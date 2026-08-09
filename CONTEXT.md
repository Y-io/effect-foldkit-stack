# Foldkit-native UI

本上下文定义 `@pkg/ui` 在 Foldkit 行为与语义之上提供统一视觉系统时使用的共同语言。它用于明确字段、组合控件及其状态的所有权边界。

## 权威与投射

**Behavior Authority（行为权威）**：
控件交互状态、`Message`、键盘、焦点与无障碍语义的唯一来源。它属于 Foldkit 及各真实交互控件，不属于视觉外壳。
_避免使用_：组件库行为、外壳行为、重复状态机

**Visual Authority（视觉权威）**：
默认 markup、设计令牌与状态外观的唯一来源。它属于 `@pkg/ui`，但不能取代或削弱 Behavior Authority。
_避免使用_：第二行为源、视觉状态机

**View Projection（视图投射）**：
把 `@foldkit/ui` view 输出作为唯一行为与语义输入，映射为 `@pkg/ui` 的 markup 和视觉表达。它不是对 Foldkit 行为的重新实现。
_避免使用_：行为包装、状态复制、重新实现 Foldkit

## Field

**Field Anatomy（字段结构）**：
由 Label、一个主 Control Slot 与一个 Description Channel 组成的完整字段结构。共享外壳只改变 Control Slot 的视觉位置，不改变三者的语义关系。
_避免使用_：把完整 Field 当作 Control、把描述放进 InputGroup

**Field State（字段状态）**：
外层 Form Model 持有的字段值、校验生命周期与错误集合。Input 与 InputGroup 只呈现它，不拥有或执行校验。
_避免使用_：Input 校验状态、InputGroup errors

**Description Channel（描述通道）**：
与主控件稳定关联的唯一描述容器，即使没有内容也持续存在。helper、validating 与 errors 只替换其内容，多条错误仍共享这一通道。
_避免使用_：临时错误节点、多个 description ID、悬空描述引用

**Control Slot（控件槽位）**：
Field 中容纳唯一主编辑控件的位置，也是控件参与共享 Control Surface 的显式契约。任意 markup 不会被自动推断为 Control Slot。
_避免使用_：任意 child、完整 Field Slot、多个主控件

**Control Surface（控件表面）**：
控件的边框、背景、圆角、阴影及外层状态视觉。Standalone 控件拥有独立 Control Surface；进入 InputGroup 后把该表面让渡给共享外壳，但保留内容、语义和行为。
_避免使用_：控件行为、字段语义、第二层外壳

## Input

**Styled Input**：
`@pkg/ui` 对 Foldkit Input view 的视觉投射。它完整保留 Foldkit 提供的 Input、Label 与 Description 语义，只增加统一视觉表达。
_避免使用_：自有 Input 状态机、Foldkit Input 替代品

**Standalone Input（独立 Input）**：
未进入 InputGroup 的 Styled Input，拥有完整的独立 Control Surface 与自身焦点视觉。
_避免使用_：Ungrouped wrapper

**Grouped Input（组内 Input）**：
位于 InputGroup 唯一 Control Slot 中的 Styled Input。它保留全部 Foldkit 行为与语义，但不显示独立 Control Surface 或局部外层焦点框。
_避免使用_：Nested Input Surface、双重焦点框

## InputGroup

**InputGroup（输入组合）**：
把恰好一个主编辑 Control Slot 与可选 affix 呈现为单一共享 Control Surface 的复合字段部件。它只拥有组合视觉，不拥有字段值、校验、ARIA 或成员行为。
_避免使用_：多主控件容器、复合状态机、Form wrapper

**Decorative Affix（装饰前后缀）**：
不参与交互的 prefix 或 suffix。只有纯视觉或已由 Label、Description Channel 完整表达的冗余内容才可对辅助技术隐藏；有意义的文字必须进入字段语义。
_避免使用_：自动隐藏的 affix、无名称文本

**Action Affix（操作前后缀）**：
位于 prefix 或 suffix 的独立交互控件，保留自己的 Behavior Authority、可访问名称、焦点和键盘行为。它不是字段的主编辑 Control Slot，也不继承主 Input 的 Label 或错误语义。
_避免使用_：装饰按钮、第二主控件、共享事件处理器

## 组合状态

**Derived Group State（派生组状态）**：
从主 Input 已有语义状态投射出的 InputGroup 外观，例如 invalid 与 readonly。它不是 wrapper 上的第二份状态，也不能反向修改主 Input。
_避免使用_：Group invalid prop、状态镜像、ARIA 转传

**Group Disabled（组级禁用）**：
由父级拥有并一次性应用于同组主 Input 与所有 Action Affix 的业务事实。InputGroup 显示完整禁用外观，但不通过拦截事件来伪造禁用；readonly 是另一项独立事实。
_避免使用_：成员各自禁用、wrapper 事件屏蔽、readonly-as-disabled

**Group Focus（组级焦点）**：
当主 Input 或任一 Action Affix 获得键盘焦点时，共享 Control Surface 显示 focus-within。Grouped Input 不再显示独立外层焦点框；当前 Action Affix 保留清晰、可区分的局部焦点提示。
_避免使用_：双重 Input focus ring、只有 Input 驱动的组焦点

**Focusable Disabled Action（可聚焦禁用操作）**：
Foldkit Button 的既定禁用语义：Action Affix 可被发现和聚焦，并向辅助技术表达不可用，但不会派发操作 `Message`。InputGroup 不把它改成另一种禁用模型。
_避免使用_：原生 disabled Button、禁用即移出焦点顺序
