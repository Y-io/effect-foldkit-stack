import type { SeparatorVariants } from "@heroui/styles/components/separator";
import { separatorVariants } from "@heroui/styles/components/separator";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

/** Separator 的原生语义与视觉配置。 */
export type ViewConfig<Message> = SeparatorVariants &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** 使用原生 separator 语义投射 HeroUI 分隔线视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const { attributes = [], className, orientation = "horizontal", variant = "default" } = config;

  return h.div([
    ...attributes,
    h.Role("separator"),
    h.AriaOrientation(orientation),
    h.Class(classes(separatorVariants({ orientation, variant }), className)),
    h.DataAttribute("orientation", orientation),
    h.DataAttribute("slot", "separator"),
  ]);
};

const Separator = { view };

/** Foldkit-native 的 HeroUI Separator 视觉投射。 */
export default Separator;
