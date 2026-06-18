import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');
const EXPECTED_COUNT = 1325;
const SOURCE_NAMES = [
  'AGENTS.md',
  'README.md',
  '程序员生存模拟器_增强版.html',
  '程序员生存模拟器_弹窗库_2026-06-18.js',
  'tools',
  'docs'
];
const RESEARCH_SOURCE = '程序员生存模拟器_弹窗候选池_调研扩展_2026-06-18.md';
const LIFE_SOURCE = '程序员生存模拟器_弹窗候选池_生活学习扩展_2026-06-18.md';
const ROUND8_SOURCE = '程序员生存模拟器_弹窗候选池_round8社区扩展_2026-06-18.md';
const ROUND9_LIFE_SOURCE = '程序员生存模拟器_弹窗候选池_round9生活扩展_2026-06-18.md';
const ROUND9_LEARNING_SOURCE = '程序员生存模拟器_弹窗候选池_round9学习扩展_2026-06-18.md';
const ROUND10_LEARNING_SOURCE = '程序员生存模拟器_弹窗候选池_round10学习扩展_2026-06-18.md';
const ROUND11_LIFE_SOURCE = '程序员生存模拟器_弹窗候选池_round11生活扩展_2026-06-18.md';

function copyRecursive(source, target) {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(target, entry));
    }
    return;
  }
  fs.copyFileSync(source, target);
}

function makeWorkspace() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'coders-life-build-verify-'));
  for (const name of SOURCE_NAMES) {
    copyRecursive(path.join(ROOT, name), path.join(tempRoot, name));
  }
  return tempRoot;
}

function runBuild(workspace) {
  return spawnSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(workspace, 'tools', 'build-popup-datasets.ps1')],
    { cwd: workspace, encoding: 'utf8' }
  );
}

function assertBuildScriptUsesAtomicWrites(workspace) {
  const scriptPath = path.join(workspace, 'tools', 'build-popup-datasets.ps1');
  const script = fs.readFileSync(scriptPath, 'utf8');
  assert.match(script, /function\s+Write-AtomicTextFile\b/, 'build script should define atomic text writes');
  assert.match(script, /function\s+Write-AtomicCsvFile\b/, 'build script should define atomic CSV writes');
  assert.match(script, /function\s+New-TempOutputPath\b[\s\S]*\$PID[\s\S]*System\.Guid[\s\S]*\.tmp/, 'temporary output paths should include PID and GUID for concurrent builds');
  assert.match(
    script,
    /function\s+Commit-AtomicFile\b[\s\S]*\$uniqueSuffix\s*=\s*"\$PID\.\$\(\[System\.Guid\]::NewGuid\(\)\.ToString\('N'\)\)"[\s\S]*\$backupPath\s*=\s*"\$resolvedFinal\.\$uniqueSuffix\.replace-backup"/,
    'atomic replace backup paths should include PID and GUID for concurrent builds'
  );

  const allowedFileWriteFunctions = new Set(['Write-AtomicTextFile', 'Write-AtomicCsvFile']);
  const fileWritePattern = /\b(Set-Content|Out-File|Add-Content|Export-Csv|sc|ac|epcsv)\b|::\s*(WriteAllText|WriteAllBytes|WriteAllLines|AppendAllText|AppendAllLines)\b/i;
  const functionStack = [];
  const violations = [];

  script.split(/\r?\n/).forEach((line, index) => {
    const functionStart = line.match(/^\s*function\s+([A-Za-z0-9_-]+)\b/);
    if (functionStart) {
      functionStack.push({ name: functionStart[1], depth: 0 });
    }

    const currentFunction = functionStack.at(-1)?.name ?? null;
    if (fileWritePattern.test(line) && !allowedFileWriteFunctions.has(currentFunction)) {
      violations.push(`${index + 1}: ${line.trim()}`);
    }

    if (functionStack.length > 0) {
      const delta = (line.match(/{/g) ?? []).length - (line.match(/}/g) ?? []).length;
      functionStack[functionStack.length - 1].depth += delta;
      while (functionStack.length > 0 && functionStack[functionStack.length - 1].depth <= 0) {
        functionStack.pop();
      }
    }
  });

  assert.deepEqual(
    violations,
    [],
    `file write commands should only appear inside atomic write helpers:\n${violations.join('\n')}`
  );
}

