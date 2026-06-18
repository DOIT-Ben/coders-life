import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');
const WORKBENCH_DIR = path.join(ROOT, 'workbench');
const MANIFEST_PATH = path.join(WORKBENCH_DIR, 'candidate-manifest.json');
const ALLOWED_STATUSES = new Set(['pending', 'merged', 'rejected']);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function countJsonlCandidates(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .filter(line => line.trim().startsWith('{'))
    .length;
}

assert.ok(fs.existsSync(WORKBENCH_DIR), 'workbench directory should exist');
assert.ok(fs.existsSync(MANIFEST_PATH), 'workbench/candidate-manifest.json should exist');

const candidateFiles = fs.readdirSync(WORKBENCH_DIR)
  .filter(name => name.endsWith('-candidates.md'))
  .sort((left, right) => left.localeCompare(right));
const manifest = readJson(MANIFEST_PATH);

assert.equal(manifest.schemaVersion, 1, 'candidate manifest schemaVersion should be 1');
assert.ok(Array.isArray(manifest.files), 'candidate manifest should contain files array');

const entriesByPath = new Map();
for (const entry of manifest.files) {
  assert.equal(typeof entry.path, 'string', 'manifest entry path should be a string');
  assert.ok(entry.path.startsWith('workbench/'), `manifest path should be repo-relative workbench path: ${entry.path}`);
  assert.ok(ALLOWED_STATUSES.has(entry.status), `invalid status for ${entry.path}: ${entry.status}`);
  assert.equal(typeof entry.candidateCount, 'number', `candidateCount should be a number for ${entry.path}`);
  assert.ok(entry.candidateCount >= 0, `candidateCount should not be negative for ${entry.path}`);
  assert.ok(!entriesByPath.has(entry.path), `duplicate manifest entry: ${entry.path}`);
  entriesByPath.set(entry.path, entry);
}

const expectedPaths = candidateFiles.map(name => `workbench/${name}`);
const manifestPaths = [...entriesByPath.keys()].sort((left, right) => left.localeCompare(right));
assert.deepEqual(manifestPaths, expectedPaths, 'manifest should list every workbench/*-candidates.md file and no stale entries');

for (const fileName of candidateFiles) {
  const repoPath = `workbench/${fileName}`;
  const filePath = path.join(WORKBENCH_DIR, fileName);
  const entry = entriesByPath.get(repoPath);
  const actualCount = countJsonlCandidates(filePath);
  assert.equal(entry.candidateCount, actualCount, `candidateCount mismatch for ${repoPath}`);
}

const statusCounts = manifest.files.reduce((counts, entry) => {
  counts[entry.status] = (counts[entry.status] || 0) + 1;
  return counts;
}, {});

console.log(JSON.stringify({
  candidateManifest: 'OK',
  files: manifest.files.length,
  totalCandidates: manifest.files.reduce((sum, entry) => sum + entry.candidateCount, 0),
  statusCounts
}, null, 2));
