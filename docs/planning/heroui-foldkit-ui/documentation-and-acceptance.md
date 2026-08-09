# 组件文档库与阶段验收规范

> 状态：信息架构与验收规划，实施未授权。本文档不要求安装 Storybook，也不授权新增文档工具。

## 1. 目标

完整组件库必须在项目内提供类似 Storybook 的文档与展示入口。每个组件都可查看用途、API、视觉变体、状态、内容自定义边界、键盘操作和无障碍语义，并可运行验收 Scene。

现有 [apps/web/src/ui-showcase](../../../apps/web/src/ui-showcase) 已展示 Button、Dialog、Combobox、Input 和 InputGroup，并已有针对 InputGroup 的组件级与 e2e 验收。规划建议以它作为迁移起点，演进为正式组件文档 surface，不引入 React 或 Storybook 运行时。

## 2. 信息架构

建议路由如下。具体 router 接线留到实施阶段评审。

```text
/components
├── /parts
│   └── /:slug
└── /standalone
    └── /:slug
/foundations
├── /visual-protocol
├── /tokens
├── /themes
└── /states-and-motion
/guides
├── /behavior-authority
├── /accessibility
├── /customization
└── /forms-and-validation
/roadmap
└── /phases
```

### 2.1 `/components`

- 提供全部 82 个组件的搜索、筛选和阶段状态。
- 可按 Catalog、Phase、Class、Status 和功能族筛选。
- 每个组件只有一个主目录入口，避免 Parts 与 Standalone 重复登记。

### 2.2 `/components/parts`

- 只列[组件矩阵](./component-catalog.md)中标为 Parts 的 23 个组件。
- 说明它依附或追随的 Standalone/Behavior Authority。
- 不把独立 demo 当作复制父状态机的理由。

### 2.3 `/components/standalone`

- 只列组件矩阵中标为 Standalone 的 59 个组件。
- 同页记录公开 subparts、slots、renderers 和 attribute bundles。
- 复杂 Standalone 仍以一个完整行为边界交付。

### 2.4 Foundations、Guides 与 Roadmap

- Foundations 固化 HeroUI visual protocol、token、主题、状态属性和动效规则。
- Guides 解释 Behavior Authority、无障碍、内容自定义和表单接线。
- Roadmap 展示恰好七个阶段、依赖和验收状态，不新增第八个“收口”阶段。

## 3. 页面元数据

每个组件页必须有机器可读取或可统一汇总的元数据。载体可以在实施阶段选择，但字段语义固定如下：

```yaml
name: ComboBox
title: 组合框
slug: combobox
catalog: standalone
phase: 4
behaviorClass: A
behaviorAuthority: "@foldkit/ui/Combobox"
status: planned
family: collection-selection
dependencies:
  - Input
  - Popover
publicParts: []
slots:
  - trigger
  - item
  - panel
states:
  - default
  - open
  - focused
  - disabled
  - invalid
heroUi:
  version: "3.2.4"
  module: combobox
foldkit:
  primitive: Combobox
examples:
  - default
  - controlled
  - custom-trigger
  - custom-item
  - custom-panel
```

### 3.1 必填字段

| 字段                      | 约束                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `name` / `title` / `slug` | 唯一组件身份与中文展示名                                                                         |
| `catalog`                 | 只能是 `parts` 或 `standalone`                                                                   |
| `phase`                   | 只能是 1 到 7，与组件矩阵一致                                                                    |
| `behaviorClass`           | 只能是 A、B 或 C                                                                                 |
| `behaviorAuthority`       | 指明复用的 Foldkit 原语、原生平台语义或待新增 Foldkit-native 边界                                |
| `status`                  | `planned`、`contract-reviewed`、`implemented`、`verified` 之一                                   |
| `family`                  | form-control、overlay、navigation、collection-selection、disclosure、feedback、data 等稳定功能族 |
| `dependencies`            | 只列真实运行或视觉协议依赖，不用阶段顺序代替依赖图                                               |
| `heroUi` / `foldkit`      | 可追溯到视觉来源与行为来源                                                                       |
| `states` / `examples`     | 驱动页面目录和验收矩阵                                                                           |

`publicParts` 与 `slots` 在适用时必填。A/B/C 不是实现状态，`verified` 也不能反推行为分类。

## 4. 每个组件页的固定章节

1. **概览**：用途、何时使用、何时不用。
2. **分类与阶段**：Parts/Standalone、A/B/C、依赖与交付阶段。
3. **Anatomy**：默认 DOM/视觉结构、Control Surface 和 Description Channel 等关键边界。
4. **Behavior Authority**：状态由谁拥有、输入 Message、输出 `OutMessage`、父层接线方式。
5. **HeroUI 视觉映射**：variant、size、color、radius、状态属性和动效。
6. **API 与内容自定义**：props/config、slots/renderers、attribute bundle 合并规则。
7. **示例与 Scene**：默认、变体、受控状态、边界状态和自定义内容。
8. **键盘与焦点**：进入、移动、激活、退出、dismiss、恢复。
9. **ARIA 与语义**：role、accessible name、description、state 和 relationships。
10. **与 HeroUI 的已知差异**：若是 B，明确最终采用的 Foldkit 语义；若是 C，链接已评审行为设计。
11. **验收状态**：视觉、主题、交互、无障碍和回归证据。

