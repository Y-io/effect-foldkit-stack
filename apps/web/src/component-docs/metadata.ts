import { Schema as S } from "effect";

export const Catalog = S.Literals(["parts", "standalone"]);
export type Catalog = typeof Catalog.Type;

export const BehaviorClass = S.Literals(["A", "B", "C"]);
export type BehaviorClass = typeof BehaviorClass.Type;

export const Status = S.Literals(["planned", "contract-reviewed", "implemented", "verified"]);
export type Status = typeof Status.Type;

export const Phase = S.Int.check(S.isBetween({ minimum: 1, maximum: 7 }));
export type Phase = typeof Phase.Type;

export const ComponentMetadata = S.Struct({
  name: S.String,
  title: S.String,
  slug: S.String,
  catalog: Catalog,
  phase: Phase,
  behaviorClass: BehaviorClass,
  behaviorAuthority: S.String,
  status: Status,
  family: S.String,
  dependencies: S.Array(S.String),
  anatomy: S.Array(S.String),
  publicParts: S.Array(S.String),
  states: S.Array(S.String),
  slots: S.Array(S.String),
  heroUi: S.Struct({ version: S.String, module: S.String }),
  foldkit: S.Struct({ primitive: S.String }),
  examples: S.Array(S.String),
  differences: S.Array(S.String),
});
export type ComponentMetadata = typeof ComponentMetadata.Type;

export const typographyMetadata = ComponentMetadata.make({
  name: "Typography",
  title: "排版",
  slug: "typography",
  catalog: "parts",
  phase: 1,
  behaviorClass: "A",
  behaviorAuthority: "原生文本语义",
  status: "verified",
  family: "foundations",
  dependencies: ["@heroui/styles/components/typography", "foldkit/html"],
  anatomy: ["语义文本元素", "typography slot"],
  publicParts: ["view", "proseView"],
  states: ["type", "align", "color", "weight", "truncate"],
  slots: ["content", "prose content"],
  heroUi: { version: "3.2.4", module: "typography" },
  foldkit: { primitive: "原生 h1-h6、p、code、div" },
  examples: ["default", "semantic-levels", "variants", "custom-content", "long-text"],
  differences: ["不引入 React Aria Text；元素语义由 Foldkit HtmlBuilder 直接生成。"],
});

export const surfaceMetadata = ComponentMetadata.make({
  name: "Surface",
  title: "表面",
  slug: "surface",
  catalog: "parts",
  phase: 1,
  behaviorClass: "A",
  behaviorAuthority: "原生容器语义",
  status: "verified",
  family: "foundations",
  dependencies: ["@heroui/styles/components/surface", "foldkit/html"],
  anatomy: ["内容容器", "surface slot"],
  publicParts: ["view"],
  states: ["default", "secondary", "tertiary", "transparent"],
  slots: ["content"],
  heroUi: { version: "3.2.4", module: "surface" },
  foldkit: { primitive: "原生容器与调用方 attributes" },
  examples: ["default", "variants", "custom-content", "narrow-content"],
  differences: ["不移植 React Context；Surface 不持有或传播行为状态。"],
});

export const separatorMetadata = ComponentMetadata.make({
  name: "Separator",
  title: "分隔线",
  slug: "separator",
  catalog: "parts",
  phase: 1,
  behaviorClass: "A",
  behaviorAuthority: "原生 separator 语义",
  status: "verified",
  family: "foundations",
  dependencies: ["@heroui/styles/components/separator", "foldkit/html"],
  anatomy: ["separator root"],
  publicParts: ["view"],
  states: ["horizontal", "vertical", "default", "secondary", "tertiary"],
  slots: ["separator"],
  heroUi: { version: "3.2.4", module: "separator" },
  foldkit: { primitive: "原生 role=separator 与 aria-orientation" },
  examples: ["default", "color-variants", "vertical"],
  differences: ["不引入 React Aria Separator；role 与 aria-orientation 由原生属性表达。"],
});

export const labelMetadata = ComponentMetadata.make({
  name: "Label",
  title: "字段标签",
  slug: "label",
  catalog: "parts",
  phase: 1,
  behaviorClass: "A",
  behaviorAuthority: "原生 label 关系",
  status: "verified",
  family: "form-control",
  dependencies: ["@heroui/styles/components/label", "foldkit/html"],
  anatomy: ["原生 label 元素", "label slot"],
  publicParts: ["view"],
  states: ["default", "required", "disabled", "invalid"],
  slots: ["content"],
  heroUi: { version: "3.2.4", module: "label" },
  foldkit: { primitive: "原生 label 与 for/id relationship" },
  examples: ["default", "required", "invalid", "disabled", "long-content"],
  differences: ["不引入 React Aria Label；for/id 与字段状态继续由调用方提供。"],
});

