import type { MeterVariants } from "@heroui/styles/components/meter";
import { meterVariants } from "@heroui/styles/components/meter";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { percentage } from "./internal/progress";
import { classes } from "./shared";

type Content = string | Html;

/** Meter 的视觉、范围语义与内容配置。范围默认 0/100；自定义 min/max 必须有限且 min < max，value 必须有限且 min ≤ value ≤ max。 */
export type ViewConfig<Message> = MeterVariants &
  Readonly<{
    accessibleLabel: string;
    value: number;
    minValue?: number;
    maxValue?: number;
    valueText?: string;
    label?: Content;
    output?: Content;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** 使用原生 meter ARIA 值语义投射 HeroUI Meter anatomy。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const slots = meterVariants({ color: config.color, size: config.size });
  const minValue = config.minValue ?? 0;
  const maxValue = config.maxValue ?? 100;

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Role("meter"),
      h.AriaLabel(config.accessibleLabel),
      h.AriaValuemin(minValue),
      h.AriaValuemax(maxValue),
      h.AriaValuenow(config.value),
      ...(config.valueText === undefined ? [] : [h.AriaValuetext(config.valueText)]),
      h.Class(classes(slots.base(), config.className)),
      h.DataAttribute("slot", "meter"),
    ],
    [
      ...(config.label === undefined
        ? []
        : [h.span([h.DataAttribute("slot", "label")], [config.label])]),
      ...(config.output === undefined
        ? []
        : [
            h.span(
              [h.Class(slots.output()), h.DataAttribute("slot", "meter-output")],
              [config.output],
            ),
          ]),
      h.div(
        [h.Class(slots.track()), h.DataAttribute("slot", "meter-track")],
        [
          h.div([
            h.Style({ width: `${percentage(config.value, minValue, maxValue)}%` }),
            h.Class(slots.fill()),
            h.DataAttribute("slot", "meter-fill"),
          ]),
        ],
      ),
    ],
  );
};

const Meter = { view };

/** Foldkit-native 的 HeroUI Meter 视觉与原生值语义投射。 */
export default Meter;
