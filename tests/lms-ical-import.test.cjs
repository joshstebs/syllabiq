const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const ical = require('node-ical');

function load(path, mocks = {}, globals = {}) {
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports, Buffer, Date, URL, AbortSignal, console,
    ...globals,
    require(name) { if (name in mocks) return mocks[name]; throw Error(`Unexpected dependency: ${name}`); }
  }, { filename: path });
  return module.exports;
}

const jsonResponse = { NextResponse: { json: (body, options) => Response.json(body, options) } };
const icalImport = load('src/lib/lms/ical-import.ts', { 'node-ical': ical });

const FIXTURE = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//EN
BEGIN:VEVENT
UID:canvas-event-1
DTSTAMP:20261001T000000Z
DTSTART:20261105T040000Z
DTEND:20261105T045900Z
SUMMARY:[ECON 301] Midterm Exam 1
DESCRIPTION:Chapters 1-5
END:VEVENT
BEGIN:VEVENT
UID:canvas-event-2
DTSTAMP:20261001T000000Z
DTSTART:20261110T040000Z
DTEND:20261110T045900Z
SUMMARY:CS3110 Problem Set 3
END:VEVENT
BEGIN:VTODO
UID:todo-1
SUMMARY:Not an event
END:VTODO
BEGIN:VEVENT
UID:no-summary
DTSTAMP:20261001T000000Z
DTSTART:20261110T040000Z
DTEND:20261110T045900Z
END:VEVENT
END:VCALENDAR`;

test('parser extracts VEVENTs, skips non-events and summary-less entries', () => {
  const events = icalImport.parseIcalEvents(FIXTURE);
  assert.equal(events.length, 2);
  assert.equal(events[0].uid, 'canvas-event-1');
  assert.equal(events[0].title, '[ECON 301] Midterm Exam 1');
  assert.equal(events[0].courseCode, 'ECON 301');
  assert.equal(events[0].taskType, 'exam');
  assert.equal(events[0].description, 'Chapters 1-5');
  assert.equal(events[0].dueDate.toISOString(), '2026-11-05T04:59:00.000Z');
  assert.equal(events[1].uid, 'canvas-event-2');
  assert.equal(events[1].courseCode, 'CS3110');
  assert.equal(events[1].taskType, 'assignment');
});

test('deduceCourseCode handles bracketed, unbracketed, and missing codes', () => {
  assert.equal(icalImport.deduceCourseCode('[CS 3110] HW 1'), 'CS 3110');
  assert.equal(icalImport.deduceCourseCode('CS3110: HW 1'), 'CS3110');
  assert.equal(icalImport.deduceCourseCode('econ 1010 quiz 2'), 'ECON 1010');
  assert.equal(icalImport.deduceCourseCode('Weekly reflection journal'), 'GEN 101');
});

test('inferTaskType guesses from title keywords', () => {
  assert.equal(icalImport.inferTaskType('Midterm Exam'), 'exam');
  assert.equal(icalImport.inferTaskType('Quiz 3'), 'quiz');
  assert.equal(icalImport.inferTaskType('Read chapter 4'), 'reading');
  assert.equal(icalImport.inferTaskType('Final project demo'), 'exam');
  assert.equal(icalImport.inferTaskType('Course project proposal'), 'project');
  assert.equal(icalImport.inferTaskType('Homework 2'), 'assignment');
});

function makePrisma() {
  const courses = [];
  const tasks = [];
  return {
    _courses: courses,
    _tasks: tasks,
    course: {
      findUnique: async ({ where }) =>
        courses.find(c => c.userId === where.userId_code.userId && c.code === where.userId_code.code) || null,
      create: async ({ data }) => {
        const c = { id: `course-${courses.length}`, ...data };
        courses.push(c);
        return c;
      }
    },
    task: {
      findFirst: async ({ where }) =>
        tasks.find(t => {
          if (t.courseId !== where.courseId) return false;
          if (where.lmsTaskId !== undefined && t.lmsTaskId !== where.lmsTaskId) return false;
          if (where.title !== undefined && t.title !== where.title) return false;
          if (where.dueDate !== undefined && +t.dueDate !== +where.dueDate) return false;
          return true;
        }) || null,
      create: async ({ data }) => {
        const t = { id: `task-${tasks.length}`, ...data };
        tasks.push(t);
        return t;
      }
    }
  };
}

function loadRoute({ configured = true, user = { id: 'student-1' }, prisma, fetchImpl } = {}) {
  const p = prisma || makePrisma();
  return {
    route: load('src/app/api/lms/sync/route.ts', {
      'next/server': jsonResponse,
      '@/lib/server/auth': { isDatabaseConfigured: () => configured, getCurrentUser: async () => user },
      '@/lib/server/prisma': { prisma: p },
      '@/lib/lms/ical-import': icalImport,
      '@/lib/lms/universal-sync': {
        UniversalLMSSyncService: {
          syncICalContent: async (text, provider) => ({ provider, totalFound: 1, syncedNew: 1, deduplicated: 0, details: ['dev fallback'] })
        }
      }
    }, { fetch: fetchImpl || (async () => { throw Error('unexpected fetch'); }) }),
    prisma: p
  };
}

function post(route, body) {
  return route.POST(new Request('http://localhost/api/lms/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }));
}

test('route imports feed into Prisma, records lmsTaskId and lmsSource', async () => {
  const { route, prisma } = loadRoute();
  const res = await post(route, { provider: 'CANVAS', rawIcs: FIXTURE });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.provider, 'CANVAS');
  assert.equal(data.totalFound, 2);
  assert.equal(data.syncedNew, 2);
  assert.equal(data.deduplicated, 0);
  assert.equal(prisma._courses.length, 2);
  assert.equal(prisma._tasks.length, 2);
  const exam = prisma._tasks.find(t => t.title.includes('Midterm'));
  assert.equal(exam.lmsTaskId, 'canvas-event-1');
  assert.equal(exam.lmsSource, 'CANVAS');
  assert.equal(exam.type, 'EXAM');
});

test('route re-import does not duplicate and reuses courses', async () => {
  const { route, prisma } = loadRoute();
  await post(route, { provider: 'CANVAS', rawIcs: FIXTURE });
  const res = await post(route, { provider: 'CANVAS', rawIcs: FIXTURE });
  const data = await res.json();
  assert.equal(data.syncedNew, 0);
  assert.equal(data.deduplicated, 2);
  assert.equal(prisma._tasks.length, 2);
  assert.equal(prisma._courses.length, 2);
});

test('route dedupes on title and due date even without matching uid', async () => {
  const { route, prisma } = loadRoute();
  await post(route, { provider: 'CANVAS', rawIcs: FIXTURE });
  const renamed = FIXTURE.replaceAll('canvas-event-1', 'different-uid-9');
  const res = await post(route, { provider: 'CANVAS', rawIcs: renamed });
  const data = await res.json();
  // The renamed-uid event is caught by the title+due-date check, not duplicated.
  assert.equal(data.syncedNew, 0);
  assert.equal(data.deduplicated, 2);
  assert.equal(prisma._tasks.length, 2);
});

test('route rejects anonymous users when the database is configured', async () => {
  const { route } = loadRoute({ user: null });
  const res = await post(route, { provider: 'ICAL_FEED', rawIcs: FIXTURE });
  assert.equal(res.status, 401);
});

test('route returns 501 for direct API sync without a feed', async () => {
  const { route } = loadRoute();
  for (const provider of ['CANVAS', 'BLACKBOARD', 'BRIGHTSPACE', 'MOODLE']) {
    const res = await post(route, { provider });
    assert.equal(res.status, 501);
    assert.match((await res.json()).error, /direct API sync is not available/);
  }
});

test('route validates feed URLs and fetches over HTTPS', async () => {
  const { route } = loadRoute({
    fetchImpl: async (url) => {
      assert.ok(String(url).startsWith('https://'), 'webcal rewritten to https');
      return new Response(FIXTURE, { status: 200 });
    }
  });
  const res = await post(route, { provider: 'BLACKBOARD', feedUrl: 'webcal://school.edu/feed.ics' });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).syncedNew, 2);
});

test('route rejects bad feed URLs and non-calendar responses', async () => {
  const { route } = loadRoute();
  assert.equal((await post(route, { provider: 'ICAL_FEED', feedUrl: 'not a url' })).status, 400);
  assert.equal((await post(route, { provider: 'ICAL_FEED', feedUrl: 'ftp://school.edu/feed.ics' })).status, 400);

  const { route: route2 } = loadRoute({
    fetchImpl: async () => new Response('nope', { status: 404 })
  });
  assert.equal((await post(route2, { provider: 'ICAL_FEED', feedUrl: 'https://school.edu/feed.ics' })).status, 502);

  const { route: route3 } = loadRoute({
    fetchImpl: async () => new Response('<html>not a calendar</html>', { status: 200 })
  });
  assert.equal((await post(route3, { provider: 'ICAL_FEED', feedUrl: 'https://school.edu/feed.ics' })).status, 400);
});

test('route falls back to the client-side store without a database', async () => {
  const { route } = loadRoute({ configured: false, user: null });
  const res = await post(route, { provider: 'ICAL_FEED', rawIcs: FIXTURE });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).details[0], 'dev fallback');
});

test('refactored syncICalContent keeps working with the client-side store', async () => {
  const store = { courses: [], tasks: [] };
  const sync = load('src/lib/lms/universal-sync.ts', {
    'node-ical': ical,
    '../storage': {
      getStore: () => store,
      saveStore: () => {},
      addActivityLog: () => {}
    },
    './deduplication': { findDuplicateInCollection: () => null },
    './ical-import': icalImport
  });
  const result = await sync.UniversalLMSSyncService.syncICalContent(FIXTURE, 'MOODLE');
  assert.equal(result.totalFound, 2);
  assert.equal(result.syncedNew, 2);
  assert.equal(result.provider, 'MOODLE');
  assert.equal(store.tasks.length, 2);
  assert.equal(store.tasks[0].lmsTaskId, 'canvas-event-1');
  assert.equal(store.tasks[0].lmsSource, 'MOODLE');
  assert.equal(store.courses.length, 2);
});
