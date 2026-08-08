import { Schema as S } from "effect";
import type { HtmlBuilder } from "foldkit/html";
import { m } from "foldkit/message";
import * as Scene from "foldkit/scene";
import { describe, test } from "vitest";

import { InputGroup } from "@pkg/ui";
import type { ViewConfig as ButtonViewConfig } from "@pkg/ui/button";

const Model = S.Struct({ value: S.String });
type Model = typeof Model.Type;

const ChangedGroupedInputValue = m("ChangedGroupedInputValue", { value: S.String });
const Message = S.Union([ChangedGroupedInputValue]);
type Message = typeof Message.Type;

const ActionModel = S.Struct({ value: S.String, actionCount: S.Finite });
type ActionModel = typeof ActionModel.Type;

const ClickedPrefixAction = m("ClickedPrefixAction");
const ClickedSuffixAction = m("ClickedSuffixAction");
const ActionMessage = S.Union([ClickedPrefixAction, ClickedSuffixAction]);
type ActionMessage = typeof ActionMessage.Type;

const inheritedLoadingAction = {
  content: "Decrease",
  onClick: ClickedPrefixAction(),
  isLoading: true,
} satisfies ButtonViewConfig<ActionMessage>;

const update = (model: Model, message: Message) => {
  switch (message._tag) {
    case "ChangedGroupedInputValue":
      return [Model.make({ value: message.value }), []] as const;
  }
};

const actionUpdate = (model: ActionModel, message: ActionMessage) => {
  switch (message._tag) {
    case "ClickedPrefixAction":
    case "ClickedSuffixAction":
      return [ActionModel.make({ ...model, actionCount: model.actionCount + 1 }), []] as const;
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

const actionView = (model: ActionModel, h: HtmlBuilder<ActionMessage>) =>
  h.div(
    [],
    [
      InputGroup.view(
        {
          input: {
            id: "quantity",
            label: "Quantity",
            description: "Use the actions to adjust the quantity",
            value: model.value,
          },
          prefix: {
            kind: "action",
            button: inheritedLoadingAction,
          },
          suffix: {
            kind: "action",
            button: { content: "Increase", onClick: ClickedSuffixAction() },
          },
        },
        h,
      ),
      h.output([], [`actions:${model.actionCount}`]),
    ],
  );

const disabledActionView = (model: ActionModel, h: HtmlBuilder<ActionMessage>) =>
  h.div(
    [],
    [
      InputGroup.view(
        {
          isDisabled: true,
          input: {
            id: "disabled-quantity",
            label: "Disabled quantity",
            value: model.value,
          },
          prefix: {
            kind: "action",
            button: { content: "Decrease disabled", onClick: ClickedPrefixAction() },
          },
          suffix: {
            kind: "action",
            button: { content: "Increase disabled", onClick: ClickedSuffixAction() },
          },
        },
        h,
      ),
      h.output([], [`actions:${model.actionCount}`]),
    ],
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

  test("启用的 Action Affix 保留 accessible name 与各自的操作 Message", () => {
    const input = Scene.role("textbox", { name: "Quantity" });
    const decrease = Scene.role("button", { name: "Decrease" });
    const increase = Scene.role("button", { name: "Increase" });

    Scene.scene(
      { update: actionUpdate, view: actionView },
      Scene.given(ActionModel.make({ value: "1", actionCount: 0 })),
      Scene.expect(input).toHaveAccessibleDescription("Use the actions to adjust the quantity"),
      Scene.expect(decrease).toExist(),
      Scene.expect(increase).toExist(),
      Scene.click(decrease),
      Scene.expect(Scene.text("actions:1")).toExist(),
      Scene.click(increase),
      Scene.expect(Scene.text("actions:2")).toExist(),
    );
  });

  test("一次 Group Disabled 同时下发给主 Input 与所有 Action Affix", () => {
    const input = Scene.role("textbox", { name: "Disabled quantity", disabled: true });
    const decrease = Scene.role("button", { name: "Decrease disabled", disabled: true });
    const increase = Scene.role("button", { name: "Increase disabled", disabled: true });

    Scene.scene(
      { update: actionUpdate, view: disabledActionView },
      Scene.given(ActionModel.make({ value: "1", actionCount: 0 })),
      Scene.expect(input).toBeDisabled(),
      Scene.expect(decrease).toHaveAttr("aria-disabled", "true"),
      Scene.expect(decrease).toHaveAttr("data-disabled"),
      Scene.expect(increase).toHaveAttr("aria-disabled", "true"),
      Scene.expect(increase).toHaveAttr("data-disabled"),
      Scene.expect(Scene.text("actions:0")).toExist(),
    );
  });
});
