import type { CloseButtonVariants } from "@heroui/styles/components/close-button";
import { closeButtonVariants } from "@heroui/styles/components/close-button";
import type { Html, HtmlBuilder } from "foldkit/html";

import * as Icons from "./icons";
import ButtonPrimitive from "./primitives/button";
import { classes } from "./shared";

/** CloseButton 的 HeroUI 视觉和 Foldkit Button 行为配置。 */
export type ViewConfig<Message> = CloseButtonVariants &
  Readonly<{
    accessibleLabel: string;
    onClick?: Message;
    isDisabled?: boolean;
    className?: string;
    icon?: Html;
  }>;

/** 使用 Foldkit Button 投射 HeroUI CloseButton，不持有父级关闭状态。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const styles = closeButtonVariants({ variant: config.variant });

  return ButtonPrimitive.view(
    {
      ...(config.onClick === undefined ? {} : { onClick: config.onClick }),
      isDisabled: config.isDisabled ?? false,
      type: "button",
      toView: ({ button }) =>
        h.button(
          [
            ...button,
            h.AriaLabel(config.accessibleLabel),
            h.DataAttribute("slot", "close-button"),
            h.Class(classes(styles, config.className)),
          ],
          [h.span([h.DataAttribute("slot", "close-button-icon")], [config.icon ?? Icons.close(h)])],
        ),
    },
    h,
  );
};

const CloseButton = { view };

/** Foldkit-native 的 HeroUI CloseButton 视觉与可访问名称适配。 */
export default CloseButton;
