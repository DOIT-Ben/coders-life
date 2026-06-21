import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const entryName = '程序员生存模拟器.html';
const oldEntryName = '程序员生存模拟器_增强版.html';
const entryPath = path.join(ROOT, entryName);

assert.ok(fs.existsSync(entryPath), `${entryName} should be the canonical entrypoint`);
assert.equal(fs.existsSync(path.join(ROOT, oldEntryName)), false, `${oldEntryName} should not remain as the canonical entrypoint`);

const html = fs.readFileSync(entryPath, 'utf8');
assert.match(html, /<title>程序员生存模拟器<\/title>/, 'browser title should be concise');
assert.match(html, /<h1>程序员生存模拟器<\/h1>/, 'main heading should be concise');
assert.match(html, /<div class="subtitle" id="game-subtitle">2026 Edition - 选择你的职业道路<\/div>/, 'home subtitle should describe career selection');
assert.match(html, /const HOME_SUBTITLE = '2026 Edition - 选择你的职业道路';/, 'home subtitle constant should exist');
assert.match(html, /const PLAY_SUBTITLE = '在这个AI时代，看看你能活多久';/, 'play subtitle constant should exist');
assert.match(html, /function setGameSubtitle\(text\)/, 'subtitle update helper should exist');
assert.match(html, /setGameSubtitle\(PLAY_SUBTITLE\);/, 'selecting or restoring a run should switch to play subtitle');
assert.match(html, /setGameSubtitle\(HOME_SUBTITLE\);/, 'returning home should switch to home subtitle');

const filesToScan = [
  'AGENTS.md',
  'README.md',
  'docs/popup_pool_game_ready_2026-06-18_README.md',
  'tools/verify-build-script.mjs',
  'tools/verify-save-system.mjs',
  'tools/verify-game-mechanics.js',
  'tools/verify-save-resume-context.mjs',
  'tools/verify-fun-loop.mjs',
  'tools/verify-save-flow.mjs',
  'tools/verify-career-boundary-loop.cjs',
  'tools/verify-daily-goal.mjs',
  'tools/verify-visual-refresh.mjs'
];

for (const relativePath of filesToScan) {
  const content = fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
  assert.equal(content.includes(oldEntryName), false, `${relativePath} should not reference ${oldEntryName}`);
}

console.log('ENTRYPOINT_AND_SUBTITLE_VERIFIED');
