import type { ProgressBarVariants } from "@heroui/styles/components/progress-bar";
import { progressBarVariants } from "@heroui/styles/components/progress-bar";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import type { ProgressRange, ProgressValue } from "./internal/progress";
import { percentage, valueAttributes } from "./internal/progress";
import { classes } from "./shared";

type Content = string | Html;

/** ProgressBar 共用的值契约。范围默认 0/100；自定义 min/max 必须有限且 min < max，确定型 value 必须有限且 min ≤ value ≤ max。 */
export type Value = ProgressRange & ProgressValue;

/** ProgressBar 的视觉、值语义与内容配置。 */
export type ViewConfig<Message> = ProgressBarVariants &
  Value &
  Readonly<{
    accessibleLabel: string;
    label?: Content;
    output?: Content;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** 使用原生 progressbar ARIA 值语义投射 HeroUI ProgressBar anatomy。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const slots = progressBarVariants({ color: config.color, size: config.size });
  const minValue = config.minValue ?? 0;
  const maxValue = config.maxValue ?? 100;
  const fillAttributes = config.isIndeterminate
    ? []
    : [
        h.Style({
          width: `${percentage(config.value, minValue, maxValue)}%`,
        }),
      ];

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Role("progressbar"),
      h.AriaLabel(config.accessibleLabel),
      ...valueAttributes(config, minValue, maxValue, h),
      h.Class(classes(slots.base(), config.className)),
      h.DataAttribute("slot", "progress-bar"),
    ],
    [
      ...(config.label === undefined
        ? []
        : [h.span([h.DataAttribute("slot", "label")], [config.label])]),
      ...(config.output === undefined
        ? []
        : [
            h.span(
              [h.Class(slots.output()), h.DataAttribute("slot", "progress-bar-output")],
              [config.output],
            ),
          ]),
      h.div(
        [h.Class(slots.track()), h.DataAttribute("slot", "progress-bar-track")],
        [
          h.div([
            ...fillAttributes,
            h.Class(slots.fill()),
            h.DataAttribute("slot", "progress-bar-fill"),
          ]),
        ],
      ),
    ],
  );
};

const ProgressBar = { view };

/** Foldkit-native 的 HeroUI ProgressBar 视觉与原生值语义投射。 */
export default ProgressBar;
