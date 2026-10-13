const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const ical = require('node-ical');

function load(path, mocks = {}) {
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports, Buffer, Date, Response, console,
    require(name) { if (name in mocks) return mocks[name]; throw Error(`Unexpected dependency: ${name}`); }
  }, { filename: path });
  return module.exports;
}
const calendar = load('src/lib/calendar-export.ts');
const jsonResponse = { NextResponse: { json: (body, options) => Response.json(body, options) } };
const fixture = { id: 'alice-task', title: 'Exam', dueDate: new Date('2026-11-03T18:00:00Z'), course: { code: 'CS101' } };

function feed({ configured = true, user = { id: 'alice' }, tasks = [], findMany } = {}) {
  return load('src/app/api/calendar/feed/route.ts', {
    'next/server': jsonResponse,
    '@/lib/server/auth': { isDatabaseConfigured: () => configured, getCurrentUser: async () => user },
    '@/lib/server/prisma': { prisma: { task: { findMany: findMany || (async () => tasks) } } },
    '@/lib/calendar-export': calendar
  });
}

test('export denies anonymous access without querying tasks', async () => {
  const route = feed({ user: null, findMany: () => assert.fail('anonymous task query') });
  assert.equal((await route.GET()).status, 401);
});
test('export does not fall back to demo data when database is unavailable', async () => {
  assert.equal((await feed({ configured: false }).GET()).status, 503);
});
test('export selects only the current account and omits grades and descriptions', async () => {
  const response = await feed({ findMany: async query => {
    assert.equal(query.where.course.userId, 'alice');
    assert.equal(JSON.stringify(query.select), JSON.stringify({ id: true, title: true, dueDate: true, course: { select: { code: true } } }));
    return [{ ...fixture, gradeReceived: 91, description: 'PRIVATE' }];
  } }).GET();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.match(response.headers.get('content-disposition'), /attachment.*\.ics/);
  const text = await response.text();
  assert.doesNotMatch(text, /PRIVATE|gradeReceived/);
  const event = ical.sync.parseICS(text)['alice-task@syllabiq.ca'];
  assert.equal(event.summary, '[CS101] Exam');
  assert.equal(event.start.toISOString(), fixture.dueDate.toISOString());
});
test('calendar escapes injected content and folds unicode lines within 75 octets', () => {
  const title = 'x,;\\\r\nBEGIN:VEVENT\r\n' + '🎓'.repeat(80);
  const text = calendar.createCalendarExport([{ ...fixture, title }]);
  for (const line of text.split('\r\n')) assert.ok(Buffer.byteLength(line, 'utf8') <= 75);
  const events = Object.values(ical.sync.parseICS(text)).filter(e => e.type === 'VEVENT');
  assert.equal(events.length, 1);
  assert.equal(events[0].summary, '[CS101] ' + title.replace(/\r\n/g, '\n'));
});
test('empty account yields a valid empty calendar and invalid dates are omitted', () => {
  const text = calendar.createCalendarExport([{ ...fixture, dueDate: 'invalid' }]);
  assert.match(text, /BEGIN:VCALENDAR/);
  assert.doesNotMatch(text, /BEGIN:VEVENT/);
});

function tasksRoute(prisma) {
  return load('src/app/api/tasks/route.ts', {
    'next/server': jsonResponse,
    '@/lib/storage': {}, '@/lib/types': {}, '@prisma/client': {},
    '@/lib/server/auth': { getCurrentUser: async () => ({ id: 'alice' }) },
    '@/lib/server/core-data': {}, '@/lib/server/prisma': { prisma }
  });
}
const request = body => new Request('https://syllabiq.ca/api/tasks', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
test('task creation cannot target another account course', async () => {
  const route = tasksRoute({ course: { findFirst: async query => {
    assert.equal(query.where.userId, 'alice');
    assert.equal(query.where.id, 'bob-course');
    return null;
  } }, task: { create: () => assert.fail('cross-account task create') } });
  assert.equal((await route.POST(request({ title: 'Injected', courseId: 'bob-course' }))).status, 404);
});
test('task creation uses the verified owned course', async () => {
  const route = tasksRoute({ course: { findFirst: async () => ({ id: 'owned-course' }) }, task: { create: async ({ data }) => {
    assert.equal(data.courseId, 'owned-course');
    return data;
  } } });
  assert.equal((await route.POST(request({ title: 'Study', courseId: 'owned-course' }))).status, 200);
});
test('task creation without a course retains owned-course fallback', async () => {
  const route = tasksRoute({ course: { findFirst: async query => {
    assert.equal(query.where.userId, 'alice');
    assert.equal(query.where.id, undefined);
    return { id: 'owned-fallback' };
  } }, task: { create: async ({ data }) => { assert.equal(data.courseId, 'owned-fallback'); return data; } } });
  assert.equal((await route.POST(request({ title: 'Study' }))).status, 200);
});
