const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const nodeCrypto = require('node:crypto');

function load(path, mocks = {}) {
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports, Buffer, Date, Response, console, process,
    URL, URLSearchParams,
    require(name) { if (name in mocks) return mocks[name]; throw Error(`Unexpected dependency: ${name}`); }
  }, { filename: path });
  return module.exports;
}

const prismaStub = { prisma: {} };
const tokens = load('src/lib/server/google-tokens.ts', {
  'node:crypto': nodeCrypto,
  './prisma': prismaStub
});
const calendar = load('src/lib/server/google-calendar.ts', {
  'node:crypto': nodeCrypto,
  './prisma': prismaStub,
  './google-tokens': { getValidAccessToken: async () => 'test-token' }
});

const TEST_KEY = 'a'.repeat(64);

test('token encrypt/decrypt round-trip', () => {
  process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = TEST_KEY;
  const cipher = tokens.encryptToken('super-secret-refresh-token');
  assert.equal(typeof cipher, 'string');
  assert.notEqual(cipher, 'super-secret-refresh-token');
  assert.equal(tokens.decryptToken(cipher), 'super-secret-refresh-token');
});

test('token encryption uses a fresh IV each time', () => {
  process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = TEST_KEY;
  const a = tokens.encryptToken('same');
  const b = tokens.encryptToken('same');
  assert.notEqual(a, b);
  assert.equal(tokens.decryptToken(a), 'same');
  assert.equal(tokens.decryptToken(b), 'same');
});

test('token decrypt rejects tampered payload', () => {
  process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = TEST_KEY;
  const cipher = tokens.encryptToken('value');
  const parts = cipher.split(':');
  parts[2] = '00'.repeat(16);
  assert.throws(() => tokens.decryptToken(parts.join(':')));
});

test('token decrypt rejects malformed payload', () => {
  process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = TEST_KEY;
  assert.throws(() => tokens.decryptToken('not-a-payload'));
});

test('token encrypt requires a 64-char hex key', () => {
  delete process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;
  assert.throws(() => tokens.encryptToken('x'), /GOOGLE_TOKEN_ENCRYPTION_KEY/);
  process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = 'short';
  assert.throws(() => tokens.encryptToken('x'), /GOOGLE_TOKEN_ENCRYPTION_KEY/);
  process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = TEST_KEY;
});

test('taskToEvent maps a task to a Calendar event', () => {
  const task = {
    id: 'task-1',
    courseId: 'course-1',
    title: 'Midterm Exam',
    description: 'Chapters 1-5',
    type: 'EXAM',
    dueDate: new Date('2026-11-03T23:59:00Z'),
    weightPercent: 25,
    status: 'TODO',
    course: { id: 'course-1', code: 'CS101', name: 'Intro CS', googleCalendarId: null, calendarSyncToken: null }
  };
  const event = calendar.taskToEvent(task, 'America/New_York');
  assert.equal(event.summary, '[DUE] CS101: Midterm Exam');
  assert.ok(event.description.includes('25% of final grade'));
  assert.ok(event.description.includes('EXAM'));
  assert.ok(event.description.includes('Chapters 1-5'));
  // 1-hour event ending at the due date
  assert.equal(event.end.dateTime, '2026-11-03T23:59:00.000Z');
  assert.equal(event.start.dateTime, '2026-11-03T22:59:00.000Z');
  assert.equal(event.start.timeZone, 'America/New_York');
  assert.equal(event.extendedProperties.private.syllabiqTaskId, 'task-1');
  assert.equal(event.extendedProperties.private.syllabiqCourseId, 'course-1');
});

test('taskToEvent omits weight line when weight is zero', () => {
  const task = {
    id: 'task-2', courseId: 'c1', title: 'Reading', description: null,
    type: 'READING', dueDate: new Date('2026-11-04T12:00:00Z'),
    weightPercent: 0, status: 'TODO',
    course: { id: 'c1', code: 'ENG102', name: 'Writing', googleCalendarId: null, calendarSyncToken: null }
  };
  const event = calendar.taskToEvent(task, 'UTC');
  assert.ok(!event.description.includes('of final grade'));
});

test('resolveCalendarMode defaults safely', () => {
  assert.equal(calendar.resolveCalendarMode('combined'), 'combined');
  assert.equal(calendar.resolveCalendarMode('per-course'), 'per-course');
  assert.equal(calendar.resolveCalendarMode(null), 'per-course');
  assert.equal(calendar.resolveCalendarMode(undefined), 'per-course');
  assert.equal(calendar.resolveCalendarMode('nonsense'), 'per-course');
});

test('isRemoteNewer implements last-write-wins', () => {
  const taskAt = new Date('2026-10-19T10:00:00Z');
  assert.equal(calendar.isRemoteNewer('2026-10-19T11:00:00Z', taskAt), true);
  assert.equal(calendar.isRemoteNewer('2026-10-19T09:00:00Z', taskAt), false);
  assert.equal(calendar.isRemoteNewer('2026-10-19T10:00:00Z', taskAt), false);
  assert.equal(calendar.isRemoteNewer(undefined, taskAt), false);
  assert.equal(calendar.isRemoteNewer('not-a-date', taskAt), false);
  // accepts string task timestamps too
  assert.equal(calendar.isRemoteNewer('2026-10-19T11:00:00Z', '2026-10-19T10:00:00Z'), true);
});
