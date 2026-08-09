# HeroUI 视觉组件库的 Foldkit-native 交付路线

> 状态：规划基线，待用户复核。本文档不授权进入实现、TDD、生产代码修改或创建实现 Issue。
>
> 视觉基线：vendored HeroUI React v3，当前版本 `@heroui/react@3.2.4`。

## 1. 文档目的

本目录固化在本项目中用 Foldkit UI 复刻 HeroUI React v3 视觉组件库的交付边界。后续实现以这里记录的组件归类、行为权威、阶段依赖和验收条件为准。

- [组件目录与行为矩阵](./component-catalog.md)：82 个 HeroUI 公共组件的 Parts/Standalone、阶段和 A/B/C 标记。
- [组件文档库与验收规范](./documentation-and-acceptance.md)：类似 Storybook 的项目内展示入口、页面元数据和每阶段固定 Definition of Done。
- [领域术语](../../../CONTEXT.md)：Behavior Authority、Visual Authority、View Projection、Field Anatomy、Control Surface 等既有定义。
- [前期架构调查](../../research/foldkit-native-ui-api.md)：Foldkit-native API、状态归属和视图定制边界。
- [HeroUI 图标调查](../../research/heroui-component-icons.md)：HeroUI 默认图标及覆盖边界。

## 2. 范围与非目标

### 2.1 范围

1. 对齐 HeroUI 的样式、外观、布局、状态表现和动效形态。
2. 默认保留并复用 Foldkit 的交互行为、`Model`、`Message`、`update`、键盘、焦点和无障碍语义。
3. HeroUI 有而 Foldkit 缺少必要行为原语时，允许新增符合 Foldkit 架构的 Behavior Authority。
4. 每个组件交付都包含项目内组件文档页、示例、状态矩阵和验收 Scene。
5. 组件范围以 `repos/heroui/packages/react/src/components/index.ts` 的 82 个组件模块为准；不把 React 专属 `rac` 导出和 `icons` 聚合包视作组件。

### 2.2 非目标

1. 不移植 HeroUI 的 React Context、hooks 或 React Aria Components 运行时架构。
2. 不为了视觉一致而重建已有 Foldkit 行为。
3. 不默认把组件拆成无边界的组合器。
4. 不要求引入 Storybook；文档库使用项目现有应用与 Scene/测试机制演进。
5. 本轮不改生产代码、不写测试、不创建实现 Issue。

## 3. 行为权威原则

### 3.1 总原则

HeroUI 是 Visual Authority，Foldkit 是 Behavior Authority。视觉投射可以调整默认 DOM anatomy、class、token、slot 和状态外观，但不得暗中改写选择、筛选、校验、焦点、键盘、ARIA 或 Message 流。

优先顺序如下：

1. 直接复用 Foldkit 已有行为并投射 HeroUI 视觉。
2. 若两侧都有同类能力但契约不同，选择正确的 Foldkit 行为原语并做显式适配。
3. 只有 Foldkit 确实缺少必要行为边界时，新增 Foldkit-native Behavior Authority。

### 3.2 新增行为的架构约束

- 有独立交互状态的组件使用 `Model -> Message -> update -> view`，需要父子隔离时使用 `Submodel`，对外只发语义化 `OutMessage`。
- 没有独立状态的视觉或语义帮助器保持为 view function，不为形式一致而制造空 `Submodel`。
- DOM 生命周期能力通过 Foldkit `Mount`、command 或订阅机制表达，不引入隐藏的本地状态。
- 自定义内容使用有界的 slot/render contract。自定义 Trigger、Item 或面板内容不能绕过组件的选择、筛选、键盘导航和 ARIA 权威。

## 4. Parts 与 Standalone 正式分类

这是一条组件目录轴，与 A/B/C 行为轴正交。

### 4.1 散装组件（Parts）

Parts 是公开的装配级视觉或语义部件。它本身不形成完整用户任务边界，不单独拥有跨部件协调状态，通常由 Standalone 组件或业务视图组合使用。

- 可以有自身语义或局部 DOM 属性。
- 可以追随所属 Standalone 的 Behavior Authority。
- 不得为了独立展示而复制父组件的状态机。
- 文档入口：`/components/parts`。

### 4.2 单体组件（Standalone）

