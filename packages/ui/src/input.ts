import { inputVariants } from "@heroui/styles/components/input";
import type { Html, HtmlBuilder } from "foldkit/html";

import { type ClassNames, render, type ViewConfig } from "./internal/input";
import { classes } from "./shared";

export type { ClassNames, ViewConfig };

export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const { variant, isFullWidth = false } = config;

  return render(config, h, (attributes, className, builder) =>
    builder.input([
      ...attributes,
      builder.Class(
        classes(inputVariants({ fullWidth: isFullWidth, variant }), "pkg-ui-input", className),
      ),
      builder.DataAttribute("slot", "input"),
    ]),
  );
};

const Input = { view } as const;

export default Input;
