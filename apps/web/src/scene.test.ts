import { Option } from "effect";
import { expect, given, role, scene, text } from "foldkit/scene";
import { describe, test } from "vitest";

import * as Counter from "./counter";
import { Model, update, view } from "./main";
import {
  ComponentPartRoute,
  ComponentsIndexRoute,
  ExampleRoute,
  HomeRoute,
  RoutingHomeRoute,
  VisualProtocolRoute,
} from "./route";
import * as UiShowcase from "./ui-showcase";

const modelOn = (route: Model["route"]): Model =>
  Model.make({
    route,
    counter: Counter.init(),
    uiShowcase: UiShowcase.init(),
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

  test("renders the Typography Parts page with metadata and semantic examples", () => {
    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "typography" }))),
      expect(role("heading", { level: 1, name: "Typography" })).toExist(),
      expect(text("Catalog")).toExist(),
      expect(text("Parts")).toExist(),
      expect(role("heading", { level: 2, name: "概览" })).toExist(),
      expect(role("heading", { level: 2, name: "分类与阶段" })).toExist(),
      expect(role("heading", { level: 2, name: "Anatomy" })).toExist(),
      expect(role("heading", { level: 2, name: "Behavior Authority" })).toExist(),
      expect(role("heading", { level: 2, name: "HeroUI 视觉映射" })).toExist(),
      expect(role("heading", { level: 2, name: "API 与内容自定义" })).toExist(),
      expect(role("heading", { level: 2, name: "示例与 Scene" })).toExist(),
      expect(role("heading", { level: 2, name: "键盘与焦点" })).toExist(),
      expect(role("heading", { level: 2, name: "ARIA 与语义" })).toExist(),
      expect(role("heading", { level: 2, name: "与 HeroUI 的已知差异" })).toExist(),
      expect(role("heading", { level: 2, name: "验收状态" })).toExist(),
      expect(role("heading", { level: 2, name: "语义标题示例" })).toExist(),
      expect(role("heading", { level: 3, name: "三级标题变体" })).toExist(),
      expect(role("heading", { level: 4, name: "四级标题变体" })).toExist(),
      expect(role("heading", { level: 5, name: "五级标题变体" })).toExist(),
      expect(role("heading", { level: 6, name: "六级标题变体" })).toExist(),
      expect(text("Body type 变体")).toExist(),
      expect(text("Body sm type 变体")).toExist(),
      expect(text("Body xs type 变体")).toExist(),
      expect(text("Align start")).toExist(),
      expect(text("Align center")).toExist(),
      expect(text("Align end")).toExist(),
      expect(text("Align justify 使用足够长的内容验证两端对齐视觉。")).toExist(),
      expect(text("Weight normal")).toExist(),
      expect(text("Weight medium")).toExist(),
      expect(text("Weight semibold")).toExist(),
      expect(text("Weight bold")).toExist(),
      expect(text("Color default")).toExist(),
      expect(text("Color muted")).toExist(),
      expect(text("调用方拥有的 prose 标题")).toExist(),
    );
  });

  test("renders the Surface Parts page with real variant content", () => {
    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "surface" }))),
      expect(role("heading", { level: 1, name: "Surface" })).toExist(),
      expect(text("Secondary Surface")).toExist(),
      expect(text("调用方拥有 Surface 内的内容与语义。")).toExist(),
      expect(role("region", { name: "Secondary Surface" })).toExist(),
    );
  });

  test("renders the Separator Parts page with native separator semantics", () => {
    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "separator" }))),
      expect(role("heading", { level: 1, name: "Separator" })).toExist(),
      expect(role("separator", { name: "Default Separator" })).toExist(),
      expect(role("separator", { name: "Vertical Separator" })).toHaveAttr(
        "aria-orientation",
        "vertical",
      ),
      expect(text("垂直方向边界")).toExist(),
    );
  });

  test("browses component documentation by catalog, phase, class, and status", () => {
    scene(
      { update, view },
      given(
        modelOn(
          ComponentsIndexRoute({
            catalog: Option.none(),
            phase: Option.none(),
            behaviorClass: Option.none(),
            status: Option.none(),
          }),
        ),
      ),
      expect(role("heading", { level: 1, name: "组件库" })).toExist(),
      expect(role("navigation", { name: "组件筛选" })).toExist(),
      expect(role("link", { name: "Parts" })).toExist(),
      expect(role("link", { name: "Standalone" })).toExist(),
      expect(role("link", { name: "Phase 1" })).toExist(),
      expect(role("link", { name: "Class A" })).toExist(),
      expect(role("link", { name: "verified" })).toExist(),
      expect(role("link", { name: "Typography" })).toExist(),
      expect(role("link", { name: "Surface" })).toExist(),
      expect(role("link", { name: "Separator" })).toExist(),
    );
  });

  test("documents the complete stage-one visual protocol", () => {
    scene(
      { update, view },
      given(modelOn(VisualProtocolRoute())),
      expect(role("heading", { level: 1, name: "Visual Protocol" })).toExist(),
      expect(text("Design tokens")).toExist(),
      expect(text("Light / dark")).toExist(),
      expect(text("Typography")).toExist(),
      expect(text("间距与圆角")).toExist(),
      expect(text("边框与阴影")).toExist(),
      expect(text("状态属性")).toExist(),
      expect(text("Reduced motion")).toExist(),
    );
  });
});
