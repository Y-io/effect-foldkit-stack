import type { TypographyVariants } from "@heroui/styles/components/typography";
import { typographyVariants } from "@heroui/styles/components/typography";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type TypographyType = NonNullable<TypographyVariants["type"]>;
type Content = string | Html;

/** Typography 的原子文本视图配置。 */
export type ViewConfig<Message> = TypographyVariants &
  Readonly<{
    content: Content;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** Typography.Prose 的富文本容器配置。 */
export type ProseViewConfig<Message> = Readonly<{
  content: ReadonlyArray<Content>;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

const elementView = <Message>(
  type: TypographyType,
  attributes: Parameters<HtmlBuilder<Message>["p"]>[0],
  content: Content,
  h: HtmlBuilder<Message>,
): Html => {
  if (type === "h1") {
    return h.h1(attributes, [content]);
  } else if (type === "h2") {
    return h.h2(attributes, [content]);
  } else if (type === "h3") {
    return h.h3(attributes, [content]);
  } else if (type === "h4") {
    return h.h4(attributes, [content]);
  } else if (type === "h5") {
    return h.h5(attributes, [content]);
  } else if (type === "h6") {
    return h.h6(attributes, [content]);
  } else if (type === "code") {
    return h.code(attributes, [content]);
  } else {
    return h.p(attributes, [content]);
  }
};

/** 使用原生文本元素投射 HeroUI Typography 视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const {
    content,
    attributes = [],
    className,
    align = "start",
    color = "default",
    truncate = false,
    type = "body",
    weight,
  } = config;
  const slots = typographyVariants({ align, color, truncate, type, weight });

  return elementView(
    type,
    [
      ...attributes,
      h.Class(classes(slots.base(), className)),
      h.DataAttribute("slot", "typography"),
      h.DataAttribute("type", type),
    ],
    content,
    h,
  );
};

/** 使用调用方拥有的语义标记投射 HeroUI prose 视觉。 */
export const proseView = <Message>(
  config: ProseViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = typographyVariants();

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.prose(), config.className)),
      h.DataAttribute("slot", "prose"),
    ],
    config.content,
  );
};

const Typography = { view, proseView };

/** Foldkit-native 的 HeroUI Typography 视觉投射。 */
export default Typography;
