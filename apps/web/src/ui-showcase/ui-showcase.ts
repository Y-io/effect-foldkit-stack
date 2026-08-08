import { Match as M, Option, Schema as S } from "effect";
import { Command, Submodel } from "foldkit";
import type { Html, HtmlBuilder } from "foldkit/html";
import { m } from "foldkit/message";
import { evo } from "foldkit/struct";
import { Button, Combobox, Dialog, Input, InputGroup } from "@pkg/ui";

export const City = S.Literals(["dubai", "london", "shanghai"]);
export type City = typeof City.Type;

const cityLabels: Readonly<Record<City, string>> = {
  dubai: "Dubai",
  london: "London",
  shanghai: "Shanghai",
};

const CityCombobox = Combobox.create<City>();

export const Model = S.Struct({
  dialog: Dialog.Model,
  cityCombobox: Combobox.Model,
  maybeCity: S.Option(City),
});
export type Model = typeof Model.Type;

export const ClickedUiShowcaseDialog = m("ClickedUiShowcaseDialog");
export const GotUiShowcaseDialogMessage = m("GotUiShowcaseDialogMessage", {
  message: Dialog.Message,
});
export const GotUiShowcaseComboboxMessage = m("GotUiShowcaseComboboxMessage", {
  message: Combobox.Message,
});

export const Message = S.Union([
  ClickedUiShowcaseDialog,
  GotUiShowcaseDialogMessage,
  GotUiShowcaseComboboxMessage,
]);
export type Message = typeof Message.Type;

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>];
const withUpdateReturn = M.withReturnType<UpdateReturn>();

export const init = (): Model =>
  Model.make({
    dialog: Dialog.init({ id: "ui-showcase-dialog", isAnimated: true }),
    cityCombobox: Combobox.init({
      id: "ui-showcase-city",
      isAnimated: true,
      nullable: true,
    }),
    maybeCity: Option.none(),
  });

export const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ClickedUiShowcaseDialog: () => {
        const [dialog, commands] = Dialog.open(model.dialog);
        return [
          evo(model, { dialog: () => dialog }),
          Command.mapMessages(commands, (childMessage) =>
            GotUiShowcaseDialogMessage({ message: childMessage }),
          ),
        ];
      },

      GotUiShowcaseDialogMessage: ({ message: childMessage }) => {
        const [dialog, commands] = Dialog.update(model.dialog, childMessage);
        return [
          evo(model, { dialog: () => dialog }),
          Command.mapMessages(commands, (nextChildMessage) =>
            GotUiShowcaseDialogMessage({ message: nextChildMessage }),
          ),
        ];
      },

      GotUiShowcaseComboboxMessage: ({ message: childMessage }) => {
        const [cityCombobox, commands, maybeOutMessage] = CityCombobox.update(
          model.cityCombobox,
          childMessage,
        );
        const maybeCity = Option.match(maybeOutMessage, {
          onNone: () => model.maybeCity,
          onSome: (outMessage) =>
            outMessage._tag === "Selected" ? Option.some(outMessage.value) : Option.none(),
        });

        return [
          evo(model, {
            cityCombobox: () => cityCombobox,
            maybeCity: () => maybeCity,
          }),
          Command.mapMessages(commands, (nextChildMessage) =>
            GotUiShowcaseComboboxMessage({ message: nextChildMessage }),
          ),
        ];
      },
    }),
  );

const cityLabel = (maybeCity: Option.Option<City>): string =>
  Option.match(maybeCity, {
    onNone: () => "No city selected",
    onSome: (city) => cityLabels[city],
  });

const explanationCard = (
  title: string,
  body: string,
  code: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("rounded-3xl border border-divider bg-surface p-6 shadow-sm")],
    [
      h.h2([h.Class("text-lg font-semibold text-foreground")], [title]),
      h.p([h.Class("mt-2 text-sm leading-6 text-muted")], [body]),
      h.code(
        [h.Class("mt-5 block overflow-x-auto rounded-2xl bg-default p-4 text-xs text-foreground")],
        [code],
      ),
    ],
  );

