import type { ModalVariants } from "@heroui/styles/components/modal";
import { Submodel } from "foldkit";
import type { Html } from "foldkit/html";

import * as Icons from "./icons";
import DialogPrimitive, {
  type Message as DialogMessage,
  type Model as DialogModel,
  type OutMessage as DialogOutMessage,
} from "./primitives/dialog";
import { classes } from "./shared";

export const Model = DialogPrimitive.Model;
export type Model = DialogModel;
export const Message = DialogPrimitive.Message;
export type Message = DialogMessage;
export const OutMessage = DialogPrimitive.OutMessage;
export type OutMessage = DialogOutMessage;
export const init = DialogPrimitive.init;
export const update = DialogPrimitive.update;
export const open = DialogPrimitive.open;
export const close = DialogPrimitive.close;
export type { InitConfig } from "@foldkit/ui/dialog";

export type ClassNames = Partial<
  Readonly<{
    backdrop: string;
    container: string;
    dialog: string;
    header: string;
    heading: string;
    description: string;
    content: string;
    footer: string;
    closeButton: string;
  }>
>;

export type ViewInputs = ModalVariants &
  Readonly<{
    heading: string;
    description: string;
    /** Parent-owned markup; h.submodel runs this top-level slot in the parent boundary. */
    content: () => Html;
    /** Parent-owned actions, built with the parent's HtmlBuilder and Messages. */
    footer?: () => ReadonlyArray<Html>;
    isCloseButtonVisible?: boolean;
    closeLabel?: string;
    classNames?: ClassNames;
  }>;

export const view = Submodel.defineView<Model, Message, ViewInputs>((model, inputs, h) => {
  const slots = DialogPrimitive.styles({
    scroll: inputs.scroll,
    size: inputs.size,
    variant: inputs.variant,
  });
  const classNames = inputs.classNames ?? {};
  const isCloseButtonVisible = inputs.isCloseButtonVisible ?? true;
  const footer = inputs.footer?.() ?? [];

  return DialogPrimitive.view(
    model,
    {
      toView: (render) =>
        h.dialog(
          [...render.dialog, h.Class("pkg-ui-dialog-root")],
          render.isVisible
            ? [
                h.div(
                  [...render.backdrop, h.Class(classes(slots.backdrop(), classNames.backdrop))],
                  [],
                ),
                h.div(
                  [
                    ...render.panel,
                    h.Class(classes(slots.container(), classNames.container)),
                    h.DataAttribute("placement", "center"),
                  ],
                  [
                    h.section(
                      [h.Class(classes(slots.dialog(), classNames.dialog))],
                      [
                        h.header(
                          [h.Class(classes(slots.header(), classNames.header))],
                          [
                            h.h2(
                              [
                                ...render.title,
                                h.Class(classes(slots.heading(), classNames.heading)),
                              ],
                              [inputs.heading],
                            ),
                            h.p(
                              [
                                ...render.description,
                                h.Class(classes("text-sm text-muted", classNames.description)),
                              ],
                              [inputs.description],
                            ),
                          ],
                        ),
                        ...(isCloseButtonVisible
                          ? [
                              h.button(
                                [
                                  ...render.closeButton,
                                  h.AriaLabel(inputs.closeLabel ?? "Close dialog"),
                                  h.Class(
                                    classes(
                                      slots.closeTrigger(),
                                      "close-button close-button--default",
                                      classNames.closeButton,
                                    ),
                                  ),
                                ],
                                [Icons.close(h)],
                              ),
                            ]
                          : []),
                        h.div(
                          [h.Class(classes(slots.body(), classNames.content))],
                          [inputs.content()],
                        ),
                        ...(footer.length > 0
                          ? [
                              h.footer(
                                [h.Class(classes(slots.footer(), classNames.footer))],
                                footer,
                              ),
                            ]
                          : []),
                      ],
                    ),
                  ],
                ),
              ]
            : [],
        ),
    },
    h,
  );
});

const Dialog = {
  Model,
  Message,
  OutMessage,
  init,
  update,
  open,
  close,
  view,
} as const;

export default Dialog;
