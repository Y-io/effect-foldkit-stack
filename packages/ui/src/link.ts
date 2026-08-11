import type { LinkVariants } from "@heroui/styles/components/link";
import { linkVariants } from "@heroui/styles/components/link";
import type { Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type SharedViewConfig = LinkVariants &
  Readonly<{
    content: string | Html;
    isCurrent?: boolean;
    className?: string;
  }>;

type EnabledViewConfig<Message> = Readonly<{
  href: string;
  onClick?: Message;
  isExternal?: boolean;
  isDisabled?: false;
}>;

type DisabledViewConfig = Readonly<{
  isDisabled: true;
}>;

/** Link 的 HeroUI 视觉和原生导航语义配置。 */
export type ViewConfig<Message> = SharedViewConfig &
  (EnabledViewConfig<Message> | DisabledViewConfig);

/** 使用原生 anchor 投射 HeroUI Link，不维护导航状态机。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const slots = linkVariants();

  if (config.isDisabled === true) {
    return h.a(
      [
        h.AriaDisabled(true),
        h.Class(classes(slots.base(), config.className)),
        h.DataAttribute("slot", "link"),
      ],
      [config.content],
    );
  }

  const isExternal = config.isExternal ?? false;

  return h.a(
    [
      h.Href(config.href),
      h.Tabindex(0),
      ...(config.onClick === undefined ? [] : [h.OnClick(config.onClick)]),
      ...(config.isCurrent === true
        ? [h.AriaCurrent("page"), h.DataAttribute("current", "true")]
        : []),
      ...(isExternal ? [h.Target("_blank"), h.Rel("noreferrer")] : []),
      h.Class(classes(slots.base(), config.className)),
      h.DataAttribute("slot", "link"),
    ],
    [
      config.content,
      ...(isExternal
        ? [
            h.span(
              [
                h.AriaHidden(true),
                h.Class(slots.icon()),
                h.DataAttribute("slot", "link-icon"),
                h.DataAttribute("default-icon", "true"),
              ],
              [
                h.svg(
                  [
                    h.ViewBox("0 0 24 24"),
                    h.AriaHidden(true),
                    h.Width("12"),
                    h.Height("12"),
                    h.DataAttribute("slot", "link-default-icon"),
                  ],
                  [
                    h.path([
                      h.D(
                        "M14 5h5v5h-2V8.4l-7.3 7.3-1.4-1.4L15.6 7H14V5ZM5 7h5v2H7v8h8v-3h2v5H5V7Z",
                      ),
                      h.Fill("currentColor"),
                    ]),
                  ],
                ),
              ],
            ),
          ]
        : []),
    ],
  );
};

const Link = { view };

export default Link;