export const descriptionMetadata = ComponentMetadata.make({
  name: "Description",
  title: "字段说明",
  slug: "description",
  catalog: "parts",
  phase: 1,
  behaviorClass: "A",
  behaviorAuthority: "稳定 Description Channel",
  status: "verified",
  family: "form-control",
  dependencies: ["@heroui/styles/components/description", "foldkit/html"],
  anatomy: ["稳定 description 容器", "description slot"],
  publicParts: ["view"],
  states: ["helper", "validating", "errors", "empty", "long-content"],
  slots: ["content"],
  heroUi: { version: "3.2.4", module: "description" },
  foldkit: { primitive: "原生 id 与 aria-describedby relationship" },
  examples: ["controlled-content", "default", "empty", "long-content"],
  differences: ["不依赖 React Aria Text slot；容器是否挂载及其 id 由 Field Anatomy 决定。"],
});

export const headerMetadata = ComponentMetadata.make({
  name: "Header",
  title: "区块标题",
  slug: "header",
  catalog: "parts",
  phase: 1,
  behaviorClass: "A",
  behaviorAuthority: "原生 header 与调用方内容语义",
  status: "verified",
  family: "foundations",
  dependencies: ["@heroui/styles/components/header", "foldkit/html"],
  anatomy: ["原生 header 容器", "调用方标题内容", "header slot"],
  publicParts: ["view"],
  states: ["default", "long-content"],
  slots: ["content"],
  heroUi: { version: "3.2.4", module: "header" },
  foldkit: { primitive: "原生 header 与调用方 heading" },
  examples: ["default", "custom-heading", "long-content"],
  differences: ["不引入 React Aria Header；标题层级与集合关系由调用方内容表达。"],
});

export const errorMessageMetadata = ComponentMetadata.make({
  name: "ErrorMessage",
  title: "错误消息",
  slug: "error-message",
  catalog: "parts",
  phase: 1,
  behaviorClass: "A",
  behaviorAuthority: "外部校验事实与原生描述关系",
  status: "verified",
  family: "form-control",
  dependencies: ["@heroui/styles/components/error-message", "foldkit/html"],
  anatomy: ["错误消息容器", "error-message slot"],
  publicParts: ["view"],
  states: ["external-error", "long-content"],
  slots: ["content"],
  heroUi: { version: "3.2.4", module: "error-message" },
  foldkit: { primitive: "调用方校验状态与原生 aria-describedby" },
  examples: ["external-error", "long-content"],
  differences: ["不依赖 React Aria Text slot；组件不决定何时产生、显示或清除错误。"],
});

export const fieldErrorMetadata = ComponentMetadata.make({
  name: "FieldError",
  title: "字段错误",
  slug: "field-error",
  catalog: "parts",
  phase: 1,
  behaviorClass: "A",
  behaviorAuthority: "外层 Form Model 与稳定 Description Channel",
  status: "verified",
  family: "form-control",
  dependencies: ["@heroui/styles/components/field-error", "foldkit/html"],
  anatomy: ["稳定字段错误容器", "field-error slot"],
  publicParts: ["view"],
  states: ["external-visible", "external-hidden", "empty", "multiple-errors"],
  slots: ["content"],
  heroUi: { version: "3.2.4", module: "field-error" },
  foldkit: { primitive: "Form Model errors 与原生 aria-describedby" },
  examples: ["external-visible", "external-hidden", "empty", "multiple-errors"],
  differences: ["不引入 React Aria FieldError 的校验读取；外层 Field 决定内容并保持稳定 id。"],
});

export const kbdMetadata = ComponentMetadata.make({
  name: "Kbd",
  title: "键盘提示",
  slug: "kbd",
  catalog: "parts",
  phase: 1,
  behaviorClass: "A",
  behaviorAuthority: "原生 kbd 与 abbr 语义",
  status: "verified",
  family: "foundations",
  dependencies: ["@heroui/styles/components/kbd", "foldkit/html"],
  anatomy: ["原生 kbd root", "abbr key", "content slot"],
  publicParts: ["view", "abbrView", "contentView"],
  states: ["default", "light"],
  slots: ["key abbreviation", "content"],
  heroUi: { version: "3.2.4", module: "kbd" },
  foldkit: { primitive: "原生 kbd、abbr、title" },
  examples: ["default", "light", "combination", "long-content"],
  differences: ["不引入 React Context；abbrView 与 contentView 显式组成同一 kbd 内容。"],
});

export const metadata: ReadonlyArray<ComponentMetadata> = [
  typographyMetadata,
  surfaceMetadata,
  separatorMetadata,
  labelMetadata,
  descriptionMetadata,
  headerMetadata,
  errorMessageMetadata,
  fieldErrorMetadata,
  kbdMetadata,
];
