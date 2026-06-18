import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');
const HTML_PATH = path.join(ROOT, '程序员生存模拟器_增强版.html');
const POPUP_JS_PATH = path.join(ROOT, '程序员生存模拟器_弹窗库_2026-06-18.js');
const SAVE_KEY = 'codersLifeSave.v2';
const SAVE_BACKUP_KEY = 'codersLifeSave.v2.backup';
const LEGACY_SAVE_KEY = 'programmerSimulator';

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

function createLocalStorage(seed = {}, options = {}) {
  const store = new Map(Object.entries(seed));
  return {
    getItem(key) {
      if (options.throwOnGet?.has?.(key)) throw new Error(`getItem failed for ${key}`);
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      if (options.throwOnSet?.has?.(key)) throw new Error(`setItem failed for ${key}`);
      store.set(key, String(value));
    },
    removeItem(key) {
      if (options.throwOnRemove?.has?.(key)) throw new Error(`removeItem failed for ${key}`);
      store.delete(key);
    },
    keys() {
      return [...store.keys()];
    },
    dump() {
      return Object.fromEntries(store);
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
    elements,
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

function createGameContext(seedStorage = {}, confirmResult = true, options = {}) {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  const popupJs = fs.readFileSync(POPUP_JS_PATH, 'utf8');
  const inlineScript = extractInlineScript(html);
  const document = createDocument();
  const localStorage = createLocalStorage(seedStorage, options.storage || {});
  const context = {
    window: {
      PROGRAMMER_POPUP_POOL: [],
      confirm: () => confirmResult,
      addEventListener: () => {}
    },
    document,
    localStorage,
    console,
    Date,
    Math,
    JSON,
    setTimeout,
    clearTimeout
  };
  if (options.skipInitGameState === true) {
    context.window.__codersLifeSkipInit = true;
  }
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(popupJs, context, { filename: POPUP_JS_PATH });
  vm.runInContext(inlineScript, context, { filename: HTML_PATH });
  return context;
}

function createSteppedDateClass(isoValues) {
  let index = 0;
  return class FakeDate extends Date {
    constructor(...args) {
      if (args.length > 0) {
        super(...args);
        return;
      }
      const value = isoValues[Math.min(index, isoValues.length - 1)];
      index += 1;
      super(value);
    }

    static now() {
      const value = isoValues[Math.min(index, isoValues.length - 1)];
      return new Date(value).getTime();
    }
  };
}

function parseSave(context) {
  const raw = context.localStorage.getItem(SAVE_KEY);
  assert.ok(raw, 'expected v2 save to exist');
  return JSON.parse(raw);
}

function assertDailyGoalCore(actual, expected) {
  for (const [key, value] of Object.entries(expected)) {
    assert.equal(actual[key], value, `dailyGoalState.${key}`);
  }
  assert.ok(Array.isArray(actual.recoveryKeys), 'daily goal recovery guard should be persisted as an array');
}

function testIdleDoesNotOverwriteExistingSave() {
  const existing = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'backend', day: 12, skill: 80, mental: 70, money: 55, ai: 20, age: 30, items: [] }
  });
  const context = createGameContext({ [SAVE_KEY]: existing });

  const result = context.saveGame({ silent: true });

  assert.equal(result, false);
  assert.equal(context.localStorage.getItem(SAVE_KEY), existing);
}

function testNewCareerNeedsConfirmationWhenSaveExists() {
  const existing = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'backend', day: 12, skill: 80, mental: 70, money: 55, ai: 20, age: 30, items: [] }
  });
  const context = createGameContext({ [SAVE_KEY]: existing }, false);

  context.selectCareer('frontend');

  assert.equal(context.localStorage.getItem(SAVE_KEY), existing);
  assert.equal(context.document.getElementById('event-log').children.length, 0);
}

