import type { LabelVariants } from "@heroui/styles/components/label";
import { labelVariants } from "@heroui/styles/components/label";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** Label 的原生字段关系与视觉配置。 */
export type ViewConfig<Message> = LabelVariants &
  Readonly<{
    content: Content;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** 使用真实 label 元素投射 HeroUI 字段标签视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const {
    content,
    attributes = [],
    className,
    isDisabled = false,
    isInvalid = false,
    isRequired = false,
  } = config;

  return h.label(
    [
      ...attributes,
      h.Class(classes(labelVariants({ isDisabled, isInvalid, isRequired }), className)),
      h.DataAttribute("slot", "label"),
    ],
    [content],
  );
};

const Label = { view };

/** Foldkit-native 的 HeroUI Label 视觉投射。 */
export default Label;
