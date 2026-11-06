const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

test('Prisma config loads schema and migration paths with the patched merger', async () => {
  const { loadConfigFromFile } = require('@prisma/config');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'syllabiq-prisma-'));
  try {
    await fs.writeFile(path.join(root, 'prisma.config.ts'),
      'export default { schema: "./db/schema.prisma", migrations: { path: "./db/migrations" } };\n');
    const result = await loadConfigFromFile({ configRoot: root });
    assert.equal(result.error, undefined);
    assert.equal(result.config.schema, path.join(root, 'db/schema.prisma'));
    assert.equal(result.config.migrations.path, path.join(root, 'db/migrations'));
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('Prisma resolves a merger that handles recursive input without exhausting the stack', async () => {
  const configPath = require.resolve('@prisma/config');
  const mergePath = require.resolve('deepmerge-ts', { paths: [path.dirname(configPath)] });
  const { deepmerge } = require(mergePath);
  const left = { value: { a: 1 } };
  const right = { value: { b: 2 } };
  left.self = left;
  right.self = right;
  const merged = deepmerge(left, right);
  assert.deepEqual(merged.value, { a: 1, b: 2 });
  assert.equal(merged.self, merged);
  assert.deepEqual(left.value, { a: 1 });
});