function testSaveIncludesRuntimeStateAndCanRestore() {
  const context = createGameContext();

  context.selectCareer('ai');
  context.action('learn-ai');
  context.action('rest');
  const saved = parseSave(context);

  assert.equal(saved.schemaVersion, 2);
  assert.equal(saved.stats.career, 'ai');
  assert.ok(saved.stats.day >= 2);
  assert.ok(saved.runState && Number.isFinite(saved.runState.focus));
  assert.ok(Array.isArray(saved.eventLog) && saved.eventLog.length >= 3);
  assert.ok(saved.weeklyActionCounts && typeof saved.weeklyActionCounts === 'object');
  assert.ok(Array.isArray(saved.achievements));
  assert.ok(Array.isArray(saved.displayTextHistory) && saved.displayTextHistory.length >= 3);
  assertDailyGoalCore(saved.dailyGoalState, {
    day: 2,
    targetAction: 'rest',
    completed: true,
    streak: 2,
    totalCompleted: 2
  });
  assert.equal(saved.dailyGoalState.completed, true);

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  const loaded = restored.loadGameFromStorage();
  const restoredSave = restored.buildSaveData();

  assert.equal(loaded, true);
  assert.equal(restored.document.getElementById('player-career').textContent, 'AI工程师');
  assert.equal(restored.document.getElementById('day-count').textContent, String(saved.stats.day));
  assert.equal(restored.document.getElementById('game-area').style.display, 'block');
  assert.equal(restored.document.getElementById('event-log').children.length, saved.eventLog.length + 1);
  assert.match(restored.document.getElementById('event-log').children[0].textContent, /接着玩提示/);
  assert.equal(restoredSave.eventLog.length, saved.eventLog.length);
  assert.equal(restoredSave.eventLog.some(entry => entry.text.includes('接着玩提示')), false);
  assert.equal(JSON.stringify(restoredSave.displayTextHistory), JSON.stringify(saved.displayTextHistory));
  assert.deepEqual(restoredSave.dailyGoalState, saved.dailyGoalState);
}

function testDailyGoalStreakUnlocksAndRestores() {
  const context = createGameContext();
  const targetSequence = ['learn-ai', 'rest', 'overtime', 'networking', 'side-project', 'interview', 'learn-ai'];

  context.selectCareer('fullstack');
  for (const actionType of targetSequence) {
    context.action(actionType);
  }
  const saved = parseSave(context);

  assert.equal(saved.stats.day, 7);
  assertDailyGoalCore(saved.dailyGoalState, {
    day: 7,
    targetAction: 'learn-ai',
    completed: true,
    streak: 7,
    totalCompleted: 7
  });
  assert.ok(saved.achievements.includes('daily_anchor'), 'daily goal streak should unlock daily_anchor achievement');
  assert.ok(saved.eventLog.some(entry => entry.type === 'special' && entry.day === 7), 'daily streak feedback should be persisted as a special event');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  const restoredSave = restored.buildSaveData();

  assert.deepEqual(restoredSave.dailyGoalState, saved.dailyGoalState);
  assert.ok(restoredSave.achievements.includes('daily_anchor'), 'daily_anchor achievement should survive restore');
}

function testDailyGoalStreakResetsAfterMissedTarget() {
  const context = createGameContext();

  context.selectCareer('fullstack');
  context.action('learn-ai');
  context.action('learn-ai');
  context.action('overtime');
  const saved = parseSave(context);

  assertDailyGoalCore(saved.dailyGoalState, {
    day: 3,
    targetAction: 'overtime',
    completed: true,
    streak: 1,
    totalCompleted: 2
  });
}

