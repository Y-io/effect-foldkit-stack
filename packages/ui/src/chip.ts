import type { ChipVariants } from "@heroui/styles/components/chip";
import { chipVariants } from "@heroui/styles/components/chip";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** Chip 根元素的视觉与内容配置。 */
export type ViewConfig<Message> = ChipVariants &
  Readonly<{
    content: ReadonlyArray<Content>;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** Chip 标签 slot 的内容配置。 */
export type LabelViewConfig<Message> = Readonly<{
  content: Content;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

/** 使用原生 span 投射 HeroUI Chip 视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const slots = chipVariants({
    color: config.color ?? "default",
    size: config.size ?? "md",
    variant: config.variant ?? "secondary",
  });

  return h.span(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.base(), config.className)),
      h.DataAttribute("slot", "chip"),
    ],
    config.content,
  );
};

/** 呈现 Chip 的 label slot。 */
export const labelView = <Message>(
  config: LabelViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = chipVariants();

  return h.span(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.label(), config.className)),
      h.DataAttribute("slot", "chip-label"),
    ],
    [config.content],
  );
};

const Chip = { view, labelView };

/** Foldkit-native 的 HeroUI Chip 视觉投射。 */
export default Chip;