Standalone 是可直接使用的完整展示、输入、选择、导航或反馈任务单元。它可以公开有界 slots/renderers，但始终保留完整的行为和无障碍边界。

- 允许内容自定义，不等于无边界组合器。
- 公开子部件在同一 Standalone 页面中说明，不重复声明行为权威。
- 文档入口：`/components/standalone`。

### 4.3 判断规则

若组件脱离父容器仍能完成一个完整用户任务，则优先归为 Standalone。若它只表达 anatomy 的一个位置、装饰或集合子项，则归为 Parts。结构复杂本身不是 Parts 的判据，拥有 slots 也不会使 Standalone 自动退化为 Parts。

## 5. A/B/C 行为标记

| 标记 | 定义 | 实施边界 |
| --- | --- | --- |
| A：视觉映射 | 现有 Foldkit 或原生平台行为已经满足目标，只需 HeroUI 视觉投射 | 不新增或修改行为状态机；证明行为、Message、键盘和 ARIA 未被视觉层改变 |
| B：契约适配 | 复用现有 Foldkit Behavior Authority，但需选择正确原语并适配 API、anatomy、slot 或语义契约 | Foldkit 仍是行为真相源；必须记录两侧差异、适配规则和最终 Foldkit 语义 |
| C：新增行为 | Foldkit 目前没有足够的行为原语，必须新增 Foldkit-native Behavior Authority | 实现前先评审 `Model`、`Message`、`update`、`view`、键盘、焦点、ARIA 和 `OutMessage` 设计 |

标记描述工作性质，不代表优先级、复杂度或组件目录。一个 Parts 可以是 C，一个 Standalone 也可以是 A。

## 6. 七阶段主路线

主路线固定为恰好七个依赖递进阶段。不存在单独的“全库收口”阶段；文档、Scene、键盘/ARIA、视觉和主题验收是每一阶段的固定完成条件。

| 阶段 | 组件范围 | 放在此阶段的原因 | 主要行为缺口 |
| --- | --- | --- | --- |
| 1 | 视觉协议与视觉叶子组件，共 21 个 | 先验证 token、主题、状态属性、anatomy 和最小视图投射方式，为后续所有组件提供视觉基线 | 以 A 为主；Avatar、ScrollShadow 为 B |
| 2 | 基础操作与表单，共 16 个 | 建立按钮、字段、校验、分组和表单接线，供 overlay、collection 和复合组件复用 | A/B 混合；CheckboxGroup 为 C |
| 3 | Disclosure、Overlay 与反馈，共 9 个 | 先稳定触发器、浮层、焦点进出、关闭和反馈生命周期 | A/B 混合；DisclosureGroup、Accordion、AlertDialog 为 C |
| 4 | Collection、Selection 与 Navigation，共 18 个 | 为菜单、选择器、标签、切换组及后续 Table 建立统一集合与选择契约 | A/B/C 并存；ListBox、组合选择和组导航是重点 |
| 5 | 数值、搜索与短结构输入，共 4 个 | 在较小范围验证新的输入状态机、格式化、清除和分段交互 | NumberField、SearchField、InputOTP 为 C；Slider 为 B |
| 6 | 日期、时间与颜色，共 13 个 | 在基础表单、overlay、collection 和短结构输入稳定后处理专业领域状态机 | Calendar/ColorSwatch 为 A，部分复合为 B，多数分段/范围/颜色交互为 C |
| 7 | 复杂数据，共 1 个 | Table 依赖前述 collection、selection、navigation、overlay 和 form 能力，最后独立收敛 | Table 为 C，不得当成纯样式工作 |

### 6.1 阶段 1：视觉协议与视觉叶子组件

组件：Typography、Surface、Separator、Label、Description、Header、ErrorMessage、FieldError、Kbd、Badge、Chip、Card、Skeleton、EmptyState、Alert、Spinner、ProgressBar、ProgressCircle、Meter、Avatar、ScrollShadow。

本阶段先验收 HeroUI token 映射、light/dark、尺寸、圆角、边框、阴影、状态属性、动效和 DOM anatomy。未通过本阶段视觉协议验收，不进入阶段 2。

### 6.2 阶段 2：基础操作与表单

组件：Button、CloseButton、ButtonGroup、Link、Input、InputGroup、Textarea、TextField、Fieldset、Form、Checkbox、CheckboxGroup、Radio、RadioGroup、Switch、SwitchGroup。

