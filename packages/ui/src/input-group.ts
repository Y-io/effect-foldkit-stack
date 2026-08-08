import type { InputGroupVariants } from "@heroui/styles/components/input-group";
import { inputGroupVariants } from "@heroui/styles/components/input-group";
import type { Html, HtmlBuilder } from "foldkit/html";

import type { ViewConfig as InputViewConfig } from "./input";
import { render } from "./internal/input";
import { classes } from "./shared";

type Content = string | Html;

export type DecorativeAffix = Readonly<{
  kind: "decorative";
  content: Content;
  isHiddenFromAccessibility?: boolean;
  className?: string;
}>;

export type ClassNames = Partial<
  Readonly<{
    group: string;
    prefix: string;
    suffix: string;
  }>
>;

export type ViewConfig<Message> = InputGroupVariants &
  Readonly<{
    input: Omit<InputViewConfig<Message>, "isFullWidth" | "variant">;
    prefix?: DecorativeAffix;
    suffix?: DecorativeAffix;
    classNames?: ClassNames;
  }>;

const affixView = <Message>(
  affix: DecorativeAffix,
  slot: "prefix" | "suffix",
  className: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.span(
    [
      h.Class(classes(className, affix.className)),
      h.DataAttribute("slot", `input-group-${slot}`),
      ...(affix.isHiddenFromAccessibility === true ? [h.AriaHidden(true)] : []),
    ],
    [affix.content],
  );

export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const { input, prefix, suffix, fullWidth = false, variant, classNames = {} } = config;
  const slots = inputGroupVariants({ fullWidth, variant });

  return render({ ...input, isFullWidth: fullWidth }, h, (attributes, inputClassName, builder) =>
    builder.div(
      [
        builder.Class(classes(slots.base(), "pkg-ui-input-group", classNames.group)),
        builder.DataAttribute("slot", "input-group"),
      ],
      [
        ...(prefix === undefined
          ? []
          : [affixView(prefix, "prefix", slots.prefix({ className: classNames.prefix }), builder)]),
        builder.input([
          ...attributes,
          builder.Class(classes(slots.input(), "pkg-ui-input", inputClassName)),
          builder.DataAttribute("slot", "input-group-input"),
        ]),
        ...(suffix === undefined
          ? []
          : [affixView(suffix, "suffix", slots.suffix({ className: classNames.suffix }), builder)]),
      ],
    ),
  );
};

const InputGroup = { view } as const;

export default InputGroup;
