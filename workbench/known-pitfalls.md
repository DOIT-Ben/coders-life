# known-pitfalls

- **首屏 chunk 污染**：`saveManager → config/events → 弹窗池 JSON`。首屏（App/index chunk）里任何对 `saveManager` 或 `config/events` 的**静态** import 都会把大数据拖进首屏，必须用动态 import。改动后用 `npm run build` 核对 index chunk。
- **事件池异步就绪**：`EVENTS` 的弹窗部分由 `ensureGameDataLoaded()` 注册。新增引擎入口（脚本、worker、测试）必须先 await 它，否则事件池为空导致结果漂移。
- **契约测试 grep 源码**：`v1FrontendContract.test.ts` 用 `?raw` 断言组件源码字符串；移动/改名 UI 代码时同步改契约测试。
- **调参基线**：改动引擎/事件相关代码后，用同 seed 跑 `npm run simulate` 与改前对比终局字段，再跑 `simulate:batch` 看 releaseGate 与确定性回放。
- **Windows 路径**：git bash 重定向的 `/tmp` 与 node `readFileSync('/tmp/...')` 解析不一致；临时文件放项目内 `.codex-run\`。
- **大文件阈值**：批次 1 已把组件文件压到 500 行以下；当前仍超 500 行的是 `types/game.ts`。后续如果改玩法结构或类型边界，先拆类型再继续堆字段。
- **视口验证必须 rebuild**：`vite preview` 服务的是 `dist`，源码 CSS 修改后必须先 `npm run build`，否则 Playwright/浏览器检查会读到旧资产并误报。
- **复盘关系债字段**：关系债真实存储在 `socialProfile.relationshipDebt`，`lifePressure` 没有该字段；展示层若要看综合压力，可用 `derivePressureSnapshot(state).relationshipDebt`。
- **Canvas 测试分层**：jsdom 没有完整 Canvas 绘图实现。Canvas 纯函数用 fake context 测文本与尺寸，真实生成图片、下载入口和移动端布局必须用 `vite preview` + Playwright 验证。
- **每日挑战首屏边界**：App 可以静态 import 轻量的日期/历史函数，但不能通过每日挑战把 `createInitialState`、引擎、`saveManager` 或 `config/events` 拉进首屏；创建挑战状态应放在游戏 chunk 或测试专用路径。
- **GameContainer 行数临界**：批次 3 后 `GameContainer.tsx` 为 499 行，后续任何新增逻辑都应先抽到系统或子组件，否则会触发 500 行契约测试。
- **人生脚本不是 JS 沙箱**：DSL 必须继续走 `lifeScriptDsl` 白名单 AST，禁止 `eval`、`Function`、对象路径、导入模块；脚本执行只能通过 `canExecuteAction`、`buildMonthlyPlan` 和 `planMonth`。
- **脚本预设必须有职业入口**：待业脚本必须覆盖“作品集 -> 求职投递 -> 参加面试 -> 接受 offer”，否则默认矩阵会真实掉进现金流陷阱。
- **脚本矩阵耗时**：默认 `simulate:batch` 已包含 auto + lifeScript 72 条轨迹，耗时明显长于批次 3。CI 若超时应优化执行效率，不能删脚本矩阵或放宽 releaseGate。
