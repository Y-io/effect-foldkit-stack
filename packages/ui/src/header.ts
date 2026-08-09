import { headerVariants } from "@heroui/styles/components/header";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** Header 的原生容器与视觉配置。 */
export type ViewConfig<Message> = Readonly<{
  content: ReadonlyArray<Content>;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

/** 使用真实 header 元素投射 HeroUI Header 视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html =>
  h.header(
    [
      ...(config.attributes ?? []),
      h.Class(classes(headerVariants(), config.className)),
      h.DataAttribute("slot", "header"),
    ],
    config.content,
  );

const Header = { view };

/** Foldkit-native 的 HeroUI Header 视觉投射。 */
export default Header;