function testBuildProjectProgressPersistsAndRestores() {
  const context = createGameContext();
  context.selectCareer('fullstack');

  let saved = parseSave(context);
  assert.deepEqual(saved.buildProjectState, {
    progress: 0,
    quality: 50,
    debt: 0,
    exposure: 0,
    stage: 'idea',
    shipped: false,
    lastFeedbackDay: 0
  });

  context.action('side-project');
  context.action('side-project');
  context.action('learn-ai');
  context.action('networking');
  context.action('rest');
  context.action('side-project');
  context.action('side-project');
  saved = parseSave(context);

  assert.ok(saved.buildProjectState.progress > 0, 'side-project actions should advance long-term build progress');
  assert.ok(saved.buildProjectState.quality >= 50, 'learning should not degrade build quality');
  assert.ok(saved.buildProjectState.exposure > 0, 'networking should increase project exposure');
  assert.ok(saved.buildProjectState.debt >= 0 && saved.buildProjectState.debt <= 100, 'project debt should be bounded');
  assert.ok(['idea', 'usable', 'portfolio'].includes(saved.buildProjectState.stage), 'build stage should stay in known stages');
  assert.ok(saved.eventLog.some(entry => entry.text.includes('长期 Build 项目')), 'weekly recap should include build project feedback');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  assert.deepEqual(restored.buildSaveData().buildProjectState, saved.buildProjectState);
}

function testBuildProjectStateResetsWhenStartingNewCareer() {
  const saved = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'fullstack', day: 8, skill: 76, mental: 71, money: 58, ai: 41, age: 30, items: [] },
    buildProjectState: {
      progress: 88,
      quality: 72,
      debt: 24,
      exposure: 66,
      stage: 'portfolio',
      shipped: true,
      lastFeedbackDay: 7
    }
  });
  const context = createGameContext({ [SAVE_KEY]: saved });

  assert.equal(context.loadGameFromStorage(), true);
  context.selectCareer('ai');

  assert.deepEqual(context.buildSaveData().buildProjectState, {
    progress: 0,
    quality: 50,
    debt: 0,
    exposure: 0,
    stage: 'idea',
    shipped: false,
    lastFeedbackDay: 0
  });
}

function testBuildProjectShippingCreatesFeedback() {
  const context = createGameContext();
  context.applySaveData({
    schemaVersion: 2,
    stats: { career: 'fullstack', day: 8, skill: 88, mental: 100, money: 140, ai: 70, age: 30, items: [] },
    actionCounts: {},
    buildProjectState: {
      progress: 88,
      quality: 80,
      debt: 20,
      exposure: 40,
      stage: 'usable',
      shipped: false,
      lastFeedbackDay: 0
    }
  });

  context.action('side-project');
  const saved = parseSave(context);

  assert.equal(saved.buildProjectState.progress, 100);
  assert.equal(saved.buildProjectState.stage, 'portfolio');
  assert.equal(saved.buildProjectState.shipped, true);
  assert.ok(saved.eventLog.some(entry => entry.text.includes('长期 Build 项目终于发布')), 'shipping should create visible feedback once');
}

function testInvalidBuildProjectStateIsNormalized() {
  const save = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'backend', day: 10, skill: 70, mental: 75, money: 55, ai: 30, age: 30, items: [] },
    buildProjectState: {
      progress: 999,
      quality: -20,
      debt: 300,
      exposure: 'bad',
      stage: 'moonshot',
      shipped: 'yes',
      lastFeedbackDay: -4
    }
  });
  const context = createGameContext({ [SAVE_KEY]: save });

  assert.equal(context.loadGameFromStorage(), true);
  assert.deepEqual(context.buildSaveData().buildProjectState, {
    progress: 100,
    quality: 0,
    debt: 100,
    exposure: 0,
    stage: 'portfolio',
    shipped: true,
    lastFeedbackDay: 0
  });
}

function testInvalidDailyGoalTargetActionIsNormalized() {
  const save = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'backend', day: 8, skill: 70, mental: 75, money: 55, ai: 30, age: 30, items: [] },
    dailyGoalState: {
      day: 8,
      targetAction: 'delete-production-db',
      completed: true,
      streak: 4,
      totalCompleted: 4
    }
  });
  const context = createGameContext({ [SAVE_KEY]: save });

  assert.equal(context.loadGameFromStorage(), true);
  const restoredSave = context.buildSaveData();

  assert.equal(restoredSave.dailyGoalState.targetAction, '');
  assert.equal(restoredSave.dailyGoalState.completed, true);
}

