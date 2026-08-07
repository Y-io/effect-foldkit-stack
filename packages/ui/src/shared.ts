export const classes = (...values: ReadonlyArray<string | undefined>): string =>
  values.filter((value): value is string => value !== undefined && value.length > 0).join(" ");
