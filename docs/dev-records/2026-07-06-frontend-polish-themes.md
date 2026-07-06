# 2026-07-06 Frontend Polish Themes

## 范围

- 保留 V1 终端风格，新增三套主题：终端黑、极简白、纯黑。
- 修复商店、反馈、人生脚本、结局复盘等弹窗的固定头尾与内容滚动边界。
- 修复右侧行动分类、行动列表和辅助信息区域的滚动分配，避免长分类或长列表挤出视口。
- 将加载页、错误页、收藏行动行的静态可见样式从 JSX 内联样式收敛到 CSS 类和主题令牌。

## 关键文件

- `src/App.tsx`
- `src/components/dialogs/ModalShell.tsx`
- `src/components/GameDialogs.tsx`
- `src/components/ErrorBoundary.tsx`
- `src/styles/app.css`
- `src/tests/themeContrast.test.ts`
- `src/tests/monthlyPlanUi.test.tsx`
- `src/tests/v1FrontendContract.test.ts`

## 验证结果

- `npm test`
  - 结果：通过
  - 摘要：22 个测试文件通过，222 个测试用例通过。
- `npm run build`
  - 结果：通过
  - 摘要：`tsc -b && vite build` 成功，生产资源输出到 `dist/`。
- `npm run simulate`
  - 结果：通过
  - 摘要：单局模拟正常结束，结局为 `realworld_cashflow_trap`。
- `npm run simulate:batch`
  - 结果：通过
  - 摘要：72 个场景，releaseGate `passed: true`，确定性回放率 `1`，覆盖成功/平衡/失败结局族。
- `git diff --check`
  - 结果：通过，无空白错误。

## 风险与回滚

- 本轮不修改核心公式、结局规则、存档结构或模拟策略，主要风险集中在视觉布局。
- 回滚可按提交粒度处理：主题切换、主题令牌、弹窗滚动、行动区滚动、样式收敛均为独立提交。
