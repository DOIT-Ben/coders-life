---
name: frontend-review
description: 本仓库前端改动的审查清单与可复用检查脚本。任何 UI/样式/交互改动合入前，或用户反馈"看不清/功能假/移动端有问题"时执行；来自 2026-07 存档断链、对比度、撤销体验三次真实修复的复盘。
---

# 前端审查清单（实战沉淀）

按顺序过，每条都有真实事故背书。

## 1. 功能真实性：引擎能力 ≠ 用户功能

对每个交互控件三问：

1. 用户**能到达**它吗（前置条件是否可发现，如"后悔药要先在商店购买"）？
2. 不可用时用户**知道为什么**吗（禁止静默 disabled，点按给中文原因）？
3. 操作成功后有**可感知反馈**吗（toast/动效/日志，缺一即"假功能"）？

事故：撤销引擎完全正确（单测全绿），但按钮常年灰、无解释、无反馈，用户判定"虚假功能"。

## 2. 接线测试优先于单元测试

两端各自的单测都绿 ≠ 链路通。存档事故：UI 写 `'ms_game'`、存储层写 `'programmer_survival_v6_save'`，190 行迁移逻辑成死代码，166 个测试照样全绿。**每条用户链路要有一个端到端接线测试**（参考 `src/tests/saveWiring.test.tsx`）。

## 3. 对比度：算，不要看

- 深色主题小字最容易翻车（事故：--text3 3.65:1，用户直接投诉看不清）。
- WCAG 阈值：正文 ≥4.5:1，大字 ≥3:1；disabled 豁免但别低于 3。
- 本仓库有守卫测试 `src/tests/themeContrast.test.ts`：13 组关键令牌自动校验，改配色它会替你把关。新增语义色对要同步补进去。

## 4. 响应式：真浏览器多档实测

至少跑 390 / 768 / 1280 三档（用 DevTools 视口仿真），每档执行：

```js
// 溢出 + 越界元素 + 触控目标一次扫完
(() => {
  const doc = document.documentElement;
  const offenders = [...document.querySelectorAll('*')]
    .filter(el => el.getBoundingClientRect().right > doc.clientWidth + 1)
    .map(el => el.tagName + '.' + [...el.classList].join('.'));
  const small = [...document.querySelectorAll('button, a, input, select')]
    .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44; })
    .map(el => [...el.classList].join('.') + ' ' + Math.round(el.getBoundingClientRect().height) + 'px');
  return { overflow: doc.scrollWidth > doc.clientWidth, offenders, targetsUnder44: small };
})()
```

另查：弹窗完整落在视口内（高度用 dvh）；fixed 悬浮元素滚动时是否遮内容；绝对定位标签窄屏是否折行。

## 5. 构建产物审查

`npm run build` 后核对 chunk 构成：数据（JSON）不得混进首屏 index chunk。本仓库红线：任何在首屏静态 import `saveManager` 或 `config/events` 的改动都会把弹窗池数据拖进首屏——必须动态 import。

## 6. 契约测试维护

`src/tests/v1FrontendContract.test.ts` 以 `?raw` grep 组件源码与 app.css 字符串。移动代码、改类名、换肤时：先跑它，失败的断言逐条迁移到新源文件，同一提交内完成，不许删断言了事。

## 7. 用户可见层审计（合入前最后一遍）

- 无英文异常/堆栈/状态码/内部标签（DEV 徽标类必须 `import.meta.env.DEV` 包裹）。
- 所有提示为中文产品化表达，且给出下一步动作。
- `npm run lint` 0 error；全量测试绿；同 seed `npm run simulate` 与基线一致（防误伤引擎）。

## 8. 测试环境陷阱速查

- jsdom 无 `window.matchMedia` / 部分布局 API → 浏览器 API 一律存在性判断。
- 组件崩溃会被 ErrorBoundary 兜住，测试表现为"文案找不到"而非报错——先怀疑运行时异常，看 console。
- 商店类有购买限制（如后悔药每阶段 1 瓶），复测要用全新存档，否则误判"功能坏了"。
