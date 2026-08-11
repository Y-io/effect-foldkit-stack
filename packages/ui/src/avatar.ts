import type { AvatarVariants } from "@heroui/styles/components/avatar";
import { avatarVariants } from "@heroui/styles/components/avatar";
import { Schema as S } from "effect";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** Avatar 图片由外层 Model 持有的可观察阶段。 */
export const ImageStatus = S.Literals(["Loading", "Loaded", "Failed", "Missing"]);
export type ImageStatus = typeof ImageStatus.Type;

/** Avatar 图片 source 与 Foldkit load/error Message 的适配配置。 */
export type ImageConfig<Message> = Readonly<{
  src: string;
  onLoad: Message;
  onError: Message;
  loading?: "eager" | "lazy";
}>;

/** Avatar 的图片阶段。可渲染图片的阶段必须携带 Foldkit 事件配置。 */
export type ImageState<Message> =
  | Readonly<{ _tag: "Loading"; image: ImageConfig<Message> }>
  | Readonly<{ _tag: "Loaded"; image: ImageConfig<Message> }>
  | Readonly<{ _tag: "Failed" }>
  | Readonly<{ _tag: "Missing" }>;

/** Avatar 的 HeroUI 视觉、外层图片状态与 fallback 内容配置。 */
export type ViewConfig<Message> = AvatarVariants &
  Readonly<{
    accessibleLabel: string;
    imageState: ImageState<Message>;
    fallback: Content;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** 使用 Foldkit 原生图片事件投射 HeroUI Avatar 图片与 fallback anatomy。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const slots = avatarVariants({ color: config.color, size: config.size, variant: config.variant });
  const image =
    config.imageState._tag === "Loading" || config.imageState._tag === "Loaded"
      ? config.imageState.image
      : undefined;

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Role("img"),
      h.AriaLabel(config.accessibleLabel),
      h.Class(classes(slots.base(), config.className)),
      h.DataAttribute("slot", "avatar"),
    ],
    [
      h.span(
        [h.AriaHidden(true), h.Class(slots.fallback()), h.DataAttribute("slot", "avatar-fallback")],
        [config.fallback],
      ),
      ...(image === undefined
        ? []
        : [
            h.img([
              h.AriaHidden(true),
              h.Alt(""),
              h.Class(slots.image()),
              h.DataAttribute("slot", "avatar-image"),
              h.DataAttribute("image-state", config.imageState._tag.toLowerCase()),
              h.Loading(image.loading ?? "eager"),
              h.OnLoad(image.onLoad),
              h.OnError(image.onError),
              h.Src(image.src),
            ]),
          ]),
    ],
  );
};

const Avatar = { view };

/** Foldkit-native 的 HeroUI Avatar 视觉与外层图片状态适配。 */
export default Avatar;
