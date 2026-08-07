# Foldkit 原生 UI 组件库 API 研究

> 研究问题：Foldkit 的核心设计特性是什么；它天然适合什么样的 UI / 组件库 API；哪些 Base UI / HeroUI 思想可以吸收，哪些模仿会牺牲 Foldkit 的特性？
>
> 结论基于 2026-08-07 的 Foldkit 官方文档、官方仓库提交 [`1995ded`](https://github.com/foldkit/foldkit/tree/1995dedf6b1fb51cd51dca135cbc2e9540b690fb)（`foldkit` / `@foldkit/ui` 0.140.1）及本仓库安装的 `foldkit` 0.140.0、`@foldkit/ui` 0.140.1。Base UI / HeroUI 仅作为用户提出的产品参照；本文没有用它们的二手资料反向定义 Foldkit。

## 结论

Foldkit-native 的 styled UI 库不应该是“没有 React 的 React 组件库”。它更适合成为 `@foldkit/ui` 的**有默认视觉的 Foldkit view 层**：

- 无状态行为使用 render helper：`view(config, h) -> Html`，直接接收父级 Message；
- 有独立交互状态机的行为使用 Submodel：公开 `Model`、`Message`、`init`、`update`、`view`、`OutMessage` 与必要的 programmatic helpers；
- 结构定制通过 `toView` / `RenderInfo` / attribute bundles，样式通过 class、data attribute、CSS variable、tokens 与 variants；
- 组件内部只拥有 UI 交互状态，业务值由父 Model 持有并经 `viewInputs` 输入，用户选择经语义化 `OutMessage` 输出；
- DOM、副作用、定位、焦点、滚动锁、动画完成监听进入命名的 `Command` 或 `Mount`，不藏在事件回调或样式包装层；
- 默认 markup、HeroUI 风格视觉、Tailwind 主题和 convenience API 可以加在上层，但必须仍然能被 Story / Scene 测试、DevTools、time travel 和 Message 因果链观察。

因此，正确方向不是把 Base UI 的 `Root / Trigger / Popup / Item` 组件树逐字翻译过来，而是把“可组合 anatomy”翻译成 Foldkit 已有的 `RenderInfo + toView + childAttributes`；也不是复制 HeroUI 的 React props，而是把其 tokens、variants、默认结构、视觉一致性翻译成纯 view 配置和默认 renderer。

## Foldkit 不可牺牲的架构特性

### 1. 单一、不可变、Schema 化的 Model

官方定义是：一个不可变 Model 保存整个应用状态，所有变化经过单一 `update`；Model 用 Effect Schema 定义，使运行时仍然知道数据形状，可做解码、相等性判断和资源生命周期管理。[Model 文档](https://foldkit.dev/core/model#overview)；[Architecture 文档](https://foldkit.dev/core/architecture#the-loop)

对 UI 库的含义：组件不能在 DOM closure、hook 等不可见位置另存一份状态。交互状态若值得独立拥有，应成为父 Model 中的一个 Submodel Model；无独立状态则不应人为制造 Submodel。官方明确说，无内部 Message / update 的 UI 应只是普通 render function，Submodel 机制只用于真正拥有状态机的 UI。[Submodel 文档：When NOT to use](https://foldkit.dev/core/submodel#when-not-to-use-a-submodel)

Schema 化并不等于“所有 Model 必须天然 JSON 序列化”。DevTools 会把 `File`、`Blob`、`Date`、`URL` 转为可检查表示，并递归处理数组和 record；这是可观察性适配层，而不是 UI 库把函数或 DOM 实例塞进 Model 的许可。[DevTools serialize 源码 L18-L67](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/foldkit/src/devTools/serialize.ts#L18-L67)

### 2. Message 是事实，update 是纯 fold

Message 描述“发生了什么”，而不是命令父级“做什么”；官方约定使用过去式事实名。`update(model, message)` 是纯函数，并以 exhaustive matching 返回新 Model 和 Commands。[Messages 文档](https://foldkit.dev/core/messages#overview)；[Update 文档](https://foldkit.dev/core/update#overview)

对 UI API 的含义：`Selected({ value })`、`Opened()`、`Closed()` 是合适的边界事件；`SetParentValue`、`NavigateNow`、在 `onChange` callback 内直接改状态不是。组件负责报告事实，父 update 决定业务后果。

### 3. Effect 通过 Command / Mount 显式进入循环

Command 是命名的副作用描述；update 只返回数据，运行时执行 Effect，并把结果作为新 Message 送回循环。Command 的名称、参数和可能产生的 Messages是一等值，可用于测试、DevTools 与 tracing。[Commands 文档 L83-L90、L124-L133](https://foldkit.dev/core/commands#overview)

实时 DOM 元素相关的生命周期 Effect 则使用 Mount，例如 overlay portal、observer、第三方 DOM 库接入；Runtime 在卸载时执行清理。[Architecture 文档 L83-L90](https://foldkit.dev/core/architecture#the-loop)

官方 Combobox 已把 Floating UI 定位和 pointer listener 建模为命名 Mount，并通过 acquire/release 管理清理；这正是 styled 层应复用的 seam，而不是自行在 render callback 中启动定位器。[Combobox `AnchorCombobox` 源码 L725-L765](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/ui/src/combobox/shared.ts#L725-L765)

### 4. View 是纯 HTML DSL，不是有生命周期的“组件实例”

View 对相同 Model 产生相同 HTML，不修改状态；handler 携带 Message。`HtmlBuilder<Message>` 把 HTML element、attribute 和 handler 绑定到当前 Message universe，应用代码不能自行构造 builder。[View 文档 L81-L131、L190-L213](https://foldkit.dev/core/view#overview)

这意味着 API 的基本组合单位应是 `Html`、render function、typed attributes 和 ViewInputs，而不是可以各自持有 state/effect 的嵌套组件对象。默认 markup 可以封装，但它仍只是纯 view 输出。

### 5. Submodel 是明确的状态机边界

Submodel 自包含 Model、Message、update、view 和 Commands；父级嵌入 child Model、包装 child Message 并委派 update。其目的既是封装交互细节，也是分解大型状态机。边界要求 internals 隐藏、跨边界信息窄且语义化；Listbox 应报告 item selected，而不是暴露 highlight index / focus bookkeeping。[Submodel 文档 L104-L124](https://foldkit.dev/core/submodel#overview)

父级绝不能直接改 child Model，因为会绕开 child update、破坏不变量并让 DevTools 看不到变化；父级发起操作应调用 child 导出的、封装 update 的语义 helper，如 `open`、`close`、`selectItem`。[Submodel 文档：Never Bypass](https://foldkit.dev/core/submodel#never-bypass-the-childs-update)

### 6. `viewInputs` 与 `OutMessage` 形成清晰的双向协议

官方将 `model` / `viewInputs` 的分离称为“load-bearing”：child Model 是 child 拥有、仅由 child update 修改的持久交互状态；`viewInputs` 是 parent 拥有、每次 render 重建的配置。把配置存入 child Model 会造成同步负担，把状态放进 ViewInputs 则会跨 render 丢失。[Submodel 文档 L390-L471](https://foldkit.dev/core/submodel#per-render-view-inputs)

OutMessage 是 child 向 parent 输出的语义事实，作为 update 三元组的 `Option<OutMessage>`；parent 决定后果。外界向 child 同步既有真相时应使用静默的 `reflect*` helper，避免回声循环。[Submodel 文档 L641-L702](https://foldkit.dev/core/submodel#surfacing-facts-to-the-parent)；[`Reflect` 源码 L1-L24](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/foldkit/src/submodel/submodel.ts#L1-L24)

现有 Combobox 是很清楚的例子：它的 Model 只拥有 open、active item、输入文本和动画等私有交互状态；selection 由 parent 持有，每 render 通过 ViewInputs 输入；提交时通过 `Selected` / `ClearedSelection` 输出。[Combobox single 源码 L23-L112](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/ui/src/combobox/single.ts#L23-L112)

### 7. slot/anatomy 已有 Foldkit 原生表达

官方建议把顶层 `toView` slot callback 放在 `viewInputs`，child 向其发布 attribute bundles，让 parent 决定 markup。顶层函数会被 runtime 自动放回 parent boundary；child 自身 handler attributes 必须经 `childAttributes` 绑定回 child boundary。[Submodel 文档 L470-L474、L767-L775](https://foldkit.dev/core/submodel#per-render-view-inputs)；[`childAttributes` 源码 L8-L73](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/foldkit/src/html/childAttribute.ts#L8-L73)

Dialog 已经把 anatomy 表达为 `RenderInfo`：`dialog`、`backdrop`、`panel`、`title`、`description`、`initialFocus`、`closeButton` 和 `isVisible`，再由消费方 `toView` 组装自己的 HTML。[Dialog 源码 L390-L446](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/ui/src/dialog/index.ts#L390-L446) handler attribute 在 L523-L532 经 `childAttributes` 发布。[Dialog 源码 L523-L532](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/ui/src/dialog/index.ts#L523-L532)

这就是 Base UI 风格“parts/anatomy”的 Foldkit 对应物；无需制造 `Dialog.Root`、`Dialog.Trigger` 之类带隐式上下文的运行时组件树。

### 8. 测试与可观察性是 API 契约，不是附加工具

Story 直接驱动 update，断言 Model、Command 和 OutMessage；Scene 通过 role / label / placeholder 操作纯 view，并显式 resolve Command 与 Mount。Submodel 可在自身层级测试，跨边界行为在 root 层测试。[Testing 文档 L84-L112](https://foldkit.dev/testing#story)

DevTools 记录每个 Message、Model diff、Commands、Mounts，并支持 time travel；`Got*Message` 命名还驱动 Submodel 过滤与因果链显示。[DevTools 文档 L80-L91](https://foldkit.dev/core/devtools#overview)；[Submodel 文档：Debugging](https://foldkit.dev/core/submodel#debugging-submodels-in-devtools)

因此 UI 层不能把关键状态转换、animation presence、focus/positioning effect 藏进不可解析的 callbacks；否则视觉上能工作，却退出 Foldkit 的 Story / Scene / DevTools 世界。

## Foldkit-native UI API 应长什么样

### 无状态或 parent-controlled 控件

沿用 `@foldkit/ui` 的 render helper：

```ts
Button.view(
  {
    onClick: ClickedSave(),
    // styled 包可提供默认 renderer；高级用户仍可覆盖
    toView: ({ button }) => h.button([...button, ...buttonStyles(config)], ["Save"]),
  },
  h,
);
```

官方 Button 的 generic Message 由调用方 builder 锁定，错误 Message 在编译期失败；它只发布 attribute bundle，不创建自己的 state。[Button 源码 L6-L60](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/ui/src/button/index.ts#L6-L60)

styled 包可以提供 `variant`、`size`、`color`、`radius`、`className`、token/CSS variable 和默认 children/layout，但这些都属于 view config，不属于 Model。

### 有独立交互状态机的控件

公开一个 namespace 或 typed factory bundle：

```ts
const UserCombobox = Ui.Combobox.create<UserId>();

// Model 中保存 UserCombobox 的 interaction Model
// update 中委派 UserCombobox.update，并折叠 OutMessage
// view 中 h.submodel({ model, view, viewInputs, toParentMessage })
```

`create<Item>()` 同时绑定 view、update 和 programmatic helpers 的泛型，使 `Selected.value` 保留调用方的 union type，这是比复制 React generic props 更 Foldkit-native 的能力。[Combobox single 源码 L116-L195](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/ui/src/combobox/single.ts#L116-L195)

styled 层可以在 ViewInputs 上添加样式 variants 和默认 `toView`，但不能把 `update`、OutMessage 或 Commands 包没。复杂 anatomy 是否全部开放，不应追求形式统一：只应开放消费者确实需要改 markup 的 seam；每个公开 handler attribute 都必须正确绑定 child boundary。

### 运行时约束应直接体现在设计规范中

- 每个 `h.submodel` embed site 要有稳定且同 parent 下唯一的 `slotId`；它表示 DOM slot identity，不是 model identity。[`SubmodelConfig` 源码 L129-L172](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/foldkit/src/html/submodel.ts#L129-L172)
- `viewInputs` 的 slot callbacks 必须位于顶层；嵌套函数会在 view-build 时抛错，因为 runtime 无法正确恢复 parent boundary。[`SubmodelConfig` 源码 L146-L158](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/foldkit/src/html/submodel.ts#L146-L158)
- slot callback 应在创建它的 render 中同步调用，不能保存后异步调用；boundary 卸载后 runtime 会拒绝错误路由。[boundary 源码 L274-L310](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/foldkit/src/html/boundary.ts#L274-L310)
- runtime 按到达顺序同步 drain Message、防止 re-entrancy，并在 Model reference 改变时安排 render；Command 延后到 microtask 中 fork，结果作为异步 Message 回来。[runtime 源码 L1777-L1838](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/foldkit/src/runtime/runtime.ts#L1777-L1838)、[L2036-L2127](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/foldkit/src/runtime/runtime.ts#L2036-L2127)

## 可以吸收的 Base UI / HeroUI 思想

以下是“翻译到 Foldkit”，不是 API 复刻。

| 参照思想                        | Foldkit-native 落点                                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Headless accessibility behavior | 继续由 `@foldkit/ui` 提供 ARIA、keyboard、focus、state machine；styled 包不重复实现                         |
| 清晰 anatomy / parts 命名       | `RenderInfo` 字段和 attribute bundles；由 `toView` 组合 Html                                                |
| 可替换 markup                   | 顶层 `toView` / slot callback；child handler 用 `childAttributes`                                           |
| state data attributes           | 由纯 view 从 Model / transition state 推导 `data-*`，供 Tailwind / CSS / Motion 消费                        |
| positioning 配置                | 作为 ViewInputs / init config，真正 DOM 生命周期仍由命名 Mount + Floating UI 管理                           |
| HeroUI 风格的完整视觉系统       | tokens、semantic colors、variants、sizes、radii、dark mode、默认结构和文档示例，全部位于 styled view 层     |
| 简洁的常见用法                  | 提供有默认 renderer 的 convenience view config，同时保留底层 Model/update/view/OutMessage                   |
| motion presets                  | 映射到可观察的 Animation Submodel / data attributes / Command 或 Mount 完成信号；视觉 preset 不另建隐藏状态 |

现有 `@foldkit/ui` 官方定位已经是“行为而非 markup”，并明确区分 render helpers 与 Submodels。[`@foldkit/ui` README L3-L45](https://github.com/foldkit/foldkit/blob/1995dedf6b1fb51cd51dca135cbc2e9540b690fb/packages/ui/README.md#L3-L45) 所以 styled 包首先应是对这个协议的默认视觉实现，而非另一套行为库。

## 会牺牲 Foldkit 特性的模仿

以下做法应列为设计红线：

1. **复制 React compound component runtime。** 用 `Root / Trigger / Content / Item` 的嵌套节点、context 和注册副作用建立组件状态，会把 `h.submodel + wrapper Message + update` 的明确边界重新变成隐式组件树。
2. **复制 hooks/local state。** open、highlight、focus、presence、filter text 等若不在 Schema Model，就无法由 update 重放、Story 断言或 DevTools time travel。
3. **复制命令式 callback props。** `onSelect={() => setState(...)}`、`onOpenChange` 中做副作用，把 Message 事实和父 update 的决策合并，破坏单向循环。相应接口应是 child Message / OutMessage / programmatic update helper。
4. **把 controlled/uncontrolled 当核心抽象。** Foldkit 更精确的区分是“业务状态由谁拥有”与“交互状态机由谁拥有”：业务 selection 常由 parent Model 持有，child interaction state 由 Submodel 持有，二者经 ViewInputs / OutMessage 同步。另造一套 internal uncontrolled source of truth 会产生双状态。
5. **styled 层重复行为状态机。** 新包若重新实现 keyboard、dismiss、focus、selection、Floating UI 生命周期，会与 `@foldkit/ui` 的 Model/update/Command 漂移；样式层应消费其协议。
6. **为追求统一 parts API 强拆所有组件。** Button 的一个 attribute group 与 Dialog 的多 anatomy 都是合理的；所有控件都强制相同 `Root/Part` 形状，会制造无价值边界，并增加 Message routing 复杂度。
7. **把 Motion 当第二运行时。** Motion 可以执行插值和 DOM 动画，但 open/close/presence 的权威状态与完成事实应回到 Foldkit Animation Model / Message；否则 leave completion 和资源清理会脱离 update 因果链。
8. **隐藏 `Model / Message / update / OutMessage / Command` 只暴露“组件 props”。** 这会让用户得到熟悉语法，却失去 Foldkit 最核心的可测试、可观察、可组合状态机。

## 对当前方案的建议

建议把产品定义为：**“`@foldkit/ui` 的 styled distribution：HeroUI 级别的视觉完成度和 defaults，Base UI 级别的 markup 可组合性，但 API 与状态所有权完全遵守 Foldkit 的 TEA/Submodel 协议。”**

第一条设计决策不应是“是否统一成 Base UI parts”，而应是逐组件判定：

1. 它有没有独立状态机？没有则 render helper，有则 Submodel。
2. 哪些是 child-owned interaction state，哪些是 parent-owned domain state？
3. parent 需要输入哪些每 render 配置，child 需要输出哪些语义事实？
4. 哪些 DOM anatomy 必须开放，哪些可以是 styled 包的稳定默认 markup？
5. 每个副作用属于 Command 还是 Mount？它的完成 Message 如何被 Story / Scene / DevTools 看到？

只有回答完这五项，再决定该组件的 `RenderInfo` 与默认 renderer。这样得到的不是 HeroUI/Base UI 的外形移植，而是 Foldkit 自己的基础组件库。