function testCorruptV2IsBackedUpAndLegacyCanLoad() {
  const legacy = JSON.stringify({
    stats: { career: 'frontend', day: 5, skill: 70, mental: 85, money: 45, ai: 25, age: 30, items: [] },
    actionCounts: { 'learn-ai': 1, overtime: 0, rest: 1, interview: 0, 'side-project': 0, networking: 0 }
  });
  const backup = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'backend', day: 9, skill: 72, mental: 81, money: 61, ai: 35, age: 30, items: [] },
    actionCounts: { 'learn-ai': 1, overtime: 0, rest: 1, interview: 0, 'side-project': 0, networking: 0 }
  });
  const context = createGameContext({ [SAVE_KEY]: '{bad-json', [SAVE_BACKUP_KEY]: backup, [LEGACY_SAVE_KEY]: legacy });

  assert.equal(context.localStorage.getItem(SAVE_KEY), '{bad-json');
  assert.deepEqual(context.localStorage.keys().filter(key => key.includes('.corrupt.')), []);
  const loaded = context.loadGameFromStorage();
  const keys = context.localStorage.keys();

  assert.equal(loaded, true);
  assert.equal(context.localStorage.getItem(SAVE_KEY), backup);
  assert.ok(keys.some(key => key.startsWith(`${SAVE_KEY}.corrupt.`)));
  assert.equal(context.document.getElementById('player-career').textContent, '后端工程师');
  assert.equal(context.localStorage.getItem(SAVE_BACKUP_KEY), backup);
}

function testCorruptLegacyIsBackedUpAndCleared() {
  const context = createGameContext({ [LEGACY_SAVE_KEY]: '{bad-legacy' });

  assert.equal(context.localStorage.getItem(LEGACY_SAVE_KEY), '{bad-legacy');
  assert.deepEqual(context.localStorage.keys().filter(key => key.includes('.corrupt.')), []);
  const loaded = context.loadGameFromStorage();
  const keys = context.localStorage.keys();

  assert.equal(loaded, false);
  assert.equal(context.localStorage.getItem(LEGACY_SAVE_KEY), null);
  assert.ok(keys.some(key => key.startsWith(`${LEGACY_SAVE_KEY}.corrupt.`)));
}

function testLegacyObjectWithoutCareerIsBackedUpAndCleared() {
  const context = createGameContext({
    [LEGACY_SAVE_KEY]: JSON.stringify({
      gameData: { achievements: ['first_day'] },
      actionCounts: { 'learn-ai': 2 }
    })
  });

  const loaded = context.loadGameFromStorage();
  const keys = context.localStorage.keys();

  assert.equal(loaded, false);
  assert.equal(context.localStorage.getItem(LEGACY_SAVE_KEY), null);
  assert.ok(keys.some(key => key.startsWith(`${LEGACY_SAVE_KEY}.corrupt.`)));
}

function testSaveCreatesRestorableBackupBeforeOverwrite() {
  const first = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'frontend', day: 4, skill: 60, mental: 70, money: 50, ai: 30, age: 30, items: [] },
    actionCounts: { 'learn-ai': 2, overtime: 1, rest: 1, interview: 0, 'side-project': 0, networking: 0 }
  });
  const context = createGameContext({ [SAVE_KEY]: first });
  context.Date = createSteppedDateClass([
    '2026-06-18T00:00:00.000Z',
    '2026-06-18T00:00:01.000Z',
    '2026-06-18T00:00:02.000Z'
  ]);

  context.selectCareer('ai');
  const backupAfterNewCareer = context.localStorage.getItem(SAVE_BACKUP_KEY);
  const currentAfterNewCareer = context.localStorage.getItem(SAVE_KEY);
  context.saveGame({ silent: true });
  const backupAfterNoopSave = context.localStorage.getItem(SAVE_BACKUP_KEY);
  const currentAfterNoopSave = context.localStorage.getItem(SAVE_KEY);
  context.action('learn-ai');

  const backup = context.localStorage.getItem(SAVE_BACKUP_KEY);
  const current = context.localStorage.getItem(SAVE_KEY);

  assert.equal(backupAfterNewCareer, first);
  assert.equal(backupAfterNoopSave, first);
  assert.equal(currentAfterNoopSave, currentAfterNewCareer);
  assert.equal(backup, currentAfterNewCareer);
  assert.notEqual(current, first);
  assert.equal(JSON.parse(backupAfterNewCareer).stats.career, 'frontend');
  assert.equal(JSON.parse(backup).stats.career, 'ai');
}

