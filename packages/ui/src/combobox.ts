import type { ComboBoxVariants } from "@heroui/styles/components/combo-box";
import { comboBoxVariants } from "@heroui/styles/components/combo-box";
import { inputVariants } from "@heroui/styles/components/input";
import * as HeadlessCombobox from "@foldkit/ui/combobox";
import { Submodel } from "foldkit";
import type { Html } from "foldkit/html";

import * as Icons from "./icons";
import { classes } from "./shared";

export const Model = HeadlessCombobox.Model;
export type Model = HeadlessCombobox.Model;
export const Message = HeadlessCombobox.Message;
export type Message = HeadlessCombobox.Message;
export const OutMessage = HeadlessCombobox.OutMessage;
export type OutMessage<Item extends string = string> = HeadlessCombobox.OutMessage<Item>;
export const init = HeadlessCombobox.init;
export const inputId = HeadlessCombobox.inputId;
export type { InitConfig, ItemConfig } from "@foldkit/ui/combobox";

export type ClassNames = Partial<
  Readonly<{
    base: string;
    input: string;
    inputGroup: string;
    trigger: string;
    popover: string;
    listbox: string;
    item: string;
    backdrop: string;
  }>
>;

type StyleOptions = Omit<ComboBoxVariants, "fullWidth">;

export type ViewInputs<Item extends string> = Omit<
  HeadlessCombobox.ViewInputs<Item>,
  | "className"
  | "inputClassName"
  | "inputWrapperClassName"
  | "buttonClassName"
  | "buttonContent"
  | "itemsClassName"
  | "itemsScrollClassName"
  | "backdropClassName"
  | "itemToConfig"
> &
  StyleOptions &
  Readonly<{
    itemToConfig: HeadlessCombobox.ViewInputs<Item>["itemToConfig"];
    isFullWidth?: boolean;
    triggerIcon?: () => Html;
    classNames?: ClassNames;
  }>;

const makeView = <Item extends string>(headless: HeadlessCombobox.Bundle<Item>) =>
  Submodel.defineView<Model, Message, ViewInputs<Item>>((model, inputs, h) => {
    const slots = comboBoxVariants({ fullWidth: inputs.isFullWidth });
    const classNames = inputs.classNames ?? {};

    return headless.view(
      model,
      {
        ...inputs,
        className: classes(slots.base(), classNames.base),
        inputClassName: classes(
          inputVariants({ fullWidth: true, variant: "primary" }),
          classNames.input,
        ),
        inputWrapperClassName: classes(slots.inputGroup(), classNames.inputGroup),
        buttonClassName: classes(slots.trigger(), classNames.trigger),
        buttonContent: inputs.triggerIcon?.() ?? Icons.chevronDown(h),
        itemsClassName: classes(slots.popover(), "pkg-ui-combobox-popover", classNames.popover),
        itemsScrollClassName: classes("list-box", classNames.listbox),
        backdropClassName: classes("pkg-ui-combobox-backdrop", classNames.backdrop),
        itemToConfig: (item, context) => {
          const itemConfig = inputs.itemToConfig(item, context);
          return {
            ...itemConfig,
            className: classes("list-box-item", classNames.item, itemConfig.className),
          };
        },
      },
      h,
    );
  });

export type Bundle<Item extends string> = Omit<HeadlessCombobox.Bundle<Item>, "view"> &
  Readonly<{
    view: ReturnType<typeof makeView<Item>>;
  }>;

export const create = <Item extends string = string>(): Bundle<Item> => {
  const headless = HeadlessCombobox.create<Item>();
  return {
    ...headless,
    view: makeView(headless),
  };
};

const Combobox = { Model, Message, OutMessage, init, inputId, create } as const;

export default Combobox;