本阶段形成可复用的 action、Field Anatomy、校验描述通道、disabled/readonly/invalid 传播以及表单提交契约。

### 6.3 阶段 3：Disclosure、Overlay 与反馈

组件：Disclosure、DisclosureGroup、Accordion、Popover、Tooltip、Modal、Drawer、AlertDialog、Toast。

本阶段固定 overlay 的打开/关闭、dismiss、焦点捕获与恢复、背景交互、层级和异步反馈契约。

### 6.4 阶段 4：Collection、Selection 与 Navigation

组件：ListBox、ListBoxItem、ListBoxSection、Menu、MenuItem、MenuSection、Dropdown、Select、Autocomplete、ComboBox、Tabs、ToggleButton、ToggleButtonGroup、Toolbar、Tag、TagGroup、Breadcrumbs、Pagination。

本阶段统一 collection item identity、选择模式、disabled item、typeahead、方向键导航、active/selected 状态和有界 item renderer。

### 6.5 阶段 5：数值、搜索与短结构输入

组件：NumberField、SearchField、InputOTP、Slider。

本阶段用可控范围验证新的输入 Behavior Authority 设计，包括格式化、步进、清除、分段焦点、粘贴和数值边界。

### 6.6 阶段 6：日期、时间与颜色

组件：Calendar、CalendarYearPicker、DateField、TimeField、DatePicker、RangeCalendar、DateRangePicker、ColorSwatch、ColorField、ColorSlider、ColorArea、ColorSwatchPicker、ColorPicker。

日期分段输入、范围选择和颜色操作必须作为行为问题处理，不能只复制样式。`CalendarYearPicker` 虽处于 HeroUI 预览形态，仍计入当前公开组件范围。

### 6.7 阶段 7：复杂数据

组件：Table。

Table 必须建立 Foldkit-native 的 collection、selection、排序、键盘网格导航和 ARIA grid/table 契约，不得以静态表格皮肤替代行为实现。

各组件的正式分类和权威说明见[组件目录与行为矩阵](./component-catalog.md)。

## 7. 现有 Input 与 InputGroup 的位置

### 7.1 Input

- 目录：Standalone。
- 阶段：2。
- 行为标记：A。
- Behavior Authority：`@foldkit/ui/Input`。
- 当前作用：作为 View Projection 样板，用 HeroUI `inputVariants` 投射 Foldkit Input，同时保留 label、主 Control Slot、稳定 Description Channel、ARIA 和 Message。
- 参考实现：[packages/ui/src/input.ts](../../../packages/ui/src/input.ts)、[packages/ui/src/internal/input.ts](../../../packages/ui/src/internal/input.ts)、[packages/ui/src/primitives/input.ts](../../../packages/ui/src/primitives/input.ts)。

### 7.2 InputGroup

- 目录：Parts。
- 阶段：2。
- 行为标记：A。
- Behavior Authority：唯一主 Input 使用 `@foldkit/ui/Input`，Action Affix 使用 Foldkit Button；group 自身没有值、校验、焦点或选择状态。
- 当前作用：作为结构型视觉组合样板。它只提供 control surface、prefix/suffix 和 `focus-within` 视觉投射，主 Input 继续拥有输入语义与 Description Channel。
- 当前约束：恰好一个主 Input；affix 分为 decorative 与 action；disabled 事实显式下发到 Input 和 action，而不是由 wrapper 截获事件。
- 参考实现：[packages/ui/src/input-group.ts](../../../packages/ui/src/input-group.ts)。

InputGroup 当前是 Input 专用结构，不在本规划中自动泛化为任意 Control Slot。若未来需要泛化，必须先单独评审其类型、语义和行为边界。

## 8. 规划变更治理

1. 新增、删除或重命名组件时，同步更新组件总数、阶段和目录。
2. A/B/C 标记变化必须附源码依据，特别是从 B/C 降为 A 时必须证明没有可观察行为。
3. Standalone 新增 slot/renderer 时，必须说明它如何保持 Behavior Authority 和 ARIA 关系。
4. 阶段完成以[组件文档库与验收规范](./documentation-and-acceptance.md)为门禁，不以“组件能渲染”作为完成标准。
5. 未经用户明确授权，不从本规划直接创建实现 Issue 或进入代码实现。
