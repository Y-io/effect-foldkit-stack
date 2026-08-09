# HeroUI 组件目录与行为矩阵

> 状态：规划基线，实施未授权。

## 1. 清单口径

清单以 vendored [HeroUI components index](../../../repos/heroui/packages/react/src/components/index.ts) 为准，共 82 个公共组件模块；版本由 [HeroUI React package.json](../../../repos/heroui/packages/react/package.json) 固定为 `3.2.4`。`icons` 是资源聚合包，`rac` 是 React 专属导出，两者不计入组件数。`CalendarYearPicker` 计入公开范围，即使它在 HeroUI 中仍带有预览性质。

分类定义与行为原则见[路线总览](./README.md)。组件文档页必须使用本表的 `Catalog`、`Phase` 和 `Class` 作为元数据真相源。

## 2. 分类汇总

| 维度       | 数量 | 说明                                           |
| ---------- | ---: | ---------------------------------------------- |
| Parts      |   23 | 装配级视觉或语义部件，不单独复制父组件状态机   |
| Standalone |   59 | 可直接完成一个展示、输入、选择、导航或反馈任务 |
| 总计       |   82 | 不含 `icons` 与 `rac`                          |

## 3. 完整矩阵

`Authority / mapping` 记录预期行为权威或需要建立的行为边界，不表示已经实现。