function assertBuildSucceeded(result, label) {
  assert.equal(
    result.status,
    0,
    `${label} should succeed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`
  );
  assert.match(result.stdout, new RegExp(`COUNT=${EXPECTED_COUNT}\\b`), `${label} should report COUNT=${EXPECTED_COUNT}`);
}

function assertBuildFailedWith(result, expectedMessage, label) {
  const output = `${result.stdout}\n${result.stderr}`;
  assert.notEqual(result.status, 0, `${label} should fail`);
  assert.match(output, expectedMessage, `${label} should fail with ${expectedMessage}\n${output}`);
}

function injectIntoFirstJsonLine(workspace, transform) {
  const sourcePath = path.join(workspace, 'docs', RESEARCH_SOURCE);
  const lines = fs.readFileSync(sourcePath, 'utf8').split(/\r?\n/);
  const index = lines.findIndex(line => line.trim().startsWith('{"action"'));
  assert.notEqual(index, -1, 'research extension source should contain JSONL action rows');
  const entry = JSON.parse(lines[index]);
  lines[index] = JSON.stringify(transform(entry));
  fs.writeFileSync(sourcePath, `${lines.join('\n')}`, 'utf8');
}

function appendJsonLine(workspace, entry) {
  const sourcePath = path.join(workspace, 'docs', RESEARCH_SOURCE);
  fs.appendFileSync(sourcePath, `\n${JSON.stringify(entry)}\n`, 'utf8');
}

function appendLifeJsonLine(workspace, entry) {
  const sourcePath = path.join(workspace, 'docs', LIFE_SOURCE);
  fs.appendFileSync(sourcePath, `\n${JSON.stringify(entry)}\n`, 'utf8');
}

function appendRound8JsonLine(workspace, entry) {
  const sourcePath = path.join(workspace, 'docs', ROUND8_SOURCE);
  fs.appendFileSync(sourcePath, `\n${JSON.stringify(entry)}\n`, 'utf8');
}

function duplicateFirstRound8JsonLine(workspace) {
  const sourcePath = path.join(workspace, 'docs', ROUND8_SOURCE);
  const lines = fs.readFileSync(sourcePath, 'utf8').split(/\r?\n/);
  const index = lines.findIndex(line => line.trim().startsWith('{"action"'));
  assert.notEqual(index, -1, 'round8 source should contain JSONL action rows');
  lines.splice(index + 1, 0, lines[index]);
  fs.writeFileSync(sourcePath, `${lines.join('\n')}`, 'utf8');
}

function appendRound9LifeJsonLine(workspace, entry) {
  const sourcePath = path.join(workspace, 'docs', ROUND9_LIFE_SOURCE);
  fs.appendFileSync(sourcePath, `\n${JSON.stringify(entry)}\n`, 'utf8');
}

function duplicateFirstRound9LifeJsonLine(workspace) {
  const sourcePath = path.join(workspace, 'docs', ROUND9_LIFE_SOURCE);
  const lines = fs.readFileSync(sourcePath, 'utf8').split(/\r?\n/);
  const index = lines.findIndex(line => line.trim().startsWith('{"action"'));
  assert.notEqual(index, -1, 'round9 life source should contain JSONL action rows');
  lines.splice(index + 1, 0, lines[index]);
  fs.writeFileSync(sourcePath, `${lines.join('\n')}`, 'utf8');
}

function appendRound9LearningJsonLine(workspace, entry) {
  const sourcePath = path.join(workspace, 'docs', ROUND9_LEARNING_SOURCE);
  fs.appendFileSync(sourcePath, `\n${JSON.stringify(entry)}\n`, 'utf8');
}

