# 程序员人生模拟器 V6

这是一个 **Vite + React + TypeScript** 的模块化工程骨架，不再是单 HTML 原型。

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开终端输出的地址，通常是：

```text
http://localhost:5173
```

## 常用命令

```bash
npm run dev       # 本地开发
npm run build     # 类型检查 + 打包
npm run test      # 单元测试
npm run simulate  # 自动模拟一局，用于调参
```

## 架构分层

```text
src/config/      规则配置：职业、行动、事件、商店、成就、结局
src/core/        纯游戏引擎：状态创建、月度循环、公式、随机数
src/systems/     业务系统：经济、事件、健康、职业、成就、结局
src/components/  React UI 组件
src/storage/     存档与迁移
src/styles/      全局样式
src/tests/       单元测试
scripts/         调参/模拟脚本
docs/            GDD 与开发设计文档
```

## 当前版本范围

这是 V6 MVP 工程骨架，已包含：

- 可运行 React 页面结构
- 游戏状态模型
- 月度循环
- 行动系统
- 经济系统
- 事件系统
- 精神/健康/燃尽系统
- 成就系统
- 多结局检查
- 本地存档
- 调试面板
- 自动模拟脚本

下一步建议：先跑通 22-45 岁完整流程，再扩充事件链、家庭系统、关系系统和职业分支。
