import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'popup_pool_game_ready_2026-06-18.json');
const RUNTIME_PATH = path.join(ROOT, '程序员生存模拟器_弹窗库_2026-06-18.js');
const REQUIRED_FIELDS = ['id', 'text', 'category', 'kind', 'tone', 'rarity', 'effect', 'trigger'];
const REQUIRED_SOURCE_FIELDS = ['source_version', 'source_scope'];
const EXPECTED_COUNT = 1325;
const EXPECTED_SOURCE_RANGES = [
  { minId: 1, maxId: 240, source_version: '2026-06-17', source_scope: 'work-core' },
  { minId: 241, maxId: 435, source_version: '2026-06-18', source_scope: 'full-spectrum' },
  { minId: 436, maxId: 475, source_version: '2026-06-18-life-extension', source_scope: 'life-learning-extension' },
  { minId: 476, maxId: 575, source_version: '2026-06-18-research-extension', source_scope: 'research-extension' },
  { minId: 576, maxId: 695, source_version: '2026-06-18-round7', source_scope: 'round7-community-extension' },
  { minId: 696, maxId: 815, source_version: '2026-06-18-round8', source_scope: 'round8-community-extension' },
  { minId: 816, maxId: 935, source_version: '2026-06-18-round9-life', source_scope: 'round9-life-extension' },
  { minId: 936, maxId: 1055, source_version: '2026-06-18-round9-learning', source_scope: 'round9-learning-extension' },
  { minId: 1056, maxId: 1175, source_version: '2026-06-18-round10-learning', source_scope: 'round10-learning-extension' },
  { minId: 1176, maxId: 1325, source_version: '2026-06-18-round11-life', source_scope: 'round11-life-extension' }
];
const ALLOWED_KINDS = new Set(['learning', 'health', 'life', 'event', 'joke', 'light']);
const ALLOWED_RARITIES = new Set(['common', 'uncommon', 'rare']);
const ALLOWED_ACTIONS = new Set(['learn-ai', 'overtime', 'rest', 'interview', 'side-project', 'networking']);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function loadRuntimePool() {
  const source = fs.readFileSync(RUNTIME_PATH, 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: RUNTIME_PATH });
  return context.window.PROGRAMMER_POPUP_POOL;
}

function findDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function normalizeText(value) {
  return String(value)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\p{P}\p{S}\p{Zs}\s]+/gu, '');
}

