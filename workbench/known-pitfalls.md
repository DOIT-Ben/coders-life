# known-pitfalls

- **首屏 chunk 污染**：`saveManager → config/events → 弹窗池 JSON`。首屏（App/index chunk）里任何对 `saveManager` 或 `config/events` 的**静态** import 都会把大数据拖进首屏，必须用动态 import。改动后用 `npm run build` 核对 index chunk。
- **事件池异步就绪**：`EVENTS` 的弹窗部分由 `ensureGameDataLoaded()` 注册。新增引擎入口（脚本、worker、测试）必须先 await 它，否则事件池为空导致结果漂移。
- **契约测试 grep 源码**：`v1FrontendContract.test.ts` 用 `?raw` 断言组件源码字符串；移动/改名 UI 代码时同步改契约测试。
- **调参基线**：改动引擎/事件相关代码后，用同 seed 跑 `npm run simulate` 与改前对比终局字段，再跑 `simulate:batch` 看 releaseGate 与确定性回放。
- **Windows 路径**：git bash 重定向的 `/tmp` 与 node `readFileSync('/tmp/...')` 解析不一致；临时文件放项目内 `.codex-run\`。
- **大文件阈值**：批次 1 已把组件文件压到 500 行以下；当前仍超 500 行的是 `types/game.ts`。后续如果改玩法结构或类型边界，先拆类型再继续堆字段。
- **视口验证必须 rebuild**：`vite preview` 服务的是 `dist`，源码 CSS 修改后必须先 `npm run build`，否则 Playwright/浏览器检查会读到旧资产并误报。
