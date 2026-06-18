import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const htmlPath = path.join(rootDir, '程序员生存模拟器_增强版.html');

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

function testNewCareerDoesNotOverwriteWhenUserCancels() {
  const h = createHarness();
  h.context.selectCareer('frontend');
  const before = h.localStorage.getItem('codersLifeSave.v2');
  h.context.restart();
  h.localStorage.setItem('codersLifeSave.v2', before);
  h.context.window.confirm = () => false;
  h.context.selectCareer('backend');
  assert.equal(h.localStorage.getItem('codersLifeSave.v2'), before, '取消新开局时不应覆盖已有存档');
}

function testFutureSchemaRequiresConfirmationBeforeNewCareer() {
  const h = createHarness();
  const futureSave = JSON.stringify({
    schemaVersion: 999,
    stats: { career: 'backend', day: 99 }
  });
  h.localStorage.setItem('codersLifeSave.v2', futureSave);
  h.context.window.confirm = () => false;

  h.context.selectCareer('frontend');

  assert.equal(h.localStorage.getItem('codersLifeSave.v2'), futureSave, '取消新开局时不应覆盖未来版本存档');
  assert.equal(h.localStorage.keys().some(key => key.startsWith('codersLifeSave.v2.corrupt.')), false, '未来版本存档不应被当坏档隔离');
  assert.equal(h.context.hasSavedGame(), true, '未来版本存档应被视为受保护存档');
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
  assert.equal(h.elements.get('career-selection').style.display, 'block', '未来版本备份失败时应退回职业选择');
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
    stats: { skill: 75, mental: 80, money: 120, ai: 80, day: 365, age: 42, career: 'ai', items: [] },
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

const tests = [
  testNewCareerDoesNotOverwriteWhenUserCancels,
  testFutureSchemaRequiresConfirmationBeforeNewCareer,
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
  testLegacyStatsItemsRestoreShopOwnership,
  testGameOverRestoreKeepsEndingUi,
  testGameOverStateForcesEndedRunOnRestore,
  testPerfectEndingDoesNotIncrementDeaths
];

for (const test of tests) {
  test();
  console.log(`PASS ${test.name}`);
}
