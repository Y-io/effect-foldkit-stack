import * as HeadlessButton from "@foldkit/ui/button";

export const view = HeadlessButton.view;
export type { ButtonAttributes, ViewConfig } from "@foldkit/ui/button";

const ButtonPrimitive = { view } as const;

export default ButtonPrimitive;
