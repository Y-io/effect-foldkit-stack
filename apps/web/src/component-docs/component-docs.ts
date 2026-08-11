import {
  Alert,
  Avatar,
  Badge,
  Card,
  Chip,
  Description,
  EmptyState,
  ErrorMessage,
  FieldError,
  Header,
  Kbd,
  Label,
  Meter,
  ProgressBar,
  ProgressCircle,
  Separator,
  Skeleton,
  ScrollShadow,
  Spinner,
  Surface,
  Typography,
} from "@pkg/ui";
import type {
  ImageConfig as AvatarImageConfig,
  ImageState as AvatarImageState,
} from "@pkg/ui/avatar";
import { Array, Option, Schema as S } from "effect";
import type { Html, HtmlBuilder } from "foldkit/html";

import {
  componentPartRouter,
  componentStandaloneRouter,
  componentsIndexRouter,
  componentsPartsRouter,
  componentsStandaloneRouter,
  routingHomeRouter,
  visualProtocolRouter,
} from "../route";
import {
  alertMetadata,
  avatarMetadata,
  badgeMetadata,
  type BehaviorClass,
  type Catalog,
  cardMetadata,
  chipMetadata,
  type ComponentMetadata,
  type Phase,
  type Status,
  descriptionMetadata,
  emptyStateMetadata,
  errorMessageMetadata,
  fieldErrorMetadata,
  headerMetadata,
  kbdMetadata,
  labelMetadata,
  meterMetadata,
  metadata,
  progressBarMetadata,
  progressCircleMetadata,
  scrollShadowMetadata,
  separatorMetadata,
  skeletonMetadata,
  spinnerMetadata,
  surfaceMetadata,
  typographyMetadata,
} from "./metadata";

/** 字段语义示例中由外层 Form Model 持有的内容阶段。 */
export const FieldExampleState = S.Literals(["Helper", "Validating", "Errors"]);
export type FieldExampleState = typeof FieldExampleState.Type;

/** Skeleton 文档示例中由外层 Model 持有的加载阶段。 */
export const SkeletonExampleState = S.Literals(["Loading", "Loaded"]);
export type SkeletonExampleState = typeof SkeletonExampleState.Type;

/** EmptyState 文档示例中由外层 Model 持有的内容阶段。 */
export const EmptyStateExampleState = S.Literals(["Empty", "Populated"]);
export type EmptyStateExampleState = typeof EmptyStateExampleState.Type;

/** Spinner 文档示例中由外层 Model 持有的加载阶段。 */
export const SpinnerExampleState = S.Literals(["Loading", "Loaded"]);
export type SpinnerExampleState = typeof SpinnerExampleState.Type;

/** Avatar 文档示例中由外层 Model 持有的图片与资源阶段。 */
export const AvatarExampleState = S.Literals([
  "Loading",
  "Loaded",
  "Failed",
  "Missing",
  "LoadingBroken",
]);
export type AvatarExampleState = typeof AvatarExampleState.Type;

/** ScrollShadow 文档示例中由 Foldkit Mount 观察到的边缘状态。 */
export const ScrollShadowExampleVisibility = S.Literals(["None", "Start", "End", "Both"]);
export type ScrollShadowExampleVisibility = typeof ScrollShadowExampleVisibility.Type;

type PartViewConfig<Message> = Readonly<{
  fieldExampleState: FieldExampleState;
  onFieldExampleStateChange: (state: FieldExampleState) => Message;
  recordedChipActionCount: number;
  onRecordChipAction: Message;
  skeletonExampleState: SkeletonExampleState;
  onSkeletonExampleStateChange: (state: SkeletonExampleState) => Message;
  verticalScrollShadowVisibility: ScrollShadowExampleVisibility;
  onVerticalScrollShadowVisibilityChange: (visibility: ScrollShadowExampleVisibility) => Message;
  horizontalScrollShadowVisibility: ScrollShadowExampleVisibility;
  onHorizontalScrollShadowVisibilityChange: (visibility: ScrollShadowExampleVisibility) => Message;
}>;

type StandaloneViewConfig<Message> = Readonly<{
  emptyStateExampleState: EmptyStateExampleState;
  emptyStateRetryCount: number;
  onEmptyStateRetry: Message;
  onEmptyStateExampleStateChange: (state: EmptyStateExampleState) => Message;
  progressExampleValue: number;
  onAdvanceProgressExample: Message;
  spinnerExampleState: SpinnerExampleState;
  onSpinnerExampleStateChange: (state: SpinnerExampleState) => Message;
  avatarExampleState: AvatarExampleState;
  onAvatarExampleStateChange: (state: AvatarExampleState) => Message;
}>;

const metadataRowView = <Message>(
  term: string,
  details: ReadonlyArray<string>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("grid gap-1 border-b border-separator py-3 sm:grid-cols-[12rem_1fr]")],
    [
      h.dt([h.Class("font-semibold text-foreground")], [term]),
      h.dd([h.Class("text-muted")], [details.join("、")]),
    ],
  );

const catalogLabel = (catalog: Catalog): string => (catalog === "parts" ? "Parts" : "Standalone");

const metadataView = <Message>(metadata: ComponentMetadata, h: HtmlBuilder<Message>): Html =>
  h.section(
    [h.Class("mt-8")],
    [
      h.h2([h.Class("text-2xl font-semibold text-foreground")], ["分类与阶段"]),
      h.dl(
        [h.Class("mt-4")],
        [
          metadataRowView("Catalog", [catalogLabel(metadata.catalog)], h),
          metadataRowView("Phase", [String(metadata.phase)], h),
          metadataRowView("Class", [metadata.behaviorClass], h),
          metadataRowView("Behavior Authority", [metadata.behaviorAuthority], h),
          metadataRowView("Status", [metadata.status], h),
          metadataRowView("Family", [metadata.family], h),
          metadataRowView("依赖", metadata.dependencies, h),
          metadataRowView("状态", metadata.states, h),
          metadataRowView("Public parts", metadata.publicParts, h),
          metadataRowView("Slots / renderers", metadata.slots, h),
          metadataRowView(
            "HeroUI 视觉来源",
            [`${metadata.heroUi.module}@${metadata.heroUi.version}`],
            h,
          ),
          metadataRowView("Foldkit 行为来源", [metadata.foldkit.primitive], h),
          metadataRowView("Example IDs", metadata.examples, h),
        ],
      ),
    ],
  );

const exampleView = <Message>(
  title: string,
  content: ReadonlyArray<Html>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("rounded-2xl border border-border bg-surface p-6 shadow-surface")],
    [h.h3([h.Class("mb-4 text-lg font-semibold text-foreground")], [title]), ...content],
  );

const documentationSectionView = <Message>(
  title: string,
  content: ReadonlyArray<Html | string>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("mt-8")],
    [h.h2([h.Class("text-2xl font-semibold text-foreground")], [title]), ...content],
  );

type PageDocumentation = Readonly<{
  summary: string;
  usage: string;
  avoidance: string;
  behavior: string;
  visual: string;
  api: string;
  keyboardAndFocus: string;
  aria: string;
  examples: ReadonlyArray<Html>;
}>;

const componentPageView = <Message>(
  metadata: ComponentMetadata,
  documentation: PageDocumentation,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [],
    [
      Typography.view({ content: metadata.name, type: "h1" }, h),
      Typography.view({ content: documentation.summary, color: "muted" }, h),
      documentationSectionView(
        "概览",
        [
          h.p([h.Class("mt-3 text-foreground")], [documentation.usage]),
          h.p([h.Class("mt-2 text-muted")], [documentation.avoidance]),
        ],
        h,
      ),
      metadataView(metadata, h),
      documentationSectionView(
        "Anatomy",
        [h.p([h.Class("mt-3 text-muted")], [metadata.anatomy.join("、")])],
        h,
      ),
      documentationSectionView(
        "Behavior Authority",
        [h.p([h.Class("mt-3 text-muted")], [documentation.behavior])],
        h,
      ),
      documentationSectionView(
        "HeroUI 视觉映射",
        [h.p([h.Class("mt-3 text-muted")], [documentation.visual])],
        h,
      ),
      documentationSectionView(
        "API 与内容自定义",
        [h.p([h.Class("mt-3 text-muted")], [documentation.api])],
        h,
      ),
      documentationSectionView(
        "示例与 Scene",
        [h.div([h.Class("mt-4 grid gap-5")], documentation.examples)],
        h,
      ),
      documentationSectionView(
        "键盘与焦点",
        [h.p([h.Class("mt-3 text-muted")], [documentation.keyboardAndFocus])],
        h,
      ),
      documentationSectionView(
        "ARIA 与语义",
        [h.p([h.Class("mt-3 text-muted")], [documentation.aria])],
        h,
      ),
      documentationSectionView(
        "与 HeroUI 的已知差异",
        [h.p([h.Class("mt-3 text-muted")], [metadata.differences.join("、")])],
        h,
      ),
      documentationSectionView(
        "验收状态",
        [
          h.p(
            [h.Class("mt-3 text-muted")],
            [
              `${metadata.status}。Foldkit Scene 覆盖公开语义与 variants；Playwright 覆盖 light/dark、计算样式、方向和 reduced motion。`,
            ],
          ),
        ],
        h,
      ),
    ],
  );