function testSaveQuarantinesCorruptMainBeforeOverwrite() {
  const context = createGameContext({ [SAVE_KEY]: '{bad-json' });

  context.selectCareer('frontend');
  const keys = context.localStorage.keys();
  const corruptKey = keys.find(key => key.startsWith(`${SAVE_KEY}.corrupt.`));

  assert.ok(corruptKey, 'corrupt main save should be quarantined before overwrite');
  assert.equal(context.localStorage.getItem(corruptKey), '{bad-json');
  assert.equal(JSON.parse(context.localStorage.getItem(SAVE_KEY)).stats.career, 'frontend');
}

function testBackupCanRestoreWhenMainSaveIsCorrupt() {
  const backup = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'fullstack', day: 11, skill: 78, mental: 76, money: 68, ai: 42, age: 30, items: [] },
    actionCounts: { 'learn-ai': 2, overtime: 1, rest: 2, interview: 1, 'side-project': 1, networking: 0 }
  });
  const context = createGameContext({ [SAVE_KEY]: '{bad-json', [SAVE_BACKUP_KEY]: backup });

  const loaded = context.loadGameFromStorage();

  assert.equal(loaded, true);
  assert.equal(context.document.getElementById('player-career').textContent, '全栈工程师');
  assert.equal(context.localStorage.getItem(SAVE_KEY), backup);
}

function testValidBackupIsKeptWhenPromotionToMainSaveFails() {
  const backup = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'backend', day: 14, skill: 78, mental: 76, money: 68, ai: 42, age: 30, items: [] },
    actionCounts: { 'learn-ai': 2, overtime: 1, rest: 2, interview: 1, 'side-project': 1, networking: 0 }
  });
  const context = createGameContext(
    { [SAVE_KEY]: '{bad-json', [SAVE_BACKUP_KEY]: backup },
    true,
    { storage: { throwOnSet: new Set([SAVE_KEY]) } }
  );

  const loaded = context.loadGameFromStorage();

  assert.equal(loaded, true);
  assert.equal(context.document.getElementById('player-career').textContent, '后端工程师');
  assert.equal(context.localStorage.getItem(SAVE_BACKUP_KEY), backup, 'valid backup should remain available if promotion fails');
  assert.ok(!context.localStorage.keys().some(key => key.startsWith(`${SAVE_BACKUP_KEY}.corrupt.`)), 'valid backup should not be quarantined');
}

function testBackupCanRestoreWhenCorruptMainRemovalFails() {
  const backup = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'backend', day: 14, skill: 78, mental: 76, money: 68, ai: 42, age: 30, items: [] },
    actionCounts: { 'learn-ai': 2, overtime: 1, rest: 2, interview: 1, 'side-project': 1, networking: 0 }
  });
  const context = createGameContext(
    { [SAVE_KEY]: '{bad-json', [SAVE_BACKUP_KEY]: backup },
    true,
    { storage: { throwOnRemove: new Set([SAVE_KEY]) } }
  );

  const loaded = context.loadGameFromStorage();

  assert.equal(loaded, true);
  assert.equal(context.document.getElementById('player-career').textContent, '后端工程师');
  assert.equal(context.localStorage.getItem(SAVE_BACKUP_KEY), backup, 'backup should remain readable when corrupt main removal fails');
}

