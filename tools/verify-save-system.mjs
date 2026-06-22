import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const htmlPath = path.join(rootDir, '程序员生存模拟器.html');

function extractInlineScript(html) {
  const marker = '<script src="程序员生存模拟器_弹窗库_2026-06-18.js"></script>';
  const start = html.indexOf(marker);
  assert.notEqual(start, -1, '入口 HTML 应包含弹窗库 script 标记');
  const scriptStart = html.indexOf('<script>', start + marker.length);
  const scriptEnd = html.indexOf('</script>', scriptStart);
  assert.notEqual(scriptStart, -1, '入口 HTML 应包含内联游戏脚本');
  assert.notEqual(scriptEnd, -1, '入口 HTML 内联游戏脚本应闭合');
  return html.slice(scriptStart + '<script>'.length, scriptEnd);
}

class ElementStub {
  constructor(id = '') {
    this.id = id;
    this.style = {};
    this.children = [];
    this.firstChild = null;
    this._textContent = '';
    this._innerHTML = '';
    this.className = '';
    this.disabled = false;
  }

  set textContent(value) {
    this._textContent = String(value);
  }

  get textContent() {
    return this._textContent;
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
    if (value === '') {
      this.children = [];
      this.firstChild = null;
    }
  }

  get innerHTML() {
    return this._innerHTML;
  }

  insertBefore(child) {
    this.children.unshift(child);
    this.firstChild = this.children[0] || null;
  }

  appendChild(child) {
    this.children.push(child);
    this.firstChild = this.children[0] || null;
  }
}

function createStorage() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
    keys() {
      return Array.from(data.keys());
    }
  };
}

function createHarness() {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const script = extractInlineScript(html);
  const elements = new Map();
  const actionButtons = Array.from({ length: 6 }, () => ({ disabled: false }));

  function getElementById(id) {
    if (!elements.has(id)) {
      elements.set(id, new ElementStub(id));
    }
    return elements.get(id);
  }

  const localStorage = createStorage();
  const warnings = [];
  const context = {
    console,
    Date,
    JSON,
    Math: Object.create(Math),
    Array,
    Boolean,
    Number,
    String,
    Object,
    window: null,
    document: {
      getElementById,
      createElement: () => new ElementStub(),
      querySelectorAll: (selector) => selector === '.action-btn' ? actionButtons : []
    },
    localStorage,
    setTimeout,
    clearTimeout
  };
  context.console = {
    log: console.log,
    warn: (...args) => warnings.push(args.map(String).join(' ')),
    error: (...args) => warnings.push(args.map(String).join(' '))
  };
  context.window = {
    PROGRAMMER_POPUP_POOL: [{ id: 'stub-popup', kind: 'event', category: '测试', text: '测试弹窗', effect: {} }],
    confirm: () => true,
    alert: () => {},
    addEventListener: () => {}
  };
  context.confirm = context.window.confirm;
  context.alert = context.window.alert;
  vm.createContext(context);
  vm.runInContext(script, context, { filename: htmlPath });
  return { context, elements, actionButtons, localStorage, warnings };
}

function readSave(harness) {
  const raw = harness.localStorage.getItem('codersLifeSave.v2');
  assert.ok(raw, '应存在 v2 存档');
  return JSON.parse(raw);
}

function testNewCareerDirectlyStartsAndBacksUpExistingSave() {
  const h = createHarness();
  h.context.selectCareer('frontend');
  const before = h.localStorage.getItem('codersLifeSave.v2');
  h.context.restart();
  h.localStorage.setItem('codersLifeSave.v2', before);
  h.context.selectCareer('backend');

  const after = JSON.parse(h.localStorage.getItem('codersLifeSave.v2'));
  assert.equal(after.stats.career, 'backend', '选择新职业应直接开始新局');
  assert.equal(h.localStorage.getItem('codersLifeSave.v2.backup'), before, '覆盖当前局前应保留备份');
}

function testFutureSchemaIsPreservedBeforeDirectNewCareer() {
  const h = createHarness();
  const futureSave = JSON.stringify({
    schemaVersion: 999,
    stats: { career: 'backend', day: 99 }
  });
  h.localStorage.setItem('codersLifeSave.v2', futureSave);

  h.context.selectCareer('frontend');

  assert.notEqual(h.localStorage.getItem('codersLifeSave.v2'), futureSave, '新开局应直接写入当前版本存档');
  const futureKey = h.localStorage.keys().find(key => key.startsWith('codersLifeSave.v2.future.'));
  assert.ok(futureKey, '覆盖未来版本前应保存到 future 专用槽');
  assert.equal(h.localStorage.getItem(futureKey), futureSave);
  assert.equal(h.localStorage.keys().some(key => key.startsWith('codersLifeSave.v2.corrupt.')), false, '未来版本存档不应被当坏档隔离');
}

