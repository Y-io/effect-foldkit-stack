import type { KbdVariants } from "@heroui/styles/components/kbd";
import { kbdVariants } from "@heroui/styles/components/kbd";
import { Schema as S } from "effect";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** HeroUI 支持的键盘按键标识。 */
export const KbdKey = S.Literals([
  "command",
  "shift",
  "ctrl",
  "option",
  "enter",
  "delete",
  "escape",
  "tab",
  "capslock",
  "up",
  "right",
  "down",
  "left",
  "pageup",
  "pagedown",
  "home",
  "end",
  "help",
  "space",
  "fn",
  "win",
  "alt",
]);
export type KbdKey = typeof KbdKey.Type;

const keySymbols: Readonly<Record<KbdKey, string>> = {
  command: "⌘",
  shift: "⇧",
  ctrl: "⌃",
  option: "⌥",
  enter: "↵",
  delete: "⌫",
  escape: "⎋",
  tab: "⇥",
  capslock: "⇪",
  up: "↑",
  right: "→",
  down: "↓",
  left: "←",
  pageup: "⇞",
  pagedown: "⇟",
  home: "↖",
  end: "↘",
  help: "?",
  space: "␣",
  fn: "Fn",
  win: "⌘",
  alt: "⌥",
};

const keyLabels: Readonly<Record<KbdKey, string>> = {
  command: "Command",
  shift: "Shift",
  ctrl: "Control",
  option: "Option",
  enter: "Enter",
  delete: "Delete",
  escape: "Escape",
  tab: "Tab",
  capslock: "Caps Lock",
  up: "Up",
  right: "Right",
  down: "Down",
  left: "Left",
  pageup: "Page Up",
  pagedown: "Page Down",
  home: "Home",
  end: "End",
  help: "Help",
  space: "Space",
  fn: "Fn",
  win: "Win",
  alt: "Alt",
};

/** Kbd 根元素的视觉与内容配置。 */
export type ViewConfig<Message> = KbdVariants &
  Readonly<{
    content: ReadonlyArray<Content>;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** Kbd 按键缩写配置。 */
export type AbbrViewConfig<Message> = Readonly<{
  keyValue: KbdKey;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

/** Kbd 普通内容配置。 */
export type ContentViewConfig<Message> = Readonly<{
  content: Content;
  attributes?: ReadonlyArray<Attribute<Message>>;
  className?: string;
}>;

/** 使用真实 kbd 元素投射 HeroUI Kbd 视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const slots = kbdVariants({ variant: config.variant ?? "default" });

  return h.kbd(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.base(), config.className)),
      h.DataAttribute("slot", "kbd"),
    ],
    config.content,
  );
};

/** 以可读 title 呈现一个键盘按键缩写。 */
export const abbrView = <Message>(
  config: AbbrViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = kbdVariants();

  return h.abbr(
    [
      ...(config.attributes ?? []),
      h.Title(keyLabels[config.keyValue]),
      h.Class(classes(slots.abbr(), config.className)),
      h.DataAttribute("slot", "kbd-abbr"),
    ],
    [keySymbols[config.keyValue]],
  );
};

/** 呈现组合键中的调用方文本内容。 */
export const contentView = <Message>(
  config: ContentViewConfig<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const slots = kbdVariants();

  return h.span(
    [
      ...(config.attributes ?? []),
      h.Class(classes(slots.content(), config.className)),
      h.DataAttribute("slot", "kbd-content"),
    ],
    [config.content],
  );
};

const Kbd = { view, abbrView, contentView };

/** Foldkit-native 的 HeroUI Kbd 视觉投射。 */
export default Kbd;
