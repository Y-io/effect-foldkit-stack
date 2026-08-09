import type { BadgeVariants } from "@heroui/styles/components/badge";
import { badgeVariants } from "@heroui/styles/components/badge";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** Badge 根元素的视觉与内容配置。 */
export type ViewConfig<Message> = BadgeVariants &
  Readonly<{
    content: ReadonlyArray<Content>;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** Badge 标签 slot 的内容配置。 */
export type LabelViewConfig<Message> = Readonly<{
  content: Content;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

/** Badge 定位锚点的内容配置。 */
export type AnchorViewConfig<Message> = Readonly<{
  content: ReadonlyArray<Content>;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

/** 使用原生 span 投射 HeroUI Badge 视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const slots = badgeVariants({
    color: config.color ?? "default",
    placement: config.placement ?? "top-right",
    size: config.size ?? "md",
    variant: config.variant ?? "primary",
  });

  return h.span(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.base(), config.className)),
      h.DataAttribute("slot", "badge"),
    ],
    config.content,
  );
};

/** 呈现 Badge 的 label slot。 */
export const labelView = <Message>(
  config: LabelViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = badgeVariants();

  return h.span(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.label(), config.className)),
      h.DataAttribute("slot", "badge-label"),
    ],
    [config.content],
  );
};

/** 呈现 Badge 的相对定位 anchor slot。 */
export const anchorView = <Message>(
  config: AnchorViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = badgeVariants();

  return h.span(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.anchor(), config.className)),
      h.DataAttribute("slot", "badge-anchor"),
    ],
    config.content,
  );
};

const Badge = { view, labelView, anchorView };

/** Foldkit-native 的 HeroUI Badge 视觉投射。 */
export default Badge;
