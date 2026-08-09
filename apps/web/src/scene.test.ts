import { Option } from "effect";
import { click, expect, given, role, scene, text } from "foldkit/scene";
import { describe, test } from "vitest";

import * as Counter from "./counter";
import { Model, update, view } from "./main";
import {
  ComponentPartRoute,
  ComponentStandaloneRoute,
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
    recordedChipActionCount: 0,
    skeletonExampleState: "Loading",
    emptyStateRetryCount: 0,
    emptyStateExampleState: "Empty",
    progressExampleValue: 40,
    spinnerExampleState: "Loading",
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

  test("renders the Badge Parts page without inventing status behavior", () => {
    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "badge" }))),
      expect(role("heading", { level: 1, name: "Badge" })).toExist(),
      expect(role("status", { name: "3 条未读通知" })).toExist(),
      expect(text("3")).toExist(),
      expect(text("New")).toExist(),
    );
  });

  test("keeps Chip actions in the caller's Message flow", () => {
    const recordAction = role("button", { name: "记录 TypeScript 标签操作" });

    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "chip" }))),
      expect(role("heading", { level: 1, name: "Chip" })).toExist(),
      expect(text("TypeScript")).toExist(),
      expect(recordAction).toExist(),
      expect(text("已记录标签操作 0 次")).toExist(),
      click(recordAction),
      expect(text("已记录标签操作 1 次")).toExist(),
    );
  });

  test("renders Card anatomy with caller-owned landmark and heading semantics", () => {
    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "card" }))),
      expect(role("heading", { level: 1, name: "Card" })).toExist(),
      expect(role("region", { name: "项目摘要卡片" })).toExist(),
      expect(role("heading", { level: 3, name: "项目状态" })).toExist(),
      expect(text("调用方拥有 Card 内的嵌套内容与语义。")).toExist(),
      expect(text("上次更新：今天 09:30")).toExist(),
    );
  });

  test("keeps EmptyState primary and secondary actions in the caller flow", () => {
    const retrySync = role("button", { name: "重试同步" });
    const emptyState = role("region", { name: "同步结果为空" });

    scene(
      { update, view },
      given(modelOn(ComponentStandaloneRoute({ slug: "empty-state" }))),
      expect(role("heading", { level: 1, name: "EmptyState" })).toExist(),
      expect(emptyState).toExist(),
      expect(retrySync).toExist(),
      expect(role("link", { name: "查看同步帮助" })).toHaveAttr("href", "/examples/routing"),
      expect(text("已请求同步 0 次")).toExist(),
      click(retrySync),
      expect(emptyState).toBeAbsent(),
      expect(text("已同步项目：Alpha")).toExist(),
      expect(text("已请求同步 1 次")).toExist(),
      click(role("button", { name: "显示空状态" })),
      expect(emptyState).toExist(),
      expect(text("暂无归档项目")).toExist(),
    );
  });

  test("uses caller-selected alert and status semantics for Alert", () => {
    scene(
      { update, view },
      given(modelOn(ComponentStandaloneRoute({ slug: "alert" }))),
      expect(role("heading", { level: 1, name: "Alert" })).toExist(),
      expect(role("alert", { name: "无法连接" })).toExist(),
      expect(text("请检查网络后重试。")).toExist(),
      expect(role("status", { name: "配置已保存" })).toExist(),
      expect(text("更改已同步到团队。")).toExist(),
      expect(role("status", { name: "后台连接状态" })).toExist(),
      expect(text("自定义指示器")).toExist(),
    );
  });

  test("renders Spinner as a named indeterminate status", () => {
    const spinner = role("status", { name: "正在加载项目" });

    scene(
      { update, view },
      given(modelOn(ComponentStandaloneRoute({ slug: "spinner" }))),
      expect(role("heading", { level: 1, name: "Spinner" })).toExist(),
      expect(spinner).toExist(),
      click(role("button", { name: "显示加载结果" })),
      expect(spinner).toBeAbsent(),
      expect(text("项目已加载")).toExist(),
      click(role("button", { name: "重新显示加载状态" })),
      expect(spinner).toExist(),
    );
  });

  test("exposes determinate and indeterminate ProgressBar value semantics", () => {
    const determinate = role("progressbar", { name: "项目上传进度" });
    const indeterminate = role("progressbar", { name: "正在准备上传" });

    scene(
      { update, view },
      given(modelOn(ComponentStandaloneRoute({ slug: "progress-bar" }))),
      expect(role("heading", { level: 1, name: "ProgressBar" })).toExist(),
      expect(determinate).toHaveAttr("aria-valuemin", "0"),
      expect(determinate).toHaveAttr("aria-valuemax", "100"),
      expect(determinate).toHaveAttr("aria-valuenow", "40"),
      expect(determinate).toHaveAttr("aria-valuetext", "已上传 40%"),
      expect(indeterminate).not.toHaveAttr("aria-valuenow"),
      click(role("button", { name: "推进条形进度" })),
      expect(determinate).toHaveAttr("aria-valuenow", "70"),
      expect(determinate).toHaveAttr("aria-valuetext", "已上传 70%"),
    );
  });

  test("shares determinate value semantics with ProgressCircle", () => {
    const determinate = role("progressbar", { name: "资料处理进度" });
    const indeterminate = role("progressbar", { name: "正在分析资料" });

    scene(
      { update, view },
      given(modelOn(ComponentStandaloneRoute({ slug: "progress-circle" }))),
      expect(role("heading", { level: 1, name: "ProgressCircle" })).toExist(),
      expect(determinate).toHaveAttr("aria-valuemin", "0"),
      expect(determinate).toHaveAttr("aria-valuemax", "100"),
      expect(determinate).toHaveAttr("aria-valuenow", "40"),
      expect(determinate).toHaveAttr("aria-valuetext", "已处理 40%"),
      expect(indeterminate).not.toHaveAttr("aria-valuenow"),
      click(role("button", { name: "推进环形进度" })),
      expect(determinate).toHaveAttr("aria-valuenow", "70"),
      expect(determinate).toHaveAttr("aria-valuetext", "已处理 70%"),
    );
  });

  test("exposes Meter range semantics without owning threshold state", () => {
    const meter = role("meter", { name: "存储空间使用量" });

    scene(
      { update, view },
      given(modelOn(ComponentStandaloneRoute({ slug: "meter" }))),
      expect(role("heading", { level: 1, name: "Meter" })).toExist(),
      expect(meter).toHaveAttr("aria-valuemin", "0"),
      expect(meter).toHaveAttr("aria-valuemax", "500"),
      expect(meter).toHaveAttr("aria-valuenow", "325"),
      expect(meter).toHaveAttr("aria-valuetext", "已使用 325 GB，共 500 GB"),
    );
  });

  test("renders Skeleton only from the caller's external loading fact", () => {
    const loadingRegion = role("region", { name: "资料加载示例" });
    const showLoaded = role("button", { name: "显示已加载内容" });
    const showLoading = role("button", { name: "重新加载" });

    scene(
      { update, view },
      given(modelOn(ComponentPartRoute({ slug: "skeleton" }))),
      expect(role("heading", { level: 1, name: "Skeleton" })).toExist(),
      expect(loadingRegion).toHaveAttr("aria-busy", "true"),
      expect(text("资料已加载")).toBeAbsent(),
      click(showLoaded),
      expect(loadingRegion).toHaveAttr("aria-busy", "false"),
      expect(text("资料已加载")).toExist(),
      click(showLoading),
      expect(loadingRegion).toHaveAttr("aria-busy", "true"),
      expect(text("资料已加载")).toBeAbsent(),
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
      expect(role("link", { name: "Badge" })).toExist(),
      expect(role("link", { name: "Chip" })).toExist(),
      expect(role("link", { name: "Card" })).toExist(),
      expect(role("link", { name: "Skeleton" })).toExist(),
      expect(role("link", { name: "EmptyState" })).toExist(),
      expect(role("link", { name: "Alert" })).toExist(),
      expect(role("link", { name: "Spinner" })).toExist(),
      expect(role("link", { name: "ProgressBar" })).toExist(),
      expect(role("link", { name: "ProgressCircle" })).toExist(),
      expect(role("link", { name: "Meter" })).toExist(),
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
