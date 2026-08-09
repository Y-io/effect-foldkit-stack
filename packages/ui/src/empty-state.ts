import { emptyStateVariants } from "@heroui/styles/components/empty-state";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** EmptyState 根元素的视觉与调用方内容配置。 */
export type ViewConfig<Message> = Readonly<{
  content?: ReadonlyArray<Content>;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

/** 使用原生 div 投射 HeroUI EmptyState 视觉，不保存外层 empty 事实。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const attributes = [
    ...(config.attributes ?? []),
    h.Class(classes(emptyStateVariants(), config.className)),
    h.DataAttribute("slot", "empty-state"),
  ];

  if (config.content === undefined) {
    return h.div(attributes, ["No results found"]);
  } else {
    return h.div(attributes, [...config.content]);
  }
};

const EmptyState = { view };

/** Foldkit-native 的 HeroUI EmptyState 视觉投射。 */
export default EmptyState;
