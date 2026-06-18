const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, '程序员生存模拟器_增强版.html');
const popupPath = path.join(root, '程序员生存模拟器_弹窗库_2026-06-18.js');
const saveKey = 'codersLifeSave.v2';

class FakeElement {
  constructor(id = '') {
    this.id = id;
    this.style = {};
    this.children = [];
    this.className = '';
    this.disabled = false;
    this._textContent = '';
    this._innerHTML = '';
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
    },
    keys() {
      return [...store.keys()];
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
  assert(matches.length > 0, 'HTML should contain an inline game script');
  return matches[0][1];
}

function createStableMath() {
  const math = Object.create(Math);
  math.random = () => 0.42;
  return math;
}

function createGameContext(seedStorage = {}) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const popupJs = fs.readFileSync(popupPath, 'utf8');
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
  vm.runInContext(popupJs, context, { filename: popupPath });
  vm.runInContext(extractInlineScript(html), context, { filename: htmlPath });
  return context;
}

function parseSave(context) {
  const raw = context.localStorage.getItem(saveKey);
  assert(raw, 'expected save to exist after gameplay');
  return JSON.parse(raw);
}

function testCoreActionSaveAndRestoreFlow() {
  const context = createGameContext();

  assert(context.window.PROGRAMMER_POPUP_POOL.length >= 400, 'popup pool should remain large');
  context.selectCareer('fullstack');
  context.action('learn-ai');
  context.action('side-project');
  context.action('rest');
  const saved = parseSave(context);

  assert.equal(saved.schemaVersion, 2);
  assert.equal(saved.stats.career, 'fullstack');
  assert.equal(saved.stats.day, 3);
  assert(saved.runGoalState && typeof saved.runGoalState.id === 'string', 'new run should persist a simple run goal');
  assert(saved.runGoalState.title && typeof saved.runGoalState.title === 'string', 'run goal should expose a title for the ending summary');
  assert(saved.eventLog.length >= 4, 'gameplay should write event log entries');
  assert(saved.buildProjectState.progress > 0, 'side project should advance build progress');
  assert(saved.dailyGoalState.totalCompleted >= 1, 'daily goal should update during actions');

  const restored = createGameContext({ [saveKey]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  assert.equal(restored.document.getElementById('player-career').textContent, '全栈工程师');
  assert.equal(restored.document.getElementById('day-count').textContent, '3');
  assert.deepEqual(restored.buildSaveData().runGoalState, saved.runGoalState);
  assert.deepEqual(restored.buildSaveData().buildProjectState, saved.buildProjectState);
}

function testEndingSummaryShowsScoreTitleAndGoalResult() {
  const context = createGameContext();

  context.selectCareer('ai');
  context.applySaveData({
    schemaVersion: 2,
    stats: { skill: 82, mental: 70, money: 130, ai: 85, day: 365, age: 42, career: 'ai', items: [] },
    actionCounts: { 'learn-ai': 20, overtime: 4, rest: 18, interview: 3, 'side-project': 12, networking: 8 },
    weeklyActionCounts: {},
    runState: { focus: 74, fatigue: 24, boundaryScore: 76, lastBoundaryFeedbackDay: 350, lastCareerStageFeedbackDay: 360 },
    buildProjectState: { progress: 100, quality: 78, debt: 22, exposure: 44, stage: 'portfolio', shipped: true, lastFeedbackDay: 350 },
    dailyGoalState: { day: 365, targetAction: 'learn-ai', completed: true, streak: 8, totalCompleted: 80 },
    runGoalState: { id: 'ship_portfolio', title: '把长期 Build 做成作品', description: '发布一个能展示的长期项目', createdDay: 0 }
  });

  context.checkGameOver();
  const saved = parseSave(context);
  const reason = context.document.getElementById('game-over-reason').textContent;
  const endingHtml = context.document.getElementById('ending-type').innerHTML;

  assert.equal(saved.isGameOver, true, 'perfect ending fixture should end the run');
  assert.match(reason, /本局评分：\d+\/100/, 'ending reason should include a compact score');
  assert.match(reason, /本局称号：/, 'ending reason should include a run title');
  assert.match(reason, /目标：把长期 Build 做成作品/, 'ending reason should include the run goal result');
  assert.match(endingHtml, /完美结局/, 'ending panel should keep the existing ending type');
}

function testCorruptMainSaveIsQuarantinedDuringNewRun() {
  const context = createGameContext({ [saveKey]: '{bad-json' });

  context.selectCareer('frontend');
  const corruptKey = context.localStorage.keys().find(key => key.startsWith(`${saveKey}.corrupt.`));

  assert(corruptKey, 'corrupt main save should be quarantined before a new run overwrites it');
  assert.equal(context.localStorage.getItem(corruptKey), '{bad-json');
  assert.equal(JSON.parse(context.localStorage.getItem(saveKey)).stats.career, 'frontend');
}

const tests = [
  testCoreActionSaveAndRestoreFlow,
  testEndingSummaryShowsScoreTitleAndGoalResult,
  testCorruptMainSaveIsQuarantinedDuringNewRun
];

for (const test of tests) {
  test();
  console.log(`PASS ${test.name}`);
}

console.log(`GAME_MECHANICS_VERIFIED ${tests.length}/${tests.length}`);
