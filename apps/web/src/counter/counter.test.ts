import { describe, expect, test } from "vitest";

import { ClickedDecrement, ClickedIncrement, ClickedReset, init, update } from "./counter";

describe("Counter update", () => {
  test("increments, decrements, and resets the Model", () => {
    const [incremented] = update(init(), ClickedIncrement());
    const [decremented] = update(incremented, ClickedDecrement());
    const [incrementedAgain] = update(decremented, ClickedIncrement());
    const [reset] = update(incrementedAgain, ClickedReset());

    expect(incremented.count).toBe(1);
    expect(decremented.count).toBe(0);
    expect(incrementedAgain.count).toBe(1);
    expect(reset.count).toBe(0);
  });
});
