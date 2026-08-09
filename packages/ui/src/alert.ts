import type { AlertVariants } from "@heroui/styles/components/alert";
import { alertVariants } from "@heroui/styles/components/alert";
import { Schema as S } from "effect";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** Alert 使用的原生 live-region 角色。 */
export const SemanticRole = S.Literals(["alert", "status"]);
export type SemanticRole = typeof SemanticRole.Type;

/** Alert 根元素的视觉、原生语义与内容配置。 */
export type ViewConfig<Message> = AlertVariants &
  Readonly<{
    semanticRole: SemanticRole;
    content: ReadonlyArray<Content>;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** Alert 普通容器 slot 的配置。 */
export type ContainerViewConfig<Message> = Readonly<{
  content: ReadonlyArray<Content>;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

/** Alert 文本 slot 的配置。 */
export type TextViewConfig<Message> = Readonly<{
  content: Content;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

/** 使用原生 alert 或 status 角色投射 HeroUI Alert root 视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const slots = alertVariants({ status: config.status ?? "default" });

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Role(config.semanticRole),
      h.Class(classes(slots.base(), config.className)),
      h.DataAttribute("slot", "alert-root"),
    ],
    config.content,
  );
};

/** 呈现 Alert indicator slot；图标与语义由调用方内容提供。 */
export const indicatorView = <Message>(
  config: ContainerViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = alertVariants();

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.indicator(), config.className)),
      h.DataAttribute("slot", "alert-indicator"),
    ],
    config.content,
  );
};

/** 呈现 Alert content slot。 */
export const contentView = <Message>(
  config: ContainerViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = alertVariants();

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.content(), config.className)),
      h.DataAttribute("slot", "alert-content"),
    ],
    config.content,
  );
};

/** 呈现 Alert title slot。 */
export const titleView = <Message>(
  config: TextViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = alertVariants();

  return h.p(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.title(), config.className)),
      h.DataAttribute("slot", "alert-title"),
    ],
    [config.content],
  );
};

/** 呈现 Alert description slot。 */
export const descriptionView = <Message>(
  config: TextViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = alertVariants();

  return h.span(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.description(), config.className)),
      h.DataAttribute("slot", "alert-description"),
    ],
    [config.content],
  );
};

const Alert = { view, indicatorView, contentView, titleView, descriptionView };

/** Foldkit-native 的 HeroUI Alert 视觉与原生 live-region 语义投射。 */
export default Alert;
