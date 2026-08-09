import type { ErrorMessageVariants } from "@heroui/styles/components/error-message";
import { errorMessageVariants } from "@heroui/styles/components/error-message";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** ErrorMessage 的外部校验事实与视觉配置。 */
export type ViewConfig<Message> = ErrorMessageVariants &
  Readonly<{
    content: ReadonlyArray<Content>;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** 呈现调用方提供的错误事实并投射 HeroUI ErrorMessage 视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      ...(config.attributes ?? []),
      h.Class(classes(errorMessageVariants(), config.className)),
      h.DataAttribute("slot", "error-message"),
    ],
    config.content,
  );

const ErrorMessage = { view };

/** Foldkit-native 的 HeroUI ErrorMessage 视觉投射。 */
export default ErrorMessage;