function testFutureSchemaIsPreservedInFutureSlotBeforeOverwrite() {
  const h = createHarness();
  const futureSave = JSON.stringify({
    schemaVersion: 999,
    stats: { career: 'backend', day: 99 }
  });
  h.localStorage.setItem('codersLifeSave.v2', futureSave);
  h.context.window.confirm = () => true;

  h.context.selectCareer('frontend');

  assert.notEqual(h.localStorage.getItem('codersLifeSave.v2'), futureSave, '确认新开局后主键可以写入当前版本存档');
  const futureKey = h.localStorage.keys().find(key => key.startsWith('codersLifeSave.v2.future.'));
  assert.ok(futureKey, '覆盖未来版本前应保存到 future 专用槽');
  assert.equal(h.localStorage.getItem(futureKey), futureSave);
  assert.equal(h.localStorage.keys().some(key => key.startsWith('codersLifeSave.v2.corrupt.')), false, '未来版本存档不应写入 corrupt 槽');
}

function testFutureSchemaIsNotOverwrittenWhenFutureBackupFails() {
  const h = createHarness();
  const futureSave = JSON.stringify({
    schemaVersion: 999,
    stats: { career: 'backend', day: 99 }
  });
  h.localStorage.setItem('codersLifeSave.v2', futureSave);
  const originalSetItem = h.localStorage.setItem.bind(h.localStorage);
  h.localStorage.setItem = (key, value) => {
    if (key.startsWith('codersLifeSave.v2.future.')) {
      throw new Error('future backup quota exceeded');
    }
    originalSetItem(key, value);
  };
  h.context.window.confirm = () => true;

  h.context.selectCareer('frontend');

  assert.equal(h.localStorage.getItem('codersLifeSave.v2'), futureSave, '未来版本备份失败时不得覆盖主存档');
  assert.equal(h.elements.get('career-selection').style.display, 'grid', '未来版本备份失败时应退回职业选择');
  assert.equal(h.elements.get('game-area').style.display, 'none', '未来版本备份失败时不应进入无法保存的新局');
}

function testValidSaveCanRestore() {
  const h = createHarness();
  h.context.selectCareer('ai');
  h.context.action('learn-ai');
  const saved = readSave(h);

  const restored = createHarness();
  restored.localStorage.setItem('codersLifeSave.v2', JSON.stringify(saved));
  assert.equal(restored.context.resumeLastGame(), undefined, '恢复入口不应抛错');
  assert.equal(restored.elements.get('game-area').style.display, 'block', '有效存档应恢复游戏区');
  assert.equal(restored.elements.get('career-selection').style.display, 'none', '有效存档应隐藏职业选择');
  assert.equal(restored.elements.get('day-count').textContent, String(saved.stats.day), '天数应恢复到存档值');
  assert.equal(restored.elements.get('player-career').textContent, 'AI工程师', '职业名应按存档恢复');
  assert.ok(restored.elements.get('event-log').children.length > 0, '事件日志应恢复');
}

function testValidSaveIsPreservedWhenRestoreRenderingFails() {
  const h = createHarness();
  h.context.selectCareer('ai');
  h.context.action('learn-ai');
  const savedRaw = h.localStorage.getItem('codersLifeSave.v2');

  const restored = createHarness();
  restored.localStorage.setItem('codersLifeSave.v2', savedRaw);
  const originalGetElementById = restored.context.document.getElementById;
  restored.context.document.getElementById = (id) => {
    if (id === 'player-career') return null;
    return originalGetElementById(id);
  };

  assert.equal(restored.context.loadGameFromStorage(), false, '渲染失败时读档应返回失败状态');
  assert.equal(restored.localStorage.getItem('codersLifeSave.v2'), savedRaw, '渲染失败不应隔离或删除有效主存档');
  assert.equal(restored.localStorage.keys().some(key => key.startsWith('codersLifeSave.v2.corrupt.')), false, '渲染失败不应把有效存档写入 corrupt 槽');
}

