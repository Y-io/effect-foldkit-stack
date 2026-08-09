import type { Attribute, HtmlBuilder } from "foldkit/html";

export type ProgressValue =
  | Readonly<{
      isIndeterminate: true;
      valueText?: never;
    }>
  | Readonly<{
      isIndeterminate?: false;
      value: number;
      valueText?: string;
    }>;

export type ProgressRange = Readonly<{
  minValue?: number;
  maxValue?: number;
}>;

export const percentage = (value: number, minValue: number, maxValue: number): number => {
  if (maxValue <= minValue) {
    return 0;
  } else {
    const normalized = ((value - minValue) / (maxValue - minValue)) * 100;
    return Math.min(100, Math.max(0, normalized));
  }
};

export const valueAttributes = <Message>(
  value: ProgressValue,
  minValue: number,
  maxValue: number,
  h: HtmlBuilder<Message>,
): ReadonlyArray<Attribute<Message>> => {
  const rangeAttributes = [h.AriaValuemin(minValue), h.AriaValuemax(maxValue)];

  if (value.isIndeterminate) {
    return rangeAttributes;
  } else {
    return [
      ...rangeAttributes,
      h.AriaValuenow(value.value),
      ...(value.valueText === undefined ? [] : [h.AriaValuetext(value.valueText)]),
    ];
  }
};