function duplicateFirstRound9LearningJsonLine(workspace) {
  const sourcePath = path.join(workspace, 'docs', ROUND9_LEARNING_SOURCE);
  const lines = fs.readFileSync(sourcePath, 'utf8').split(/\r?\n/);
  const index = lines.findIndex(line => line.trim().startsWith('{"action"'));
  assert.notEqual(index, -1, 'round9 learning source should contain JSONL action rows');
  lines.splice(index + 1, 0, lines[index]);
  fs.writeFileSync(sourcePath, `${lines.join('\n')}`, 'utf8');
}

function appendRound10LearningJsonLine(workspace, entry) {
  const sourcePath = path.join(workspace, 'docs', ROUND10_LEARNING_SOURCE);
  fs.appendFileSync(sourcePath, `\n${JSON.stringify(entry)}\n`, 'utf8');
}

function duplicateFirstRound10LearningJsonLine(workspace) {
  const sourcePath = path.join(workspace, 'docs', ROUND10_LEARNING_SOURCE);
  const lines = fs.readFileSync(sourcePath, 'utf8').split(/\r?\n/);
  const index = lines.findIndex(line => line.trim().startsWith('{"action"'));
  assert.notEqual(index, -1, 'round10 learning source should contain JSONL action rows');
  lines.splice(index + 1, 0, lines[index]);
  fs.writeFileSync(sourcePath, `${lines.join('\n')}`, 'utf8');
}

function appendRound11LifeJsonLine(workspace, entry) {
  const sourcePath = path.join(workspace, 'docs', ROUND11_LIFE_SOURCE);
  fs.appendFileSync(sourcePath, `\n${JSON.stringify(entry)}\n`, 'utf8');
}

function duplicateFirstRound11LifeJsonLine(workspace) {
  const sourcePath = path.join(workspace, 'docs', ROUND11_LIFE_SOURCE);
  const lines = fs.readFileSync(sourcePath, 'utf8').split(/\r?\n/);
  const index = lines.findIndex(line => line.trim().startsWith('{"action"'));
  assert.notEqual(index, -1, 'round11 life source should contain JSONL action rows');
  lines.splice(index + 1, 0, lines[index]);
  fs.writeFileSync(sourcePath, `${lines.join('\n')}`, 'utf8');
}

const results = [];

{
  const workspace = makeWorkspace();
  assertBuildScriptUsesAtomicWrites(workspace);
  const result = runBuild(workspace);
  assertBuildSucceeded(result, 'clean build copy');
  const gameReadyPath = path.join(workspace, 'data', 'popup_pool_game_ready_2026-06-18.json');
  const runtimePath = path.join(workspace, '程序员生存模拟器_弹窗库_2026-06-18.js');
  const gameReady = JSON.parse(fs.readFileSync(gameReadyPath, 'utf8').replace(/^\uFEFF/, ''));
  assert.equal(gameReady.length, EXPECTED_COUNT, `game-ready JSON should contain ${EXPECTED_COUNT} items after build`);
  assert.match(fs.readFileSync(runtimePath, 'utf8'), /window\.PROGRAMMER_POPUP_POOL\s*=/);
  results.push({ case: 'clean-build', status: 'OK', count: gameReady.length });
}

