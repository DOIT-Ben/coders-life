const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');

const ROOT = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT, '程序员生存模拟器_增强版.html');
const POPUP_JS_PATH = path.join(ROOT, '程序员生存模拟器_弹窗库_2026-06-18.js');
const SAVE_KEY = 'codersLifeSave.v2';

class FakeElement {
  constructor(id = '') {
    this.id = id;
    this.style = {};
    this.children = [];
    this.className = '';
    this._textContent = '';
    this._innerHTML = '';
    this.disabled = false;
  }
  get textContent() { return this._textContent; }
  set textContent(value) { this._textContent = String(value); }
  get innerHTML() { return this._innerHTML; }
  set innerHTML(value) {
    this._innerHTML = String(value);
    if (value === '') this.children = [];
  }
  get firstChild() { return this.children[0] || null; }
  appendChild(child) { this.children.push(child); return child; }
  insertBefore(child, before) {
    if (!before) { this.children.unshift(child); return child; }
    const index = this.children.indexOf(before);
    if (index === -1) this.children.unshift(child);
    else this.children.splice(index, 0, child);
    return child;
  }
}

function createLocalStorage(seed = {}) {
  const store = new Map(Object.entries(seed));
  return {
    getItem(key) { return store.has(key) ? store.get(key) : null; },
    setItem(key, value) { store.set(key, String(value)); },
    removeItem(key) { store.delete(key); },
    keys() { return [...store.keys()]; }
  };
}

function createDocument() {
  const ids = [
    'resume-btn', 'career-selection', 'game-area', 'player-career', 'event-log', 'game-over',
    'day-count', 'age-count', 'skill', 'mental', 'money', 'ai', 'skill-bar', 'mental-bar',
    'money-bar', 'ai-bar', 'game-over-reason', 'ending-type', 'achievement-grid', 'shop-grid'
  ];
  const elements = new Map(ids.map(id => [id, new FakeElement(id)]));
  const actionButtons = Array.from({ length: 6 }, (_, index) => new FakeElement(`action-${index}`));
  return {
    createElement() { return new FakeElement(); },
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, new FakeElement(id));
      return elements.get(id);
    },
    querySelectorAll(selector) { return selector === '.action-btn' ? actionButtons : []; }
  };
}

function extractInlineScript(html) {
  const matches = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)];
  assert.ok(matches.length > 0, 'HTML should contain one inline game script');
  return matches[0][1];
}

function createStableMath() {
  const math = Object.create(Math);
  math.random = () => 0;
  return math;
}

function createGameContext(seedStorage = {}) {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  const popupJs = fs.readFileSync(POPUP_JS_PATH, 'utf8');
  const inlineScript = extractInlineScript(html);
  const context = {
    window: { PROGRAMMER_POPUP_POOL: [], confirm: () => true, addEventListener: () => {} },
    document: createDocument(),
    localStorage: createLocalStorage(seedStorage),
    console,
    Date,
    Math: createStableMath(),
    JSON,
    setTimeout,
    clearTimeout
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(popupJs, context, { filename: POPUP_JS_PATH });
  vm.runInContext(inlineScript, context, { filename: HTML_PATH });
  return context;
}

function parseSave(context) {
  const raw = context.localStorage.getItem(SAVE_KEY);
  assert.ok(raw, 'expected v2 save to exist');
  return JSON.parse(raw);
}

function hasLog(save, text) {
  return save.eventLog.some(entry => entry.type === 'special' && entry.text.includes(text));
}

function countLogs(save, text) {
  return save.eventLog.filter(entry => entry.text.includes(text)).length;
}

function testResumeAddsContextReminderWithoutPersistingNoise() {
  const first = createGameContext();
  first.selectCareer('fullstack');
  first.action('overtime');
  first.action('overtime');
  first.action('side-project');
  const savedBeforeResume = parseSave(first);

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(savedBeforeResume) });
  assert.equal(restored.loadGameFromStorage(), true);

  const eventLog = restored.document.getElementById('event-log').children.map(child => child.textContent).join('\n');
  assert.match(eventLog, /接着玩提示/);

  const savedAfterResume = restored.buildSaveData();
  assert.equal(countLogs(savedAfterResume, '接着玩提示'), 0, 'resume reminder should not consume persistent event log slots');
  assert.deepEqual(savedAfterResume.stats, savedBeforeResume.stats, 'resume reminder should not change stats');

  const restoredAgain = createGameContext({ [SAVE_KEY]: JSON.stringify(savedAfterResume) });
  assert.equal(restoredAgain.loadGameFromStorage(), true);
  const savedAfterSecondResume = restoredAgain.buildSaveData();
  assert.equal(countLogs(savedAfterSecondResume, '接着玩提示'), 0, 'resume reminder should remain render-only on repeated restore');
}

function testCareerStageFeedbackPersistsAtMilestones() {
  const context = createGameContext();
  context.selectCareer('backend');
  for (let index = 0; index < 10; index += 1) {
    context.action('learn-ai');
  }
  const saved = parseSave(context);

  assert.ok(hasLog(saved, '职业阶段'), 'career stage feedback should be persisted as a special event');
  assert.ok(saved.runState.lastCareerStageFeedbackDay >= 10, 'career stage feedback day should be saved');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  assert.deepEqual(restored.buildSaveData().runState, saved.runState);
}

const tests = [
  testResumeAddsContextReminderWithoutPersistingNoise,
  testCareerStageFeedbackPersistsAtMilestones
];

for (const test of tests) {
  test();
  console.log(`PASS ${test.name}`);
}

console.log(`CAREER_BOUNDARY_LOOP_VERIFIED ${tests.length}/${tests.length}`);