function testResumeButtonProbeDoesNotMutateCorruptMainSaveWithValidBackup() {
  const backup = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'backend', day: 9, skill: 72, mental: 81, money: 61, ai: 35, age: 30, items: [] },
    actionCounts: { 'learn-ai': 1, overtime: 0, rest: 1, interview: 0, 'side-project': 0, networking: 0 }
  });
  const context = createGameContext({ [SAVE_KEY]: '{bad-json', [SAVE_BACKUP_KEY]: backup });

  assert.equal(context.localStorage.getItem(SAVE_KEY), '{bad-json');
  assert.equal(context.localStorage.getItem(SAVE_BACKUP_KEY), backup);
  assert.deepEqual(context.localStorage.keys().filter(key => key.includes('.corrupt.')), []);
  assert.equal(context.document.getElementById('resume-btn').style.display, 'block');
}

function testResumeButtonProbeDoesNotMutateCorruptLegacySave() {
  const context = createGameContext({ [LEGACY_SAVE_KEY]: '{bad-legacy' });

  assert.equal(context.localStorage.getItem(LEGACY_SAVE_KEY), '{bad-legacy');
  assert.deepEqual(context.localStorage.keys().filter(key => key.includes('.corrupt.')), []);
  assert.equal(context.document.getElementById('resume-btn').style.display, 'none');
}

function testRestartClearsAllSaveSlotsIncludingBackup() {
  const main = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'ai', day: 6, skill: 82, mental: 74, money: 62, ai: 80, age: 30, items: [] }
  });
  const backup = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'backend', day: 16, skill: 88, mental: 70, money: 72, ai: 44, age: 30, items: [] }
  });
  const legacy = JSON.stringify({
    stats: { career: 'frontend', day: 3, skill: 58, mental: 80, money: 48, ai: 20, age: 30, items: [] }
  });
  const context = createGameContext({ [SAVE_KEY]: main, [SAVE_BACKUP_KEY]: backup, [LEGACY_SAVE_KEY]: legacy });

  context.loadGameFromStorage();
  context.restart();

  assert.equal(context.localStorage.getItem(SAVE_KEY), null);
  assert.equal(context.localStorage.getItem(SAVE_BACKUP_KEY), null);
  assert.equal(context.localStorage.getItem(LEGACY_SAVE_KEY), null);
  assert.equal(context.document.getElementById('event-log').children.length, 0);
}

function testRestartKeepsSaveSlotsWhenUserCancels() {
  const main = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'ai', day: 6, skill: 82, mental: 74, money: 62, ai: 80, age: 30, items: [] }
  });
  const backup = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'backend', day: 16, skill: 88, mental: 70, money: 72, ai: 44, age: 30, items: [] }
  });
  const legacy = JSON.stringify({
    stats: { career: 'frontend', day: 3, skill: 58, mental: 80, money: 48, ai: 20, age: 30, items: [] }
  });
  const context = createGameContext({ [SAVE_KEY]: main, [SAVE_BACKUP_KEY]: backup, [LEGACY_SAVE_KEY]: legacy });
  context.window.confirm = () => false;

  context.loadGameFromStorage();
  context.restart();

  assert.equal(context.localStorage.getItem(SAVE_KEY), main);
  assert.equal(context.localStorage.getItem(SAVE_BACKUP_KEY), backup);
  assert.equal(context.localStorage.getItem(LEGACY_SAVE_KEY), legacy);
}

function testStorageGetFailureDoesNotCrashResumeProbe() {
  const context = createGameContext({}, true, { storage: { throwOnGet: new Set([SAVE_KEY]) } });

  assert.doesNotThrow(() => context.updateResumeButton());
  assert.equal(context.document.getElementById('resume-btn').style.display, 'none');
}

function testStorageSetFailureMakesSaveFailWithoutCrashing() {
  const context = createGameContext({}, true, { storage: { throwOnSet: new Set([SAVE_KEY]) } });

  context.selectCareer('backend');
  const result = context.saveGame({ silent: true });

  assert.equal(result, false);
  assert.ok(
    context.document.getElementById('event-log').children.length >= 1,
    'game should continue rendering events after a storage write failure'
  );
}

