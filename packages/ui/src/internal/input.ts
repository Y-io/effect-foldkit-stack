import type { InputVariants } from "@heroui/styles/components/input";
import type { Html, HtmlBuilder } from "foldkit/html";

import InputPrimitive, { type ViewConfig as PrimitiveViewConfig } from "../primitives/input";
import { classes } from "../shared";

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

type ControlView<Message> = (
  attributes: Parameters<NonNullable<PrimitiveViewConfig<Message>["toView"]>>[0]["input"],
  className: string | undefined,
  h: HtmlBuilder<Message>,
) => Html;

export const render = <Message>(
  config: ViewConfig<Message>,
  h: HtmlBuilder<Message>,
  controlView: ControlView<Message>,
): Html => {
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
            controlView(attributes.input, classNames.input, h),
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
