# 前端优化规划：交互结构、弹窗可访问性与首进体积

## 1. 第一性原理：当前阶段核心需求

当前目标不是重做视觉系统，而是清掉上一轮审查中最影响前端可靠性的点：

- 行动卡片不能再出现嵌套交互控件，用户点击行动和收藏行动必须是两个清晰、独立、可键盘操作的目标。
- 弹窗必须具备基本可访问性语义：明确标题、可读关闭按钮、打开后可聚焦、Escape 可关闭。
- 用户可见成品不能默认展示内部调试/制作标签，例如 `BUGS WELCOME`。
- 首次进入游戏的加载体积要继续下降，至少把低频弹窗拆出主游戏 chunk，降低进入主循环时的同步解析成本。

可验证成功标准：

- 契约测试能阻止 `action-btn` 内再次出现 `act-bookmark` 嵌套结构。
- 契约测试能阻止生产态继续渲染 `BUGS WELCOME`。
- 契约测试能覆盖 modal 的 `role="dialog"`、`aria-modal`、标题关联和关闭按钮名称。
- `npm run test -- --maxWorkers=2`、`npm run build` 通过。
- 构建后主游戏 chunk 不再包含反馈、成就、商店、收藏、结局等低频弹窗完整实现。

## 2. 行业验证与可复用方法

本轮采用成熟 Web 平台规则和现有项目模式，不引入新 UI 框架：

- HTML/ARIA 交互规则：MDN 对 `role="button"` 的说明强调，优先使用原生 `button`，`role="button"` 不会自动提供按钮键盘行为；这支持将收藏星标从 span role button 改为原生 button。
- WAI-ARIA APG Modal Dialog Pattern 要求 modal 的 Tab/Shift+Tab 焦点留在 dialog 内，Escape 可关闭，并且焦点应进入 dialog。本轮先实现最小语义与 Escape 关闭，焦点 trap 可作为下一步增强。
- Vite 官方构建配置说明 `build.chunkSizeWarningLimit` 默认 500 kB，且比较的是未压缩 JS，因为 JS 大小影响执行时间。本轮不调高阈值掩盖问题，而是拆分低频弹窗。

参考来源：

- MDN ARIA button role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/button_role
- WAI-ARIA APG Dialog Modal Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- Vite build.chunkSizeWarningLimit: https://vite.dev/config/build-options

## 3. 复用、适配和必要自研组合

复用：

- 复用现有 React 状态、`modal` 枚举、CSS token、按钮样式和 Vitest 契约测试体系。
- 复用现有 lazy import 思路，继续用 React `lazy` / `Suspense` 做 chunk 边界。

适配：

- 将行动卡片从单个大 `button` 适配为 `article + button.action-btn-main + button.act-bookmark` 的组合。视觉仍保持原卡片样式，但 DOM 结构变成合法交互结构。
- 将重复 modal 外壳适配成 `ModalShell`，统一 `role="dialog"`、`aria-modal`、标题 id、关闭按钮、Escape 关闭和基础聚焦。
- 将 `BUGS WELCOME` 改为开发态标签，只在 `import.meta.env.DEV` 下显示。

必要自研：

- `ModalShell` 是项目内小组件，不引入第三方 focus trap 依赖，先覆盖项目当前弹窗的最小语义与关闭路径。
- 低频弹窗拆分为本地 lazy 子模块，避免把所有弹窗实现强绑到主游戏渲染代码里。

## 4. 落地方案、风险与验证标准

落地顺序：

1. 补契约测试并确认失败：覆盖行动卡片结构、收藏按钮原生化、生产标签隐藏、modal 语义、低频弹窗 lazy import。
2. 修改 `GameContainer.tsx`：拆出 `ActionCard` 局部组件，主行动按钮和收藏按钮并列；补准确 `aria-label`。
3. 新增 `ModalShell`，并让成就、商店、收藏、反馈、结局和事件选择弹窗复用。
4. 拆分低频弹窗到 `GameDialogs.tsx` 或等价模块，用 lazy import 从主游戏界面加载。
5. 修改 `App.tsx` 生产态标签逻辑。
6. 更新 CSS 以保持原视觉布局，并补移动触摸目标。
7. 运行目标测试、全量测试、构建和浏览器 smoke。

风险：

- 拆分弹窗可能影响 modal 状态和结局自动弹窗，需要用测试与浏览器 smoke 验证。
- 行动卡片 DOM 变更可能影响点击计划行动与收藏操作，需要检查事件冒泡和键盘路径。
- 过度拆分会增加异步加载状态，本轮只拆低频弹窗，不拆游戏核心循环。

验证标准：

- 测试：`npx vitest run src/tests/v1FrontendContract.test.ts --maxWorkers=2` 先红后绿；最终 `npm run test -- --maxWorkers=2` 通过。
- 构建：`npm run build` 通过；记录 chunk 输出并确认低频弹窗不再进入主游戏 chunk。
- 浏览器：本地 `http://127.0.0.1:5173/` 能开始新局、选择行动、收藏行动、打开/关闭成就或商店弹窗，页面无横向溢出。
