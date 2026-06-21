import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');
const HTML_PATH = path.join(ROOT, '程序员生存模拟器.html');
const POPUP_JS_PATH = path.join(ROOT, '程序员生存模拟器_弹窗库_2026-06-18.js');
const SAVE_KEY = 'codersLifeSave.v2';

const DAILY_PATTERN = ['learn-ai', 'rest', 'overtime', 'networking', 'side-project', 'interview', 'learn-ai'];

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

  get textContent() {
    return this._textContent;
  }

  set textContent(value) {
    this._textContent = String(value);
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
    if (value === '') this.children = [];
  }

  get firstChild() {
    return this.children[0] || null;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  insertBefore(child, before) {
    if (!before) {
      this.children.unshift(child);
      return child;
    }
    const index = this.children.indexOf(before);
    if (index === -1) this.children.unshift(child);
    else this.children.splice(index, 0, child);
    return child;
  }
}

function createLocalStorage(seed = {}) {
  const store = new Map(Object.entries(seed));
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    }
  };
}

function createDocument() {
  const ids = [
    'resume-btn',
    'career-selection',
    'game-area',
    'player-career',
    'event-log',
    'game-over',
    'day-count',
    'age-count',
    'skill',
    'mental',
    'money',
    'ai',
    'skill-bar',
    'mental-bar',
    'money-bar',
    'ai-bar',
    'game-over-reason',
    'ending-type',
    'achievement-grid',
    'shop-grid'
  ];
  const elements = new Map(ids.map(id => [id, new FakeElement(id)]));
  const actionButtons = Array.from({ length: 6 }, (_, index) => new FakeElement(`action-${index}`));

  return {
    createElement() {
      return new FakeElement();
    },
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, new FakeElement(id));
      return elements.get(id);
    },
    querySelectorAll(selector) {
      if (selector === '.action-btn') return actionButtons;
      return [];
    }
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
    window: {
      PROGRAMMER_POPUP_POOL: [],
      confirm: () => true,
      addEventListener: () => {}
    },
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

function playDailyPattern(context, days) {
  for (let index = 0; index < days; index += 1) {
    context.action(DAILY_PATTERN[index % DAILY_PATTERN.length]);
  }
}

function assertDailyGoalState(save, expected) {
  assert.deepEqual(
    Object.fromEntries(Object.keys(expected).map(key => [key, save.dailyGoalState[key]])),
    expected
  );
}

function assertUnlocked(save, achievementId) {
  assert.ok(Array.isArray(save.achievements), 'save should expose unlocked achievements');
  assert.ok(save.achievements.includes(achievementId), `expected ${achievementId} in achievements`);
  assert.ok(Array.isArray(save.gameData?.achievements), 'gameData should expose unlocked achievements');
  assert.ok(save.gameData.achievements.includes(achievementId), `expected ${achievementId} in gameData achievements`);
}

function testDailyGoalSevenDaySaveRestoreAndContinue() {
  const context = createGameContext();

  context.selectCareer('ai');
  playDailyPattern(context, 7);
  const savedAfterSeven = parseSave(context);

  assert.equal(savedAfterSeven.stats.day, 7);
  assertDailyGoalState(savedAfterSeven, {
    day: 7,
    targetAction: 'learn-ai',
    completed: true,
    streak: 7,
    totalCompleted: 7
  });
  assertUnlocked(savedAfterSeven, 'daily_anchor');
  assert.ok(savedAfterSeven.eventLog.some(entry => entry.type === 'special'), 'daily goal should create special stateful log entries');

  assert.equal(context.saveGame({ silent: true }), true);
  const manualSave = parseSave(context);
  assertDailyGoalState(manualSave, savedAfterSeven.dailyGoalState);
  assertUnlocked(manualSave, 'daily_anchor');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(manualSave) });
  assert.equal(restored.loadGameFromStorage(), true);
  const restoredSave = restored.buildSaveData();

  assert.equal(restored.document.getElementById('game-area').style.display, 'block');
  assert.equal(restored.document.getElementById('day-count').textContent, '7');
  assertDailyGoalState(restoredSave, manualSave.dailyGoalState);
  assertUnlocked(restoredSave, 'daily_anchor');

  restored.action('learn-ai');
  const continuedSave = parseSave(restored);

  assert.equal(continuedSave.stats.day, 8);
  assertDailyGoalState(continuedSave, {
    day: 8,
    targetAction: 'learn-ai',
    completed: true,
    streak: 8,
    totalCompleted: 8
  });
  assertUnlocked(continuedSave, 'daily_anchor');
}

function testMissedDailyGoalRecoveryRestIsOneShotAfterReload() {
  const context = createGameContext();

  context.selectCareer('ai');
  context.action('learn-ai');
  context.action('overtime');
  const missedSave = parseSave(context);

  assert.equal(missedSave.stats.day, 2);
  assert.equal(missedSave.dailyGoalState.completed, false, 'day 2 daily goal should be missed before the next day rolls over');

  context.action('rest');
  const recoveredSave = parseSave(context);
  const recoveryEvents = recoveredSave.eventLog.filter(entry => entry.text.includes('补救日课'));

  assert.equal(recoveryEvents.length, 1, 'rest on the next day after a miss should create one recovery event');
  assert.ok(recoveryEvents[0].text.includes('重新接住节奏'), 'recovery event should explain the rhythm reset');
  assert.ok(recoveredSave.stats.mental > missedSave.stats.mental, 'recovery should grant a small mental reward');
  assert.equal(recoveredSave.schemaVersion, 2, 'recovery state must stay in v2 save schema');

  const reloaded = createGameContext({ [SAVE_KEY]: JSON.stringify(recoveredSave) });
  assert.equal(reloaded.loadGameFromStorage(), true);
  const afterReload = reloaded.buildSaveData();

  assert.equal(afterReload.eventLog.filter(entry => entry.text.includes('补救日课')).length, 1, 'same missed-day recovery must not repeat after reload');
  assert.ok(afterReload.dailyGoalState.recoveryKeys.includes('2->3'), 'recovery guard should persist in dailyGoalState');
}

const tests = [
  testDailyGoalSevenDaySaveRestoreAndContinue,
  testMissedDailyGoalRecoveryRestIsOneShotAfterReload
];

for (const test of tests) {
  test();
  console.log(`PASS ${test.name}`);
}

console.log(`DAILY_GOAL_VERIFIED ${tests.length}/${tests.length}`);