export const view = Submodel.defineView<Model, Message>((model, h) =>
  h.section(
    [h.AriaLabel("Foldkit styled UI showcase"), h.Class("space-y-8")],
    [
      h.div(
        [h.Class("grid gap-5 xl:grid-cols-3")],
        [
          explanationCard(
            "Button · render helper",
            "No Model is invented. Loading is an explicit input mapped to disabled and aria-busy.",
            "Button.view({ content, variant, isLoading, onClick }, h)",
            h,
          ),
          explanationCard(
            "Dialog · complete Submodel view",
            "The styled layer supplies anatomy and a fallback close icon; Foldkit owns focus, presence and close Messages.",
            "h.submodel({ model, view: Dialog.view, … })",
            h,
          ),
          explanationCard(
            "Combobox · styled facade",
            "Selection remains parent-owned. Primitive anatomy waits for an upstream RenderInfo seam.",
            "const City = Combobox.create<City>()",
            h,
          ),
        ],
      ),

      h.div(
        [h.Class("flex flex-wrap items-center gap-3")],
        [
          Button.view(
            {
              content: "Open dialog",
              variant: "primary",
              onClick: ClickedUiShowcaseDialog(),
            },
            h,
          ),
          Button.view(
            {
              content: "Saving",
              variant: "secondary",
              isLoading: true,
            },
            h,
          ),
          Button.view(
            {
              content: "Delete",
              variant: "danger-soft",
            },
            h,
          ),
        ],
      ),

      h.div(
        [h.Class("max-w-sm space-y-2")],
        [
          h.label(
            [h.For(Combobox.inputId("ui-showcase-city")), h.Class("text-sm font-medium")],
            ["Preferred city"],
          ),
          h.submodel({
            slotId: "city-combobox",
            model: model.cityCombobox,
            view: CityCombobox.view,
            toParentMessage: (message) => GotUiShowcaseComboboxMessage({ message }),
            viewInputs: {
              items: City.literals,
              maybeSelectedValue: model.maybeCity,
              restingInputValue: Option.match(model.maybeCity, {
                onNone: () => "",
                onSome: (city) => cityLabels[city],
              }),
              itemToValue: (item) => item,
              itemToDisplayText: (item) => cityLabels[item],
              itemToConfig: (item, context) => ({
                content: h.div(
                  [h.Class("flex items-center justify-between gap-4")],
                  [
                    h.span([], [cityLabels[item]]),
                    ...(context.isSelected
                      ? [h.span([h.AriaHidden(true), h.Class("text-accent")], ["✓"])]
                      : []),
                  ],
                ),
              }),
              inputPlaceholder: "Choose a city",
              ariaLabel: "Preferred city",
              isFullWidth: true,
              anchor: { placement: "bottom-start", gap: 8 },
            },
          }),
          h.p([h.Class("text-sm text-muted")], [cityLabel(model.maybeCity)]),
        ],
      ),

      h.div(
        [h.Class("grid max-w-sm gap-4")],
        [
          InputGroup.view(
            {
              input: {
                id: "plain-grouped-input",
                label: "Plain grouped input",
                description: "Focus demonstrates the shared and local focus indicators.",
              },
              prefix: { kind: "decorative", content: "#", isHiddenFromAccessibility: true },
            },
            h,
          ),
          InputGroup.view(
            {
              input: {
                id: "readonly-grouped-input",
                label: "Readonly grouped input",
                value: "Read only",
                isReadOnly: true,
              },
            },
            h,
          ),
          InputGroup.view(
            {
              input: {
                id: "invalid-grouped-input",
                label: "Invalid grouped input",
                description: "This value is invalid.",
                isInvalid: true,
                isReadOnly: true,
              },
            },
            h,
          ),
          Input.view(
            {
              id: "standalone-invalid-input",
              label: "Standalone invalid input",
              description: "Standalone styling remains independent.",
              isInvalid: true,
            },
            h,
          ),
          InputGroup.view(
            {
              input: {
                id: "readonly-action-grouped-input",
                label: "Readonly action grouped input",
                value: "Read only with an available action",
                isReadOnly: true,
              },
              suffix: {
                kind: "action",
                button: {
                  content: "Open from action affix",
                  onClick: ClickedUiShowcaseDialog(),
                },
              },
            },
            h,
          ),
          InputGroup.view(
            {
              isDisabled: true,
              input: {
                id: "disabled-action-grouped-input",
                label: "Disabled action grouped input",
                description: "Disabled state overrides this invalid surface.",
                value: "Disabled",
                isInvalid: true,
                isReadOnly: true,
              },
              suffix: {
                kind: "action",
                button: {
                  content: "Disabled action affix",
                  onClick: ClickedUiShowcaseDialog(),
                },
              },
            },
            h,
          ),
        ],
      ),

      h.submodel({
        slotId: "dialog",
        model: model.dialog,
        view: Dialog.view,
        toParentMessage: (message) => GotUiShowcaseDialogMessage({ message }),
        viewInputs: {
          heading: "Foldkit owns the behavior",
          description: "This anatomy and close icon came from @pkg/ui.",
          content: () =>
            h.div(
              [h.Class("space-y-3")],
              [
                h.p(
                  [],
                  [
                    "The Dialog Model still contains open state, animation phase and focus configuration.",
                  ],
                ),
                h.p(
                  [],
                  [
                    "Escape, backdrop click, scroll lock, focus return and OutMessage remain observable Foldkit behavior.",
                  ],
                ),
              ],
            ),
          footer: () => [
            Button.view(
              {
                content: "Parent action",
                variant: "primary",
                onClick: ClickedUiShowcaseDialog(),
              },
              h,
            ),
          ],
          size: "md",
          scroll: "inside",
          variant: "opaque",
        },
      }),
    ],
  ),
);
