import type { DescriptionVariants } from "@heroui/styles/components/description";
import { descriptionVariants } from "@heroui/styles/components/description";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** Description Channel 的原生关系与视觉配置。 */
export type ViewConfig<Message> = DescriptionVariants &
  Readonly<{
    content: ReadonlyArray<Content>;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** 使用稳定容器投射 HeroUI Description 视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      ...(config.attributes ?? []),
      h.Class(classes(descriptionVariants(), config.className)),
      h.DataAttribute("slot", "description"),
    ],
    config.content,
  );

const Description = { view };

/** Foldkit-native 的 HeroUI Description 视觉投射。 */
export default Description;
