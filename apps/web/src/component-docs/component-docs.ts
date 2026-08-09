import {
  Description,
  ErrorMessage,
  FieldError,
  Header,
  Kbd,
  Label,
  Separator,
  Surface,
  Typography,
} from "@pkg/ui";
import { Array, Option, Schema as S } from "effect";
import type { Html, HtmlBuilder } from "foldkit/html";

import {
  componentPartRouter,
  componentsIndexRouter,
  componentsPartsRouter,
  componentsStandaloneRouter,
  visualProtocolRouter,
} from "../route";
import {
  type BehaviorClass,
  type Catalog,
  type ComponentMetadata,
  type Phase,
  type Status,
  descriptionMetadata,
  errorMessageMetadata,
  fieldErrorMetadata,
  headerMetadata,
  kbdMetadata,
  labelMetadata,
  metadata,
  separatorMetadata,
  surfaceMetadata,
  typographyMetadata,
} from "./metadata";

/** 字段语义示例中由外层 Form Model 持有的内容阶段。 */
export const FieldExampleState = S.Literals(["Helper", "Validating", "Errors"]);
export type FieldExampleState = typeof FieldExampleState.Type;

type PartViewConfig<Message> = Readonly<{
  fieldExampleState: FieldExampleState;
  onFieldExampleStateChange: (state: FieldExampleState) => Message;
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

const missingPartView = <Message>(slug: string, h: HtmlBuilder<Message>): Html =>
  h.section(
    [],
    [
      h.h1([h.Class("text-4xl font-semibold text-foreground")], ["组件文档不存在"]),
      h.p([h.Class("mt-3 text-muted")], [`未找到 Parts 组件：${slug}`]),
    ],
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
  } else {
    return missingPartView(slug, h);
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

const componentCardView = <Message>(component: ComponentMetadata, h: HtmlBuilder<Message>): Html =>
  h.keyed("li")(
    component.slug,
    [h.Class("rounded-2xl border border-border bg-surface p-5 shadow-surface")],
    [
      h.a(
        [
          h.Href(componentPartRouter({ slug: component.slug })),
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
                h.Href(componentPartRouter({ slug: component.slug })),
                h.Class("rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface"),
              ],
              [component.name],
            ),
          ),
        ],
      ),
    ],
  );
