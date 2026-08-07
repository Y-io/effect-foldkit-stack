import { Array, Option } from "effect";
import { fromString } from "foldkit/url";
import { describe, expect, test } from "vitest";

import * as Counter from "./counter";
import { ChangedUrl, GotCounterMessage, init, update } from "./main";

const urlOrThrow = (raw: string) =>
  Option.getOrThrowWith(fromString(raw), () => new Error(`Failed to parse URL: ${raw}`));

describe("application update", () => {
  test("records a cold load and later stayed transitions", () => {
    const [initialModel] = init(urlOrThrow("http://localhost/examples/routing/users/ada"));
    const [nextModel] = update(
      initialModel,
      ChangedUrl({ url: urlOrThrow("http://localhost/examples/routing/users/grace") }),
    );

    expect(Option.getOrThrow(Array.head(initialModel.transitionLog))).toContain("cold load");
    expect(Option.getOrThrow(Array.head(nextModel.transitionLog))).toContain(
      "stayed User(ada) → User(grace)",
    );
  });

  test("resets Counter state after leaving its route", () => {
    const [initialModel] = init(urlOrThrow("http://localhost/examples/counter"));
    const [incrementedModel] = update(
      initialModel,
      GotCounterMessage({ message: Counter.ClickedIncrement() }),
    );
    const [homeModel] = update(
      incrementedModel,
      ChangedUrl({ url: urlOrThrow("http://localhost/") }),
    );

    expect(incrementedModel.counter.count).toBe(1);
    expect(homeModel.counter.count).toBe(0);
  });

  test("redirects a cold load of the guarded route", () => {
    const [, commands] = init(urlOrThrow("http://localhost/examples/routing/guarded"));

    expect(Option.isSome(Array.head(commands))).toBe(true);
  });
});