function testRestoreRenderingFailureDoesNotLeakRestoringFlag() {
  const h = createHarness();
  h.context.selectCareer('ai');
  const savedRaw = h.localStorage.getItem('codersLifeSave.v2');

  const restored = createHarness();
  restored.localStorage.setItem('codersLifeSave.v2', savedRaw);
  const originalGetElementById = restored.context.document.getElementById;
  restored.context.document.getElementById = (id) => {
    if (id === 'player-career') return null;
    return originalGetElementById(id);
  };
  restored.context.loadGameFromStorage();

  restored.context.document.getElementById = originalGetElementById;
  restored.context.restart();
  restored.context.selectCareer('frontend');
  const newSave = JSON.parse(restored.localStorage.getItem('codersLifeSave.v2'));

  assert.ok(newSave.eventLog.some(entry => entry.text.includes('欢迎来到2026年')), '读档渲染失败后新开局仍应持久化欢迎事件');
}

function testCorruptV2SaveIsBackedUp() {
  const h = createHarness();
  h.localStorage.setItem('codersLifeSave.v2', '{bad-json');
  assert.equal(h.context.resumeLastGame(), undefined, '坏档恢复入口不应抛错');
  assert.equal(h.localStorage.getItem('codersLifeSave.v2'), null, '坏 v2 存档应从主键隔离');
  assert.ok(h.localStorage.keys().some(key => key.startsWith('codersLifeSave.v2.corrupt.')), '坏 v2 存档应备份到 corrupt 键');
}

function testCorruptLegacySaveIsBackedUp() {
  const h = createHarness();
  h.localStorage.setItem('programmerSimulator', '{bad-legacy');
  assert.equal(h.context.resumeLastGame(), undefined, '坏旧存档恢复入口不应抛错');
  assert.equal(h.localStorage.getItem('programmerSimulator'), null, '坏旧存档应从 legacy 主键隔离');
  assert.ok(h.localStorage.keys().some(key => key.startsWith('programmerSimulator.corrupt.')), '坏旧存档应备份到 corrupt 键');
}

function testMalformedV2SaveIsBackedUp() {
  const h = createHarness();
  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify({
    schemaVersion: 2,
    savedAt: 'not-a-date',
    stats: 'not-an-object',
    eventLog: 'not-an-array'
  }));
  h.context.resumeLastGame();
  assert.equal(h.localStorage.getItem('codersLifeSave.v2'), null, '结构损坏的 v2 存档应从主键隔离');
  assert.ok(h.localStorage.keys().some(key => key.startsWith('codersLifeSave.v2.corrupt.')), '结构损坏的 v2 存档应备份到 corrupt 键');
}

function testMalformedHiddenStateFieldsAreBackedUp() {
  const h = createHarness();
  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { career: 'backend', day: 3, skill: 70, mental: 70, money: 50, ai: 30, age: 30, items: [] },
    rarePopupCooldowns: [],
    toolHabitState: [],
    resumeFollowupState: [],
    isGameOver: 'false'
  }));

  h.context.resumeLastGame();

  assert.equal(h.localStorage.getItem('codersLifeSave.v2'), null, '隐藏状态字段类型损坏的 v2 存档应从主键隔离');
  assert.ok(h.localStorage.keys().some(key => key.startsWith('codersLifeSave.v2.corrupt.')), '隐藏状态字段类型损坏的 v2 存档应备份到 corrupt 键');
}

function testFutureSchemaIsPreservedWithoutQuarantine() {
  const h = createHarness();
  const futureSave = JSON.stringify({
    schemaVersion: 999,
    stats: { career: 'backend', day: 99 }
  });
  h.localStorage.setItem('codersLifeSave.v2', futureSave);

  h.context.resumeLastGame();

  assert.equal(h.localStorage.getItem('codersLifeSave.v2'), futureSave, '未来版本存档应保留在主键中');
  assert.ok(!h.localStorage.keys().some(key => key.startsWith('codersLifeSave.v2.corrupt.')), '未来版本存档不应被当成损坏档隔离');
  assert.equal(h.context.hasSavedGame(), true, '未来版本存档应显示为受保护存档');
  assert.equal(h.elements.get('resume-btn').style.display, 'block', '继续按钮应保留以阻止误开局覆盖');
}

function testFutureSchemaResumeShowsVisibleWarning() {
  const h = createHarness();
  const futureSave = JSON.stringify({
    schemaVersion: 999,
    stats: { career: 'backend', day: 99 }
  });
  const alerts = [];
  h.context.window.alert = (message) => alerts.push(String(message));
  h.context.alert = h.context.window.alert;
  h.localStorage.setItem('codersLifeSave.v2', futureSave);

  h.context.resumeLastGame();

  assert.equal(h.localStorage.getItem('codersLifeSave.v2'), futureSave, '未来版本存档应保留在主键中');
  assert.ok(alerts.some(message => message.includes('存档版本') && message.includes('更新版本')), '未来版本读档失败时应给用户可见提示');
}