|   # | Component          | Catalog    | Phase | Class | Authority / mapping                                               |
| --: | ------------------ | ---------- | ----: | ----- | ----------------------------------------------------------------- |
|   1 | Typography         | Parts      |     1 | A     | 原生文本语义与视觉 token 投射                                     |
|   2 | Surface            | Parts      |     1 | A     | 无状态容器视图                                                    |
|   3 | Separator          | Parts      |     1 | A     | 原生 separator 语义与视觉投射                                     |
|   4 | Label              | Parts      |     1 | A     | 原生 label 关系，追随所属 field                                   |
|   5 | Description        | Parts      |     1 | A     | 稳定 Description Channel 与 `aria-describedby`                    |
|   6 | Header             | Parts      |     1 | A     | 集合或区块 header 语义与视觉投射                                  |
|   7 | ErrorMessage       | Parts      |     1 | A     | 外部校验事实的视觉表达                                            |
|   8 | FieldError         | Parts      |     1 | A     | 追随 Foldkit field 校验与描述关系                                 |
|   9 | Kbd                | Parts      |     1 | A     | 原生 `kbd` 语义与视觉投射                                         |
|  10 | Badge              | Parts      |     1 | A     | 无状态装饰或状态标签视图                                          |
|  11 | Chip               | Parts      |     1 | A     | 无状态内容容器；可交互删除归属使用方行为                          |
|  12 | Card               | Parts      |     1 | A     | 无状态容器 anatomy 与视觉投射                                     |
|  13 | Skeleton           | Parts      |     1 | A     | loading 占位视觉，不建立业务 loading 状态                         |
|  14 | EmptyState         | Standalone |     1 | A     | 外部空状态事实的完整展示单元                                      |
|  15 | Alert              | Standalone |     1 | A     | 原生 alert/status 语义与视觉投射                                  |
|  16 | Spinner            | Standalone |     1 | A     | 原生 progress/status 语义与视觉投射                               |
|  17 | ProgressBar        | Standalone |     1 | A     | 原生 progressbar 值语义与视觉投射                                 |
|  18 | ProgressCircle     | Standalone |     1 | A     | 与 ProgressBar 共用值语义，改变视觉 anatomy                       |
|  19 | Meter              | Standalone |     1 | A     | 原生 meter 语义与视觉投射                                         |
|  20 | Avatar             | Standalone |     1 | B     | 复用 Foldkit HTML `img` 的 load/error 事件，适配 fallback 契约    |
|  21 | ScrollShadow       | Parts      |     1 | B     | 复用 Foldkit Mount/DOM observer 能力，投射滚动边缘可见状态        |
|  22 | Button             | Standalone |     2 | B     | 复用 Foldkit Button，适配 HeroUI variant、pending 与 slot anatomy |
|  23 | CloseButton        | Standalone |     2 | B     | 复用 Foldkit Button，固定 close 语义与可访问名称契约              |
|  24 | ButtonGroup        | Parts      |     2 | A     | 视觉排列与相邻 control surface，不协调成员状态                    |
|  25 | Link               | Standalone |     2 | B     | 复用原生/Foldkit 导航语义，适配 disabled/current/external 表现    |
|  26 | Input              | Standalone |     2 | A     | 直接投射 `@foldkit/ui/Input`，现有样板                            |
|  27 | InputGroup         | Parts      |     2 | A     | Foldkit Input/Button 持有行为，group 仅组合与视觉投射             |
|  28 | Textarea           | Standalone |     2 | A     | 直接投射 Foldkit Textarea                                         |
|  29 | TextField          | Standalone |     2 | B     | 复用 Foldkit field/input，适配 HeroUI Field Anatomy 与表单契约    |
|  30 | Fieldset           | Standalone |     2 | A     | 直接投射 Foldkit/native fieldset 与 legend 语义                   |
|  31 | Form               | Standalone |     2 | B     | 复用 Foldkit Form/外层 Model，适配校验与提交契约                  |
|  32 | Checkbox           | Standalone |     2 | B     | 复用 Foldkit Checkbox，适配 indeterminate、anatomy 与 slot        |
|  33 | CheckboxGroup      | Standalone |     2 | C     | 新增组值、成员约束、键盘/ARIA 与 OutMessage 权威                  |
|  34 | Radio              | Standalone |     2 | B     | 复用 Foldkit Radio，适配视觉 anatomy 与字段契约                   |
|  35 | RadioGroup         | Standalone |     2 | B     | 复用 Foldkit RadioGroup，适配 orientation、slot 与错误通道        |
|  36 | Switch             | Standalone |     2 | B     | 复用 Foldkit Switch，适配 track/thumb anatomy 与 slot             |
|  37 | SwitchGroup        | Parts      |     2 | A     | 仅排列独立 Switch，不新增组选择权威                               |
|  38 | Disclosure         | Standalone |     3 | A     | 直接投射 Foldkit Disclosure 行为                                  |
|  39 | DisclosureGroup    | Standalone |     3 | C     | 新增展开集合、单/多开模式与组级 Message 权威                      |
|  40 | Accordion          | Standalone |     3 | C     | 基于 Foldkit-native disclosure collection 建立协调行为            |
|  41 | Popover            | Standalone |     3 | A     | 直接投射 Foldkit Popover 的定位、dismiss 与焦点行为               |
|  42 | Tooltip            | Standalone |     3 | B     | 复用 Foldkit Tooltip，适配 trigger、延时和 content slot 契约      |
|  43 | Modal              | Standalone |     3 | B     | 复用 Foldkit Dialog，适配 backdrop、placement、size 与 anatomy    |
|  44 | Drawer             | Standalone |     3 | B     | 复用 Foldkit Dialog，适配边缘 placement 与转场契约                |
|  45 | AlertDialog        | Standalone |     3 | C     | 新增 destructive/confirm 焦点与关闭约束的 Foldkit-native 权威     |
|  46 | Toast              | Standalone |     3 | B     | 复用 Foldkit Toast，适配队列、region 和 HeroUI anatomy            |
|  47 | ListBox            | Standalone |     4 | C     | 新增完整 collection、selection、typeahead、键盘与 ARIA 权威       |
|  48 | ListBoxItem        | Parts      |     4 | C     | 追随 ListBox authority，提供有界 item renderer 与属性包           |
|  49 | ListBoxSection     | Parts      |     4 | C     | 追随 ListBox authority，提供 section/header 关系                  |
|  50 | Menu               | Standalone |     4 | B     | 复用 Foldkit Menu，适配 HeroUI collection 与 slot 契约            |
|  51 | MenuItem           | Parts      |     4 | B     | 追随 Foldkit Menu authority，适配 item anatomy 与状态属性         |
|  52 | MenuSection        | Parts      |     4 | B     | 追随 Foldkit Menu authority，适配 section/header anatomy          |
|  53 | Dropdown           | Standalone |     4 | B     | 复用 Foldkit Menu/Popover，封装有界 trigger 与 content slot       |
|  54 | Select             | Standalone |     4 | B     | 映射 Foldkit Listbox 而非同名原生 Select，适配单选 field API      |
|  55 | Autocomplete       | Standalone |     4 | B     | 复用 Foldkit Combobox/Listbox，适配异步与建议项契约               |
|  56 | ComboBox           | Standalone |     4 | A     | 直接投射 Foldkit Combobox 已有选择、筛选、键盘和 renderer 能力    |
|  57 | Tabs               | Standalone |     4 | B     | 复用 Foldkit Tabs，适配 collection、orientation 与 panel slot     |
|  58 | ToggleButton       | Standalone |     4 | C     | 新增 pressed 状态、键盘与 `aria-pressed` 行为权威                 |
|  59 | ToggleButtonGroup  | Standalone |     4 | C     | 新增单/多选 pressed collection 与组级 Message 权威                |
|  60 | Toolbar            | Standalone |     4 | C     | 新增 roving focus、方向键和 orientation 行为权威                  |
|  61 | Tag                | Parts      |     4 | A     | tag anatomy 与视觉投射，交互追随所属 TagGroup                     |
|  62 | TagGroup           | Standalone |     4 | C     | 新增 tag collection、选择、移除、键盘与 ARIA 权威                 |
|  63 | Breadcrumbs        | Standalone |     4 | A     | 原生 nav/list/current 语义与视觉投射                              |
|  64 | Pagination         | Standalone |     4 | A     | 父层页码状态与 Foldkit Button/Link 行为的视觉投射                 |
|  65 | NumberField        | Standalone |     5 | C     | 新增格式化、步进、范围、键盘和 locale 行为权威                    |
|  66 | SearchField        | Standalone |     5 | C     | 新增 search/clear/submit Message 与字段语义权威                   |
|  67 | InputOTP           | Standalone |     5 | C     | 新增分段焦点、输入、粘贴、完成与 ARIA 行为权威                    |
|  68 | Slider             | Standalone |     5 | B     | 复用 Foldkit Slider，适配单/多 thumb、label 与 output anatomy     |
|  69 | Calendar           | Standalone |     6 | A     | 直接投射 Foldkit Calendar 的日期网格与导航行为                    |
|  70 | CalendarYearPicker | Standalone |     6 | B     | 复用 Foldkit Calendar authority，适配年份选择视图与契约           |
|  71 | DateField          | Standalone |     6 | C     | 新增 locale-aware 日期分段输入与焦点行为权威                      |
|  72 | TimeField          | Standalone |     6 | C     | 新增 locale-aware 时间分段输入与焦点行为权威                      |
|  73 | DatePicker         | Standalone |     6 | B     | 复用 Foldkit Calendar/Popover，并适配 field 与 overlay 协调契约   |
|  74 | RangeCalendar      | Standalone |     6 | C     | 新增日期范围选择、预览与键盘行为权威                              |
|  75 | DateRangePicker    | Standalone |     6 | C     | 新增范围 field、calendar、popover 的 Foldkit-native 协调权威      |
|  76 | ColorSwatch        | Parts      |     6 | A     | 颜色值的无状态视觉与可访问文本表达                                |
|  77 | ColorField         | Standalone |     6 | C     | 新增颜色解析、格式化、校验与 Message 权威                         |
|  78 | ColorSlider        | Standalone |     6 | C     | 新增颜色通道、thumb、键盘和 ARIA 行为权威                         |
|  79 | ColorArea          | Standalone |     6 | C     | 新增二维颜色通道、指针/键盘与 ARIA 行为权威                       |
|  80 | ColorSwatchPicker  | Standalone |     6 | C     | 新增颜色 collection、selection、键盘和 ARIA 权威                  |
|  81 | ColorPicker        | Standalone |     6 | C     | 新增 field/slider/area/swatch/overlay 的协调权威                  |
|  82 | Table              | Standalone |     7 | C     | 新增 collection、selection、sort、网格导航与 ARIA 权威            |

