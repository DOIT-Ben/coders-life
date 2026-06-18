import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');
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
  assert.ok(matches.length > 0, 'HTML should contain inline game script');
  return matches[0][1];
}

function createGameContext(seedStorage = {}) {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  const popupJs = fs.readFileSync(POPUP_JS_PATH, 'utf8');
  const inlineScript = extractInlineScript(html);
  const document = createDocument();
  const localStorage = createLocalStorage(seedStorage);
  const context = {
    window: {
      PROGRAMMER_POPUP_POOL: [],
      confirm: () => true,
      alert: () => {},
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

  context.globalThis = context;
  vm.createContext(context);
  context.alert = context.window.alert;
  vm.runInContext(popupJs, context, { filename: POPUP_JS_PATH });
  vm.runInContext(inlineScript, context, { filename: HTML_PATH });
  return context;
}

function parseSave(context) {
  const raw = context.localStorage.getItem(SAVE_KEY);
  assert.ok(raw, 'expected v2 save to exist');
  return JSON.parse(raw);
}

function testSaveCapturesResumeContextWithoutSchemaBump() {
  const context = createGameContext();

  context.selectCareer('fullstack');
  context.action('side-project');
  context.action('overtime');
  const saved = parseSave(context);

  assert.equal(saved.schemaVersion, 2, 'resume context must not bump save schema');
  assert.ok(saved.resumeContext && typeof saved.resumeContext === 'object', 'save should include resumeContext snapshot');
  assert.equal(saved.resumeContext.day, saved.stats.day, 'snapshot should remember saved day');
  assert.equal(saved.resumeContext.career, '全栈工程师', 'snapshot should remember readable career');
  assert.ok(saved.resumeContext.lastEventText, 'snapshot should remember last persisted event');
  assert.ok(['skill', 'mental', 'money', 'ai'].includes(saved.resumeContext.weakestStat), 'snapshot should identify weakest stat');
  assert.ok(typeof saved.resumeContext.summary === 'string' && saved.resumeContext.summary.includes('第'), 'snapshot should expose a readable summary');
  assert.ok(typeof saved.resumeContext.nextSuggestion === 'string' && saved.resumeContext.nextSuggestion, 'snapshot should recommend the next action');
}

function testOldSaveGetsResumeReminderFromExistingState() {
  const oldSave = JSON.stringify({
    schemaVersion: 2,
    savedAt: '2026-06-18T00:00:00.000Z',
    stats: { career: 'backend', day: 18, skill: 76, mental: 24, money: 61, ai: 33, age: 30, items: [] },
    actionCounts: { 'learn-ai': 2, overtime: 5, rest: 1, interview: 0, 'side-project': 3, networking: 1 },
    eventLog: [
      { day: 18, text: '线上事故恢复到一半，监控又开始眨眼', type: 'bad', createdAt: 1 },
      { day: 17, text: '你把长期 Build 项目推进到了可用阶段', type: 'special', createdAt: 2 }
    ],
    buildProjectState: { progress: 42, quality: 58, debt: 66, exposure: 12, stage: 'usable', shipped: false, lastFeedbackDay: 14 }
  });
  const context = createGameContext({ [SAVE_KEY]: oldSave });

  assert.equal(context.resumeLastGame(), undefined);

  const restoredSave = context.buildSaveData();
  assert.equal(restoredSave.schemaVersion, 2, 'old save restore should keep schema v2');
  const reminderText = context.document.getElementById('event-log').children[0].textContent;
  assert.ok(reminderText.includes('📌 接着玩提示：'), 'restore should render a context reminder');
  assert.ok(reminderText.includes('第18天'), 'reminder should mention restored day');
  assert.ok(reminderText.includes('精神值偏低'), 'reminder should mention the weakest restored stat');
  assert.ok(reminderText.includes('技术债较高'), 'reminder should surface long-term project recovery risk');
  assert.ok(reminderText.includes('建议下一步：'), 'reminder should include a concrete next action suggestion');
  assert.equal(restoredSave.eventLog.some(entry => entry.text.includes('接着玩提示')), false, 'context reminder should not consume persistent event log slots');
  assert.equal(Object.hasOwn(restoredSave, 'saveHealthSnapshot'), false, 'feature should not add another top-level health schema field');
}

function testResumeReminderIncludesRunMemorySnapshot() {
  const save = JSON.stringify({
    schemaVersion: 2,
    savedAt: '2026-06-18T00:00:00.000Z',
    stats: { career: 'fullstack', day: 28, skill: 81, mental: 58, money: 66, ai: 49, age: 30, items: [] },
    actionCounts: { 'learn-ai': 3, overtime: 1, rest: 2, interview: 0, 'side-project': 9, networking: 2 },
    weeklyActionCounts: { 'learn-ai': 1, overtime: 0, rest: 1, interview: 0, 'side-project': 5, networking: 0 },
    runState: { focus: 72, fatigue: 78, boundaryScore: 34, lastBoundaryFeedbackDay: 21, lastCareerStageFeedbackDay: 10 },
    buildProjectState: { progress: 64, quality: 73, debt: 47, exposure: 22, stage: 'usable', shipped: false, lastFeedbackDay: 21 },
    eventLog: [
      { day: 28, text: '副项目终于跑通了第一个真实用户路径', type: 'special', createdAt: 1 }
    ]
  });
  const context = createGameContext({ [SAVE_KEY]: save });

  assert.equal(context.loadGameFromStorage(), true);

  const reminderText = context.document.getElementById('event-log').children[0].textContent;
  assert.ok(reminderText.includes('近期主线：副业/作品'), 'reminder should include the recent dominant action');
  assert.ok(reminderText.includes('项目可用期'), 'reminder should include the long-term project stage');
  assert.ok(reminderText.includes('边界偏薄'), 'reminder should include boundary state');
  assert.ok(reminderText.includes('疲劳偏高'), 'reminder should include fatigue state');
  assert.ok(reminderText.includes('建议下一步：休息'), 'high fatigue should recommend recovery before more work');
}

function testResumeReminderIncludesRunGoalProgressForOldSaves() {
  const save = JSON.stringify({
    schemaVersion: 2,
    savedAt: '2026-06-18T00:00:00.000Z',
    stats: { career: 'ai', day: 36, skill: 70, mental: 66, money: 74, ai: 60, age: 30, items: [] },
    actionCounts: { 'learn-ai': 6, overtime: 1, rest: 4, interview: 0, 'side-project': 6, networking: 1 },
    weeklyActionCounts: { 'learn-ai': 2, overtime: 0, rest: 1, interview: 0, 'side-project': 2, networking: 0 },
    runState: { focus: 70, fatigue: 34, boundaryScore: 68, lastBoundaryFeedbackDay: 28, lastCareerStageFeedbackDay: 20 },
    buildProjectState: { progress: 28, quality: 64, debt: 22, exposure: 10, stage: 'usable', shipped: false, lastFeedbackDay: 28 },
    runGoalState: { id: 'ai_compound', title: '把 AI 练成复利', description: '把 AI 熟练度、技术和长期项目一起推上去', createdDay: 0 },
    eventLog: [
      { day: 36, text: '你把 AI 工具接进了副项目的验收流程', type: 'special', createdAt: 1 }
    ]
  });
  const context = createGameContext({ [SAVE_KEY]: save });

  assert.equal(context.loadGameFromStorage(), true);
  const restoredSave = context.buildSaveData();
  const reminderText = context.document.getElementById('event-log').children[0].textContent;

  assert.equal(restoredSave.schemaVersion, 2, 'run goal resume hints should not bump save schema');
  assert.equal(Object.hasOwn(restoredSave, 'runGoalResumeState'), false, 'run goal resume hints should not add a new top-level save field');
  assert.ok(reminderText.includes('目标：把 AI 练成复利'), 'resume reminder should mention the active run goal title');
  assert.match(reminderText, /目标进度\d+%/, 'resume reminder should include a compact run goal progress percentage');
  assert.ok(restoredSave.resumeContext.runGoalTitle.includes('把 AI 练成复利'), 'resume context should persist the goal title in existing resumeContext');
  assert.equal(typeof restoredSave.resumeContext.runGoalProgress, 'number', 'resume context should persist the computed goal progress');
}

function testFullEventLogRestoreDoesNotDropRealHistory() {
  const eventLog = Array.from({ length: 80 }, (_, index) => ({
    day: 80 - index,
    text: `真实历史事件 ${index + 1}`,
    type: index % 3 === 0 ? 'special' : 'neutral',
    createdAt: index + 1
  }));
  const fullSave = JSON.stringify({
    schemaVersion: 2,
    savedAt: '2026-06-18T00:00:00.000Z',
    stats: { career: 'backend', day: 80, skill: 76, mental: 24, money: 61, ai: 33, age: 32, items: [] },
    eventLog,
    buildProjectState: { progress: 42, quality: 58, debt: 66, exposure: 12, stage: 'usable', shipped: false, lastFeedbackDay: 77 }
  });
  const context = createGameContext({ [SAVE_KEY]: fullSave });

  assert.equal(context.loadGameFromStorage(), true);
  const restoredSave = context.buildSaveData();

  assert.equal(restoredSave.eventLog.length, 80, 'restore should keep all real history entries at cap');
  assert.equal(restoredSave.eventLog[79].text, '真实历史事件 80', 'oldest real event should not be displaced by resume reminder');
  assert.equal(restoredSave.eventLog.some(entry => entry.text.includes('接着玩提示')), false, 'resume reminder should stay render-only');
  assert.ok(context.document.getElementById('event-log').children[0].textContent.includes('接着玩提示'), 'rendered log should still show resume reminder');
}

function testFollowingResumeSuggestionCreatesOneShotFeedback() {
  const save = JSON.stringify({
    schemaVersion: 2,
    savedAt: '2026-06-18T00:00:00.000Z',
    stats: { career: 'backend', day: 20, skill: 74, mental: 31, money: 62, ai: 38, age: 30, items: [] },
    actionCounts: { 'learn-ai': 2, overtime: 6, rest: 1, interview: 0, 'side-project': 2, networking: 1 },
    runState: { focus: 48, fatigue: 82, boundaryScore: 32, lastBoundaryFeedbackDay: 14, lastCareerStageFeedbackDay: 10 },
    buildProjectState: { progress: 35, quality: 58, debt: 52, exposure: 8, stage: 'usable', shipped: false, lastFeedbackDay: 14 },
    eventLog: [
      { day: 20, text: '连续加班后，你终于意识到精神值正在报警', type: 'bad', createdAt: 1 }
    ]
  });
  const context = createGameContext({ [SAVE_KEY]: save });

  assert.equal(context.loadGameFromStorage(), true);
  assert.ok(context.document.getElementById('event-log').children[0].textContent.includes('建议下一步：休息'), 'fixture should recommend rest');

  context.action('rest');
  const firstFollowupSave = context.buildSaveData();
  assert.ok(firstFollowupSave.eventLog.some(entry => entry.text.includes('接住读档建议')), 'matching the resume suggestion should create a one-shot feedback event');
  assert.equal(firstFollowupSave.eventLog.filter(entry => entry.text.includes('接住读档建议')).length, 1, 'resume suggestion feedback should happen once');

  context.action('rest');
  const secondFollowupSave = context.buildSaveData();
  assert.equal(secondFollowupSave.eventLog.filter(entry => entry.text.includes('接住读档建议')).length, 1, 'resume suggestion feedback should not repeat after being consumed');
}

function testConsumedResumeSuggestionDoesNotRepeatAfterReload() {
  const save = JSON.stringify({
    schemaVersion: 2,
    savedAt: '2026-06-18T00:00:00.000Z',
    stats: { career: 'fullstack', day: 20, skill: 74, mental: 70, money: 62, ai: 38, age: 30, items: [] },
    actionCounts: { 'learn-ai': 2, overtime: 1, rest: 3, interview: 0, 'side-project': 5, networking: 1 },
    runState: { focus: 66, fatigue: 32, boundaryScore: 62, lastBoundaryFeedbackDay: 14, lastCareerStageFeedbackDay: 10 },
    buildProjectState: { progress: 40, quality: 58, debt: 24, exposure: 8, stage: 'usable', shipped: false, lastFeedbackDay: 14 },
    eventLog: [
      { day: 20, text: '长期项目还有一个能被用户验证的小版本没收口', type: 'special', createdAt: 1 }
    ]
  });
  const first = createGameContext({ [SAVE_KEY]: save });

  assert.equal(first.loadGameFromStorage(), true);
  assert.ok(first.document.getElementById('event-log').children[0].textContent.includes('建议下一步：副业/作品'), 'fixture should recommend side project');
  first.action('side-project');
  const afterFollowup = first.localStorage.getItem(SAVE_KEY);
  assert.ok(JSON.parse(afterFollowup).eventLog.some(entry => entry.text.includes('接住读档建议')), 'fixture should persist consumed followup event');

  const second = createGameContext({ [SAVE_KEY]: afterFollowup });
  assert.equal(second.loadGameFromStorage(), true);
  assert.ok(second.document.getElementById('event-log').children[0].textContent.includes('建议下一步：副业/作品'), 'reload should still recommend the same action without persistence guard');
  second.action('side-project');
  const reloadedSave = parseSave(second);

  assert.equal(reloadedSave.eventLog.filter(entry => entry.text.includes('接住读档建议')).length, 1, 'consumed resume suggestion should not repeat after reload');
  assert.ok(!reloadedSave.resumeContext.lastEventText.includes('接住读档建议'), 'resume context should not use followup meta events as the last real event');
}

function testResumeSuggestionCanRecoverMissedDailyGoalOnce() {
  const save = JSON.stringify({
    schemaVersion: 2,
    savedAt: '2026-06-18T00:00:00.000Z',
    stats: { career: 'backend', day: 2, skill: 74, mental: 42, money: 62, ai: 38, age: 30, items: [] },
    actionCounts: { 'learn-ai': 1, overtime: 1, rest: 0, interview: 0, 'side-project': 0, networking: 0 },
    runState: { focus: 48, fatigue: 82, boundaryScore: 32, lastBoundaryFeedbackDay: 0, lastCareerStageFeedbackDay: 0 },
    dailyGoalState: { day: 2, targetAction: 'rest', completed: false, streak: 0, totalCompleted: 1 },
    resumeContext: {
      day: 2,
      career: '后端工程师',
      weakestStat: 'mental',
      weakestStatLabel: '精神值',
      weakestStatValue: 42,
      lastEventText: '你错过了今天该休息恢复的节奏',
      projectProgress: 0,
      projectDebt: 0,
      summary: '第2天 后端工程师，精神值42，上次停在“你错过了今天该休息恢复的节奏”',
      noteText: '疲劳偏高',
      nextSuggestion: '休息恢复，先把精神值和疲劳拉回安全区'
    },
    eventLog: [
      { day: 2, text: '你错过了今天该休息恢复的节奏', type: 'bad', createdAt: 1 }
    ]
  });
  const first = createGameContext({ [SAVE_KEY]: save });

  assert.equal(first.loadGameFromStorage(), true);
  first.action('rest');
  const recovered = parseSave(first);

  assert.equal(recovered.eventLog.filter(entry => entry.text.includes('补救日课')).length, 1, 'following resume suggestion after a miss should create one recovery event');
  assert.equal(recovered.eventLog.filter(entry => entry.text.includes('接住读档建议')).length, 1, 'existing resume followup event should still happen once');

  const second = createGameContext({ [SAVE_KEY]: JSON.stringify(recovered) });
  assert.equal(second.loadGameFromStorage(), true);
  const reloaded = second.buildSaveData();

  assert.equal(reloaded.eventLog.filter(entry => entry.text.includes('补救日课')).length, 1, 'daily recovery reward should not repeat after reload');
  assert.ok(reloaded.dailyGoalState.recoveryKeys.includes('2->3'), 'daily recovery guard should survive reload');
  assert.equal(reloaded.schemaVersion, 2, 'daily recovery guard must not bump schema');
}

const tests = [
  testSaveCapturesResumeContextWithoutSchemaBump,
  testOldSaveGetsResumeReminderFromExistingState,
  testResumeReminderIncludesRunMemorySnapshot,
  testResumeReminderIncludesRunGoalProgressForOldSaves,
  testFullEventLogRestoreDoesNotDropRealHistory,
  testFollowingResumeSuggestionCreatesOneShotFeedback,
  testConsumedResumeSuggestionDoesNotRepeatAfterReload,
  testResumeSuggestionCanRecoverMissedDailyGoalOnce
];

for (const test of tests) {
  test();
  console.log(`PASS ${test.name}`);
}

console.log(`SAVE_RESUME_CONTEXT_VERIFIED ${tests.length}/${tests.length}`);