function testMalformedLegacyShapeIsBackedUpAndCleared() {
  const h = createHarness();
  h.localStorage.setItem('programmerSimulator', '123');
  h.context.resumeLastGame();
  assert.equal(h.localStorage.getItem('programmerSimulator'), null, '结构损坏的 legacy 存档应从主键隔离');
  assert.ok(h.localStorage.keys().some(key => key.startsWith('programmerSimulator.corrupt.')), '结构损坏的 legacy 存档应备份到 corrupt 键');
}

function testSaveContainsHiddenStateLogAndAchievements() {
  const h = createHarness();
  h.context.selectCareer('fullstack');
  h.context.action('learn-ai');
  h.context.saveGame();
  const saved = readSave(h);
  assert.equal(saved.schemaVersion, 2, '存档应包含 schemaVersion=2');
  assert.ok(saved.runState && typeof saved.runState.focus === 'number', '存档应包含隐藏 runState.focus');
  assert.ok(saved.runState && typeof saved.runState.fatigue === 'number', '存档应包含隐藏 runState.fatigue');
  assert.ok(saved.weeklyActionCounts && typeof saved.weeklyActionCounts['learn-ai'] === 'number', '存档应包含周动作计数');
  assert.ok(Array.isArray(saved.eventLog) && saved.eventLog.length > 0, '存档应包含事件日志');
  assert.ok(Array.isArray(saved.displayTextHistory) && saved.displayTextHistory.length > 0, '存档应包含显示文本冷却历史');
  assert.ok(Array.isArray(saved.achievements) && saved.achievements.includes('first_day'), '存档应包含已解锁成就');
  assert.ok(!saved.eventLog.some(entry => entry.text === '游戏已保存'), '手动保存提示不应污染持久事件日志');
}

function testGameDataStatsAreClampedAndDedupedOnRestore() {
  const h = createHarness();
  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { skill: 70, mental: 75, money: 55, ai: 40, day: 20, age: 30, career: 'backend', items: [] },
    gameData: {
      achievements: ['first_day', 'first_day', {}],
      deaths: -3.5,
      maxDay: -1,
      endings: [{}, '精神崩溃结局', '精神崩溃结局']
    },
    achievements: ['first_day', 'first_day', {}],
    shopItems: []
  }));
  h.context.resumeLastGame();
  const saved = h.context.buildSaveData();

  assert.equal(saved.gameData.deaths, 0, '死亡次数应归一化为非负整数');
  assert.equal(saved.gameData.maxDay, 0, '最大天数应归一化为非负整数');
  assert.deepEqual(saved.gameData.endings, ['精神崩溃结局'], '结局记录应过滤非字符串并去重');
  assert.deepEqual(saved.gameData.achievements, ['first_day'], '成就记录应过滤非字符串并去重');
}

function testUnknownCareerNormalizesToFullstackOnRestore() {
  const h = createHarness();
  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { skill: 70, mental: 75, money: 55, ai: 40, day: 20, age: 30, career: 'unknown-career', items: [] },
    actionCounts: {},
    runGoalState: { id: 'ship_portfolio', title: '把作品做成作品集', description: '旧档里残留的前端目标', createdDay: 0 },
    gameData: { achievements: [], deaths: 0, maxDay: 20, endings: [], runs: [] },
    achievements: [],
    shopItems: []
  }));

  assert.equal(h.context.loadGameFromStorage(), true);
  const saved = h.context.buildSaveData();

  assert.equal(saved.schemaVersion, 2, '归一化未知职业不应 bump schema');
  assert.equal(saved.stats.career, 'fullstack', '未知职业应回落到可预期的 fullstack');
  assert.equal(h.elements.get('player-career').textContent, '全栈工程师', 'UI 职业名应与归一化后的职业一致');
  assert.equal(saved.runGoalState.id, 'balanced_builder', '本局目标应与 fullstack 职业一致');
  assert.equal(h.localStorage.keys().some(key => key.startsWith('codersLifeSave.v2.corrupt.')), false, '未知职业兼容恢复不应隔离用户存档');
}

