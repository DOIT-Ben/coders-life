import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT, '程序员生存模拟器.html');
const html = fs.readFileSync(HTML_PATH, 'utf8');

const requiredAvatars = [
  'assets/avatars/frontend-fox.svg',
  'assets/avatars/backend-capybara.svg',
  'assets/avatars/fullstack-octopus.svg',
  'assets/avatars/ai-duck.svg'
];

for (const avatar of requiredAvatars) {
  const absolute = path.join(ROOT, avatar);
  assert.ok(fs.existsSync(absolute), `${avatar} should exist`);
  const svg = fs.readFileSync(absolute, 'utf8');
  assert.match(svg, /<svg[\s>]/, `${avatar} should be an SVG image`);
  assert.doesNotMatch(svg, /<image\b/i, `${avatar} should be native vector art, not an embedded raster`);
}

for (const avatar of requiredAvatars) {
  assert.ok(html.includes(`src="${avatar}"`), `${avatar} should be referenced by the career cards`);
}

const forbiddenDarkAiTokens = [
  '#0f0c29',
  '#302b63',
  '#24243e',
  '#667eea',
  '#764ba2',
  'rgba(30, 30, 50'
];

for (const token of forbiddenDarkAiTokens) {
  assert.equal(html.includes(token), false, `old dark AI theme token should be removed: ${token}`);
}

const uiLabelPatterns = [
  /<h3>[^<]*[\u{1F300}-\u{1FAFF}]/u,
  /<button[^>]*>[^<]*[\u{1F300}-\u{1FAFF}]/u,
  /<h2>[^<]*[\u{1F300}-\u{1FAFF}]/u
];

for (const pattern of uiLabelPatterns) {
  assert.equal(pattern.test(html), false, `primary UI labels should not rely on emoji: ${pattern}`);
}

assert.match(html, /--paper:/, 'visual theme should expose paper-style CSS tokens');
assert.match(html, /--ink:/, 'visual theme should expose ink CSS token');
assert.match(html, /--tomato:/, 'visual theme should expose playful accent token');
assert.match(html, /career-avatar/, 'career cards should render avatar images');
assert.match(html, /function formatEventTextForDisplay/, 'event log should sanitize emoji at the display layer');
assert.match(html, /\.event\.good::before[\s\S]*content: "顺风"/, 'event log should use text badges for good events');
assert.match(html, /\.event\.bad::before[\s\S]*content: "翻车"/, 'event log should use text badges for bad events');

console.log('VISUAL_REFRESH_VERIFIED');