## 5. 示例与 Scene 最小矩阵

每个组件按适用性提供以下示例，不适用项必须注明原因，不能静默缺失：

- default、variant、color、size、radius、full width；
- hover、pressed、focused、focus-visible、disabled、readonly、invalid、loading；
- empty、single item、many items、overflow、long text、RTL；
- controlled value/open/selection；
- custom trigger、item、panel、prefix/suffix 或其他公开 slot；
- light、dark 与高对比边界；
- reduced motion；
- form validation 与 description/error 切换；
- keyboard-only 与 screen-reader-oriented Scene。

文档示例既是说明材料，也是可复用验收夹具。不得维护一套只供文档展示、行为不同于生产组件的平行实现。

## 6. 每阶段固定 Definition of Done

以下条件适用于七个阶段中的每一个阶段。任何一项未完成，该阶段都不能标记完成，也不能以单独的最终“收口阶段”补做。

### 6.1 目录与文档

- 本阶段所有组件已进入 `/components/parts` 或 `/components/standalone` 的唯一主入口。
- 页面元数据与[组件矩阵](./component-catalog.md)一致。
- 默认、变体、状态、受控使用和适用的内容自定义示例齐备。
- anatomy、依赖、Behavior Authority 和已知差异有源码依据。

### 6.2 行为门禁

- A：证明 Foldkit/native 行为、Message、键盘、焦点和 ARIA 未被视觉层改变。
- B：记录 HeroUI 与 Foldkit 契约差异、适配方式和最终采用的 Foldkit 语义。
- C：在实现前完成 Foldkit-native `Model`、`Message`、`update`、`view`、`OutMessage` 与父层接线评审。
- 复合组件没有重新实现可复用的 Foldkit 行为。
- 没有 React Context、hooks 或隐藏局部状态成为第二行为权威。

### 6.3 键盘、焦点与无障碍

- 记录并验收鼠标、触摸和键盘的主要操作路径。
- 验收 Tab 进入/离开、方向键移动、激活、取消、dismiss 和焦点恢复。
- 验收 role、accessible name、description、state、set relationships 和 live region。
- disabled、readonly、invalid、required 和 loading 的语义与视觉一致。
- 自定义 slot/renderer 不会丢失必须的 attribute bundle。

### 6.4 视觉与主题

- light/dark 下的默认、交互、disabled、invalid、loading、selected/open 状态通过视觉验收。
- token、尺寸、间距、圆角、边框、阴影、层级和 typography 符合阶段 1 visual protocol。
- 动效与 HeroUI 表现一致，并尊重 reduced motion。
- overflow、长文本、窄视口、缩放与 RTL 按组件适用性验收。

### 6.5 Scene 与回归证据

- 每个公共 variant 和关键状态都有稳定 Scene。
- 行为断言覆盖 Message/OutMessage、键盘和焦点边界。
- ARIA 与语义断言覆盖组件的主要任务路径。
- 视觉基准覆盖主题和关键状态，不只覆盖默认截图。
- 本阶段验收全部通过后，下一阶段才能开始。

## 7. 七阶段的专项验收重点

| 阶段 | 在固定 DoD 之外重点证明                                                                                                       |
| ---- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1    | visual protocol、token、主题、state attribute 和 leaf anatomy 可稳定复用；Avatar fallback 与 ScrollShadow observer 无第二权威 |
| 2    | Field Anatomy、Description Channel、form validation、disabled/readonly/invalid 传播；Input/InputGroup 样板成立                |
| 3    | overlay layer、dismiss、focus scope/restore、modal background、toast region 与 disclosure 协调                                |
| 4    | collection identity、selection、typeahead、roving/active focus、有界 item renderer；Select 明确映射 Listbox                   |
| 5    | 格式化、步进、清除、分段焦点、粘贴和数值边界                                                                                  |
| 6    | locale 日期/时间分段、范围选择、颜色通道与二维键盘/指针模型                                                                   |
| 7    | Table 的 selection、sort、行列导航、virtual/overflow 边界和 ARIA table/grid 契约                                              |

## 8. 现有 showcase 的迁移边界

当前 `apps/web/src/ui-showcase` 是可复用起点，但不是最终信息架构。实施时建议：

1. 保留现有 Scene 和测试价值，不复制组件 demo。
2. 将组件元数据驱动的目录、页面和筛选建立在项目应用中。
3. 旧 showcase 路径是保留、重定向还是替换，由实施前的路由设计决定。
4. 不因“类似 Storybook”而引入 Storybook API、React renderer 或新的行为运行时。

## 9. 规划期仍需复核的决策

1. 最终组件文档 URL 是否采用本文建议的 `/components/*`，以及现有 showcase URL 是保留还是重定向。
2. InputGroup 是否长期保持当前“恰好一个 Input”的专用 contract；本规划默认不将其泛化为任意 Control Slot。
3. `CalendarYearPicker` 继续随 HeroUI 公开导出纳入强制视觉对齐，还是在实施时标记为 preview 但仍保留目录页。

以上决策不阻碍当前七阶段和行为矩阵成为规划基线，但会影响文档路由或局部公共 API，进入实现前应由用户确认。
