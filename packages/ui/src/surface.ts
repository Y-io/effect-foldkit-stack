import type { SurfaceVariants } from "@heroui/styles/components/surface";
import { surfaceVariants } from "@heroui/styles/components/surface";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** Surface 的无状态内容容器配置。 */
export type ViewConfig<Message> = SurfaceVariants &
  Readonly<{
    content: ReadonlyArray<Content>;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** 使用原生容器投射 HeroUI Surface 视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const { content, attributes = [], className, variant = "default" } = config;

  return h.div(
    [
      ...attributes,
      h.Class(classes(surfaceVariants({ variant }), className)),
      h.DataAttribute("slot", "surface"),
    ],
    content,
  );
};

const Surface = { view };

/** Foldkit-native 的 HeroUI Surface 视觉投射。 */
export default Surface;