## 4. 重点判定依据

### 4.1 Select 是 B

HeroUI Select 不映射 HTML 同名原生 `select`。其行为权威应选择 [Foldkit Listbox](../../../repos/foldkit/packages/ui/src/listbox/public.ts)，再适配单选 field、trigger、value display、popover 和 item contract。这是原语选择与契约适配，不是纯视觉 A。

本表把公开 HeroUI ListBox 标为 C 并不否认现有 Foldkit Listbox。后者的现有模型围绕 button、open/close、portal panel 和 popup focus 展开，足以作为 Select 的行为基础；前者还要求一个可独立常驻的 collection/selection 任务边界。实施前的 C 类行为设计应明确哪些 selection/typeahead 逻辑可抽取复用，不能另写一套平行算法。

### 4.2 Avatar 是 B，不是 C

Avatar 的 fallback 会因 image load/error 产生可观察变化，因此不能标 A。[Foldkit HTML events](../../../repos/foldkit/packages/foldkit/src/html/index.ts) 已提供 `OnLoad`/`OnError`，不需要创建完整的新 Behavior Authority，只需用现有事件和父层状态适配 fallback 契约，所以标 B。

### 4.3 ScrollShadow 是 B，不是 C

ScrollShadow 的边缘阴影取决于 scroll position、viewport 与 content size，属于可观察行为，不能标 A。[Foldkit Mount](../../../repos/foldkit/packages/foldkit/src/mount/index.ts) 的 `defineStream` 可承载 scroll 与 observer 类订阅，[VirtualList](../../../repos/foldkit/packages/ui/src/virtualList/index.ts) 也已有 `ResizeObserver` 先例，因此应复用生命周期原语做契约适配，标 B。

### 4.4 Table、颜色和日期分段输入是 C

这些组件需要持续协调 selection、排序、二维或分段键盘导航、locale 格式和 ARIA 关系。HeroUI 外观不能替代这些行为，现有 Foldkit 原语也不足以直接覆盖完整契约，因此明确标 C。

## 5. Standalone 内容自定义边界

Dropdown、Menu、ComboBox、Select、Autocomplete、Table 等 Standalone 可以开放内容自定义，但 contract 必须是有限且可审计的：

1. Trigger renderer 接收 Foldkit 生成的 attribute bundle，不自行管理 open/focus 状态。
2. Item renderer 接收稳定 identity、selected/disabled/focused 等派生状态和必须合并的语义属性。
3. Panel renderer 只控制内容 anatomy，不接管定位、dismiss、focus scope 或 collection 导航。
4. 自定义视觉节点不能吞掉 Message，也不能移除必须的 role、id 和 ARIA 关系。
5. ComboBox 已有 Foldkit renderer/attribute 能力，归为 A；文档阶段只审计公开 contract 与 HeroUI anatomy 的映射差异。
