import { Array } from "effect";
import { describe, expect, test } from "vitest";

import { examples } from "./example";

describe("official example manifest", () => {
  test("contains every current official example exactly once", () => {
    expect(examples).toHaveLength(31);
    expect(new Set(Array.map(examples, (example) => example.slug)).size).toBe(31);
  });

  test("marks the first implemented vertical slices as ready", () => {
    expect(
      Array.filter(examples, (example) => example.status === "Ready").map(
        (example) => example.slug,
      ),
    ).toStrictEqual(["counter", "routing", "ui-showcase"]);
  });
});
