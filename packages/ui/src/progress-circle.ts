import type { ProgressCircleVariants } from "@heroui/styles/components/progress-circle";
import { progressCircleVariants } from "@heroui/styles/components/progress-circle";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import type { ProgressRange, ProgressValue } from "./internal/progress";
import { percentage, valueAttributes } from "./internal/progress";
import { classes } from "./shared";

const STROKE_WIDTH = 4;
const CENTER = 18;
const RADIUS = CENTER - STROKE_WIDTH / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const INDETERMINATE_PERCENTAGE = 25;

/** ProgressCircle 与 ProgressBar 共用的值契约。范围默认 0/100；自定义 min/max 必须有限且 min < max，确定型 value 必须有限且 min ≤ value ≤ max。 */
export type Value = ProgressRange & ProgressValue;

/** ProgressCircle 的视觉和值语义配置。 */
export type ViewConfig<Message> = ProgressCircleVariants &
  Value &
  Readonly<{
    accessibleLabel: string;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** 使用原生 progressbar ARIA 值语义投射 HeroUI ProgressCircle anatomy。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const slots = progressCircleVariants({ color: config.color, size: config.size });
  const minValue = config.minValue ?? 0;
  const maxValue = config.maxValue ?? 100;
  const valuePercentage = config.isIndeterminate
    ? INDETERMINATE_PERCENTAGE
    : percentage(config.value, minValue, maxValue);
  const strokeDashoffset = CIRCUMFERENCE - (valuePercentage / 100) * CIRCUMFERENCE;

  return h.div(
    [
      ...(config.attributes ?? []),
      h.Role("progressbar"),
      h.AriaLabel(config.accessibleLabel),
      ...valueAttributes(config, minValue, maxValue, h),
      h.Class(classes(slots.base(), config.className)),
      h.DataAttribute("slot", "progress-circle"),
    ],
    [
      h.svg(
        [
          h.AriaHidden(true),
          h.Class(slots.track()),
          h.DataAttribute("slot", "progress-circle-track"),
          h.Fill("none"),
          h.ViewBox(`0 0 ${CENTER * 2} ${CENTER * 2}`),
        ],
        [
          h.circle([
            h.Class(slots.trackCircle()),
            h.Cx(String(CENTER)),
            h.Cy(String(CENTER)),
            h.DataAttribute("slot", "progress-circle-track-circle"),
            h.R(String(RADIUS)),
            h.StrokeWidth(String(STROKE_WIDTH)),
          ]),
          h.circle([
            h.Class(slots.fillCircle()),
            h.Cx(String(CENTER)),
            h.Cy(String(CENTER)),
            h.DataAttribute("slot", "progress-circle-fill-circle"),
            h.R(String(RADIUS)),
            h.StrokeDasharray(String(CIRCUMFERENCE)),
            h.StrokeDashoffset(String(strokeDashoffset)),
            h.StrokeLinecap("round"),
            h.StrokeWidth(String(STROKE_WIDTH)),
            h.Transform(`rotate(-90 ${CENTER} ${CENTER})`),
          ]),
        ],
      ),
    ],
  );
};

const ProgressCircle = { view };

/** Foldkit-native 的 HeroUI ProgressCircle 视觉与原生值语义投射。 */
export default ProgressCircle;
