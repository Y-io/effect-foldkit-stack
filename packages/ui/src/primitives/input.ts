import * as HeadlessInput from "@foldkit/ui/input";

export const view = HeadlessInput.view;
export const descriptionId = HeadlessInput.descriptionId;
export type { InputAttributes, ViewConfig } from "@foldkit/ui/input";

const InputPrimitive = { view, descriptionId } as const;

export default InputPrimitive;