{
  const workspace = makeWorkspace();
  injectIntoFirstJsonLine(workspace, entry => ({ ...entry, action: 'unknown-action' }));
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Unknown research extension action 'unknown-action'/, 'invalid action build');
  results.push({ case: 'invalid-action', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  injectIntoFirstJsonLine(workspace, entry => ({ ...entry, tone: '' }));
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Missing research extension tone/, 'empty tone build');
  results.push({ case: 'empty-tone', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  appendJsonLine(workspace, { action: 'tail-invalid-action', text: '尾部坏行不能因为导入满额而被跳过。', tone: 'resonant' });
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Unknown research extension action 'tail-invalid-action'/, 'tail invalid action build');
  results.push({ case: 'tail-invalid-action', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  appendJsonLine(workspace, { action: 'rest', text: '超过上限的调研扩展合法行也不能静默丢失。', tone: 'gentle' });
  const result = runBuild(workspace);
  assertBuildSucceeded(result, 'research overflow build');
  assert.match(result.stdout, /INFO_RESEARCH_EXTENSION_IGNORED_OVER_LIMIT=\d+/, 'research overflow should be reported');
  results.push({ case: 'research-overflow', status: 'reported' });
}

{
  const workspace = makeWorkspace();
  appendLifeJsonLine(workspace, { action: 'life-invalid-action', text: '生活扩展源里的坏分类不能静默跳过。' });
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Unknown life extension action 'life-invalid-action'/, 'life invalid action build');
  results.push({ case: 'life-invalid-action', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  appendLifeJsonLine(workspace, { action: 'rest', text: '超过配额的生活扩展合法行也不能静默丢失。' });
  const result = runBuild(workspace);
  assertBuildSucceeded(result, 'life overflow build');
  assert.match(result.stdout, /INFO_LIFE_EXTENSION_IGNORED_OVER_LIMIT_rest=\d+/, 'life overflow should be reported');
  results.push({ case: 'life-overflow', status: 'reported' });
}

{
  const workspace = makeWorkspace();
  appendRound8JsonLine(workspace, { action: 'rest', text: '超过上限的 round8 合法行也不能静默丢失。', tone: 'gentle' });
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Round8 community exceeds 120 items/, 'round8 overflow build');
  results.push({ case: 'round8-overflow', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  duplicateFirstRound8JsonLine(workspace);
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Duplicate round8 community text/, 'round8 duplicate build');
  results.push({ case: 'round8-duplicate', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  appendRound9LifeJsonLine(workspace, { action: 'rest', text: '超过上限的 round9 生活行也不能静默丢失。', tone: 'gentle', kind: 'life', category: '测试' });
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Round9 life exceeds 120 items/, 'round9 life overflow build');
  results.push({ case: 'round9-life-overflow', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  duplicateFirstRound9LifeJsonLine(workspace);
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Duplicate round9 life text/, 'round9 life duplicate build');
  results.push({ case: 'round9-life-duplicate', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  appendRound9LearningJsonLine(workspace, { action: 'learn-ai', text: '超过上限的 round9 学习行也不能静默丢失。', tone: 'gentle', kind: 'learning', category: '测试' });
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Round9 learning exceeds 120 items/, 'round9 learning overflow build');
  results.push({ case: 'round9-learning-overflow', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  duplicateFirstRound9LearningJsonLine(workspace);
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Duplicate round9 learning text/, 'round9 learning duplicate build');
  results.push({ case: 'round9-learning-duplicate', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  appendRound10LearningJsonLine(workspace, { action: 'learn-ai', text: '超过上限的 round10 学习行也不能静默丢失。', tone: 'gentle', kind: 'learning', category: '测试' });
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Round10 learning exceeds 120 items/, 'round10 learning overflow build');
  results.push({ case: 'round10-learning-overflow', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  duplicateFirstRound10LearningJsonLine(workspace);
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Duplicate round10 learning text/, 'round10 learning duplicate build');
  results.push({ case: 'round10-learning-duplicate', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  appendRound11LifeJsonLine(workspace, { action: 'rest', text: '超过上限的 round11 生活行也不能静默丢失。', tone: 'gentle', kind: 'life', category: '测试' });
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Round11 life exceeds 150 items/, 'round11 life overflow build');
  results.push({ case: 'round11-life-overflow', status: 'failed-as-expected' });
}

{
  const workspace = makeWorkspace();
  duplicateFirstRound11LifeJsonLine(workspace);
  const result = runBuild(workspace);
  assertBuildFailedWith(result, /Duplicate round11 life text/, 'round11 life duplicate build');
  results.push({ case: 'round11-life-duplicate', status: 'failed-as-expected' });
}

console.log(JSON.stringify({
  buildScript: 'OK',
  expectedCount: EXPECTED_COUNT,
  cases: results
}, null, 2));
