import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { projectPath, parseArgs, safeFile } from '../scripts/paths.mjs';

test('render accepts project folders with spaces but rejects escaping output root', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'content test '));
  try {
    mkdirSync(path.join(root, 'post one'));
    assert.equal(projectPath(root, 'post one'), path.join(root, 'post one'));
    assert.throws(() => projectPath(root, '../elsewhere'));
    assert.throws(() => projectPath(root, root));
    assert.throws(() => projectPath(root, '../content test sibling'));
    mkdirSync(path.join(root, 'outside'));
    symlinkSync(path.join(root, 'outside'), path.join(root, 'post one', 'link'), 'junction');
    assert.throws(() => safeFile(path.join(root, 'post one'), '/link/'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
test('HTTP rejects traversal, malformed escapes and non-files', () => {
  assert.throws(() => safeFile(process.cwd(), '/%2e%2e/package.json'));
  assert.throws(() => safeFile(process.cwd(), '/%ZZ'));
  assert.throws(() => safeFile(process.cwd(), '/'));
});
test('CLI rejects unrecognized modes and flags before running subprocesses', () => {
  assert.deepEqual(parseArgs(['--project','pilot one','--mode','stills']), { project:'pilot one', mode:'stills' });
  for (const args of [[], ['--project','x','--mode','delete'], ['--project','x','--shell','anything']]) assert.throws(() => parseArgs(args));
});