function testStorageRemoveFailureDoesNotCrashRestart() {
  const main = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'ai', day: 6, skill: 82, mental: 74, money: 62, ai: 80, age: 30, items: [] }
  });
  const context = createGameContext({ [SAVE_KEY]: main }, true, { storage: { throwOnRemove: new Set([SAVE_KEY]) } });

  context.loadGameFromStorage();
  assert.doesNotThrow(() => context.restart());
  assert.equal(context.document.getElementById('career-selection').style.display, 'grid');
  assert.equal(context.document.getElementById('game-area').style.display, 'none');
}

function testRestartContinuesClearingOtherSaveSlotsWhenOneRemoveFails() {
  const main = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'ai', day: 6, skill: 82, mental: 74, money: 62, ai: 80, age: 30, items: [] }
  });
  const backup = JSON.stringify({
    schemaVersion: 2,
    stats: { career: 'backend', day: 16, skill: 88, mental: 70, money: 72, ai: 44, age: 30, items: [] }
  });
  const legacy = JSON.stringify({
    stats: { career: 'frontend', day: 3, skill: 58, mental: 80, money: 48, ai: 20, age: 30, items: [] }
  });
  const context = createGameContext(
    { [SAVE_KEY]: main, [SAVE_BACKUP_KEY]: backup, [LEGACY_SAVE_KEY]: legacy },
    true,
    { storage: { throwOnRemove: new Set([SAVE_KEY]) } }
  );

  context.loadGameFromStorage();
  assert.doesNotThrow(() => context.restart());

  assert.equal(context.localStorage.getItem(SAVE_BACKUP_KEY), null, 'restart should still clear backup if main removal fails');
  assert.equal(context.localStorage.getItem(LEGACY_SAVE_KEY), null, 'restart should still clear legacy save if main removal fails');
}

const tests = [
  testIdleDoesNotOverwriteExistingSave,
  testNewCareerNeedsConfirmationWhenSaveExists,
  testSaveIncludesRuntimeStateAndCanRestore,
  testDailyGoalStreakUnlocksAndRestores,
  testDailyGoalStreakResetsAfterMissedTarget,
  testBuildProjectProgressPersistsAndRestores,
  testBuildProjectStateResetsWhenStartingNewCareer,
  testBuildProjectShippingCreatesFeedback,
  testInvalidBuildProjectStateIsNormalized,
  testInvalidDailyGoalTargetActionIsNormalized,
  testCorruptV2IsBackedUpAndLegacyCanLoad,
  testCorruptLegacyIsBackedUpAndCleared,
  testLegacyObjectWithoutCareerIsBackedUpAndCleared,
  testSaveCreatesRestorableBackupBeforeOverwrite,
  testSaveQuarantinesCorruptMainBeforeOverwrite,
  testBackupCanRestoreWhenMainSaveIsCorrupt,
  testValidBackupIsKeptWhenPromotionToMainSaveFails,
  testBackupCanRestoreWhenCorruptMainRemovalFails,
  testResumeButtonProbeDoesNotMutateCorruptMainSaveWithValidBackup,
  testResumeButtonProbeDoesNotMutateCorruptLegacySave,
  testRestartClearsAllSaveSlotsIncludingBackup,
  testRestartKeepsSaveSlotsWhenUserCancels,
  testStorageGetFailureDoesNotCrashResumeProbe,
  testStorageSetFailureMakesSaveFailWithoutCrashing,
  testStorageRemoveFailureDoesNotCrashRestart,
  testRestartContinuesClearingOtherSaveSlotsWhenOneRemoveFails
];

for (const test of tests) {
  test();
  console.log(`PASS ${test.name}`);
}

console.log(`SAVE_FLOW_VERIFIED ${tests.length}/${tests.length}`);
