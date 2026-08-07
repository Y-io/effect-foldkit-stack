import type { Html, HtmlBuilder } from "foldkit/html";

/** Built-in decorative glyphs. Semantics stay on the owning control. */
export const close = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.ViewBox("0 0 24 24"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeWidth("2"),
      h.StrokeLinecap("round"),
      h.AriaHidden(true),
    ],
    [h.path([h.D("M6 6l12 12M18 6 6 18")], [])],
  );

export const chevronDown = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.ViewBox("0 0 24 24"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeWidth("2"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.AriaHidden(true),
      h.DataAttribute("slot", "combo-box-trigger-default-icon"),
    ],
    [h.path([h.D("m6 9 6 6 6-6")], [])],
  );

export const spinner = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.ViewBox("0 0 24 24"),
      h.Fill("none"),
      h.AriaHidden(true),
      h.DataAttribute("slot", "spinner"),
      h.Class("pkg-ui-spinner"),
    ],
    [
      h.circle(
        [h.Cx("12"), h.Cy("12"), h.R("9"), h.Stroke("currentColor"), h.StrokeWidth("3")],
        [],
      ),
      h.path(
        [
          h.D("M21 12a9 9 0 0 0-9-9"),
          h.Stroke("currentColor"),
          h.StrokeWidth("3"),
          h.StrokeLinecap("round"),
        ],
        [],
      ),
    ],
  );