function testLegacyMonthlyAgeIsClampedOnRestore() {
  const h = createHarness();
  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { skill: 90, mental: 90, money: 150, ai: 90, day: 365, age: 42, career: 'ai', items: [] },
    actionCounts: {},
    runState: { focus: 80, fatigue: 10, boundaryScore: 80 },
    buildProjectState: { progress: 90, quality: 80, debt: 10, exposure: 40, stage: 'portfolio', shipped: true, lastFeedbackDay: 350 },
    gameData: { achievements: [], deaths: 0, maxDay: 364, endings: [], runs: [] },
    achievements: [],
    shopItems: []
  }));

  assert.equal(h.context.loadGameFromStorage(), true);
  const saved = h.context.buildSaveData();

  assert.equal(saved.stats.age, 31, '旧版本按月增长得到的虚高年龄应按一年尺度校正');
  assert.equal(saved.achievements.includes('old_dog'), false, '旧虚高年龄不应在读档后保留或触发 40 岁成就');
  assert.equal(saved.schemaVersion, 2, '年龄兼容迁移不应 bump schema');
}

function testLegacyStatsItemsRestoreShopOwnership() {
  const h = createHarness();
  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { career: 'fullstack', day: 9, skill: 70, mental: 72, money: 55, ai: 36, age: 30, items: ['keyboard', 'chair'] },
    actionCounts: { 'learn-ai': 1, overtime: 0, rest: 1, interview: 0, 'side-project': 0, networking: 0 },
    gameData: { deaths: 0, maxDay: 9, endings: [], achievements: [] }
  }));

  assert.equal(h.context.loadGameFromStorage(), true);
  const saved = h.context.buildSaveData();

  assert.equal(JSON.stringify(saved.shopItems.sort()), JSON.stringify(['chair', 'keyboard']));
}

function testGameOverRestoreKeepsEndingUi() {
  const h = createHarness();
  const gameOverSave = {
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { skill: 10, mental: 0, money: 20, ai: 30, day: 12, age: 30, career: 'backend', items: [] },
    actionCounts: {},
    consecutiveEvents: {},
    weeklyActionCounts: {},
    streakRewards: {},
    runState: { focus: 20, fatigue: 90 },
    popupHistory: ['p1'],
    popupCategoryHistory: ['事故'],
    displayTextHistory: ['精神崩溃结局触发'],
    eventLog: [{ day: 12, text: '精神崩溃结局触发', type: 'bad', createdAt: Date.now() }],
    isGameOver: true,
    gameOverState: { reason: '你在第12天精神崩溃了。', endingType: '精神崩溃结局' },
    gameData: { achievements: ['first_day'], deaths: 1, maxDay: 12, endings: ['精神崩溃结局'] },
    achievements: ['first_day'],
    shopItems: []
  };
  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify(gameOverSave));
  h.context.resumeLastGame();
  assert.equal(h.elements.get('game-over').style.display, 'block', '游戏结束存档应恢复 game over 面板');
  assert.match(h.elements.get('game-over-reason').textContent, /第12天/, '游戏结束原因应恢复');
  assert.match(h.elements.get('ending-type').innerHTML, /精神崩溃结局/, '结局标题应恢复');
  assert.ok(h.actionButtons.every(button => button.disabled), '游戏结束后行动按钮应保持禁用');
}

function testGameOverStateForcesEndedRunOnRestore() {
  const h = createHarness();
  const inconsistentSave = {
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { skill: 35, mental: 0, money: 20, ai: 30, day: 18, age: 30, career: 'frontend', items: [] },
    actionCounts: {},
    consecutiveEvents: {},
    weeklyActionCounts: {},
    streakRewards: {},
    runState: { focus: 15, fatigue: 95 },
    popupHistory: [],
    popupCategoryHistory: [],
    displayTextHistory: ['终局状态'],
    eventLog: [{ day: 18, text: '终局状态', type: 'bad', createdAt: Date.now() }],
    isGameOver: false,
    gameOverState: { reason: '你在第18天精神崩溃了。', endingType: '精神崩溃结局' },
    gameData: { achievements: ['first_day'], deaths: 1, maxDay: 18, endings: ['精神崩溃结局'] },
    achievements: ['first_day'],
    shopItems: []
  };

  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify(inconsistentSave));
  h.context.resumeLastGame();
  const restoredSave = h.context.buildSaveData();

  assert.equal(restoredSave.isGameOver, true, '存在 gameOverState 的存档应恢复为已结束状态');
  assert.equal(h.elements.get('game-over').style.display, 'block', '不一致终局存档应显示 game over 面板');
  assert.ok(h.actionButtons.every(button => button.disabled), '不一致终局存档应禁用行动按钮');
}

