import type { FieldErrorVariants } from "@heroui/styles/components/field-error";
import { fieldErrorVariants } from "@heroui/styles/components/field-error";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** FieldError 的稳定描述容器与视觉配置。 */
export type ViewConfig<Message> = FieldErrorVariants &
  Readonly<{
    content: ReadonlyArray<Content>;
    isVisible?: boolean;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** 呈现外层字段提供的错误内容并投射 HeroUI FieldError 视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const visibilityAttributes = config.isVisible ? [h.DataAttribute("visible", "")] : [];

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Class(classes(fieldErrorVariants(), config.className)),
      h.DataAttribute("slot", "field-error"),
      ...visibilityAttributes,
    ],
    config.content,
  );
};

const FieldError = { view };

/** Foldkit-native 的 HeroUI FieldError 视觉投射。 */
export default FieldError;
