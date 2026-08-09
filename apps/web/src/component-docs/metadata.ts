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

export const metadata: ReadonlyArray<ComponentMetadata> = [
  typographyMetadata,
  surfaceMetadata,
  separatorMetadata,
];
