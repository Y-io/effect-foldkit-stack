import { Schema as S } from "effect";
import type { HtmlBuilder } from "foldkit/html";
import { m } from "foldkit/message";
import * as Scene from "foldkit/scene";
import { describe, test } from "vitest";

import { InputGroup } from "@pkg/ui";

const Model = S.Struct({ value: S.String });
type Model = typeof Model.Type;

const ChangedGroupedInputValue = m("ChangedGroupedInputValue", { value: S.String });
const Message = S.Union([ChangedGroupedInputValue]);
type Message = typeof Message.Type;

const update = (model: Model, message: Message) => {
  switch (message._tag) {
    case "ChangedGroupedInputValue":
      return [Model.make({ value: message.value }), []] as const;
  }
};

const view = (model: Model, h: HtmlBuilder<Message>) =>
  h.div(
    [],
    [
      InputGroup.view(
        {
          input: {
            id: "invoice-amount",
            label: "Invoice amount",
            description: "Amount in US dollars",
            value: model.value,
            onInput: (value) => ChangedGroupedInputValue({ value }),
          },
          prefix: {
            kind: "decorative",
            content: "$",
            isHiddenFromAccessibility: true,
          },
          suffix: {
            kind: "decorative",
            content: "USD",
          },
        },
        h,
      ),
      h.output([], [model.value]),
    ],
  );

const stateView = (model: Model, h: HtmlBuilder<Message>) =>
  InputGroup.view(
    {
      input: {
        id: "derived-state",
        label: "Derived state",
        description: "State remains owned by the Foldkit Input",
        value: model.value,
        isInvalid: true,
        isReadOnly: true,
      },
    },
    h,
  );

describe("Decorative Input Group", () => {
  test("组合恰好一个主 Input，并保留父级 Message 与 Description Channel", () => {
    const input = Scene.role("textbox", { name: "Invoice amount" });

    Scene.scene(
      { update, view },
      Scene.given(Model.make({ value: "" })),
      Scene.expect(input).toHaveAccessibleDescription("Amount in US dollars"),
      Scene.expect(Scene.text("$")).toHaveAttr("aria-hidden", "true"),
      Scene.expect(Scene.text("USD")).not.toHaveAttr("aria-hidden"),
      Scene.expect(Scene.text("USD")).toExist(),
      Scene.expect(Scene.nth(Scene.all.role("textbox"), 1)).toBeAbsent(),
      Scene.type(input, "125.00"),
      Scene.expect(input).toHaveValue("125.00"),
      Scene.expect(Scene.text("125.00")).toExist(),
    );
  });

  test("invalid 与 readonly 语义仍只由主 Foldkit Input 输出", () => {
    const input = Scene.role("textbox", { name: "Derived state" });

    Scene.scene(
      { update, view: stateView },
      Scene.given(Model.make({ value: "locked" })),
      Scene.expect(input).toHaveAttr("aria-invalid", "true"),
      Scene.expect(input).toHaveAttr("data-readonly"),
      Scene.expect(input).toHaveAccessibleDescription("State remains owned by the Foldkit Input"),
      Scene.expect(input).toHaveValue("locked"),
    );
  });
});