function testPerfectEndingDoesNotIncrementDeaths() {
  const h = createHarness();
  const nearPerfectSave = {
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { skill: 75, mental: 80, money: 120, ai: 80, day: 365, age: 31, career: 'ai', items: [] },
    actionCounts: {},
    consecutiveEvents: {},
    weeklyActionCounts: {},
    streakRewards: {},
    runState: { focus: 70, fatigue: 20 },
    popupHistory: [],
    popupCategoryHistory: [],
    displayTextHistory: [],
    eventLog: [],
    isGameOver: false,
    gameOverState: null,
    gameData: { achievements: ['first_day'], deaths: 0, maxDay: 364, endings: [] },
    achievements: ['first_day'],
    shopItems: []
  };

  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify(nearPerfectSave));
  h.context.resumeLastGame();
  h.context.checkGameOver();
  const saved = readSave(h);

  assert.ok(h.elements.get('game-over').style.display === 'block', '完美结局应进入终局');
  assert.equal(saved.gameData.deaths, 0, '完美结局不应计入死亡次数');
  assert.ok(saved.gameData.endings.includes('✨ 完美结局'), '完美结局应记录到 endings');
}

function testEndingPersistsCompactRunSummary() {
  const h = createHarness();
  h.context.selectCareer('ai');
  h.context.applySaveData({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { skill: 82, mental: 70, money: 130, ai: 85, day: 365, age: 31, career: 'ai', items: [] },
    actionCounts: { 'learn-ai': 20, overtime: 4, rest: 18, interview: 3, 'side-project': 12, networking: 8 },
    weeklyActionCounts: {},
    runState: { focus: 74, fatigue: 24, boundaryScore: 76, lastBoundaryFeedbackDay: 350, lastCareerStageFeedbackDay: 360 },
    buildProjectState: { progress: 100, quality: 78, debt: 22, exposure: 44, stage: 'portfolio', shipped: true, lastFeedbackDay: 350 },
    dailyGoalState: { day: 365, targetAction: 'learn-ai', completed: true, streak: 8, totalCompleted: 80 },
    runGoalState: { id: 'ai_compound', title: '把 AI 练成复利', description: '把 AI 熟练度、技术和长期项目一起推上去', createdDay: 0 },
    gameData: { achievements: ['first_day'], deaths: 0, maxDay: 364, endings: [], runs: [] },
    achievements: ['first_day'],
    shopItems: []
  });

  h.context.checkGameOver();
  const saved = readSave(h);

  assert.equal(saved.schemaVersion, 2, '结局复盘收藏不应 bump SAVE_SCHEMA_VERSION');
  assert.ok(Array.isArray(saved.gameData.runs), 'gameData.runs 应保存结局复盘列表');
  assert.equal(saved.gameData.runs.length, 1, '每次结局应追加一条 run summary');
  assert.deepEqual(Object.keys(saved.gameData.runs[0]).sort(), ['career', 'day', 'endingType', 'goalCompleted', 'score', 'title'].sort(), 'run summary 应保持短结构');
  assert.equal(saved.gameData.runs[0].endingType, '✨ 完美结局');
  assert.equal(saved.gameData.runs[0].career, 'ai');
  assert.equal(saved.gameData.runs[0].day, 365);
  assert.equal(saved.gameData.runs[0].goalCompleted, true);
  assert.equal(typeof saved.gameData.runs[0].score, 'number');
  assert.equal(typeof saved.gameData.runs[0].title, 'string');
}

function testRunSummariesSurviveRestoreAndRestart() {
  const existingRuns = [{
    endingType: '精神崩溃结局',
    score: 31,
    title: '还在 debug 人生的人',
    goalCompleted: false,
    day: 18,
    career: 'frontend'
  }];
  const h = createHarness();
  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { career: 'backend', day: 4, skill: 70, mental: 72, money: 55, ai: 36, age: 30, items: [] },
    actionCounts: {},
    gameData: { achievements: [], deaths: 1, maxDay: 18, endings: ['精神崩溃结局'], runs: existingRuns },
    achievements: [],
    shopItems: []
  }));

  assert.equal(h.context.loadGameFromStorage(), true);
  h.context.restart();
  h.context.selectCareer('ai');
  const saved = readSave(h);

  assert.deepEqual(saved.gameData.runs, existingRuns, '读档后重开局不应丢失历史 run summaries');
}

