import { Schema as S } from "effect";
import type { HtmlBuilder } from "foldkit/html";
import { m } from "foldkit/message";
import * as Scene from "foldkit/scene";
import { describe, test } from "vitest";

import { Input } from "@pkg/ui";

const Model = S.Struct({ value: S.String });
type Model = typeof Model.Type;

const ChangedStyledInputValue = m("ChangedStyledInputValue", { value: S.String });
const Message = S.Union([ChangedStyledInputValue]);
type Message = typeof Message.Type;

const update = (model: Model, message: Message) => {
  switch (message._tag) {
    case "ChangedStyledInputValue":
      return [Model.make({ value: message.value }), []] as const;
  }
};

const view = (model: Model, h: HtmlBuilder<Message>) =>
  h.div(
    [],
    [
      Input.view(
        {
          id: "invoice-amount",
          label: "Invoice amount",
          description: "Shown on the invoice",
          value: model.value,
          onInput: (value) => ChangedStyledInputValue({ value }),
        },
        h,
      ),
      h.output([], [model.value]),
    ],
  );

const errorsView = (model: Model, h: HtmlBuilder<Message>) =>
  Input.view(
    {
      id: "account-name",
      label: "Account name",
      description: h.ul(
        [],
        [h.li([], ["Name is required"]), h.li([], ["Use 80 characters or fewer"])],
      ),
      value: model.value,
      onInput: (value) => ChangedStyledInputValue({ value }),
      isInvalid: true,
    },
    h,
  );

const constrainedView = (model: Model, h: HtmlBuilder<Message>) =>
  Input.view(
    {
      id: "reference-code",
      label: "Reference code",
      value: model.value,
      onInput: (value) => ChangedStyledInputValue({ value }),
      isDisabled: true,
      isReadOnly: true,
      isInvalid: true,
      isAutofocus: true,
      name: "referenceCode",
      type: "search",
      placeholder: "Search codes",
    },
    h,
  );

const validatingView = (model: Model, h: HtmlBuilder<Message>) =>
  Input.view(
    {
      id: "workspace-name",
      label: "Workspace name",
      description: "Checking availability",
      value: model.value,
      onInput: (value) => ChangedStyledInputValue({ value }),
    },
    h,
  );

describe("Styled Input", () => {
  test("用户输入后可以观察父级控制的 value 与 Description Channel", () => {
    const input = Scene.role("textbox", { name: "Invoice amount" });

    Scene.scene(
      { update, view },
      Scene.given(Model.make({ value: "" })),
      Scene.expect(input).toHaveAccessibleDescription("Shown on the invoice"),
      Scene.type(input, "42.00"),
      Scene.expect(input).toHaveValue("42.00"),
      Scene.expect(Scene.text("42.00")).toExist(),
    );
  });

  test("多条 errors 共享同一个可访问 Description Channel", () => {
    const input = Scene.role("textbox", { name: "Account name" });

    Scene.scene(
      { update, view: errorsView },
      Scene.given(Model.make({ value: "" })),
      Scene.expect(input).toHaveAccessibleDescription(
        /Name is required.*Use 80 characters or fewer/,
      ),
      Scene.expect(input).toHaveAttr("aria-invalid", "true"),
    );
  });

  test("保留 Foldkit Input 的原生状态与表单属性", () => {
    const input = Scene.role("searchbox", { name: "Reference code", disabled: true });

    Scene.scene(
      { update, view: constrainedView },
      Scene.given(Model.make({ value: "ABC" })),
      Scene.expect(input).toBeDisabled(),
      Scene.expect(input).toHaveAttr("data-readonly"),
      Scene.expect(input).toHaveAttr("aria-invalid", "true"),
      Scene.expect(input).toHaveAttr("autofocus"),
      Scene.expect(input).toHaveAttr("name", "referenceCode"),
      Scene.expect(input).toHaveAttr("type", "search"),
      Scene.expect(input).toHaveAttr("placeholder", "Search codes"),
      Scene.expect(input).toHaveValue("ABC"),
      Scene.expect(input).toHaveAttr("aria-describedby", "reference-code-description"),
      Scene.expect(Scene.selector("#reference-code-description")).toExist(),
      Scene.expect(input).toHaveAccessibleDescription(""),
    );
  });

  test("validating 内容替换 Description Channel 内容而不改变关联", () => {
    const input = Scene.role("textbox", { name: "Workspace name" });

    Scene.scene(
      { update, view: validatingView },
      Scene.given(Model.make({ value: "foldkit" })),
      Scene.expect(input).toHaveAttr("aria-describedby", "workspace-name-description"),
      Scene.expect(input).toHaveAccessibleDescription("Checking availability"),
    );
  });
});
