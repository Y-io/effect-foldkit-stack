import type { SkeletonVariants } from "@heroui/styles/components/skeleton";
import { skeletonVariants } from "@heroui/styles/components/skeleton";
import { Array } from "effect";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** Skeleton 根元素的视觉与可选嵌套内容配置。 */
export type ViewConfig<Message> = SkeletonVariants &
  Readonly<{
    content?: ReadonlyArray<Content>;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** 使用原生 div 投射 HeroUI Skeleton 占位视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const slots = skeletonVariants({ animationType: config.animationType ?? "shimmer" });
  const attributes = [
    ...(config.attributes ?? []),
    h.Class(classes(slots.base(), config.className)),
    h.DataAttribute("slot", "skeleton"),
  ];

  if (config.content !== undefined && Array.isReadonlyArrayNonEmpty(config.content)) {
    return h.div(attributes, [...config.content]);
  } else {
    return h.div(attributes);
  }
};

const Skeleton = { view };

/** Foldkit-native 的 HeroUI Skeleton 视觉投射。 */
export default Skeleton;
