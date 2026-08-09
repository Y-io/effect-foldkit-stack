import type { CardVariants } from "@heroui/styles/components/card";
import { cardVariants } from "@heroui/styles/components/card";
import { Schema as S } from "effect";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** Card title 支持的原生语义元素。 */
export const TitleElement = S.Literals(["h1", "h2", "h3", "h4", "h5", "h6", "p"]);
export type TitleElement = typeof TitleElement.Type;

/** Card 根元素的视觉与内容配置。 */
export type ViewConfig<Message> = CardVariants &
  Readonly<{
    content: ReadonlyArray<Content>;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** Card 普通容器 slot 的配置。 */
export type ContainerViewConfig<Message> = Readonly<{
  content: ReadonlyArray<Content>;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

/** Card title slot 的语义与内容配置。 */
export type TitleViewConfig<Message> = Readonly<{
  content: Content;
  element?: TitleElement;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

/** Card description slot 的内容配置。 */
export type DescriptionViewConfig<Message> = Readonly<{
  content: Content;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

/** 使用原生 div 投射 HeroUI Card root 视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const slots = cardVariants({ variant: config.variant ?? "default" });

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.base(), config.className)),
      h.DataAttribute("slot", "card"),
    ],
    config.content,
  );
};

/** 呈现 Card header slot。 */
export const headerView = <Message>(
  config: ContainerViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = cardVariants();

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.header(), config.className)),
      h.DataAttribute("slot", "card-header"),
    ],
    config.content,
  );
};

const titleElementView = <Message>(
  element: TitleElement,
  attributes: Parameters<HtmlBuilder<Message>["p"]>[0],
  content: Content,
  h: HtmlBuilder<Message>,
): Html => {
  if (element === "h1") {
    return h.h1(attributes, [content]);
  } else if (element === "h2") {
    return h.h2(attributes, [content]);
  } else if (element === "h3") {
    return h.h3(attributes, [content]);
  } else if (element === "h4") {
    return h.h4(attributes, [content]);
  } else if (element === "h5") {
    return h.h5(attributes, [content]);
  } else if (element === "h6") {
    return h.h6(attributes, [content]);
  } else {
    return h.p(attributes, [content]);
  }
};

/** 呈现 Card title slot，并保留调用方选择的原生标题层级。 */
export const titleView = <Message>(
  config: TitleViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = cardVariants();

  return titleElementView(
    config.element ?? "h3",
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.title(), config.className)),
      h.DataAttribute("slot", "card-title"),
    ],
    config.content,
    h,
  );
};

/** 呈现 Card description slot。 */
export const descriptionView = <Message>(
  config: DescriptionViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = cardVariants();

  return h.p(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.description(), config.className)),
      h.DataAttribute("slot", "card-description"),
    ],
    [config.content],
  );
};

/** 呈现 Card content slot。 */
export const contentView = <Message>(
  config: ContainerViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = cardVariants();

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.content(), config.className)),
      h.DataAttribute("slot", "card-content"),
    ],
    config.content,
  );
};

/** 呈现 Card footer slot。 */
export const footerView = <Message>(
  config: ContainerViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = cardVariants();

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.footer(), config.className)),
      h.DataAttribute("slot", "card-footer"),
    ],
    config.content,
  );
};

const Card = { view, headerView, titleView, descriptionView, contentView, footerView };

/** Foldkit-native 的 HeroUI Card 视觉投射。 */
export default Card;
