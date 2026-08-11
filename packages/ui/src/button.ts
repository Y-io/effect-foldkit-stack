import type { ButtonVariants } from "@heroui/styles/components/button";
import { buttonVariants } from "@heroui/styles/components/button";
import type { Html, HtmlBuilder } from "foldkit/html";

import * as Icons from "./icons";
import ButtonPrimitive from "./primitives/button";
import { classes } from "./shared";

type StyleOptions = Omit<ButtonVariants, "fullWidth">;

export type ViewConfig<Message> = StyleOptions &
  Readonly<{
    content: string | Html;
    onClick?: Message;
    type?: "button" | "submit" | "reset";
    isAutofocus?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    isFullWidth?: boolean;
    leading?: Html;
    trailing?: Html;
    className?: string;
  }>;

export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const {
    content,
    onClick,
    type,
    isAutofocus,
    isDisabled = false,
    isLoading = false,
    isFullWidth = false,
    leading,
    trailing,
    className,
    isIconOnly,
    size,
    variant,
  } = config;

  return ButtonPrimitive.view(
    {
      ...(onClick === undefined ? {} : { onClick }),
      ...(type === undefined ? {} : { type }),
      ...(isAutofocus === undefined ? {} : { isAutofocus }),
      isDisabled: isDisabled || isLoading,
      toView: ({ button }) =>
        h.button(
          [
            ...button,
            h.Class(
              classes(
                buttonVariants({ fullWidth: isFullWidth, isIconOnly, size, variant }),
                className,
              ),
            ),
            h.DataAttribute("slot", "button"),
            ...(isLoading ? [h.AriaBusy(true), h.DataAttribute("pending", "true")] : []),
          ],
          [
            ...(isLoading ? [Icons.spinner(h)] : []),
            ...(leading === undefined
              ? []
              : [h.span([h.DataAttribute("slot", "leading")], [leading])]),
            content,
            ...(trailing === undefined
              ? []
              : [h.span([h.DataAttribute("slot", "trailing")], [trailing])]),
          ],
        ),
    },
    h,
  );
};

const Button = { view };

export default Button;