const typographyPageView = <Message>(h: HtmlBuilder<Message>): Html =>
  componentPageView(
    typographyMetadata,
    {
      summary: "以原生文本语义为 Behavior Authority，投射 HeroUI 的排版视觉。",
      usage: "用于标题、正文、辅助文本、code 与调用方拥有语义结构的 prose 内容。",
      avoidance: "不用于表达交互、状态或可点击行为；这些职责应交给对应 Standalone。",
      behavior:
        "原生 h1-h6、p、code 与 div 是唯一语义来源。组件没有 Model、Message 或 OutMessage，也不持有受控状态。",
      visual:
        "type 映射 HeroUI 的 h1-h6、body、body-sm、body-xs 与 code；align、color、weight、truncate 原样进入 typographyVariants。",
      api: "view 接收调用方 content 与可选原生 attributes；proseView 接收调用方拥有的完整语义内容数组。className 是唯一视觉扩展入口。",
      keyboardAndFocus: "Typography 不产生可聚焦元素，Tab、方向键、激活与焦点恢复均不适用。",
      aria: "标题层级和文本语义来自真实原生元素；组件不添加 role、accessible name 或 ARIA relationships。",
      examples: [
        exampleView(
          "默认与语义层级",
          [
            Typography.view({ content: "语义标题示例", type: "h2" }, h),
            Typography.view({ content: "默认正文使用原生段落元素。" }, h),
            Typography.view({ content: "较小的辅助正文。", type: "body-sm", color: "muted" }, h),
          ],
          h,
        ),
        exampleView(
          "完整 type 矩阵",
          [
            Typography.view({ content: "三级标题变体", type: "h3" }, h),
            Typography.view({ content: "四级标题变体", type: "h4" }, h),
            Typography.view({ content: "五级标题变体", type: "h5" }, h),
            Typography.view({ content: "六级标题变体", type: "h6" }, h),
            Typography.view({ content: "Body type 变体", type: "body" }, h),
            Typography.view({ content: "Body sm type 变体", type: "body-sm" }, h),
            Typography.view({ content: "Body xs type 变体", type: "body-xs" }, h),
            Typography.view({ content: "const authority = 'native';", type: "code" }, h),
          ],
          h,
        ),
        exampleView(
          "align、weight 与 color 矩阵",
          [
            Typography.view({ content: "Align start", align: "start" }, h),
            Typography.view({ content: "Align center", align: "center" }, h),
            Typography.view({ content: "Align end", align: "end" }, h),
            Typography.view(
              {
                content: "Align justify 使用足够长的内容验证两端对齐视觉。",
                align: "justify",
              },
              h,
            ),
            Typography.view({ content: "Weight normal", weight: "normal" }, h),
            Typography.view({ content: "Weight medium", weight: "medium" }, h),
            Typography.view({ content: "Weight semibold", weight: "semibold" }, h),
            Typography.view({ content: "Weight bold", weight: "bold" }, h),
            Typography.view({ content: "Color default", color: "default" }, h),
            Typography.view({ content: "Color muted", color: "muted" }, h),
          ],
          h,
        ),
        exampleView(
          "边界场景",
          [
            h.div(
              [h.Class("max-w-64")],
              [
                Typography.view(
                  {
                    content: "这是一段用于验证窄容器截断表现的长文本内容",
                    truncate: true,
                  },
                  h,
                ),
              ],
            ),
            Typography.view(
              {
                content: "本组件没有受控状态；内容始终由调用方拥有。",
                type: "body-xs",
                color: "muted",
              },
              h,
            ),
          ],
          h,
        ),
        exampleView(
          "Prose 内容",
          [
            Typography.proseView(
              {
                content: [
                  h.h3([], ["调用方拥有的 prose 标题"]),
                  h.p([], ["proseView 只为既有语义结构提供统一排版。"]),
                ],
              },
              h,
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const surfaceSampleView = <Message>(
  title: string,
  variant: "default" | "secondary" | "tertiary" | "transparent",
  h: HtmlBuilder<Message>,
): Html =>
  Surface.view(
    {
      variant,
      className: "rounded-2xl border border-border p-5",
      attributes: [h.Role("region"), h.AriaLabel(title)],
      content: [
        Typography.view({ content: title, type: "h3" }, h),
        Typography.view({ content: "调用方拥有 Surface 内的内容与语义。", color: "muted" }, h),
      ],
    },
    h,
  );

const surfacePageView = <Message>(h: HtmlBuilder<Message>): Html =>
  componentPageView(
    surfaceMetadata,
    {
      summary: "无状态容器只投射 HeroUI 表面 token。",
      usage: "用于为调用方内容提供 default、secondary、tertiary 或 transparent 的视觉层级。",
      avoidance: "不用于创建交互边界、Context 或隐式状态传播。",
      behavior:
        "调用方拥有 Surface 内的全部内容、语义与 attributes。Surface 没有 Model、Message、OutMessage 或 Context。",
      visual:
        "variant 直接映射 HeroUI surfaceVariants；背景与前景只消费 surface、surface-secondary、surface-tertiary 及对应 foreground token。",
      api: "content 接收调用方 markup；attributes 保留调用方原生语义和事件；className 只扩展视觉，不改变内容所有权。",
      keyboardAndFocus: "Surface 默认不可聚焦，不创建 focus scope，也不改变后代的 Tab 或焦点行为。",
      aria: "默认 div 没有隐式 role；调用方可通过 attributes 在同一原生节点上提供所需 role、name 与 relationships。",
      examples: [
        exampleView(
          "默认与变体",
          [
            h.div(
              [h.Class("grid gap-4 md:grid-cols-2")],
              [
                surfaceSampleView("Default Surface", "default", h),
                surfaceSampleView("Secondary Surface", "secondary", h),
                surfaceSampleView("Tertiary Surface", "tertiary", h),
                surfaceSampleView("Transparent Surface", "transparent", h),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "内容自定义与边界",
          [
            Surface.view(
              {
                variant: "secondary",
                className: "max-w-sm rounded-2xl p-5",
                attributes: [h.Role("region"), h.AriaLabel("自定义内容 Surface")],
                content: [
                  h.article(
                    [],
                    [
                      h.h3([h.Class("font-semibold")], ["调用方文章语义"]),
                      h.p(
                        [h.Class("mt-2 text-muted")],
                        ["长内容和窄容器不会改变 Surface 的职责。"],
                      ),
                    ],
                  ),
                ],
              },
              h,
            ),
            Typography.view(
              {
                content: "本组件没有受控状态；变体由调用方配置。",
                type: "body-xs",
                color: "muted",
              },
              h,
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const separatorPageView = <Message>(h: HtmlBuilder<Message>): Html =>
  componentPageView(
    separatorMetadata,
    {
      summary: "原生 separator 语义与 HeroUI 视觉保持同一 DOM 节点。",
      usage: "用于表达内容区块之间的视觉与语义分隔。",
      avoidance:
        "不用于可拖拽 split pane；需要交互调节时应使用拥有独立 Behavior Authority 的组件。",
      behavior:
        "原生 role=separator 与 aria-orientation 是唯一语义来源。Separator 没有 Model、Message、OutMessage 或受控值。",
      visual:
        "orientation 映射 horizontal/vertical 几何；variant 映射 separator、separator-secondary、separator-tertiary token。",
      api: "attributes 在真实 separator 节点保留调用方原生属性；className 扩展布局。组件没有 content slot。",
      keyboardAndFocus: "静态 Separator 不可聚焦，键盘移动、激活和焦点恢复不适用。",
      aria: "真实节点固定具有 role=separator，并将 orientation 同步到 aria-orientation 与 data-orientation。",
      examples: [
        exampleView(
          "默认与变体",
          [
            Typography.view({ content: "Default" }, h),
            Separator.view({ attributes: [h.AriaLabel("Default Separator")] }, h),
            Typography.view({ content: "Secondary" }, h),
            Separator.view(
              { variant: "secondary", attributes: [h.AriaLabel("Secondary Separator")] },
              h,
            ),
            Typography.view({ content: "Tertiary" }, h),
            Separator.view(
              { variant: "tertiary", attributes: [h.AriaLabel("Tertiary Separator")] },
              h,
            ),
          ],
          h,
        ),
        exampleView(
          "垂直方向边界",
          [
            h.div(
              [h.Class("flex h-16 items-stretch gap-4")],
              [
                Typography.view({ content: "左侧", type: "body-sm" }, h),
                Separator.view(
                  { orientation: "vertical", attributes: [h.AriaLabel("Vertical Separator")] },
                  h,
                ),
                Typography.view({ content: "右侧", type: "body-sm" }, h),
              ],
            ),
            Typography.view(
              {
                content: "Separator 没有受控状态或内容 slot。",
                type: "body-xs",
                color: "muted",
              },
              h,
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const labelPageView = <Message>(h: HtmlBuilder<Message>): Html =>
  componentPageView(
    labelMetadata,
    {
      summary: "保留原生 label 关系，只投射 HeroUI 字段标签视觉。",
      usage: "用于为表单控件提供稳定的可访问名称，并呈现 required、disabled 与 invalid 外观。",
      avoidance: "不用于替代字段状态或自动推断目标控件；for/id relationship 始终由调用方拥有。",
      behavior:
        "真实 label 元素及调用方提供的 for/id 是唯一 Behavior Authority。Label 没有 Model、Message 或校验状态。",
      visual:
        "isRequired、isDisabled 与 isInvalid 只映射 HeroUI labelVariants，不向字段复制 required、disabled 或 invalid 语义。",
      api: "content 提供标签内容；attributes 原样落在真实 label；className 是唯一视觉扩展入口。",
      keyboardAndFocus:
        "Label 不进入 Tab 顺序；原生 label 激活和焦点转移行为由浏览器与目标控件决定。",
      aria: "accessible name 来自原生 label relationship；Label 不生成 aria-label 或第二份字段状态。",
      examples: [
        exampleView(
          "默认关系",
          [
            h.div(
              [h.Class("grid max-w-sm gap-2")],
              [
                Label.view({ content: "项目名称", attributes: [h.For("label-project-name")] }, h),
                h.input([h.Id("label-project-name"), h.Type("text")]),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "必填与长内容",
          [
            h.div(
              [h.Class("grid max-w-sm gap-2")],
              [
                Label.view(
                  {
                    content: "必填项目",
                    isRequired: true,
                    attributes: [h.For("label-required-project")],
                  },
                  h,
                ),
                h.input([h.Id("label-required-project"), h.Type("text"), h.Required(true)]),
                Label.view(
                  {
                    content: "较长的字段标签内容仍由调用方完整拥有并保持原生关系",
                    attributes: [h.For("label-long-project")],
                  },
                  h,
                ),
                h.input([h.Id("label-long-project"), h.Type("text")]),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "Invalid 与 disabled",
          [
            h.div(
              [h.Class("grid max-w-sm gap-2")],
              [
                Label.view(
                  {
                    content: "无效项目",
                    isInvalid: true,
                    attributes: [h.For("label-invalid-project")],
                  },
                  h,
                ),
                h.input([h.Id("label-invalid-project"), h.Type("text"), h.AriaInvalid(true)]),
                Label.view(
                  {
                    content: "禁用项目",
                    isDisabled: true,
                    attributes: [h.For("label-disabled-project")],
                  },
                  h,
                ),
                h.input([h.Id("label-disabled-project"), h.Type("text"), h.Disabled(true)]),
              ],
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const fieldExampleDescriptionContent = <Message>(
  state: FieldExampleState,
  h: HtmlBuilder<Message>,
): ReadonlyArray<string | Html> => {
  if (state === "Helper") {
    return ["请输入唯一的工作区标识。"];
  } else if (state === "Validating") {
    return ["正在检查标识是否可用。"];
  } else {
    return [ErrorMessage.view({ content: ["此工作区标识已被使用。"] }, h)];
  }
};

const descriptionPageView = <Message>(
  config: PartViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const descriptionContent = fieldExampleDescriptionContent(config.fieldExampleState, h);

  return componentPageView(
    descriptionMetadata,
    {
      summary: "以稳定容器呈现字段说明，并保留原生 aria-describedby relationship。",
      usage:
        "用于 Field Anatomy 的唯一 Description Channel，可承载 helper、validating 或 errors 内容。",
      avoidance: "不用于创建第二个描述 id，也不根据内容自行挂载或卸载字段容器。",
      behavior:
        "调用方提供的 id 与控件 aria-describedby 是唯一 Behavior Authority。Description 没有 Model、Message 或内容切换状态。",
      visual: "内容只映射 HeroUI descriptionVariants 的字号、换行与 muted token。",
      api: "content 可为空以保留稳定容器；attributes 原样保留 id；className 只扩展视觉。",
      keyboardAndFocus: "Description 不可聚焦，不增加键盘路径或焦点行为。",
      aria: "Description 不自行修改控件 ARIA；调用方在真实控件上提供 aria-describedby。",
      examples: [
        exampleView(
          "受控 Description Channel",
          [
            h.div(
              [h.Class("grid max-w-sm gap-2")],
              [
                Label.view(
                  {
                    content: "工作区标识",
                    attributes: [h.For("description-workspace-slug")],
                    isInvalid: config.fieldExampleState === "Errors",
                  },
                  h,
                ),
                h.input([
                  h.Id("description-workspace-slug"),
                  h.Type("text"),
                  h.AriaInvalid(config.fieldExampleState === "Errors"),
                  h.AriaDescribedBy("description-workspace-slug-description"),
                ]),
                Description.view(
                  {
                    content: descriptionContent,
                    attributes: [h.Id("description-workspace-slug-description")],
                  },
                  h,
                ),
                h.div(
                  [h.Class("flex flex-wrap gap-2")],
                  [
                    h.button(
                      [h.Type("button"), h.OnClick(config.onFieldExampleStateChange("Helper"))],
                      ["显示帮助"],
                    ),
                    h.button(
                      [h.Type("button"), h.OnClick(config.onFieldExampleStateChange("Validating"))],
                      ["显示校验中"],
                    ),
                    h.button(
                      [h.Type("button"), h.OnClick(config.onFieldExampleStateChange("Errors"))],
                      ["显示错误"],
                    ),
                  ],
                ),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "稳定 Description Channel",
          [
            h.div(
              [h.Class("grid max-w-sm gap-2")],
              [
                Label.view(
                  { content: "团队名称", attributes: [h.For("description-team-input")] },
                  h,
                ),
                h.input([
                  h.Id("description-team-input"),
                  h.Type("text"),
                  h.AriaDescribedBy("description-team-name"),
                ]),
                Description.view(
                  {
                    content: ["这会显示在团队主页。"],
                    attributes: [h.Id("description-team-name")],
                  },
                  h,
                ),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "空容器与长内容",
          [
            Description.view({ content: [], attributes: [h.Id("description-stable-empty")] }, h),
            Description.view(
              {
                content: [
                  "较长的说明内容会自然换行，但不会改变 Description Channel 的 id 或字段语义所有权。",
                ],
                attributes: [h.Id("description-long-content")],
              },
              h,
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );
};

const headerPageView = <Message>(h: HtmlBuilder<Message>): Html =>
  componentPageView(
    headerMetadata,
    {
      summary: "提供原生 header 容器，标题层级与内容语义继续由调用方拥有。",
      usage: "用于集合或内容区块的标题位置，并投射 HeroUI Header 的间距与排版。",
      avoidance: "不用于自动创建 heading level、集合状态或导航行为。",
      behavior:
        "原生 header 与调用方提供的 heading 是唯一 Behavior Authority。Header 没有 Model、Message 或集合状态。",
      visual: "Header 只映射 HeroUI headerVariants 的宽度、间距、对齐、字号与 muted token。",
      api: "content 接收完整语义内容；attributes 落在真实 header；className 只扩展视觉。",
      keyboardAndFocus: "Header 默认不可聚焦，不增加键盘或焦点路径。",
      aria: "组件不推断 heading level 或 landmark name；需要的语义由调用方内容与 attributes 提供。",
      examples: [
        exampleView(
          "调用方拥有标题层级",
          [
            Header.view(
              {
                content: [
                  h.h3([h.Class("text-sm font-semibold text-foreground")], ["收件箱"]),
                  h.p([h.Class("mt-1")], ["12 条未读消息"]),
                ],
              },
              h,
            ),
          ],
          h,
        ),
        exampleView(
          "长内容边界",
          [
            Header.view(
              {
                content: [
                  h.h3(
                    [h.Class("text-sm font-semibold text-foreground")],
                    ["较长的集合标题仍保留调用方选择的语义层级并自然换行"],
                  ),
                ],
                className: "max-w-xs",
              },
              h,
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const errorMessagePageView = <Message>(h: HtmlBuilder<Message>): Html =>
  componentPageView(
    errorMessageMetadata,
    {
      summary: "只呈现调用方给出的校验事实，并投射 HeroUI 错误视觉。",
      usage: "用于把外层 Form Model 已确定的错误内容放入既有描述关系。",
      avoidance: "不用于运行校验、保存 errors、推断 invalid 或创建 live region。",
      behavior:
        "外层 Form Model、控件 aria-invalid 与 aria-describedby 是唯一 Behavior Authority。ErrorMessage 没有 Model、Message 或校验生命周期。",
      visual:
        "消息只映射 HeroUI errorMessageVariants 的 danger token、字号、换行与 reduced motion。",
      api: "content 接收外部错误事实；attributes 保留 id 与调用方语义；className 只扩展视觉。",
      keyboardAndFocus: "ErrorMessage 不可聚焦，也不移动或恢复焦点。",
      aria: "组件不自动添加 alert、live region 或 aria-invalid；描述 relationship 由真实控件提供。",
      examples: [
        exampleView(
          "外部校验事实",
          [
            h.div(
              [h.Class("grid max-w-sm gap-2")],
              [
                Label.view(
                  { content: "账户名称", attributes: [h.For("error-message-account")] },
                  h,
                ),
                h.input([
                  h.Id("error-message-account"),
                  h.Type("text"),
                  h.AriaInvalid(true),
                  h.AriaDescribedBy("error-message-account-description"),
                ]),
                ErrorMessage.view(
                  {
                    content: ["此名称已被使用。"],
                    attributes: [h.Id("error-message-account-description")],
                  },
                  h,
                ),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "长错误内容",
          [
            ErrorMessage.view(
              {
                content: ["错误内容可以换行，但校验事实、显示时机和描述 id 始终由外层字段拥有。"],
              },
              h,
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const fieldErrorPageView = <Message>(
  config: PartViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const isVisible = config.fieldExampleState === "Errors";

  return componentPageView(
    fieldErrorMetadata,
    {
      summary: "在稳定 Description Channel 中呈现外层 Form Model 提供的字段错误。",
      usage:
        "用于 Field Anatomy 中需要稳定 id 的错误容器，内容可由 helper、validating 或 errors 替换。",
      avoidance: "不用于保存错误数组、执行校验、复制 invalid 状态或创建第二个 description。",
      behavior:
        "外层 Form Model 持有错误事实，控件 aria-describedby 维持 relationship。FieldError 只呈现内容，没有 Model、Message 或校验生命周期。",
      visual: "容器只映射 HeroUI fieldErrorVariants 的 danger token、显隐过渡与 reduced motion。",
      api: "content 可为空并由外层替换；isVisible 只接收外层已经确定的错误可见性；attributes 保留稳定 id；className 只扩展视觉。",
      keyboardAndFocus: "FieldError 不可聚焦，也不改变字段的 Tab 或焦点行为。",
      aria: "组件不添加 aria-invalid 或 live region；真实控件继续拥有状态与 aria-describedby。",
      examples: [
        exampleView(
          "外部控制的稳定字段错误",
          [
            h.div(
              [h.Class("grid max-w-sm gap-2")],
              [
                Label.view(
                  {
                    content: "密码",
                    isInvalid: isVisible,
                    attributes: [h.For("field-error-password")],
                  },
                  h,
                ),
                h.input([
                  h.Id("field-error-password"),
                  h.Type("password"),
                  h.AriaInvalid(isVisible),
                  h.AriaDescribedBy("field-error-password-description"),
                ]),
                FieldError.view(
                  {
                    content: isVisible ? ["长度至少为 8 个字符。必须包含数字。"] : [],
                    isVisible,
                    attributes: [h.Id("field-error-password-description")],
                  },
                  h,
                ),
                h.div(
                  [h.Class("flex flex-wrap gap-2")],
                  [
                    h.button(
                      [h.Type("button"), h.OnClick(config.onFieldExampleStateChange("Errors"))],
                      ["显示字段错误"],
                    ),
                    h.button(
                      [h.Type("button"), h.OnClick(config.onFieldExampleStateChange("Helper"))],
                      ["隐藏字段错误"],
                    ),
                  ],
                ),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "稳定空容器",
          [
            FieldError.view({ content: [], attributes: [h.Id("field-error-stable-empty")] }, h),
            Typography.view(
              {
                content: "外层 Field 只替换内容，不替换容器 id。",
                type: "body-xs",
                color: "muted",
              },
              h,
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );
};

const kbdPageView = <Message>(h: HtmlBuilder<Message>): Html =>
  componentPageView(
    kbdMetadata,
    {
      summary: "使用原生 kbd 与 abbr 表达键盘提示，并投射 HeroUI 视觉。",
      usage: "用于在说明文字、菜单或操作提示中展示单键、组合键和文本键名。",
      avoidance: "不用于监听键盘、派发 Message 或声明真实快捷键绑定。",
      behavior:
        "原生 kbd、abbr title 与调用方内容是唯一 Behavior Authority。Kbd 没有 Model、Message 或快捷键状态。",
      visual:
        "variant 映射 HeroUI kbdVariants 的 default 与 light，abbr 和 content 使用对应 slot。",
      api: "view 提供 kbd root；abbrView 接收受限 KbdKey；contentView 接收调用方文本；各层 attributes 原样保留。",
      keyboardAndFocus: "Kbd 是静态提示，不进入 Tab 顺序，也不拦截任何按键。",
      aria: "真实 kbd 表达键盘输入；每个符号通过 abbr title 提供完整键名，组合键名称可由调用方 attributes 补充。",
      examples: [
        exampleView(
          "组合键",
          [
            Kbd.view(
              {
                attributes: [h.AriaLabel("打开命令面板快捷键")],
                content: [
                  Kbd.abbrView({ keyValue: "command" }, h),
                  Kbd.abbrView({ keyValue: "shift" }, h),
                  Kbd.contentView({ content: "K" }, h),
                ],
              },
              h,
            ),
          ],
          h,
        ),
        exampleView(
          "Light 与长文本",
          [
            Kbd.view(
              {
                variant: "light",
                attributes: [h.AriaLabel("长文本快捷键提示")],
                content: [Kbd.contentView({ content: "COMMAND-PALETTE" }, h)],
              },
              h,
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const badgeAnchorTargetView = <Message>(content: string, h: HtmlBuilder<Message>): Html =>
  h.span(
    [
      h.AriaHidden(true),
      h.Class(
        "inline-flex size-12 items-center justify-center rounded-full bg-surface-secondary text-xs text-foreground",
      ),
    ],
    [content],
  );

const badgePageView = <Message>(h: HtmlBuilder<Message>): Html =>
  componentPageView(
    badgeMetadata,
    {
      summary: "呈现 HeroUI Badge 视觉，同时让状态语义与更新时机继续由调用方拥有。",
      usage: "用于数量、状态或分类等短标签，也可通过 anchor 与 placement 附着到已有内容。",
      avoidance: "不用于保存计数、创建 live region 或根据业务状态自行显示与隐藏。",
      behavior:
        "原生 span 与调用方 attributes 是唯一 Behavior Authority。Badge 没有 Model、Message 或状态订阅。",
      visual:
        "color、variant、size 与 placement 直接映射 HeroUI badgeVariants；anchor、root 与 label 保持公开 anatomy。",
      api: "view 呈现 root；labelView 呈现 label slot；anchorView 提供相对定位容器。三者都原样保留调用方 attributes。",
      keyboardAndFocus:
        "Badge 默认不可聚焦，不增加键盘路径；若调用方内容可交互，其行为属于该真实控件。",
      aria: "Badge 不自动添加 status、alert 或 aria-live。需要播报的状态由调用方显式提供 role 与 accessible name。",
      examples: [
        exampleView(
          "调用方拥有的状态语义",
          [
            Badge.anchorView(
              {
                attributes: [h.AriaLabel("未读通知 Badge anchor")],
                content: [
                  badgeAnchorTargetView("IN", h),
                  Badge.view(
                    {
                      color: "accent",
                      variant: "primary",
                      attributes: [h.Role("status"), h.AriaLabel("3 条未读通知")],
                      content: [Badge.labelView({ content: "3" }, h)],
                    },
                    h,
                  ),
                ],
              },
              h,
            ),
          ],
          h,
        ),
        exampleView(
          "Color 与 variant",
          [
            h.div(
              [h.Class("flex flex-wrap items-center gap-3")],
              [
                Badge.anchorView(
                  {
                    content: [
                      badgeAnchorTargetView("A", h),
                      Badge.view(
                        {
                          color: "accent",
                          variant: "soft",
                          attributes: [h.AriaLabel("Accent soft Badge")],
                          content: [Badge.labelView({ content: "New" }, h)],
                        },
                        h,
                      ),
                    ],
                  },
                  h,
                ),
                Badge.anchorView(
                  {
                    content: [
                      badgeAnchorTargetView("S", h),
                      Badge.view(
                        {
                          color: "success",
                          variant: "primary",
                          attributes: [h.AriaLabel("Success primary Badge")],
                          content: [Badge.labelView({ content: "Success" }, h)],
                        },
                        h,
                      ),
                    ],
                  },
                  h,
                ),
                Badge.anchorView(
                  {
                    content: [
                      badgeAnchorTargetView("W", h),
                      Badge.view(
                        {
                          color: "warning",
                          variant: "secondary",
                          attributes: [h.AriaLabel("Warning secondary Badge")],
                          content: [Badge.labelView({ content: "Warning" }, h)],
                        },
                        h,
                      ),
                    ],
                  },
                  h,
                ),
                Badge.anchorView(
                  {
                    content: [
                      badgeAnchorTargetView("D", h),
                      Badge.view(
                        {
                          color: "danger",
                          variant: "soft",
                          attributes: [h.AriaLabel("Danger soft Badge")],
                          content: [Badge.labelView({ content: "Danger" }, h)],
                        },
                        h,
                      ),
                    ],
                  },
                  h,
                ),
                Badge.anchorView(
                  {
                    content: [
                      badgeAnchorTargetView("D", h),
                      Badge.view(
                        {
                          color: "default",
                          variant: "primary",
                          attributes: [h.AriaLabel("Default primary Badge")],
                          content: [Badge.labelView({ content: "Default" }, h)],
                        },
                        h,
                      ),
                    ],
                  },
                  h,
                ),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "Size、placement 与长内容",
          [
            h.div(
              [h.Class("flex flex-wrap items-center gap-8")],
              [
                Badge.anchorView(
                  {
                    attributes: [h.AriaLabel("Badge top-right anchor")],
                    content: [
                      badgeAnchorTargetView("TR", h),
                      Badge.view(
                        {
                          color: "danger",
                          placement: "top-right",
                          size: "sm",
                          attributes: [h.AriaLabel("Badge top-right small")],
                          content: [Badge.labelView({ content: "3" }, h)],
                        },
                        h,
                      ),
                    ],
                  },
                  h,
                ),
                Badge.anchorView(
                  {
                    attributes: [h.AriaLabel("Badge top-left anchor")],
                    content: [
                      badgeAnchorTargetView("TL", h),
                      Badge.view(
                        {
                          color: "success",
                          placement: "top-left",
                          attributes: [h.AriaLabel("Badge top-left medium")],
                          content: [Badge.labelView({ content: "TL" }, h)],
                        },
                        h,
                      ),
                    ],
                  },
                  h,
                ),
                Badge.anchorView(
                  {
                    attributes: [h.AriaLabel("Badge bottom-right anchor")],
                    content: [
                      badgeAnchorTargetView("BR", h),
                      Badge.view(
                        {
                          color: "warning",
                          placement: "bottom-right",
                          attributes: [h.AriaLabel("Badge bottom-right medium")],
                          content: [Badge.labelView({ content: "BR" }, h)],
                        },
                        h,
                      ),
                    ],
                  },
                  h,
                ),
                Badge.anchorView(
                  {
                    attributes: [h.AriaLabel("Badge bottom-left anchor")],
                    content: [
                      badgeAnchorTargetView("BL", h),
                      Badge.view(
                        {
                          color: "accent",
                          placement: "bottom-left",
                          size: "lg",
                          variant: "secondary",
                          attributes: [h.AriaLabel("Badge bottom-left large")],
                          content: [Badge.labelView({ content: "较长的徽标内容" }, h)],
                        },
                        h,
                      ),
                    ],
                  },
                  h,
                ),
              ],
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const chipPageView = <Message>(config: PartViewConfig<Message>, h: HtmlBuilder<Message>): Html =>
  componentPageView(
    chipMetadata,
    {
      summary: "提供 HeroUI Chip 的无状态内容视觉，所有交互继续由调用方真实控件拥有。",
      usage: "用于短标签、分类或带有调用方 action 的紧凑内容。",
      avoidance: "不用于复制删除、选择或 pressed 行为，也不把整个 Chip 伪装成按钮。",
      behavior:
        "Chip 只呈现 span anatomy。示例中的记录动作来自调用方 button 和父级 Message，组件自身没有 Model、Message 或事件。",
      visual:
        "color、variant 与 size 直接映射 HeroUI chipVariants；label slot 和 root 保持独立视觉扩展入口。",
      api: "view 接收完整调用方内容；labelView 映射 label slot。交互内容必须是调用方创建并命名的真实控件。",
      keyboardAndFocus:
        "Chip root 默认不可聚焦。嵌入的真实 button 保留自己的 Tab、Enter、Space 与焦点视觉。",
      aria: "Chip 不生成 role、selected、pressed 或 disabled。交互控件必须保留自己的 accessible name 与状态。",
      examples: [
        exampleView(
          "调用方 Action 与 Message",
          [
            h.div(
              [h.Class("flex flex-wrap items-center gap-3")],
              [
                Chip.view(
                  {
                    color: "accent",
                    variant: "soft",
                    attributes: [h.AriaLabel("TypeScript action Chip")],
                    content: [
                      Chip.labelView({ content: "TypeScript" }, h),
                      h.button(
                        [
                          h.Type("button"),
                          h.AriaLabel("记录 TypeScript 标签操作"),
                          h.OnClick(config.onRecordChipAction),
                          h.Class(
                            "rounded-full px-1 text-current focus-visible:outline focus-visible:outline-2",
                          ),
                        ],
                        ["×"],
                      ),
                    ],
                  },
                  h,
                ),
                h.output([], [`已记录标签操作 ${config.recordedChipActionCount} 次`]),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "Color 与 variant",
          [
            h.div(
              [h.Class("flex flex-wrap gap-3")],
              [
                Chip.view(
                  {
                    color: "default",
                    variant: "secondary",
                    attributes: [h.AriaLabel("Default secondary Chip")],
                    content: [Chip.labelView({ content: "Default" }, h)],
                  },
                  h,
                ),
                Chip.view(
                  {
                    color: "accent",
                    variant: "primary",
                    attributes: [h.AriaLabel("Accent primary Chip")],
                    content: [Chip.labelView({ content: "Accent" }, h)],
                  },
                  h,
                ),
                Chip.view(
                  {
                    color: "success",
                    variant: "soft",
                    attributes: [h.AriaLabel("Success soft Chip")],
                    content: [Chip.labelView({ content: "Success" }, h)],
                  },
                  h,
                ),
                Chip.view(
                  {
                    color: "warning",
                    variant: "tertiary",
                    attributes: [h.AriaLabel("Warning tertiary Chip")],
                    content: [Chip.labelView({ content: "Warning" }, h)],
                  },
                  h,
                ),
                Chip.view(
                  {
                    color: "danger",
                    variant: "primary",
                    attributes: [h.AriaLabel("Danger primary Chip")],
                    content: [Chip.labelView({ content: "Danger" }, h)],
                  },
                  h,
                ),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "Size、radius 与长文本",
          [
            h.div(
              [h.Class("flex flex-wrap items-center gap-3")],
              [
                Chip.view(
                  {
                    size: "sm",
                    attributes: [h.AriaLabel("Small Chip")],
                    content: [Chip.labelView({ content: "Small" }, h)],
                  },
                  h,
                ),
                Chip.view(
                  {
                    size: "md",
                    className: "rounded-sm",
                    attributes: [h.AriaLabel("Medium square Chip")],
                    content: [Chip.labelView({ content: "Medium square" }, h)],
                  },
                  h,
                ),
                Chip.view(
                  {
                    size: "lg",
                    attributes: [h.AriaLabel("Large long-content Chip")],
                    content: [
                      Chip.labelView({ content: "较长的 Chip 内容仍保持完整调用方文本" }, h),
                    ],
                  },
                  h,
                ),
              ],
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const cardPageView = <Message>(h: HtmlBuilder<Message>): Html =>
  componentPageView(
    cardMetadata,
    {
      summary: "提供 HeroUI Card anatomy 与表面视觉，同时保留调用方的内容和原生语义。",
      usage:
        "用于组织标题、说明、主体与页脚等嵌套内容，可由调用方赋予 landmark 与 accessible name。",
      avoidance: "不用于引入卡片选择、点击、展开或导航行为，也不传播隐藏 Context。",
      behavior:
        "Card 的真实 div、heading、p 和调用方 attributes 是唯一 Behavior Authority。组件没有 Model、Message 或交互状态。",
      visual:
        "variant 映射 HeroUI cardVariants；header、title、description、content 与 footer 分别映射官方 slots。",
      api: "view 组合完整 anatomy；titleView 允许调用方选择 h1-h6 或 p；其他 slot view 保留 attributes 与 className。",
      keyboardAndFocus:
        "Card anatomy 默认不进入 Tab 顺序。调用方放入的 link、button 或其他控件保留自己的键盘与焦点行为。",
      aria: "Card 不自动添加 region、group 或 accessible name；landmark 与标题关系由调用方显式提供。",
      examples: [
        exampleView(
          "完整 anatomy 与调用方语义",
          [
            Card.view(
              {
                attributes: [h.Role("region"), h.AriaLabel("项目摘要卡片")],
                className: "max-w-md",
                content: [
                  Card.headerView(
                    {
                      content: [
                        Card.titleView({ content: "项目状态", element: "h3" }, h),
                        Card.descriptionView(
                          { content: "调用方拥有 Card 内的嵌套内容与语义。" },
                          h,
                        ),
                      ],
                    },
                    h,
                  ),
                  Card.contentView(
                    {
                      content: [
                        h.ul(
                          [h.Class("list-disc space-y-1 pl-5 text-sm text-foreground")],
                          [h.li([], ["视觉映射已确认"]), h.li([], ["行为权威保持不变"])],
                        ),
                      ],
                    },
                    h,
                  ),
                  Card.footerView(
                    {
                      content: [h.p([h.Class("text-xs text-muted")], ["上次更新：今天 09:30"])],
                    },
                    h,
                  ),
                ],
              },
              h,
            ),
          ],
          h,
        ),
        exampleView(
          "Surface variants",
          [
            h.div(
              [h.Class("grid gap-4 md:grid-cols-2")],
              [
                Card.view(
                  {
                    variant: "default",
                    attributes: [h.Role("region"), h.AriaLabel("Default Card")],
                    content: [Card.titleView({ content: "Default Card", element: "h4" }, h)],
                  },
                  h,
                ),
                Card.view(
                  {
                    variant: "secondary",
                    attributes: [h.Role("region"), h.AriaLabel("Secondary Card")],
                    content: [Card.titleView({ content: "Secondary Card", element: "h4" }, h)],
                  },
                  h,
                ),
                Card.view(
                  {
                    variant: "tertiary",
                    attributes: [h.Role("region"), h.AriaLabel("Tertiary Card")],
                    content: [Card.titleView({ content: "Tertiary Card", element: "h4" }, h)],
                  },
                  h,
                ),
                Card.view(
                  {
                    variant: "transparent",
                    attributes: [h.Role("region"), h.AriaLabel("Transparent Card")],
                    content: [Card.titleView({ content: "Transparent Card", element: "h4" }, h)],
                  },
                  h,
                ),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "Radius 与长内容边界",
          [
            Card.view(
              {
                variant: "secondary",
                className: "max-w-xs rounded-sm",
                attributes: [h.Role("region"), h.AriaLabel("Long-content Card")],
                content: [
                  Card.titleView({ content: "较长标题仍由调用方选择语义层级", element: "h5" }, h),
                  Card.descriptionView(
                    {
                      content:
                        "较长的 Card 描述与嵌套内容会自然换行，不创建新的交互或隐藏状态来源。",
                    },
                    h,
                  ),
                ],
              },
              h,
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const loadingSkeletonExampleView = <Message>(h: HtmlBuilder<Message>): Html =>
  Skeleton.view(
    {
      animationType: "shimmer",
      attributes: [h.Id("skeleton-controlled"), h.AriaHidden(true)],
      className: "h-20 w-full rounded-xl",
    },
    h,
  );

const loadedSkeletonExampleView = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div([h.Class("rounded-xl bg-surface-secondary p-5 text-foreground")], ["资料已加载"]);

const skeletonExampleContentView = <Message>(
  state: SkeletonExampleState,
  h: HtmlBuilder<Message>,
): Html => {
  if (state === "Loading") {
    return loadingSkeletonExampleView(h);
  } else {
    return loadedSkeletonExampleView(h);
  }
};

const skeletonPageView = <Message>(
  config: PartViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  componentPageView(
    skeletonMetadata,
    {
      summary: "只投射 HeroUI Skeleton 占位视觉，loading 事实与 aria-busy 继续由外层 Model 拥有。",
      usage: "用于外层已经处于 Loading 阶段时呈现内容占位，并支持 shimmer、pulse 与 none。",
      avoidance: "不用于请求数据、保存 loading、自动切换真实内容或创建业务状态机。",
      behavior:
        "外层 Model 分支、真实内容和调用方 aria-busy 是唯一 Behavior Authority。Skeleton.view 没有 Model、Message 或定时器。",
      visual:
        "animationType 直接映射 HeroUI skeletonVariants；尺寸、圆角与布局通过 className 适配实际内容形状。",
      api: "view 呈现原生 div，可接收可选嵌套视觉内容、attributes 与 className。是否渲染 Skeleton 由调用方 view 分支决定。",
      keyboardAndFocus:
        "Skeleton 不可聚焦并禁用 pointer events，不增加键盘路径；加载完成后的真实内容恢复自身行为。",
      aria: "Skeleton 不自行添加 aria-busy、status 或 live region。纯视觉占位应由调用方 aria-hidden，并在拥有内容的容器表达 busy。",
      examples: [
        exampleView(
          "外部 loading 事实",
          [
            h.section(
              [
                h.Role("region"),
                h.AriaLabel("资料加载示例"),
                h.AriaBusy(config.skeletonExampleState === "Loading"),
                h.Class("max-w-md space-y-3"),
              ],
              [
                skeletonExampleContentView(config.skeletonExampleState, h),
                h.div(
                  [h.Class("flex flex-wrap gap-2")],
                  [
                    h.button(
                      [h.Type("button"), h.OnClick(config.onSkeletonExampleStateChange("Loaded"))],
                      ["显示已加载内容"],
                    ),
                    h.button(
                      [h.Type("button"), h.OnClick(config.onSkeletonExampleStateChange("Loading"))],
                      ["重新加载"],
                    ),
                  ],
                ),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "Animation types",
          [
            h.div(
              [h.Class("grid max-w-md gap-4")],
              [
                Skeleton.view(
                  {
                    animationType: "shimmer",
                    attributes: [h.Id("skeleton-shimmer"), h.AriaHidden(true)],
                    className: "h-5 w-full",
                  },
                  h,
                ),
                Skeleton.view(
                  {
                    animationType: "pulse",
                    attributes: [h.Id("skeleton-pulse"), h.AriaHidden(true)],
                    className: "h-5 w-4/5",
                  },
                  h,
                ),
                Skeleton.view(
                  {
                    animationType: "none",
                    attributes: [h.Id("skeleton-none"), h.AriaHidden(true)],
                    className: "h-5 w-3/5",
                  },
                  h,
                ),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "Shape、radius 与窄容器",
          [
            h.div(
              [h.Class("flex max-w-xs items-center gap-4")],
              [
                Skeleton.view(
                  {
                    attributes: [h.Id("skeleton-avatar"), h.AriaHidden(true)],
                    className: "size-14 shrink-0 rounded-full",
                  },
                  h,
                ),
                h.div(
                  [h.Class("grid min-w-0 flex-1 gap-2")],
                  [
                    Skeleton.view(
                      {
                        attributes: [h.AriaHidden(true)],
                        className: "h-4 w-full rounded-sm",
                      },
                      h,
                    ),
                    Skeleton.view(
                      {
                        attributes: [h.AriaHidden(true)],
                        className: "h-4 w-2/3 rounded-2xl",
                      },
                      h,
                    ),
                  ],
                ),
              ],
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const emptyStateEmptyExampleView = <Message>(
  config: StandaloneViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  EmptyState.view(
    {
      attributes: [h.Role("region"), h.AriaLabel("同步结果为空")],
      className:
        "grid max-w-lg justify-items-center gap-3 rounded-3xl border border-border bg-surface px-6 py-10 text-center",
      content: [
        h.h3([h.Class("text-xl font-semibold text-foreground")], ["尚未同步任何项目"]),
        h.p(
          [h.Class("max-w-md text-sm text-muted")],
          ["重新同步以检查最新项目，或查看帮助了解支持的数据来源。"],
        ),
        h.div(
          [h.Class("flex flex-wrap justify-center gap-3")],
          [
            h.button(
              [
                h.Type("button"),
                h.OnClick(config.onEmptyStateRetry),
                h.Class(
                  "rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground focus-visible:outline focus-visible:outline-2",
                ),
              ],
              ["重试同步"],
            ),
            h.a(
              [
                h.Href(routingHomeRouter()),
                h.Class(
                  "rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground focus-visible:outline focus-visible:outline-2",
                ),
              ],
              ["查看同步帮助"],
            ),
          ],
        ),
      ],
    },
    h,
  );

const emptyStatePopulatedExampleView = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Role("region"),
      h.AriaLabel("同步项目结果"),
      h.Class("rounded-2xl bg-surface-secondary p-5 text-foreground"),
    ],
    ["已同步项目：Alpha"],
  );

const emptyStateExampleContentView = <Message>(
  config: StandaloneViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  if (config.emptyStateExampleState === "Empty") {
    return emptyStateEmptyExampleView(config, h);
  } else {
    return emptyStatePopulatedExampleView(h);
  }
};

const emptyStatePageView = <Message>(
  config: StandaloneViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  componentPageView(
    emptyStateMetadata,
    {
      summary: "将外层 empty 事实呈现为完整空状态，操作继续由调用方真实控件与 Message 拥有。",
      usage: "用于列表、搜索或归档等外层已经确认无内容的场景，可组合标题、描述与操作。",
      avoidance: "不用于读取集合、推断是否为空、保存重试次数或复制按钮与导航行为。",
      behavior:
        "外层 Model 决定是否渲染 EmptyState；原生 heading、button、link 与 Message 是唯一 Behavior Authority。EmptyState.view 没有 Model、Message 或状态订阅。",
      visual:
        "root 直接映射 HeroUI emptyStateVariants；布局、标题、描述和 actions 是调用方可审计的真实内容。",
      api: "view 接收完整调用方 content、attributes 与 className；content 省略时保留 HeroUI 的默认空结果文案。",
      keyboardAndFocus:
        "root 不进入 Tab 顺序；调用方 button 与 link 保留自身 Tab、Enter、Space、焦点视觉和 Message。",
      aria: "EmptyState 不自动添加 role 或 live region；调用方按页面结构提供 region、accessible name 与真实标题层级。",
      examples: [
        exampleView(
          "主要与次要操作",
          [
            h.section(
              [h.Role("region"), h.AriaLabel("同步项目示例"), h.Class("grid gap-3")],
              [
                emptyStateExampleContentView(config, h),
                h.output([], [`已请求同步 ${config.emptyStateRetryCount} 次`]),
                h.button(
                  [h.Type("button"), h.OnClick(config.onEmptyStateExampleStateChange("Empty"))],
                  ["显示空状态"],
                ),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "无操作、长文案、窄容器与 RTL",
          [
            EmptyState.view(
              {
                attributes: [h.Role("region"), h.AriaLabel("归档项目空状态"), h.Dir("rtl")],
                className:
                  "grid max-w-64 justify-items-start gap-2 rounded-2xl border border-border bg-surface p-5 text-start",
                content: [
                  h.h3([h.Class("font-semibold text-foreground")], ["暂无归档项目"]),
                  h.p(
                    [h.Class("text-sm text-muted")],
                    ["当项目完成并归档后，它们会显示在这里；当前不需要执行任何操作。"],
                  ),
                ],
              },
              h,
            ),
          ],
          h,
        ),
        exampleView("HeroUI 默认内容", [EmptyState.view({}, h)], h),
      ],
    },
    h,
  );

const alertPageView = <Message>(h: HtmlBuilder<Message>): Html =>
  componentPageView(
    alertMetadata,
    {
      summary: "按调用方用途投射原生 alert 或 status 语义，并应用 HeroUI Alert 状态视觉。",
      usage: "用于需要即时播报或礼貌状态更新的重要消息，语义用途与视觉 status 显式分离。",
      avoidance:
        "不用于保存消息队列、定时关闭、复制 Toast 行为，或从 danger/success 颜色猜测播报优先级。",
      behavior:
        "semanticRole 直接成为原生 role=alert/status；浏览器 live-region 语义和调用方内容是唯一 Behavior Authority。组件没有 Model、Message、dismiss 或计时器。",
      visual:
        "status 映射 HeroUI alertVariants；indicator、content、title 与 description 映射官方 slots，并由 root descendant 样式获得状态颜色。",
      api: "view 要求调用方显式选择 semanticRole；各 slot view 接收真实内容、attributes 与 className，不使用隐藏 Context。",
      keyboardAndFocus:
        "Alert anatomy 默认不进入 Tab 顺序；调用方嵌入的 link、button 等真实控件保留自身键盘与焦点行为。",
      aria: "紧急且需要立即播报的消息使用 alert；非紧急状态更新使用 status。视觉 status 不自动决定 live-region role。",
      examples: [
        exampleView(
          "紧急 alert",
          [
            Alert.view(
              {
                semanticRole: "alert",
                status: "danger",
                attributes: [h.AriaLabel("无法连接")],
                content: [
                  Alert.indicatorView({ content: [h.span([h.AriaHidden(true)], ["!"])] }, h),
                  Alert.contentView(
                    {
                      content: [
                        Alert.titleView({ content: "无法连接" }, h),
                        Alert.descriptionView({ content: "请检查网络后重试。" }, h),
                      ],
                    },
                    h,
                  ),
                ],
              },
              h,
            ),
          ],
          h,
        ),
        exampleView(
          "礼貌 status 与自定义 indicator",
          [
            Alert.view(
              {
                semanticRole: "status",
                status: "success",
                attributes: [h.AriaLabel("配置已保存")],
                content: [
                  Alert.indicatorView(
                    {
                      content: [h.span([h.AriaHidden(true)], ["自定义指示器"])],
                    },
                    h,
                  ),
                  Alert.contentView(
                    {
                      content: [
                        Alert.titleView({ content: "配置已保存" }, h),
                        Alert.descriptionView({ content: "更改已同步到团队。" }, h),
                      ],
                    },
                    h,
                  ),
                ],
              },
              h,
            ),
          ],
          h,
        ),
        exampleView(
          "Status 视觉矩阵",
          [
            h.div(
              [h.Class("grid gap-3")],
              [
                Alert.view(
                  {
                    semanticRole: "status",
                    status: "default",
                    attributes: [h.AriaLabel("Default Alert")],
                    content: [Alert.titleView({ content: "Default" }, h)],
                  },
                  h,
                ),
                Alert.view(
                  {
                    semanticRole: "status",
                    status: "accent",
                    attributes: [h.AriaLabel("Accent Alert")],
                    content: [Alert.titleView({ content: "Accent" }, h)],
                  },
                  h,
                ),
                Alert.view(
                  {
                    semanticRole: "status",
                    status: "warning",
                    attributes: [h.AriaLabel("Warning Alert")],
                    content: [Alert.titleView({ content: "Warning" }, h)],
                  },
                  h,
                ),
                Alert.view(
                  {
                    semanticRole: "status",
                    status: "danger",
                    attributes: [h.AriaLabel("后台连接状态")],
                    content: [Alert.titleView({ content: "Danger polite status" }, h)],
                  },
                  h,
                ),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "长文案、窄容器与 RTL",
          [
            Alert.view(
              {
                semanticRole: "status",
                status: "accent",
                attributes: [h.AriaLabel("RTL 长文案 Alert"), h.Dir("rtl")],
                className: "max-w-64",
                content: [
                  Alert.indicatorView({ content: [h.span([h.AriaHidden(true)], ["i"])] }, h),
                  Alert.contentView(
                    {
                      content: [
                        Alert.titleView({ content: "تم حفظ التغييرات" }, h),
                        Alert.descriptionView(
                          {
                            content:
                              "هذا نص طويل للتأكد من أن الرسالة تلتف داخل الحاوية الضيقة دون فقدان المعنى.",
                          },
                          h,
                        ),
                      ],
                    },
                    h,
                  ),
                ],
              },
              h,
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const spinnerLoadingExampleView = <Message>(
  config: StandaloneViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [],
    [
      Spinner.view({ accessibleLabel: "正在加载项目", gradientId: "spinner-project-loading" }, h),
      h.button(
        [
          h.Type("button"),
          h.OnClick(config.onSpinnerExampleStateChange("Loaded")),
          h.Class("ml-3 rounded-lg border border-border px-3 py-2 text-sm font-semibold"),
        ],
        ["显示加载结果"],
      ),
    ],
  );

const spinnerLoadedExampleView = <Message>(
  config: StandaloneViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [],
    [
      h.p([h.Class("text-foreground")], ["项目已加载"]),
      h.button(
        [
          h.Type("button"),
          h.OnClick(config.onSpinnerExampleStateChange("Loading")),
          h.Class("mt-3 rounded-lg border border-border px-3 py-2 text-sm font-semibold"),
        ],
        ["重新显示加载状态"],
      ),
    ],
  );

const spinnerControlledExampleView = <Message>(
  config: StandaloneViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  if (config.spinnerExampleState === "Loading") {
    return spinnerLoadingExampleView(config, h);
  } else {
    return spinnerLoadedExampleView(config, h);
  }
};

const spinnerPageView = <Message>(
  config: StandaloneViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  componentPageView(
    spinnerMetadata,
    {
      summary:
        "以调用方 loading 事实和原生 status 为 Behavior Authority，投射 HeroUI Spinner 视觉。",
      usage: "用于无法提供完成比例的短时加载反馈，并用任务上下文给出可访问名称。",
      avoidance: "已知完成比例时应使用 ProgressBar 或 ProgressCircle；Spinner 不负责决定何时出现。",
      behavior:
        "调用方决定 loading 分支。Spinner.view 不持有 Model、Message 或计时器，原生 status 与 accessible name 是唯一行为语义。",
      visual:
        "color 与 size 直接映射 HeroUI spinnerVariants；旋转只属于视觉，并遵循 reduced motion。",
      api: "view 要求 accessibleLabel 与用于生成唯一 SVG gradient id 的 gradientId，并接受 color、size、原生 attributes 与 className；内部图标对辅助技术隐藏。",
      keyboardAndFocus: "Spinner 不进入 Tab 顺序，也没有激活或焦点行为。",
      aria: "根元素使用 role=status 与调用方提供的 accessibleLabel；装饰图标使用 aria-hidden。",
      examples: [
        exampleView("不确定型加载", [spinnerControlledExampleView(config, h)], h),
        exampleView(
          "颜色与尺寸",
          [
            h.div(
              [h.Class("flex flex-wrap items-center gap-5")],
              [
                Spinner.view(
                  {
                    accessibleLabel: "正在保存",
                    gradientId: "spinner-saving",
                    color: "success",
                    size: "sm",
                  },
                  h,
                ),
                Spinner.view(
                  {
                    accessibleLabel: "正在同步",
                    gradientId: "spinner-syncing",
                    color: "warning",
                    size: "lg",
                  },
                  h,
                ),
                Spinner.view(
                  {
                    accessibleLabel: "正在重试",
                    gradientId: "spinner-retrying",
                    color: "danger",
                    size: "xl",
                  },
                  h,
                ),
                h.span(
                  [h.Class("text-muted")],
                  [
                    Spinner.view(
                      {
                        accessibleLabel: "继承当前颜色",
                        gradientId: "spinner-current-color",
                        color: "current",
                      },
                      h,
                    ),
                  ],
                ),
              ],
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const avatarImageConfig = <Message>(
  onAvatarExampleStateChange: (state: AvatarExampleState) => Message,
  src = "/avatar-delayed.svg",
): AvatarImageConfig<Message> => ({
  src,
  onLoad: onAvatarExampleStateChange("Loaded"),
  onError: onAvatarExampleStateChange("Failed"),
  loading: "eager",
});

const avatarImageState = <Message>(
  status: AvatarExampleState,
  onAvatarExampleStateChange: (state: AvatarExampleState) => Message,
): AvatarImageState<Message> => {
  if (status === "Loading") {
    return { _tag: "Loading", image: avatarImageConfig(onAvatarExampleStateChange) };
  } else if (status === "Loaded") {
    return { _tag: "Loaded", image: avatarImageConfig(onAvatarExampleStateChange) };
  } else if (status === "Failed") {
    return { _tag: "Failed" };
  } else if (status === "Missing") {
    return { _tag: "Missing" };
  } else {
    return {
      _tag: "Loading",
      image: avatarImageConfig(onAvatarExampleStateChange, "/avatar-error.svg"),
    };
  }
};

const avatarControlledExampleView = <Message>(
  config: StandaloneViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-wrap items-center gap-3")],
    [
      Avatar.view(
        {
          accessibleLabel: "Ada Lovelace",
          imageState: avatarImageState(
            config.avatarExampleState,
            config.onAvatarExampleStateChange,
          ),
          fallback: "AL",
          size: "lg",
        },
        h,
      ),
      h.p([h.Class("text-muted")], [`当前图片状态：${config.avatarExampleState}`]),
      h.button(
        [
          h.Type("button"),
          h.OnClick(config.onAvatarExampleStateChange("Loading")),
          h.Class("rounded-lg border border-border px-3 py-2 text-sm font-semibold"),
        ],
        ["显示Loading头像"],
      ),
      h.button(
        [
          h.Type("button"),
          h.OnClick(config.onAvatarExampleStateChange("Loaded")),
          h.Class("rounded-lg border border-border px-3 py-2 text-sm font-semibold"),
        ],
        ["显示Loaded头像"],
      ),
      h.button(
        [
          h.Type("button"),
          h.OnClick(config.onAvatarExampleStateChange("Failed")),
          h.Class("rounded-lg border border-border px-3 py-2 text-sm font-semibold"),
        ],
        ["显示Failed头像"],
      ),
      h.button(
        [
          h.Type("button"),
          h.OnClick(config.onAvatarExampleStateChange("Missing")),
          h.Class("rounded-lg border border-border px-3 py-2 text-sm font-semibold"),
        ],
        ["显示Missing头像"],
      ),
      h.button(
        [
          h.Type("button"),
          h.OnClick(config.onAvatarExampleStateChange("LoadingBroken")),
          h.Class("rounded-lg border border-border px-3 py-2 text-sm font-semibold"),
        ],
        ["尝试不可用图片"],
      ),
    ],
  );

const avatarPageView = <Message>(
  config: StandaloneViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  componentPageView(
    avatarMetadata,
    {
      summary:
        "以外层图片状态与 Foldkit 原生 img 事件为 Behavior Authority，投射 HeroUI Avatar 视觉。",
      usage: "用于展示人物、团队或实体的紧凑身份标识，并始终提供稳定的 accessibleLabel。",
      avoidance:
        "不要让 Avatar 自行请求、轮询或推断图片状态；由调用方 Model 消费 load/error Message。",
      behavior:
        "调用方持有 Loading、Loaded、Failed、Missing 与资源选择事实。Avatar.view 只在 Loading 与 Loaded 阶段渲染原生 img，并把 OnLoad 与 OnError 原样投射为调用方 Message。",
      visual:
        "color、size 与 variant 直接映射 HeroUI avatarVariants。Loading 仅隐藏图片视觉，保留 fallback，图片 load 后以 HeroUI transition 覆盖 fallback。",
      api: "view 要求 accessibleLabel、imageState 与 fallback；有图片时提供 src、onLoad、onError 和可选 loading。color、size、variant、attributes 与 className 用于视觉和原生扩展。",
      keyboardAndFocus:
        "Avatar 本身不进入 Tab 顺序。示例中的外部状态按钮保持原生按钮键盘行为，Avatar 不拦截任何事件。",
      aria: "根元素使用 role=img 与 accessibleLabel。fallback 和内部 img 对辅助技术隐藏，因此状态切换不会重复朗读同一身份名称。",
      examples: [
        exampleView("调用方拥有的图片状态", [avatarControlledExampleView(config, h)], h),
        exampleView(
          "颜色、尺寸与 fallback",
          [
            h.div(
              [h.Class("flex flex-wrap items-center gap-5")],
              [
                Avatar.view(
                  {
                    accessibleLabel: "默认小头像",
                    imageState: { _tag: "Missing" },
                    fallback: "DS",
                    size: "sm",
                  },
                  h,
                ),
                Avatar.view(
                  {
                    accessibleLabel: "成功中头像",
                    imageState: { _tag: "Missing" },
                    fallback: "OK",
                    color: "success",
                    size: "md",
                  },
                  h,
                ),
                Avatar.view(
                  {
                    accessibleLabel: "危险大头像",
                    imageState: { _tag: "Missing" },
                    fallback: "!",
                    color: "danger",
                    size: "lg",
                    variant: "soft",
                  },
                  h,
                ),
                Avatar.view(
                  {
                    accessibleLabel: "强调色头像",
                    imageState: { _tag: "Missing" },
                    fallback: "AC",
                    color: "accent",
                  },
                  h,
                ),
                Avatar.view(
                  {
                    accessibleLabel: "警告色头像",
                    imageState: { _tag: "Missing" },
                    fallback: "WA",
                    color: "warning",
                  },
                  h,
                ),
                Avatar.view(
                  {
                    accessibleLabel: "自定义内容头像",
                    imageState: { _tag: "Missing" },
                    fallback: h.span([h.Class("font-bold")], ["自定义"]),
                  },
                  h,
                ),
              ],
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const progressBarPageView = <Message>(
  config: StandaloneViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  componentPageView(
    progressBarMetadata,
    {
      summary: "以原生 progressbar 值语义呈现确定型或不确定型进度，并投射 HeroUI 条形 anatomy。",
      usage: "用于显示已知比例或暂时未知比例的任务进度。",
      avoidance: "不用于表达容量或质量阈值；这类已知范围测量应使用 Meter。",
      behavior:
        "value、范围与 valueText 来自调用方 Model。ProgressBar.view 只把这些事实投射为标准 ARIA 值属性与 fill 宽度。",
      visual:
        "color 与 size 映射 HeroUI progressBarVariants；无 aria-valuenow 时使用官方 indeterminate 动效。",
      api: "Value 是确定型与不确定型的共享契约。范围省略时为 0/100；提供时 minValue 与 maxValue 必须有限且 minValue < maxValue，确定型 value 必须有限且 minValue ≤ value ≤ maxValue。accessibleLabel 必填，label、output、attributes 与 className 由调用方提供。",
      keyboardAndFocus: "ProgressBar 不进入 Tab 顺序，也没有键盘操作或焦点状态。",
      aria: "确定型暴露 aria-valuemin、aria-valuemax、aria-valuenow 与可选 aria-valuetext；不确定型省略 aria-valuenow。",
      examples: [
        exampleView(
          "确定型进度",
          [
            ProgressBar.view(
              {
                accessibleLabel: "项目上传进度",
                value: config.progressExampleValue,
                valueText: `已上传 ${config.progressExampleValue}%`,
                label: "上传项目",
                output: `${config.progressExampleValue}%`,
              },
              h,
            ),
            h.button(
              [
                h.Type("button"),
                h.OnClick(config.onAdvanceProgressExample),
                h.Class("mt-3 rounded-lg border border-border px-3 py-2 text-sm font-semibold"),
              ],
              ["推进条形进度"],
            ),
          ],
          h,
        ),
        exampleView(
          "不确定型进度",
          [
            ProgressBar.view(
              {
                accessibleLabel: "正在准备上传",
                isIndeterminate: true,
                color: "warning",
                label: "准备中",
              },
              h,
            ),
          ],
          h,
        ),
        exampleView(
          "颜色、尺寸与自定义范围",
          [
            h.div(
              [h.Class("grid gap-5")],
              [
                ProgressBar.view(
                  {
                    accessibleLabel: "默认小尺寸进度",
                    value: 2,
                    maxValue: 5,
                    color: "default",
                    size: "sm",
                    output: "2 / 5",
                  },
                  h,
                ),
                ProgressBar.view(
                  {
                    accessibleLabel: "成功大尺寸进度",
                    value: 80,
                    color: "success",
                    size: "lg",
                    output: "80%",
                  },
                  h,
                ),
                ProgressBar.view(
                  {
                    accessibleLabel: "危险进度",
                    value: 95,
                    color: "danger",
                    output: "95%",
                  },
                  h,
                ),
              ],
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const progressCirclePageView = <Message>(
  config: StandaloneViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  componentPageView(
    progressCircleMetadata,
    {
      summary: "复用 ProgressBar 的值语义，以 HeroUI SVG anatomy 呈现环形进度。",
      usage: "用于紧凑区域中的确定型或不确定型进度反馈。",
      avoidance: "需要同时展示长标签与精确输出时优先使用 ProgressBar；测量阈值使用 Meter。",
      behavior:
        "value、范围与 valueText 仍由调用方 Model 持有，并投射为与 ProgressBar 相同的 progressbar ARIA 属性。SVG 不成为第二行为源。",
      visual:
        "color 与 size 映射 HeroUI progressCircleVariants；确定型改变 stroke dash offset，不确定型旋转 track。",
      api: "Value 与 ProgressBar 使用同一确定型/不确定型字段。范围省略时为 0/100；提供时 minValue 与 maxValue 必须有限且 minValue < maxValue，确定型 value 必须有限且 minValue ≤ value ≤ maxValue。accessibleLabel、attributes 与 className 由调用方提供。",
      keyboardAndFocus: "ProgressCircle 不进入 Tab 顺序，也没有键盘操作或焦点状态。",
      aria: "根元素拥有 progressbar role 与值属性；SVG track 和 circles 作为整体对辅助技术隐藏。",
      examples: [
        exampleView(
          "确定型环形进度",
          [
            ProgressCircle.view(
              {
                accessibleLabel: "资料处理进度",
                value: config.progressExampleValue,
                valueText: `已处理 ${config.progressExampleValue}%`,
              },
              h,
            ),
            h.button(
              [
                h.Type("button"),
                h.OnClick(config.onAdvanceProgressExample),
                h.Class("ml-3 rounded-lg border border-border px-3 py-2 text-sm font-semibold"),
              ],
              ["推进环形进度"],
            ),
          ],
          h,
        ),
        exampleView(
          "不确定型与视觉矩阵",
          [
            h.div(
              [h.Class("flex flex-wrap items-center gap-5")],
              [
                ProgressCircle.view({ accessibleLabel: "正在分析资料", isIndeterminate: true }, h),
                ProgressCircle.view(
                  { accessibleLabel: "警告进度", value: 65, color: "warning", size: "sm" },
                  h,
                ),
                ProgressCircle.view(
                  { accessibleLabel: "成功进度", value: 85, color: "success", size: "lg" },
                  h,
                ),
                ProgressCircle.view(
                  { accessibleLabel: "默认进度", value: 35, color: "default" },
                  h,
                ),
                ProgressCircle.view({ accessibleLabel: "危险进度", value: 95, color: "danger" }, h),
              ],
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const meterPageView = <Message>(h: HtmlBuilder<Message>): Html =>
  componentPageView(
    meterMetadata,
    {
      summary: "以标准 meter 值语义展示已知范围内的数量，并由调用方显式选择 HeroUI 阈值颜色。",
      usage: "用于存储占用、配额、质量或健康度等已知范围内的当前测量。",
      avoidance:
        "不用于表示任务完成进度或未知时长的等待；这些场景使用 ProgressBar、ProgressCircle 或 Spinner。",
      behavior:
        "调用方持有 value、minValue、maxValue、valueText 与阈值判断。Meter.view 不推断业务边界，只投射标准 meter 属性与视觉。",
      visual:
        "color 与 size 映射 HeroUI meterVariants；fill 宽度按有效范围计算并仅在视觉层 clamp，边界颜色由调用方事实显式提供。",
      api: "范围省略时为 0/100；提供时 minValue 与 maxValue 必须有限且 minValue < maxValue，value 必须有限且 minValue ≤ value ≤ maxValue。view 还要求 accessibleLabel，并支持 valueText、label、output、attributes 与 className。",
      keyboardAndFocus: "Meter 不进入 Tab 顺序，也没有键盘操作或焦点状态。",
      aria: "根元素使用 role=meter，并暴露 aria-valuemin、aria-valuemax、aria-valuenow 与可选 aria-valuetext。",
      examples: [
        exampleView(
          "自定义范围与值文本",
          [
            Meter.view(
              {
                accessibleLabel: "存储空间使用量",
                value: 325,
                maxValue: 500,
                valueText: "已使用 325 GB，共 500 GB",
                label: "存储空间",
                output: "325 / 500 GB",
              },
              h,
            ),
          ],
          h,
        ),
        exampleView(
          "调用方阈值颜色",
          [
            h.div(
              [h.Class("grid gap-5")],
              [
                Meter.view(
                  {
                    accessibleLabel: "健康容量",
                    value: 35,
                    color: "success",
                    size: "sm",
                    output: "35%",
                  },
                  h,
                ),
                Meter.view(
                  {
                    accessibleLabel: "接近容量上限",
                    value: 72,
                    color: "warning",
                    output: "72%",
                  },
                  h,
                ),
                Meter.view(
                  {
                    accessibleLabel: "容量已告急",
                    value: 92,
                    color: "danger",
                    size: "lg",
                    output: "92%",
                  },
                  h,
                ),
              ],
            ),
          ],
          h,
        ),
        exampleView(
          "长标签、窄容器与 RTL",
          [
            Meter.view(
              {
                accessibleLabel: "مساحة التخزين المستخدمة",
                value: 58,
                color: "default",
                label: "مساحة التخزين المستخدمة في مساحة العمل المشتركة",
                output: "58%",
                attributes: [h.Dir("rtl")],
                className: "max-w-64",
              },
              h,
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

const missingPartView = <Message>(slug: string, h: HtmlBuilder<Message>): Html =>
  h.section(
    [],
    [
      h.h1([h.Class("text-4xl font-semibold text-foreground")], ["组件文档不存在"]),
      h.p([h.Class("mt-3 text-muted")], [`未找到 Parts 组件：${slug}`]),
    ],
  );

const scrollShadowPageView = <Message>(
  config: PartViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  componentPageView(
    scrollShadowMetadata,
    {
      summary: "以 Foldkit Mount 观察真实滚动容器，并投射 HeroUI ScrollShadow 边缘阴影。",
      usage: "用于可滚动内容的开始与结束边缘提示，不改变内容的原生滚动语义。",
      avoidance: "不要在组件中维护第二滚动状态机；可见边缘由 Mount Message 写入外层 Model。",
      behavior:
        "Mount 在元素存在时建立 scroll listener、ResizeObserver 与 MutationObserver，并在滚动、viewport 或内容变化时发出 Visibility。元素卸载时由 Mount 自动释放它们。",
      visual:
        "visibility 映射 HeroUI 的 data-top/bottom 或 data-left/right 属性；orientation、hideScrollBar、fade 与 size 投射 HeroUI styles。",
      api: "view 要求 content、visibility 与 onVisibilityChange；可选 orientation、offset、size、isEnabled、attributes 与 className。",
      keyboardAndFocus:
        "ScrollShadow 不添加 tabindex、role 或键盘处理。原生 scroll container 保留浏览器的滚动、焦点与辅助技术语义。",
      aria: "组件不改写子内容的 ARIA；调用方在需要时通过 attributes 提供可访问名称。",
      examples: [
        exampleView(
          "垂直溢出与外层状态",
          [
            ScrollShadow.view(
              {
                content: [
                  h.div(
                    [h.Class("min-h-96 space-y-3 p-4")],
                    [
                      h.p([], ["第 1 行：滚动容器保留原生行为。"]),
                      h.p([], ["第 2 行：顶部与底部阴影由 Mount 观察。"]),
                      h.p([], ["第 3 行：内容变化也会重新计算边缘。"]),
                      h.p([], ["第 4 行：抵达末尾后底部阴影消失。"]),
                      h.p([], ["第 5 行：这是用于验证溢出的最后一行。"]),
                    ],
                  ),
                ],
                visibility: config.verticalScrollShadowVisibility,
                onVisibilityChange: config.onVerticalScrollShadowVisibilityChange,
                attributes: [h.AriaLabel("垂直滚动阴影示例"), h.Class("h-28 border border-border")],
              },
              h,
            ),
            h.p(
              [h.Class("mt-3 text-muted")],
              [`当前可见边缘：${config.verticalScrollShadowVisibility}`],
            ),
          ],
          h,
        ),
        exampleView(
          "水平、自定义阴影与无溢出边界",
          [
            ScrollShadow.view(
              {
                content: [h.div([h.Class("w-[40rem] p-4")], ["横向滚动内容"])],
                visibility: config.horizontalScrollShadowVisibility,
                onVisibilityChange: config.onHorizontalScrollShadowVisibilityChange,
                orientation: "Horizontal",
                hideScrollBar: true,
                offset: 12,
                size: 24,
                attributes: [
                  h.AriaLabel("水平滚动阴影示例"),
                  h.Class("max-w-64 border border-border"),
                ],
              },
              h,
            ),
            ScrollShadow.view(
              {
                content: [h.p([h.Class("p-4")], ["没有溢出时不显示阴影。"])],
                visibility: "None",
                onVisibilityChange: config.onVerticalScrollShadowVisibilityChange,
                isEnabled: false,
                attributes: [
                  h.AriaLabel("无溢出滚动阴影示例"),
                  h.Class("mt-4 border border-border"),
                ],
              },
              h,
            ),
          ],
          h,
        ),
      ],
    },
    h,
  );

export const partView = <Message>(
  slug: string,
  config: PartViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  if (slug === typographyMetadata.slug) {
    return typographyPageView(h);
  } else if (slug === surfaceMetadata.slug) {
    return surfacePageView(h);
  } else if (slug === separatorMetadata.slug) {
    return separatorPageView(h);
  } else if (slug === labelMetadata.slug) {
    return labelPageView(h);
  } else if (slug === descriptionMetadata.slug) {
    return descriptionPageView(config, h);
  } else if (slug === headerMetadata.slug) {
    return headerPageView(h);
  } else if (slug === errorMessageMetadata.slug) {
    return errorMessagePageView(h);
  } else if (slug === fieldErrorMetadata.slug) {
    return fieldErrorPageView(config, h);
  } else if (slug === kbdMetadata.slug) {
    return kbdPageView(h);
  } else if (slug === badgeMetadata.slug) {
    return badgePageView(h);
  } else if (slug === chipMetadata.slug) {
    return chipPageView(config, h);
  } else if (slug === cardMetadata.slug) {
    return cardPageView(h);
  } else if (slug === skeletonMetadata.slug) {
    return skeletonPageView(config, h);
  } else if (slug === scrollShadowMetadata.slug) {
    return scrollShadowPageView(config, h);
  } else {
    return missingPartView(slug, h);
  }
};

const missingStandaloneView = <Message>(slug: string, h: HtmlBuilder<Message>): Html =>
  h.section(
    [],
    [
      h.h1([h.Class("text-4xl font-semibold text-foreground")], ["组件文档不存在"]),
      h.p([h.Class("mt-3 text-muted")], [`未找到 Standalone 组件：${slug}`]),
    ],
  );

export const standaloneView = <Message>(
  slug: string,
  config: StandaloneViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  if (slug === emptyStateMetadata.slug) {
    return emptyStatePageView(config, h);
  } else if (slug === alertMetadata.slug) {
    return alertPageView(h);
  } else if (slug === spinnerMetadata.slug) {
    return spinnerPageView(config, h);
  } else if (slug === avatarMetadata.slug) {
    return avatarPageView(config, h);
  } else if (slug === progressBarMetadata.slug) {
    return progressBarPageView(config, h);
  } else if (slug === progressCircleMetadata.slug) {
    return progressCirclePageView(config, h);
  } else if (slug === meterMetadata.slug) {
    return meterPageView(h);
  } else {
    return missingStandaloneView(slug, h);
  }
};

export type Filters = Readonly<{
  catalog: Option.Option<Catalog>;
  phase: Option.Option<Phase>;
  behaviorClass: Option.Option<BehaviorClass>;
  status: Option.Option<Status>;
}>;

const filterLinkView = <Message>(label: string, href: string, h: HtmlBuilder<Message>): Html =>
  h.a(
    [
      h.Href(href),
      h.Class("rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold"),
    ],
    [label],
  );

const matchesOptional = <Value>(maybeExpected: Option.Option<Value>, actual: Value): boolean =>
  Option.match(maybeExpected, {
    onNone: () => true,
    onSome: (expected) => expected === actual,
  });

const matchesFilters = (component: ComponentMetadata, filters: Filters): boolean =>
  matchesOptional(filters.catalog, component.catalog) &&
  matchesOptional(filters.phase, component.phase) &&
  matchesOptional(filters.behaviorClass, component.behaviorClass) &&
  matchesOptional(filters.status, component.status);

const componentDetailHref = (component: ComponentMetadata): string =>
  component.catalog === "parts"
    ? componentPartRouter({ slug: component.slug })
    : componentStandaloneRouter({ slug: component.slug });

const componentCardView = <Message>(
  component: ComponentMetadata,
  h: HtmlBuilder<Message>,
): Html => {
  return h.keyed("li")(
    component.slug,
    [h.Class("rounded-2xl border border-border bg-surface p-5 shadow-surface")],
    [
      h.a(
        [
          h.Href(componentDetailHref(component)),
          h.Class("text-xl font-semibold text-foreground underline-offset-4 hover:underline"),
        ],
        [component.name],
      ),
      h.p([h.Class("mt-2 text-sm text-muted")], [component.title]),
      h.p(
        [h.Class("mt-4 text-xs text-muted")],
        [
          `${catalogLabel(component.catalog)} · Phase ${component.phase} · Class ${component.behaviorClass} · ${component.status}`,
        ],
      ),
    ],
  );
};

export const indexView = <Message>(filters: Filters, h: HtmlBuilder<Message>): Html => {
  const visibleComponents = Array.filter(metadata, (component) =>
    matchesFilters(component, filters),
  );

  return h.div(
    [],
    [
      Typography.view({ content: "组件库", type: "h1" }, h),
      Typography.view(
        {
          content: "以项目内文档页审阅真实生产组件、领域元数据与验收证据。",
          color: "muted",
        },
        h,
      ),
      h.nav(
        [h.AriaLabel("组件筛选"), h.Class("mt-8 flex flex-wrap gap-3")],
        [
          filterLinkView(
            "全部",
            componentsIndexRouter({
              catalog: Option.none(),
              phase: Option.none(),
              behaviorClass: Option.none(),
              status: Option.none(),
            }),
            h,
          ),
          filterLinkView("Parts", componentsPartsRouter(), h),
          filterLinkView("Standalone", componentsStandaloneRouter(), h),
          filterLinkView(
            "Phase 1",
            componentsIndexRouter({
              catalog: Option.none(),
              phase: Option.some(1),
              behaviorClass: Option.none(),
              status: Option.none(),
            }),
            h,
          ),
          filterLinkView(
            "Class A",
            componentsIndexRouter({
              catalog: Option.none(),
              phase: Option.none(),
              behaviorClass: Option.some("A"),
              status: Option.none(),
            }),
            h,
          ),
          filterLinkView(
            "verified",
            componentsIndexRouter({
              catalog: Option.none(),
              phase: Option.none(),
              behaviorClass: Option.none(),
              status: Option.some("verified"),
            }),
            h,
          ),
        ],
      ),
      Array.isArrayNonEmpty(visibleComponents)
        ? h.ul(
            [h.Class("mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3")],
            Array.map(visibleComponents, (component) => componentCardView(component, h)),
          )
        : h.p([h.Class("mt-8 text-muted")], ["当前筛选没有组件。"]),
    ],
  );
};

const protocolSectionView = <Message>(
  title: string,
  description: string,
  content: ReadonlyArray<Html>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("rounded-2xl border border-border bg-surface p-6 shadow-surface")],
    [
      Typography.view({ content: title, type: "h2" }, h),
      Typography.view({ content: description, color: "muted" }, h),
      ...content,
    ],
  );

const themePreviewView = <Message>(
  theme: "light" | "dark",
  title: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [
      h.AriaLabel(`${title} theme preview`),
      h.DataAttribute("theme", theme),
      h.Class("rounded-2xl bg-background p-5"),
    ],
    [
      Surface.view(
        {
          variant: "default",
          className: "rounded-xl border border-border p-5 shadow-surface",
          attributes: [h.Role("region"), h.AriaLabel(`${title} Surface sample`)],
          content: [
            Typography.view({ content: `${title} Surface`, type: "h3" }, h),
            Typography.view({ content: "Foreground and muted token sample", color: "muted" }, h),
            Separator.view({ className: "my-4" }, h),
            Typography.view({ content: "HeroUI theme variables remain the Visual Authority." }, h),
          ],
        },
        h,
      ),
    ],
  );

export const visualProtocolView = <Message>(h: HtmlBuilder<Message>): Html =>
  h.article(
    [],
    [
      Typography.view({ content: "Visual Protocol", type: "h1" }, h),
      Typography.view(
        {
          content: "阶段 1 固定 HeroUI Visual Authority 在 Foldkit view 中的投射基线。",
          color: "muted",
        },
        h,
      ),
      h.div(
        [h.Class("mt-8 grid gap-5")],
        [
          protocolSectionView(
            "Design tokens",
            "组件只消费 HeroUI 3.2.4 公开 CSS variables，不在页面或组件内部复制颜色常量。",
            [
              h.ul(
                [h.Class("mt-4 list-disc space-y-2 pl-5 text-muted")],
                [
                  h.li(
                    [],
                    [
                      "颜色：--background、--foreground、--surface、--surface-secondary、--surface-tertiary、--muted、--separator、--focus。",
                    ],
                  ),
                  h.li(
                    [],
                    [
                      "形状：--spacing 是 0.25rem；--radius 是 0.5rem；--field-radius 是 --radius 的 1.5 倍。",
                    ],
                  ),
                  h.li(
                    [],
                    ["边框：--border-width 是 1px；表单边框另由 --field-border-width 控制。"],
                  ),
                  h.li(
                    [],
                    ["层次：--surface-shadow、--overlay-shadow 与 --field-shadow 是唯一基础阴影。"],
                  ),
                ],
              ),
            ],
            h,
          ),
          protocolSectionView(
            "Light / dark",
            "[data-theme=light] 与 [data-theme=dark] 使用同一组件 anatomy，只切换 HeroUI 主题变量；组件不能分叉 markup 或 Behavior Authority。",
            [
              h.div(
                [h.Class("mt-4 grid gap-4 lg:grid-cols-2")],
                [themePreviewView("light", "Light", h), themePreviewView("dark", "Dark", h)],
              ),
            ],
            h,
          ),
          protocolSectionView(
            "Typography",
            "原生标题、段落与 code 元素保留语义。h1-h6 依次映射 2.25、1.875、1.5、1.25、1.125、1rem；body/body-sm/body-xs 映射 1、0.875、0.75rem。weight、align 与 color 只控制视觉。",
            [Typography.view({ content: "Semantic heading scale", type: "h3" }, h)],
            h,
          ),
          protocolSectionView(
            "间距与圆角",
            "布局间距使用 HeroUI spacing scale，允许 --spacing 的整数与半级倍数（例如 0.5、1.5）；一般组件圆角使用 --radius，Control Surface 使用 --field-radius，不在组件中复制像素值。",
            [],
            h,
          ),
          protocolSectionView(
            "边框与阴影",
            "--border、--border-secondary、--border-tertiary 表达分界；--surface-shadow、--overlay-shadow、--field-shadow 表达层级。边框或阴影不能创造第二 Control Surface。",
            [],
            h,
          ),
          protocolSectionView(
            "状态属性",
            ":disabled、[aria-disabled=true]、[readonly]、[data-readonly]、[aria-invalid=true]、[data-selected]、[data-open] 与 :focus-visible 必须来自 Behavior Authority；CSS 只能读取并投射视觉，不能复制状态。Typography、Surface 与 Separator 没有可聚焦交互面，因此 focus-visible 不适用。",
            [],
            h,
          ),
          protocolSectionView(
            "Reduced motion",
            "默认动效使用组件公开 motion token；prefers-reduced-motion: reduce 下统一压缩为 1ms，同时保留最终视觉状态与 Message 路径。",
            [
              h.span([
                h.Role("img"),
                h.AriaLabel("Motion protocol sample"),
                h.Class("component-docs-motion-sample mt-4"),
              ]),
            ],
            h,
          ),
        ],
      ),
    ],
  );

export const navigationView = <Message>(h: HtmlBuilder<Message>): Html =>
  h.aside(
    [
      h.Class(
        "max-h-64 overflow-y-auto border-b border-border bg-surface-secondary lg:max-h-none lg:min-h-[calc(100vh-5rem)] lg:border-r lg:border-b-0",
      ),
    ],
    [
      h.nav(
        [h.AriaLabel("组件文档"), h.Class("grid gap-2 p-5 lg:sticky lg:top-20")],
        [
          h.a([h.Href(componentsPartsRouter()), h.Class("font-semibold")], ["Parts"]),
          h.a([h.Href(componentsStandaloneRouter()), h.Class("font-semibold")], ["Standalone"]),
          h.a([h.Href(visualProtocolRouter()), h.Class("font-semibold")], ["Visual Protocol"]),
          ...Array.map(metadata, (component) =>
            h.keyed("a")(
              component.slug,
              [
                h.Href(componentDetailHref(component)),
                h.Class("rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface"),
              ],
              [component.name],
            ),
          ),
        ],
      ),
    ],
  );