function testRestartPreservesCareerMetaHistory() {
  const existingRuns = [{
    endingType: '精神崩溃结局',
    score: 31,
    title: '还在 debug 人生的人',
    goalCompleted: false,
    day: 18,
    career: 'frontend'
  }];
  const h = createHarness();
  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { career: 'backend', day: 4, skill: 70, mental: 72, money: 55, ai: 36, age: 30, items: [] },
    actionCounts: {},
    gameData: {
      achievements: ['first_day', 'survivor'],
      deaths: 2,
      maxDay: 123,
      endings: ['精神崩溃结局', '破产结局'],
      runs: existingRuns
    },
    achievements: ['first_day', 'survivor'],
    shopItems: []
  }));

  assert.equal(h.context.loadGameFromStorage(), true);
  h.context.restart();
  h.context.selectCareer('ai');
  const saved = readSave(h);

  assert.deepEqual(saved.gameData.achievements.sort(), ['first_day', 'survivor'].sort(), '重开局不应清空跨局成就记录');
  assert.deepEqual(saved.gameData.endings.sort(), ['精神崩溃结局', '破产结局'].sort(), '重开局不应清空已见结局记录');
  assert.equal(saved.gameData.deaths, 2, '重开局不应清空历史死亡次数');
  assert.equal(saved.gameData.maxDay, 123, '重开局不应清空历史最大天数');
  assert.deepEqual(saved.gameData.runs, existingRuns, '重开局不应丢失历史 run summaries');
}

function testRestartMetaSaveKeepsAchievementUnlockState() {
  const existingRuns = [{
    endingType: '精神崩溃结局',
    score: 31,
    title: '还在 debug 人生的人',
    goalCompleted: false,
    day: 18,
    career: 'frontend'
  }];
  const h = createHarness();
  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { career: 'backend', day: 4, skill: 70, mental: 72, money: 55, ai: 36, age: 30, items: [] },
    actionCounts: {},
    gameData: {
      achievements: ['first_day', 'survivor'],
      deaths: 1,
      maxDay: 18,
      endings: ['精神崩溃结局'],
      runs: existingRuns
    },
    achievements: ['first_day', 'survivor'],
    shopItems: []
  }));

  assert.equal(h.context.loadGameFromStorage(), true);
  h.context.restart();
  const restartedRaw = h.localStorage.getItem('codersLifeSave.v2');
  assert.ok(restartedRaw, '重开未选职业时应保存跨局元数据');
  const restartedSave = JSON.parse(restartedRaw);

  assert.deepEqual(restartedSave.achievements.sort(), ['first_day', 'survivor'].sort(), 'meta 存档顶层 achievements 不应被 resetMetaState 清空');
  assert.deepEqual(restartedSave.gameData.achievements.sort(), ['first_day', 'survivor'].sort(), 'meta 存档 gameData achievements 应保留历史成就');

  const reloaded = createHarness();
  reloaded.localStorage.setItem('codersLifeSave.v2', restartedRaw);
  assert.equal(reloaded.context.loadGameFromStorage(), false, '仅元数据存档不应进入 active run');
  const reloadedSave = reloaded.context.buildSaveData();

  assert.deepEqual([...reloadedSave.achievements].sort(), ['first_day', 'survivor'].sort(), '刷新后 unlocked 成就状态应能从 meta 存档恢复');
  assert.deepEqual([...reloadedSave.gameData.achievements].sort(), ['first_day', 'survivor'].sort(), '刷新后 gameData 成就历史应保留');
}

function testRunSummariesPersistAfterRestartBeforeCareerSelection() {
  const existingRuns = [{
    endingType: '精神崩溃结局',
    score: 31,
    title: '还在 debug 人生的人',
    goalCompleted: false,
    day: 18,
    career: 'frontend'
  }];
  const h = createHarness();
  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { career: 'backend', day: 4, skill: 70, mental: 72, money: 55, ai: 36, age: 30, items: [] },
    actionCounts: {},
    gameData: { achievements: [], deaths: 1, maxDay: 18, endings: ['精神崩溃结局'], runs: existingRuns },
    achievements: [],
    shopItems: []
  }));

  assert.equal(h.context.loadGameFromStorage(), true);
  h.context.restart();

  const restartedRaw = h.localStorage.getItem('codersLifeSave.v2');
  assert.ok(restartedRaw, '重开后未选职业前也应持久化历史 run summaries');
  const restartedSave = JSON.parse(restartedRaw);
  assert.equal(restartedSave.stats.career, '', '重开后的元数据存档不应伪造 active run');
  assert.deepEqual(restartedSave.gameData.runs, existingRuns, '重开后刷新/关闭不应丢失历史 run summaries');
  assert.equal(h.context.hasSavedGame(), false, '仅元数据存档不应显示继续游戏入口');

  const reloaded = createHarness();
  reloaded.localStorage.setItem('codersLifeSave.v2', restartedRaw);
  assert.equal(reloaded.context.loadGameFromStorage(), false, '仅元数据存档不应进入游戏区域');
  assert.deepEqual(reloaded.context.buildSaveData().gameData.runs, existingRuns, '刷新后应能恢复历史 run summaries 到内存');
}

