import type { SpinnerVariants } from "@heroui/styles/components/spinner";
import { spinnerVariants } from "@heroui/styles/components/spinner";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

/** Spinner 的视觉与原生 status 语义配置。 */
export type ViewConfig<Message> = SpinnerVariants &
  Readonly<{
    accessibleLabel: string;
    gradientId: string;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

/** 使用命名的原生 status 投射 HeroUI Spinner 视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const leadingGradientId = `${config.gradientId}-leading`;
  const trailingGradientId = `${config.gradientId}-trailing`;

  return h.span(
    [
      ...(config.attributes ?? []),
      h.Role("status"),
      h.AriaLabel(config.accessibleLabel),
      h.Class(
        classes(spinnerVariants({ color: config.color, size: config.size }), config.className),
      ),
      h.DataAttribute("slot", "spinner"),
    ],
    [
      h.svg(
        [
          h.AriaHidden(true),
          h.Class("size-full"),
          h.DataAttribute("slot", "spinner-icon"),
          h.ViewBox("0 0 24 24"),
          h.Fill("none"),
        ],
        [
          h.defs(
            [],
            [
              h.linearGradient(
                [
                  h.Id(leadingGradientId),
                  h.X1("50%"),
                  h.X2("50%"),
                  h.Y1("5.271%"),
                  h.Y2("91.793%"),
                ],
                [
                  h.stop([h.Offset("0%"), h.StopColor("currentColor")]),
                  h.stop([h.Offset("100%"), h.StopColor("currentColor"), h.StopOpacity("0.55")]),
                ],
              ),
              h.linearGradient(
                [
                  h.Id(trailingGradientId),
                  h.X1("50%"),
                  h.X2("50%"),
                  h.Y1("15.24%"),
                  h.Y2("87.15%"),
                ],
                [
                  h.stop([h.Offset("0%"), h.StopColor("currentColor"), h.StopOpacity("0")]),
                  h.stop([h.Offset("100%"), h.StopColor("currentColor"), h.StopOpacity("0.55")]),
                ],
              ),
            ],
          ),
          h.g(
            [h.Fill("none")],
            [
              h.path([
                h.D(
                  "M8.749.021a1.5 1.5 0 0 1 .497 2.958A7.5 7.5 0 0 0 3 10.375a7.5 7.5 0 0 0 7.5 7.5v3c-5.799 0-10.5-4.7-10.5-10.5C0 5.23 3.726.865 8.749.021",
                ),
                h.Fill(`url(#${leadingGradientId})`),
                h.Transform("translate(1.5 1.625)"),
              ]),
              h.path([
                h.D(
                  "M15.392 2.673a1.5 1.5 0 0 1 2.119-.115A10.48 10.48 0 0 1 21 10.375c0 5.8-4.701 10.5-10.5 10.5v-3a7.5 7.5 0 0 0 5.007-13.084 1.5 1.5 0 0 1-.115-2.118",
                ),
                h.Fill(`url(#${trailingGradientId})`),
                h.Transform("translate(1.5 1.625)"),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
};

const Spinner = { view };

/** Foldkit-native 的 HeroUI Spinner 视觉与原生 status 语义投射。 */
export default Spinner;
