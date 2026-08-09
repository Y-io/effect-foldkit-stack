import { Option } from "effect";
import { click, expect, given, role, scene, text } from "foldkit/scene";
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
    fieldExampleState: "Helper",
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

  test("renders the Label Parts page with a native field relationship", () => {
    const requiredInput = role("textbox", { name: "必填项目" });
    const invalidInput = role("textbox", { name: "无效项目" });
    const disabledInput = role("textbox", { name: "禁用项目" });

    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "label" }))),
      expect(role("heading", { level: 1, name: "Label" })).toExist(),
      expect(role("textbox", { name: "项目名称" })).toExist(),
      expect(requiredInput).toHaveAttr("required", "true"),
      expect(invalidInput).toHaveAttr("aria-invalid", "true"),
      expect(disabledInput).toHaveAttr("disabled", "true"),
    );
  });

  test("renders the Description Parts page with a stable description relationship", () => {
    const workspaceSlug = role("textbox", { name: "工作区标识" });
    const validating = role("button", { name: "显示校验中" });
    const errors = role("button", { name: "显示错误" });

    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "description" }))),
      expect(role("heading", { level: 1, name: "Description" })).toExist(),
      expect(workspaceSlug).toHaveAttr(
        "aria-describedby",
        "description-workspace-slug-description",
      ),
      expect(workspaceSlug).toHaveAccessibleDescription("请输入唯一的工作区标识。"),
      expect(text("请输入唯一的工作区标识。")).toHaveId("description-workspace-slug-description"),
      click(validating),
      expect(workspaceSlug).toHaveAccessibleDescription("正在检查标识是否可用。"),
      expect(workspaceSlug).toHaveAttr(
        "aria-describedby",
        "description-workspace-slug-description",
      ),
      click(errors),
      expect(workspaceSlug).toHaveAccessibleDescription("此工作区标识已被使用。"),
      expect(workspaceSlug).toHaveAttr("aria-invalid", "true"),
      expect(workspaceSlug).toHaveAttr(
        "aria-describedby",
        "description-workspace-slug-description",
      ),
      expect(role("textbox", { name: "团队名称" })).toHaveAccessibleDescription(
        "这会显示在团队主页。",
      ),
      expect(text("这会显示在团队主页。")).toHaveId("description-team-name"),
    );
  });

  test("renders the Header Parts page with caller-owned heading semantics", () => {
    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "header" }))),
      expect(role("heading", { level: 1, name: "Header" })).toExist(),
      expect(role("heading", { level: 3, name: "收件箱" })).toExist(),
      expect(text("12 条未读消息")).toExist(),
    );
  });

  test("renders the ErrorMessage Parts page from caller-owned validation facts", () => {
    const accountName = role("textbox", { name: "账户名称" });

    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "error-message" }))),
      expect(role("heading", { level: 1, name: "ErrorMessage" })).toExist(),
      expect(accountName).toHaveAttr("aria-invalid", "true"),
      expect(accountName).toHaveAccessibleDescription("此名称已被使用。"),
    );
  });

  test("renders the FieldError Parts page as a stable field description", () => {
    const password = role("textbox", { name: "密码" });
    const showError = role("button", { name: "显示字段错误" });
    const hideError = role("button", { name: "隐藏字段错误" });

    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "field-error" }))),
      expect(role("heading", { level: 1, name: "FieldError" })).toExist(),
      expect(password).toHaveAttr("aria-describedby", "field-error-password-description"),
      expect(password).toHaveAccessibleDescription(""),
      expect(showError).toExist(),
      expect(hideError).toExist(),
      click(showError),
      expect(password).toHaveAttr("aria-invalid", "true"),
      expect(password).toHaveAccessibleDescription("长度至少为 8 个字符。必须包含数字。"),
      expect(text("长度至少为 8 个字符。必须包含数字。")).toHaveId(
        "field-error-password-description",
      ),
      expect(text("长度至少为 8 个字符。必须包含数字。")).toHaveAttr("data-visible", ""),
      click(hideError),
      expect(password).toHaveAccessibleDescription(""),
      expect(password).toHaveAttr("aria-describedby", "field-error-password-description"),
    );
  });

  test("renders the Kbd Parts page with labelled combination keys and long content", () => {
    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "kbd" }))),
      expect(role("heading", { level: 1, name: "Kbd" })).toExist(),
      expect(text("⌘")).toHaveAttr("title", "Command"),
      expect(text("⇧")).toHaveAttr("title", "Shift"),
      expect(text("Light 与长文本")).toExist(),
      expect(text("COMMAND-PALETTE")).toExist(),
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
      expect(role("link", { name: "Label" })).toExist(),
      expect(role("link", { name: "Description" })).toExist(),
      expect(role("link", { name: "Header" })).toExist(),
      expect(role("link", { name: "ErrorMessage" })).toExist(),
      expect(role("link", { name: "FieldError" })).toExist(),
      expect(role("link", { name: "Kbd" })).toExist(),
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
