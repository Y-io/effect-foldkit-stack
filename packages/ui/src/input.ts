import type { InputVariants } from "@heroui/styles/components/input";
import { inputVariants } from "@heroui/styles/components/input";
import type { Html, HtmlBuilder } from "foldkit/html";

import InputPrimitive, { type ViewConfig as PrimitiveViewConfig } from "./primitives/input";
import { classes } from "./shared";

type StyleOptions = Omit<InputVariants, "fullWidth">;
type Content = string | Html;

export type ClassNames = Partial<
  Readonly<{
    field: string;
    label: string;
    input: string;
    description: string;
  }>
>;

export type ViewConfig<Message> = Omit<PrimitiveViewConfig<Message>, "toView"> &
  StyleOptions &
  Readonly<{
    label: Content;
    description?: Content;
    isFullWidth?: boolean;
    classNames?: ClassNames;
  }>;

export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const {
    id,
    label,
    description,
    onInput,
    value,
    isDisabled = false,
    isReadOnly = false,
    isInvalid = false,
    isAutofocus = false,
    name,
    type = "text",
    placeholder,
    variant,
    isFullWidth = false,
    classNames = {},
  } = config;

  return InputPrimitive.view(
    {
      id,
      ...(onInput === undefined ? {} : { onInput }),
      ...(value === undefined ? {} : { value }),
      isDisabled,
      isReadOnly,
      isInvalid,
      isAutofocus,
      ...(name === undefined ? {} : { name }),
      type,
      ...(placeholder === undefined ? {} : { placeholder }),
      toView: (attributes) =>
        h.div(
          [
            h.Class(
              classes(
                "textfield",
                isFullWidth ? "textfield--full-width" : undefined,
                classNames.field,
              ),
            ),
            h.DataAttribute("slot", "field"),
          ],
          [
            h.label([...attributes.label, h.Class(classes("label", classNames.label))], [label]),
            h.input([
              ...attributes.input,
              h.Class(
                classes(
                  inputVariants({ fullWidth: isFullWidth, variant }),
                  "pkg-ui-input",
                  classNames.input,
                ),
              ),
              h.DataAttribute("slot", "input"),
            ]),
            h.div(
              [
                ...attributes.description,
                h.Class(classes("description", classNames.description)),
                h.DataAttribute("slot", "description"),
              ],
              description === undefined ? [] : [description],
            ),
          ],
        ),
    },
    h,
  );
};

const Input = { view } as const;

export default Input;
