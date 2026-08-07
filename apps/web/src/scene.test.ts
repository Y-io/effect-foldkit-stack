import { expect, given, role, scene, text } from "foldkit/scene";
import { describe, test } from "vitest";

import * as Counter from "./counter";
import { Model, update, view } from "./main";
import { ExampleRoute, HomeRoute, RoutingHomeRoute } from "./route";

const modelOn = (route: Model["route"]): Model =>
  Model.make({
    route,
    counter: Counter.init(),
    transitionLog: ["cold load"],
    isSignedIn: false,
  });

describe("application view", () => {
  test("renders primary and official-example navigation on every page", () => {
    scene(
      { update, view },
      given(modelOn(HomeRoute())),
      expect(role("navigation", { name: "Primary" })).toExist(),
      expect(role("navigation", { name: "Official examples" })).toExist(),
      expect(role("link", { name: "Counter" })).toExist(),
      expect(role("link", { name: "Routing Lab" })).toExist(),
    );
  });

  test("renders the live Counter page through a Submodel boundary", () => {
    scene(
      { update, view },
      given(modelOn(ExampleRoute({ slug: "counter" }))),
      expect(role("heading", { name: "Counter" })).toExist(),
      expect(role("button", { name: "Increment count" })).toExist(),
      expect(role("button", { name: "Decrement count" })).toExist(),
    );
  });

  test("renders routing navigation and capability boundaries", () => {
    scene(
      { update, view },
      given(modelOn(RoutingHomeRoute())),
      expect(role("heading", { name: "Foldkit Routing Lab" })).toExist(),
      expect(role("navigation", { name: "Routing variants" })).toExist(),
      expect(text("Capability boundaries")).toExist(),
    );
  });
});