function findDuplicateGroups(items, getKey) {
  const groups = new Map();
  for (const item of items) {
    const key = getKey(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([key, group]) => ({ key, group }));
}

function formatDuplicateGroups(groups) {
  return groups
    .map(({ key, group }) => {
      const entries = group.map(item => `${item.id}:${item.text}`).join(' | ');
      return `${key} => ${entries}`;
    })
    .join('\n');
}

function countBy(items, field) {
  return Object.fromEntries(
    Object.entries(items.reduce((counts, item) => {
      counts[item[field]] = (counts[item[field]] || 0) + 1;
      return counts;
    }, {})).sort(([left], [right]) => left.localeCompare(right))
  );
}

const pool = readJson(DATA_PATH);
const runtimePool = loadRuntimePool();

assert.ok(Array.isArray(pool), 'game-ready JSON should be an array');
assert.ok(Array.isArray(runtimePool), 'runtime JS should expose window.PROGRAMMER_POPUP_POOL');
assert.equal(pool.length, EXPECTED_COUNT, 'popup pool should include the latest community extension batch');
assert.equal(runtimePool.length, pool.length, 'runtime JS and game-ready JSON counts should match');
const normalizedRuntimePool = JSON.parse(JSON.stringify(runtimePool));
assert.deepEqual(normalizedRuntimePool, pool, 'runtime JS and game-ready JSON should contain identical popup data');

const missing = [];
const invalidFields = [];
for (const item of pool) {
  for (const field of [...REQUIRED_FIELDS, ...REQUIRED_SOURCE_FIELDS]) {
    if (item[field] === undefined || item[field] === null || item[field] === '') missing.push(`${item.id ?? '<no-id>'}.${field}`);
  }
  assert.equal(typeof item.text, 'string', `item ${item.id} text should be a string`);
  assert.ok(item.text.trim().length >= 6, `item ${item.id} text is too short`);
  assert.ok(item.text.length <= 80, `item ${item.id} text is too long for popup use`);
  if (!ALLOWED_KINDS.has(item.kind)) invalidFields.push(`${item.id}.kind=${item.kind}`);
  if (!ALLOWED_RARITIES.has(item.rarity)) invalidFields.push(`${item.id}.rarity=${item.rarity}`);
  if (!item.tone || typeof item.tone !== 'string') invalidFields.push(`${item.id}.tone=${item.tone}`);
  if (item.source_action !== undefined && !ALLOWED_ACTIONS.has(item.source_action)) {
    invalidFields.push(`${item.id}.source_action=${item.source_action}`);
  }
}

const duplicateIds = findDuplicates(pool.map(item => item.id));
const duplicateTexts = findDuplicates(pool.map(item => item.text));
const duplicateNormalizedTextGroups = findDuplicateGroups(pool, item => normalizeText(item.text));
const ids = pool.map(item => item.id);
const expectedIds = Array.from({ length: EXPECTED_COUNT }, (_, index) => index + 1);
const sourceScopeCounts = countBy(pool, 'source_scope');
const sourceVersionCounts = countBy(pool, 'source_version');

assert.deepEqual(missing, [], `missing fields: ${missing.join(', ')}`);
assert.deepEqual(invalidFields, [], `invalid fields: ${invalidFields.join(', ')}`);
assert.deepEqual(duplicateIds, [], `duplicate ids: ${duplicateIds.join(', ')}`);
assert.deepEqual(duplicateTexts, [], `duplicate texts: ${duplicateTexts.join('\n')}`);
assert.deepEqual(
  duplicateNormalizedTextGroups,
  [],
  `normalized duplicate texts:\n${formatDuplicateGroups(duplicateNormalizedTextGroups)}`
);
assert.deepEqual(ids, expectedIds, `popup ids should be continuous from 1 to ${EXPECTED_COUNT} in ascending order`);
assert.deepEqual(sourceScopeCounts, {
  'full-spectrum': 195,
  'life-learning-extension': 40,
  'research-extension': 100,
  'round7-community-extension': 120,
  'round8-community-extension': 120,
  'round10-learning-extension': 120,
  'round11-life-extension': 150,
  'round9-learning-extension': 120,
  'round9-life-extension': 120,
  'work-core': 240
});
assert.deepEqual(sourceVersionCounts, {
  '2026-06-17': 240,
  '2026-06-18': 195,
  '2026-06-18-life-extension': 40,
  '2026-06-18-research-extension': 100,
  '2026-06-18-round7': 120,
  '2026-06-18-round8': 120,
  '2026-06-18-round10-learning': 120,
  '2026-06-18-round11-life': 150,
  '2026-06-18-round9-learning': 120,
  '2026-06-18-round9-life': 120
});

for (const range of EXPECTED_SOURCE_RANGES) {
  const rangeItems = pool.filter(item => item.id >= range.minId && item.id <= range.maxId);
  assert.equal(
    rangeItems.length,
    range.maxId - range.minId + 1,
    `source range ${range.minId}-${range.maxId} should be complete`
  );
  const mismatches = rangeItems.filter(item => (
    item.source_scope !== range.source_scope ||
    item.source_version !== range.source_version
  ));
  assert.deepEqual(
    mismatches,
    [],
    `source range ${range.minId}-${range.maxId} should be ${range.source_scope}/${range.source_version}`
  );
}

console.log(JSON.stringify({
  popupPool: 'OK',
  count: pool.length,
  runtimeCount: runtimePool.length,
  duplicateIds: duplicateIds.length,
  duplicateTexts: duplicateTexts.length,
  duplicateNormalizedTexts: duplicateNormalizedTextGroups.length,
  missingFields: missing.length,
  invalidFields: invalidFields.length,
  sourceScopeCounts,
  sourceVersionCounts
}, null, 2));

console.log(JSON.stringify({
  sourceRanges: EXPECTED_SOURCE_RANGES.map(range => ({
    minId: range.minId,
    maxId: range.maxId,
    source_version: range.source_version,
    source_scope: range.source_scope
  }))
}, null, 2));
