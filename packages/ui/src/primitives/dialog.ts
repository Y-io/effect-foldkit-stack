import { modalVariants } from "@heroui/styles/components/modal";
import * as HeadlessDialog from "@foldkit/ui/dialog";

export const Model = HeadlessDialog.Model;
export type Model = HeadlessDialog.Model;
export const Message = HeadlessDialog.Message;
export type Message = HeadlessDialog.Message;
export const OutMessage = HeadlessDialog.OutMessage;
export type OutMessage = HeadlessDialog.OutMessage;
export const init = HeadlessDialog.init;
export const update = HeadlessDialog.update;
export const open = HeadlessDialog.open;
export const close = HeadlessDialog.close;
export const view = HeadlessDialog.view;
export const styles = modalVariants;

export type { InitConfig, RenderInfo, ViewInputs } from "@foldkit/ui/dialog";

const DialogPrimitive = {
  Model,
  Message,
  OutMessage,
  init,
  update,
  open,
  close,
  view,
  styles,
} as const;

export default DialogPrimitive;
