import type { ButtonGroupVariants } from "@heroui/styles/components/button-group";
import { buttonGroupVariants } from "@heroui/styles/components/button-group";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

/** ButtonGroup 根元素的纯视觉排列配置。 */
export type ViewConfig<Message> = ButtonGroupVariants &
  Readonly<{
    content: ReadonlyArray<Html>;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** ButtonGroup 相邻成员间的纯视觉分隔配置。 */
export type SeparatorViewConfig = Readonly<{
  className?: string;
}>;

/** 组织相邻 Button 的 HeroUI Control Surface，不协调成员行为。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const slots = buttonGroupVariants({
    fullWidth: config.fullWidth ?? false,
    orientation: config.orientation ?? "horizontal",
  });

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.base(), config.className)),
      h.DataAttribute("slot", "button-group"),
    ],
    config.content,
  );
};

/** 呈现 ButtonGroup 成员间的装饰性 separator。 */
export const separatorView = <Message>(
  config: SeparatorViewConfig,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = buttonGroupVariants();

  return h.span([
    h.AriaHidden(true),
    h.Class(classes(slots.separator(), config.className)),
    h.DataAttribute("slot", "button-group-separator"),
  ]);
};

const ButtonGroup = { view, separatorView };

export default ButtonGroup;