function testLegacySaveWithoutRunsRestoresWithEmptyRuns() {
  const h = createHarness();
  h.localStorage.setItem('codersLifeSave.v2', JSON.stringify({
    schemaVersion: 2,
    savedAt: new Date().toISOString(),
    stats: { career: 'backend', day: 4, skill: 70, mental: 72, money: 55, ai: 36, age: 30, items: [] },
    actionCounts: {},
    gameData: { achievements: [], deaths: 0, maxDay: 4, endings: [] },
    achievements: [],
    shopItems: []
  }));

  assert.equal(h.context.loadGameFromStorage(), true);
  const saved = h.context.buildSaveData();

  assert.deepEqual(saved.gameData.runs, [], '旧存档缺失 runs 时应兼容为空数组');
}

function testRunSummariesKeepLatestTen() {
  const oldRuns = Array.from({ length: 10 }, (_, index) => ({
    endingType: `旧结局${index}`,
    score: index,
    title: `旧标题${index}`,
    goalCompleted: false,
    day: index + 1,
    career: 'backend'
  }));
  const h = createHarness();
  h.context.applySaveData({
    schemaVersion: 2,
    stats: { skill: 10, mental: 0, money: 20, ai: 30, day: 99, age: 30, career: 'backend', items: [] },
    actionCounts: {},
    gameData: { achievements: [], deaths: 0, maxDay: 98, endings: [], runs: oldRuns },
    achievements: [],
    shopItems: []
  });

  h.context.checkGameOver();
  const saved = h.context.buildSaveData();

  assert.equal(saved.gameData.runs.length, 10, 'run summaries 最多保留最近 10 局');
  assert.equal(saved.gameData.runs[0].endingType, '旧结局1', '超过 10 条时应丢弃最旧记录');
  assert.equal(saved.gameData.runs[9].endingType, '精神崩溃结局', '最新结局应保留在末尾');
}

const tests = [
  testNewCareerDirectlyStartsAndBacksUpExistingSave,
  testFutureSchemaIsPreservedBeforeDirectNewCareer,
  testFutureSchemaIsPreservedInFutureSlotBeforeOverwrite,
  testFutureSchemaIsNotOverwrittenWhenFutureBackupFails,
  testValidSaveCanRestore,
  testValidSaveIsPreservedWhenRestoreRenderingFails,
  testRestoreRenderingFailureDoesNotLeakRestoringFlag,
  testCorruptV2SaveIsBackedUp,
  testCorruptLegacySaveIsBackedUp,
  testMalformedV2SaveIsBackedUp,
  testMalformedHiddenStateFieldsAreBackedUp,
  testFutureSchemaIsPreservedWithoutQuarantine,
  testFutureSchemaResumeShowsVisibleWarning,
  testMalformedLegacyShapeIsBackedUpAndCleared,
  testSaveContainsHiddenStateLogAndAchievements,
  testGameDataStatsAreClampedAndDedupedOnRestore,
  testUnknownCareerNormalizesToFullstackOnRestore,
  testLegacyMonthlyAgeIsClampedOnRestore,
  testLegacyStatsItemsRestoreShopOwnership,
  testGameOverRestoreKeepsEndingUi,
  testGameOverStateForcesEndedRunOnRestore,
  testPerfectEndingDoesNotIncrementDeaths,
  testEndingPersistsCompactRunSummary,
  testRunSummariesSurviveRestoreAndRestart,
  testRestartPreservesCareerMetaHistory,
  testRestartMetaSaveKeepsAchievementUnlockState,
  testRunSummariesPersistAfterRestartBeforeCareerSelection,
  testLegacySaveWithoutRunsRestoresWithEmptyRuns,
  testRunSummariesKeepLatestTen
];

for (const test of tests) {
  test();
  console.log(`PASS ${test.name}`);
}
