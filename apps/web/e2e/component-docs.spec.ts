import { expect, test } from "@playwright/test";
import { Deferred, Effect } from "effect";

declare global {
  interface Window {
    __scrollShadowLifecycle: {
      mutationDisconnects: number;
      resizeDisconnects: number;
      scrollRemovals: number;
    };
  }
}

test("proves the stage-one visual protocol with real computed styles", async ({ page }) => {
  await page.goto("/components/foundations/visual-protocol");

  const lightPreview = page.getByRole("region", { name: "Light theme preview" });
  const darkPreview = page.getByRole("region", { name: "Dark theme preview" });
  const lightSurface = lightPreview.getByRole("region", { name: "Light Surface sample" });
  const darkSurface = darkPreview.getByRole("region", { name: "Dark Surface sample" });

  await expect(lightSurface).toBeVisible();
  await expect(darkSurface).toBeVisible();
  expect(
    await lightSurface.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(await darkSurface.evaluate((element) => getComputedStyle(element).backgroundColor));
  expect(await lightSurface.evaluate((element) => getComputedStyle(element).color)).not.toBe(
    await darkSurface.evaluate((element) => getComputedStyle(element).color),
  );

  const lightHeading = lightPreview.getByRole("heading", { name: "Light Surface" });
  const lightBody = lightPreview.getByText("HeroUI theme variables remain the Visual Authority.");
  expect(
    await lightHeading.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
  ).toBeGreaterThan(
    await lightBody.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
  );

  const separator = lightPreview.getByRole("separator");
  expect(
    await separator.evaluate((element) => element.getBoundingClientRect().width),
  ).toBeGreaterThan(100);
  expect(await separator.evaluate((element) => element.getBoundingClientRect().height)).toBe(1);

  const motionSample = page.getByRole("img", { name: "Motion protocol sample" });
  await expect(motionSample).toBeVisible();
  expect(
    await motionSample.evaluate((element) => getComputedStyle(element).animationDuration),
  ).not.toBe("0s");

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await motionSample.evaluate((element) => getComputedStyle(element).animationDuration),
  ).toBe("0.001s");
});

test("covers every public Typography, Surface, and Separator visual variant", async ({ page }) => {
  await page.goto("/components/parts/typography");

  const headingSizes = await Promise.all(
    [
      page.getByRole("heading", { level: 1, name: "Typography" }),
      page.getByRole("heading", { level: 2, name: "语义标题示例" }),
      page.getByRole("heading", { level: 3, name: "三级标题变体" }),
      page.getByRole("heading", { level: 4, name: "四级标题变体" }),
      page.getByRole("heading", { level: 5, name: "五级标题变体" }),
      page.getByRole("heading", { level: 6, name: "六级标题变体" }),
    ].map((heading) =>
      heading.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    ),
  );
  expect(headingSizes).toEqual([36, 30, 24, 20, 18, 16]);

  const bodySizes = await Promise.all(
    ["Body type 变体", "Body sm type 变体", "Body xs type 变体"].map((content) =>
      page
        .getByText(content, { exact: true })
        .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    ),
  );
  expect(bodySizes).toEqual([16, 14, 12]);

  await expect(page.getByText("Align start", { exact: true })).toHaveCSS("text-align", "start");
  await expect(page.getByText("Align center", { exact: true })).toHaveCSS("text-align", "center");
  await expect(page.getByText("Align end", { exact: true })).toHaveCSS("text-align", "end");
  await expect(page.getByText(/Align justify/)).toHaveCSS("text-align", "justify");

  const weightCases: ReadonlyArray<Readonly<{ label: string; weight: string }>> = [
    { label: "Weight normal", weight: "400" },
    { label: "Weight medium", weight: "500" },
    { label: "Weight semibold", weight: "600" },
    { label: "Weight bold", weight: "700" },
  ];
  for (const { label, weight } of weightCases) {
    await expect(page.getByText(label, { exact: true })).toHaveCSS("font-weight", weight);
  }

  expect(
    await page
      .getByText("Color default", { exact: true })
      .evaluate((element) => getComputedStyle(element).color),
  ).not.toBe(
    await page
      .getByText("Color muted", { exact: true })
      .evaluate((element) => getComputedStyle(element).color),
  );
  const truncated = page.getByText("这是一段用于验证窄容器截断表现的长文本内容");
  await expect(truncated).toHaveCSS("text-overflow", "ellipsis");
  await expect(truncated).toHaveCSS("white-space", "nowrap");
  await expect(page.getByText("const authority = 'native';")).toHaveJSProperty("tagName", "CODE");
  await expect(page.getByText("调用方拥有的 prose 标题")).toBeVisible();

  await page.goto("/components/parts/surface");

  const defaultSurface = page.getByRole("region", { name: "Default Surface" });
  const secondarySurface = page.getByRole("region", { name: "Secondary Surface" });
  const tertiarySurface = page.getByRole("region", { name: "Tertiary Surface" });
  const transparentSurface = page.getByRole("region", { name: "Transparent Surface" });
  const backgrounds = await Promise.all(
    [defaultSurface, secondarySurface, tertiarySurface, transparentSurface].map((surface) =>
      surface.evaluate((element) => getComputedStyle(element).backgroundColor),
    ),
  );
  expect(new Set(backgrounds).size).toBe(4);

  await page.goto("/components/parts/separator");

  const defaultSeparator = page.getByRole("separator", { name: "Default Separator" });
  const secondarySeparator = page.getByRole("separator", { name: "Secondary Separator" });
  const tertiarySeparator = page.getByRole("separator", { name: "Tertiary Separator" });
  const verticalSeparator = page.getByRole("separator", { name: "Vertical Separator" });
  await expect(verticalSeparator).toHaveAttribute("aria-orientation", "vertical");
  expect(
    await verticalSeparator.evaluate((element) => element.getBoundingClientRect().height),
  ).toBe(64);
  const separatorColors = await Promise.all(
    [defaultSeparator, secondarySeparator, tertiarySeparator].map((separator) =>
      separator.evaluate((element) => getComputedStyle(element).backgroundColor),
    ),
  );
  expect(new Set(separatorColors).size).toBe(3);
});

test("keeps Label native focus behavior while projecting HeroUI field states", async ({ page }) => {
  await page.goto("/components/parts/label");

  const label = page.getByText("项目名称", { exact: true });
  const input = page.getByRole("textbox", { name: "项目名称" });
  await label.click();
  await expect(input).toBeFocused();
  await expect(label).toHaveCSS("font-size", "14px");
  await expect(label).toHaveCSS("font-weight", "500");

  const requiredLabel = page.getByText("必填项目", { exact: true });
  expect(
    await requiredLabel.evaluate((element) => getComputedStyle(element, "::after").content),
  ).toBe('"*"');
});

test("projects the complete field semantic Parts visual contract", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/components/parts/label");

  const defaultLabel = page.getByText("项目名称", { exact: true });
  const invalidLabel = page.getByText("无效项目", { exact: true });
  const disabledLabel = page.getByText("禁用项目", { exact: true });
  expect(await invalidLabel.evaluate((element) => getComputedStyle(element).color)).not.toBe(
    await defaultLabel.evaluate((element) => getComputedStyle(element).color),
  );
  expect(
    await disabledLabel.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity)),
  ).toBeLessThan(1);

  await page.goto("/components/parts/description");
  const description = page.getByText("这会显示在团队主页。", { exact: true });
  await expect(description).toHaveCSS("font-size", "12px");
  await expect(description).toHaveCSS("overflow-wrap", "break-word");

  await page.goto("/components/parts/header");
  const header = page.getByText("12 条未读消息", { exact: true });
  await expect(header).toHaveCSS("font-size", "12px");
  await expect(header).toHaveCSS("text-align", "start");

  await page.goto("/components/parts/error-message");
  const errorMessage = page.getByText("此名称已被使用。", { exact: true });
  expect(
    await errorMessage.evaluate((element) => getComputedStyle(element).transitionDuration),
  ).not.toBe("0s");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(errorMessage).toHaveCSS("transition-property", "none");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/components/parts/field-error");
  const fieldError = page.locator("#field-error-password-description");
  const emptyFieldError = page.locator("#field-error-stable-empty");
  const fieldInput = page.getByRole("textbox", { name: "密码" });
  await expect(fieldError).toHaveCount(1);
  await expect(fieldError).not.toHaveAttribute("data-visible", "");
  await expect(fieldInput).toHaveAttribute("aria-describedby", "field-error-password-description");
  await expect(fieldInput).toHaveAccessibleDescription("");

  await page.getByRole("button", { name: "显示字段错误" }).click();
  await expect(fieldError).toHaveCSS("opacity", "1");
  await expect(fieldError).toHaveAttribute("data-visible", "");
  await expect(fieldInput).toHaveAccessibleDescription("长度至少为 8 个字符。必须包含数字。");
  expect(
    await fieldError.evaluate((element) => element.getBoundingClientRect().height),
  ).toBeGreaterThan(0);
  expect(
    await fieldError.evaluate((element) => getComputedStyle(element).transitionDuration),
  ).not.toBe("0s");
  await expect(emptyFieldError).not.toHaveAttribute("data-visible", "");
  await expect(emptyFieldError).toHaveCSS("opacity", "0");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(fieldError).toHaveCSS("transition-property", "none");

  await page.getByRole("button", { name: "隐藏字段错误" }).click();
  await expect(fieldError).toHaveCount(1);
  await expect(fieldError).not.toHaveAttribute("data-visible", "");
  await expect(fieldInput).toHaveAccessibleDescription("");
  await expect(fieldInput).toHaveAttribute("aria-describedby", "field-error-password-description");

  await page.goto("/components/parts/kbd");
  const combination = page.getByLabel("打开命令面板快捷键");
  const longContent = page.getByLabel("长文本快捷键提示");
  await expect(combination).toHaveJSProperty("tagName", "KBD");
  await expect(combination.getByTitle("Command")).toHaveText("⌘");
  await expect(combination.getByTitle("Shift")).toHaveText("⇧");
  await expect(longContent).toHaveCSS("white-space", "nowrap");
  expect(
    await combination.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(await longContent.evaluate((element) => getComputedStyle(element).backgroundColor));

  const lightBackground = await combination.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  expect(
    await combination.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(lightBackground);
});

test("keeps one Description Channel while external field content changes", async ({ page }) => {
  await page.goto("/components/parts/description");

  const input = page.getByRole("textbox", { name: "工作区标识" });
  const description = page.locator("#description-workspace-slug-description");
  await expect(input).toHaveAttribute("aria-describedby", "description-workspace-slug-description");
  await expect(description).toHaveCount(1);
  await expect(input).toHaveAccessibleDescription("请输入唯一的工作区标识。");

  await page.getByRole("button", { name: "显示校验中" }).click();
  await expect(description).toHaveCount(1);
  await expect(input).toHaveAccessibleDescription("正在检查标识是否可用。");

  await page.getByRole("button", { name: "显示错误" }).click();
  await expect(description).toHaveCount(1);
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAccessibleDescription("此工作区标识已被使用。");
  await expect(input).toHaveAttribute("aria-describedby", "description-workspace-slug-description");
});

test("projects light and dark HeroUI tokens for every field semantic Part", async ({ page }) => {
  const cases = [
    {
      path: "label",
      locate: () => page.getByText("项目名称", { exact: true }),
    },
    {
      path: "description",
      locate: () => page.getByText("这会显示在团队主页。", { exact: true }),
    },
    {
      path: "header",
      locate: () => page.getByText("12 条未读消息", { exact: true }),
    },
    {
      path: "error-message",
      locate: () => page.getByText("此名称已被使用。", { exact: true }),
    },
    {
      path: "field-error",
      locate: () => page.getByText("长度至少为 8 个字符。必须包含数字。", { exact: true }),
    },
    {
      path: "kbd",
      locate: () => page.getByLabel("长文本快捷键提示"),
    },
  ];

  for (const visualCase of cases) {
    await page.goto(`/components/parts/${visualCase.path}`);
    if (visualCase.path === "field-error") {
      await page.getByRole("button", { name: "显示字段错误" }).click();
    }
    const sample = visualCase.locate();
    const light = await sample.evaluate((element) => {
      const style = getComputedStyle(element);
      return `${style.color}|${style.backgroundColor}`;
    });
    await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
    const dark = await sample.evaluate((element) => {
      const style = getComputedStyle(element);
      return `${style.color}|${style.backgroundColor}`;
    });
    expect(dark).not.toBe(light);
  }
});

test("projects Badge color, variant, size, placement, and theme without owning semantics", async ({
  page,
}) => {
  await page.goto("/components/parts/badge");

  const callerStatus = page.getByRole("status", { name: "3 条未读通知" });
  await expect(callerStatus).toHaveText("3");

  const softAccent = page.getByLabel("Accent soft Badge");
  const primarySuccess = page.getByLabel("Success primary Badge");
  expect(
    await softAccent.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(await primarySuccess.evaluate((element) => getComputedStyle(element).backgroundColor));

  const smallBadge = page.getByLabel("Badge top-right small");
  const largeBadge = page.getByLabel("Badge bottom-left large");
  expect(
    await largeBadge.evaluate((element) => element.getBoundingClientRect().height),
  ).toBeGreaterThan(await smallBadge.evaluate((element) => element.getBoundingClientRect().height));
  await expect(smallBadge).toHaveCSS("position", "absolute");
  expect(await smallBadge.evaluate((element) => getComputedStyle(element).transform)).not.toBe(
    "none",
  );

  const placementCases = [
    { placement: "top-right", badgeLabel: "Badge top-right small", isRight: true, isBottom: false },
    { placement: "top-left", badgeLabel: "Badge top-left medium", isRight: false, isBottom: false },
    {
      placement: "bottom-right",
      badgeLabel: "Badge bottom-right medium",
      isRight: true,
      isBottom: true,
    },
    {
      placement: "bottom-left",
      badgeLabel: "Badge bottom-left large",
      isRight: false,
      isBottom: true,
    },
  ];
  for (const placementCase of placementCases) {
    const anchor = page.getByLabel(`Badge ${placementCase.placement} anchor`);
    const badge = page.getByLabel(placementCase.badgeLabel);
    const anchorBox = await anchor.boundingBox();
    const badgeBox = await badge.boundingBox();
    expect(anchorBox).not.toBeNull();
    expect(badgeBox).not.toBeNull();
    if (anchorBox !== null && badgeBox !== null) {
      const crossesHorizontalEdge = placementCase.isRight
        ? badgeBox.x + badgeBox.width > anchorBox.x + anchorBox.width
        : badgeBox.x < anchorBox.x;
      const crossesVerticalEdge = placementCase.isBottom
        ? badgeBox.y + badgeBox.height > anchorBox.y + anchorBox.height
        : badgeBox.y < anchorBox.y;
      expect(crossesHorizontalEdge).toBe(true);
      expect(crossesVerticalEdge).toBe(true);
    }
  }

  const lightBackground = await softAccent.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  expect(
    await softAccent.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(lightBackground);
});

test("keeps Chip actions caller-owned while covering visual variants and theme", async ({
  page,
}) => {
  await page.goto("/components/parts/chip");

  const action = page.getByRole("button", { name: "记录 TypeScript 标签操作" });
  await action.focus();
  await expect(action).toBeFocused();
  await action.press("Enter");
  await expect(page.getByText("已记录标签操作 1 次", { exact: true })).toBeVisible();

  const defaultChip = page.getByLabel("Default secondary Chip");
  const accentChip = page.getByLabel("Accent primary Chip");
  expect(
    await defaultChip.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(await accentChip.evaluate((element) => getComputedStyle(element).backgroundColor));

  const smallChip = page.getByLabel("Small Chip");
  const largeChip = page.getByLabel("Large long-content Chip");
  expect(
    await largeChip.evaluate((element) => element.getBoundingClientRect().height),
  ).toBeGreaterThan(await smallChip.evaluate((element) => element.getBoundingClientRect().height));
  const squareChip = page.getByLabel("Medium square Chip");
  await expect(squareChip).toHaveCSS("border-radius", "4px");

  const lightBackground = await defaultChip.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  expect(
    await defaultChip.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(lightBackground);
});

test("projects Card anatomy, surface variants, wrapping, radius, and theme", async ({ page }) => {
  await page.goto("/components/parts/card");

  const semanticCard = page.getByRole("region", { name: "项目摘要卡片" });
  await expect(semanticCard.getByRole("heading", { level: 3, name: "项目状态" })).toBeVisible();
  await expect(semanticCard.getByText("视觉映射已确认", { exact: true })).toBeVisible();

  const defaultCard = page.getByRole("region", { name: "Default Card" });
  const secondaryCard = page.getByRole("region", { name: "Secondary Card" });
  const tertiaryCard = page.getByRole("region", { name: "Tertiary Card" });
  const transparentCard = page.getByRole("region", { name: "Transparent Card" });
  const backgrounds = await Promise.all(
    [defaultCard, secondaryCard, tertiaryCard, transparentCard].map((card) =>
      card.evaluate((element) => getComputedStyle(element).backgroundColor),
    ),
  );
  expect(new Set(backgrounds).size).toBe(4);

  const longCard = page.getByRole("region", { name: "Long-content Card" });
  await expect(longCard).toHaveCSS("border-radius", "4px");
  const longDescription = longCard.getByText(/较长的 Card 描述/);
  await expect(longDescription).toHaveCSS("white-space", "normal");
  expect(
    await longDescription.evaluate((element) => element.scrollWidth <= element.clientWidth),
  ).toBe(true);

  const lightBackground = await defaultCard.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  expect(
    await defaultCard.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(lightBackground);
});

test("renders Skeleton only from external loading state and respects motion preferences", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/components/parts/skeleton");

  const example = page.getByRole("region", { name: "资料加载示例" });
  await expect(example).toHaveAttribute("aria-busy", "true");
  await expect(page.locator("#skeleton-controlled")).toHaveCount(1);
  await page.getByRole("button", { name: "显示已加载内容" }).click();
  await expect(example).toHaveAttribute("aria-busy", "false");
  await expect(page.locator("#skeleton-controlled")).toHaveCount(0);
  await expect(example.getByText("资料已加载", { exact: true })).toBeVisible();

  const shimmer = page.locator("#skeleton-shimmer");
  const pulse = page.locator("#skeleton-pulse");
  const none = page.locator("#skeleton-none");
  expect(
    await shimmer.evaluate((element) => getComputedStyle(element, "::after").animationDuration),
  ).not.toBe("0s");
  expect(await pulse.evaluate((element) => getComputedStyle(element).animationDuration)).not.toBe(
    "0s",
  );
  await expect(none).toHaveCSS("animation-duration", "0s");

  const avatar = page.locator("#skeleton-avatar");
  expect(
    await avatar.evaluate((element) => Number.parseFloat(getComputedStyle(element).borderRadius)),
  ).toBeGreaterThanOrEqual(28);
  const lightBackground = await avatar.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  expect(await avatar.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(
    lightBackground,
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await shimmer.evaluate((element) => getComputedStyle(element, "::after").animationDuration),
  ).toBe("0s");
  await expect(pulse).toHaveCSS("animation-duration", "0s");
});

test("keeps EmptyState actions external across theme, narrow layout, and RTL", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/components/standalone/empty-state");

  const actionable = page.getByRole("region", { name: "同步结果为空" });
  const retry = page.getByRole("button", { name: "重试同步" });
  const lightVisual = await actionable.evaluate((element) => {
    const style = getComputedStyle(element);
    return `${style.color}|${style.backgroundColor}|${style.borderColor}`;
  });
  await retry.focus();
  await expect(retry).toBeFocused();
  await retry.press("Enter");
  await expect(actionable).toHaveCount(0);
  await expect(page.getByRole("region", { name: "同步项目结果" })).toHaveText("已同步项目：Alpha");
  await expect(page.getByText("已请求同步 1 次", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "显示空状态" }).click();
  await expect(actionable).toHaveCount(1);
  const help = page.getByRole("link", { name: "查看同步帮助" });
  await help.focus();
  await expect(help).toBeFocused();
  await expect(help).toHaveAttribute("href", "/examples/routing");

  const noAction = page.getByRole("region", { name: "归档项目空状态" });
  await expect(noAction.getByRole("button")).toHaveCount(0);
  await expect(noAction.getByRole("link")).toHaveCount(0);
  await expect(noAction).toHaveCSS("direction", "rtl");
  expect(
    await noAction.evaluate((element) => element.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(256);
  const longCopy = noAction.getByText(/当项目完成并归档后/);
  expect(await longCopy.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
    true,
  );
  await expect(page.getByText("No results found", { exact: true })).toBeVisible();

  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  const darkVisual = await actionable.evaluate((element) => {
    const style = getComputedStyle(element);
    return `${style.color}|${style.backgroundColor}|${style.borderColor}`;
  });
  expect(darkVisual).not.toBe(lightVisual);
});

test("keeps Alert live-region purpose separate from every visual status", async ({ page }) => {
  await page.goto("/components/standalone/alert");

  const urgent = page.getByRole("alert", { name: "无法连接" });
  const polite = page.getByRole("status", { name: "配置已保存" });
  const dangerPolite = page.getByRole("status", { name: "后台连接状态" });
  await expect(urgent.getByText("请检查网络后重试。", { exact: true })).toBeVisible();
  await expect(polite.getByText("更改已同步到团队。", { exact: true })).toBeVisible();
  const urgentVisual = `${await urgent.evaluate((element) => getComputedStyle(element).backgroundColor)}|${await urgent.getByText("无法连接", { exact: true }).evaluate((element) => getComputedStyle(element).color)}`;
  const dangerPoliteVisual = `${await dangerPolite.evaluate((element) => getComputedStyle(element).backgroundColor)}|${await dangerPolite.getByText("Danger polite status", { exact: true }).evaluate((element) => getComputedStyle(element).color)}`;
  expect(dangerPoliteVisual).toBe(urgentVisual);

  const defaultAlert = page.getByRole("status", { name: "Default Alert" });
  const accentAlert = page.getByRole("status", { name: "Accent Alert" });
  const warningAlert = page.getByRole("status", { name: "Warning Alert" });
  const titleColors = await Promise.all(
    [
      defaultAlert.getByText("Default", { exact: true }),
      accentAlert.getByText("Accent", { exact: true }),
      warningAlert.getByText("Warning", { exact: true }),
    ].map((title) => title.evaluate((element) => getComputedStyle(element).color)),
  );
  expect(new Set(titleColors).size).toBe(3);

  const rtlAlert = page.getByRole("status", { name: "RTL 长文案 Alert" });
  await expect(rtlAlert).toHaveCSS("direction", "rtl");
  expect(
    await rtlAlert.evaluate((element) => element.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(256);
  const rtlDescription = rtlAlert.getByText(/هذا نص طويل/);
  expect(
    await rtlDescription.evaluate((element) => element.scrollWidth <= element.clientWidth),
  ).toBe(true);

  const lightVisual = await accentAlert.evaluate((element) => {
    const style = getComputedStyle(element);
    return `${style.backgroundColor}|${style.color}`;
  });
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  const darkVisual = await accentAlert.evaluate((element) => {
    const style = getComputedStyle(element);
    return `${style.backgroundColor}|${style.color}`;
  });
  expect(darkVisual).not.toBe(lightVisual);
});

test("projects native progress semantics through HeroUI feedback visuals", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/components/standalone/spinner");

  const spinner = page.getByRole("status", { name: "正在加载项目" });
  await expect(spinner).toBeVisible();
  const lightSpinnerColor = await spinner.evaluate((element) => getComputedStyle(element).color);
  expect(await spinner.evaluate((element) => getComputedStyle(element).animationDuration)).not.toBe(
    "0s",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(spinner).toHaveCSS("animation-duration", "0s");
  await page.getByRole("button", { name: "显示加载结果" }).click();
  await expect(spinner).toHaveCount(0);
  await expect(page.getByText("项目已加载", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "重新显示加载状态" }).click();
  await expect(spinner).toHaveCount(1);
  const spinnerVariants = ["正在保存", "正在同步", "正在重试", "继承当前颜色"].map((name) =>
    page.getByRole("status", { name }),
  );
  const spinnerColors = await Promise.all(
    spinnerVariants.map((variant) =>
      variant.evaluate((element) => getComputedStyle(element).color),
    ),
  );
  expect(new Set(spinnerColors).size).toBe(4);
  const spinnerSizes = await Promise.all(
    spinnerVariants
      .slice(0, 3)
      .map((variant) => variant.evaluate((element) => element.getBoundingClientRect().width)),
  );
  expect(spinnerSizes).toEqual([16, 32, 40]);
  const spinnerGradientIds = await page
    .locator('[data-slot="spinner-icon"] linearGradient[id]')
    .evaluateAll((elements) => elements.map((element) => element.id));
  expect(new Set(spinnerGradientIds).size).toBe(spinnerGradientIds.length);
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  expect(await spinner.evaluate((element) => getComputedStyle(element).color)).toBe(
    lightSpinnerColor,
  );

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/components/standalone/progress-bar");
  const progressBar = page.getByRole("progressbar", { name: "项目上传进度" });
  const progressBarFill = progressBar.locator('[data-slot="progress-bar-fill"]');
  await expect(progressBar).toHaveAttribute("aria-valuenow", "40");
  const initialBarWidth = await progressBarFill.evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  await page.getByRole("button", { name: "推进条形进度" }).press("Enter");
  await expect(progressBar).toHaveAttribute("aria-valuenow", "70");
  expect(
    await progressBarFill.evaluate((element) => element.getBoundingClientRect().width),
  ).toBeGreaterThan(initialBarWidth);
  const indeterminateBar = page.getByRole("progressbar", { name: "正在准备上传" });
  await expect(indeterminateBar).not.toHaveAttribute("aria-valuenow");
  expect(
    await indeterminateBar
      .locator('[data-slot="progress-bar-fill"]')
      .evaluate((element) => getComputedStyle(element).animationDuration),
  ).not.toBe("0s");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(indeterminateBar.locator('[data-slot="progress-bar-fill"]')).toHaveCSS(
    "animation-duration",
    "0s",
  );
  const barVariants = ["默认小尺寸进度", "成功大尺寸进度", "危险进度"].map((name) =>
    page.getByRole("progressbar", { name }),
  );
  const barColors = await Promise.all(
    barVariants.map((variant) =>
      variant
        .locator('[data-slot="progress-bar-fill"]')
        .evaluate((element) => getComputedStyle(element).backgroundColor),
    ),
  );
  expect(new Set(barColors).size).toBe(3);
  const barHeights = await Promise.all(
    barVariants
      .slice(0, 2)
      .map((variant) =>
        variant
          .locator('[data-slot="progress-bar-track"]')
          .evaluate((element) => element.getBoundingClientRect().height),
      ),
  );
  expect(barHeights).toEqual([4, 12]);
  const progressBarTrack = progressBar.locator('[data-slot="progress-bar-track"]');
  const lightProgressBarTrack = await progressBarTrack.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  expect(
    await progressBarTrack.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(lightProgressBarTrack);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/components/standalone/progress-circle");
  const progressCircle = page.getByRole("progressbar", { name: "资料处理进度" });
  const progressCircleFill = progressCircle.locator('[data-slot="progress-circle-fill-circle"]');
  const initialCircleOffset = await progressCircleFill.getAttribute("stroke-dashoffset");
  await page.getByRole("button", { name: "推进环形进度" }).click();
  await expect(progressCircle).toHaveAttribute("aria-valuenow", "70");
  expect(await progressCircleFill.getAttribute("stroke-dashoffset")).not.toBe(initialCircleOffset);
  const indeterminateCircle = page.getByRole("progressbar", { name: "正在分析资料" });
  await expect(indeterminateCircle).not.toHaveAttribute("aria-valuenow");
  const indeterminateCircleTrack = indeterminateCircle.locator(
    '[data-slot="progress-circle-track"]',
  );
  expect(
    await indeterminateCircleTrack.evaluate(
      (element) => getComputedStyle(element).animationDuration,
    ),
  ).not.toBe("0s");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(indeterminateCircleTrack).toHaveCSS("animation-duration", "0s");
  const circleVariants = ["警告进度", "成功进度", "默认进度", "危险进度"].map((name) =>
    page.getByRole("progressbar", { name }),
  );
  const circleColors = await Promise.all(
    circleVariants.map((variant) =>
      variant
        .locator('[data-slot="progress-circle-fill-circle"]')
        .evaluate((element) => getComputedStyle(element).stroke),
    ),
  );
  expect(new Set(circleColors).size).toBe(4);
  const circleSizes = await Promise.all(
    circleVariants
      .slice(0, 2)
      .map((variant) =>
        variant
          .locator('[data-slot="progress-circle-track"]')
          .evaluate((element) => element.getBoundingClientRect().width),
      ),
  );
  expect(circleSizes).toEqual([20, 36]);
  const progressCircleTrackCircle = progressCircle.locator(
    '[data-slot="progress-circle-track-circle"]',
  );
  const lightProgressCircleTrack = await progressCircleTrackCircle.evaluate(
    (element) => getComputedStyle(element).stroke,
  );
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  expect(
    await progressCircleTrackCircle.evaluate((element) => getComputedStyle(element).stroke),
  ).not.toBe(lightProgressCircleTrack);

  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/components/standalone/meter");
  const meter = page.getByRole("meter", { name: "存储空间使用量" });
  await expect(meter).toHaveAttribute("aria-valuemin", "0");
  await expect(meter).toHaveAttribute("aria-valuemax", "500");
  await expect(meter).toHaveAttribute("aria-valuenow", "325");
  const meterTrack = meter.locator('[data-slot="meter-track"]');
  const lightTrackColor = await meterTrack.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const healthMeter = page.getByRole("meter", { name: "健康容量" });
  const thresholdMeters = [
    healthMeter,
    page.getByRole("meter", { name: "接近容量上限" }),
    page.getByRole("meter", { name: "容量已告急" }),
  ];
  const thresholdColors = await Promise.all(
    thresholdMeters.map((variant) =>
      variant
        .locator('[data-slot="meter-fill"]')
        .evaluate((element) => getComputedStyle(element).backgroundColor),
    ),
  );
  expect(new Set(thresholdColors).size).toBe(3);
  const meterTrackHeights = await Promise.all(
    thresholdMeters.map((variant) =>
      variant
        .locator('[data-slot="meter-track"]')
        .evaluate((element) => element.getBoundingClientRect().height),
    ),
  );
  expect(meterTrackHeights).toEqual([4, 8, 12]);
  await expect(healthMeter.locator('[data-slot="meter-fill"]')).toHaveCSS(
    "transition-duration",
    "0s",
  );
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  expect(
    await meterTrack.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(lightTrackColor);
  const rtlMeter = page.getByRole("meter", { name: "مساحة التخزين المستخدمة" });
  await expect(rtlMeter).toHaveCSS("direction", "rtl");
  expect(
    await rtlMeter.evaluate((element) => element.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(256);
});

test("projects caller-owned Avatar image states through native image events", async ({ page }) => {
  const avatarImageRelease = Deferred.makeUnsafe<void>();
  const releaseAvatarImage = () => Effect.runSync(Deferred.succeed(avatarImageRelease, undefined));

  await page.emulateMedia({ reducedMotion: "no-preference" });
  page.once("close", releaseAvatarImage);
  await page.route("**/avatar-delayed.svg", async (route) => {
    await Effect.runPromise(Deferred.await(avatarImageRelease));
    await route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#82a7f5"/></svg>',
    });
  });
  await page.route("**/avatar-error.svg", (route) => route.abort());
  await page.goto("/components/standalone/avatar", { waitUntil: "domcontentloaded" });

  const avatar = page.getByRole("img", { name: "Ada Lovelace" });
  await expect(avatar).toBeVisible();
  await page.getByRole("button", { name: "显示Loading头像" }).click();
  const image = avatar.locator('[data-slot="avatar-image"]');
  await expect(image).toHaveAttribute("data-image-state", "loading");
  await expect(image).toHaveCSS("opacity", "0");
  expect(await image.evaluate((element) => getComputedStyle(element).transitionDuration)).not.toBe(
    "0s",
  );

  releaseAvatarImage();
  await expect(page.getByText("当前图片状态：Loaded", { exact: true })).toBeVisible();
  await expect(image).toHaveAttribute("data-image-state", "loaded");
  await expect(image).toHaveCSS("opacity", "1");

  await page.getByRole("button", { name: "显示Loading头像" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(avatar).not.toBeFocused();

  await page.getByRole("button", { name: "尝试不可用图片" }).click();
  await expect(page.getByText("当前图片状态：Failed", { exact: true })).toBeVisible();
  await expect(avatar.locator('[data-slot="avatar-image"]')).toHaveCount(0);
  await expect(avatar.getByText("AL", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "显示Missing头像" }).press("Enter");
  await expect(page.getByText("当前图片状态：Missing", { exact: true })).toBeVisible();
  await expect(avatar.locator('[data-slot="avatar-image"]')).toHaveCount(0);

  const defaultAvatar = page.getByRole("img", { name: "默认小头像" });
  const successAvatar = page.getByRole("img", { name: "成功中头像" });
  const dangerAvatar = page.getByRole("img", { name: "危险大头像" });
  const sizeAvatars = [defaultAvatar, successAvatar, dangerAvatar];
  const avatarSizes = await Promise.all(
    sizeAvatars.map((item) => item.evaluate((element) => element.getBoundingClientRect().width)),
  );
  expect(avatarSizes).toEqual([32, 40, 48]);
  await expect(defaultAvatar).toHaveCSS("border-radius", "16px");
  await expect(dangerAvatar).toHaveCSS("border-radius", "24px");
  const fallbackColors = await Promise.all(
    sizeAvatars.map((item) =>
      item
        .locator('[data-slot="avatar-fallback"]')
        .evaluate((element) => getComputedStyle(element).color),
    ),
  );
  expect(new Set(fallbackColors).size).toBe(3);
  await expect(page.getByRole("img", { name: "强调色头像" })).toBeVisible();
  await expect(page.getByRole("img", { name: "警告色头像" })).toBeVisible();
  await expect(page.getByRole("img", { name: "自定义内容头像" })).toBeVisible();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "显示Loading头像" }).click();
  await expect(avatar.locator('[data-slot="avatar-image"]')).toHaveCSS("transition-duration", "0s");
  const lightBackground = await successAvatar.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  expect(
    await successAvatar.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(lightBackground);
});

test("projects Foldkit Button semantics through Button and CloseButton visuals", async ({
  page,
}) => {
  await page.goto("/components/standalone/button");

  const save = page.getByRole("button", { name: "保存", exact: true });
  const pending = page.getByRole("button", { name: "正在保存", exact: true });
  const disabled = page.getByRole("button", { name: "不可用", exact: true });
  const iconOnly = page.getByRole("button", { name: "＋", exact: true });
  const fullWidth = page.getByRole("button", { name: "全宽操作", exact: true });
  const small = page.getByRole("button", { name: "小尺寸操作", exact: true });
  const actionCount = page.getByText("已记录操作 3 次", { exact: true });
  await expect(save).toHaveAttribute("type", "button");
  await expect(pending).toHaveAttribute("aria-busy", "true");
  await expect(pending).toHaveAttribute("data-pending", "true");
  await expect(pending).toHaveAttribute("aria-disabled", "true");
  await expect(disabled).toHaveAttribute("aria-disabled", "true");
  await expect(iconOnly).toHaveAttribute("data-slot", "button");
  expect(
    await fullWidth.evaluate((element) => element.getBoundingClientRect().width),
  ).toBeGreaterThan(await save.evaluate((element) => element.getBoundingClientRect().width));
  expect(await small.evaluate((element) => element.getBoundingClientRect().height)).toBeLessThan(
    await save.evaluate((element) => element.getBoundingClientRect().height),
  );
  await save.focus();
  await expect(save).toBeFocused();
  await save.hover();
  await page.mouse.down();
  expect(await save.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  await page.mouse.up();
  await save.click();
  await save.press("Enter");
  await expect(actionCount).toBeVisible();
  await pending.focus();
  await expect(pending).toBeFocused();
  await pending.press("Enter");
  await expect(actionCount).toBeVisible();
  await disabled.focus();
  await expect(disabled).toBeFocused();
  await disabled.press(" ");
  await expect(actionCount).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(pending.locator('[data-slot="spinner"]')).toHaveCSS("animation-duration", "0.001s");

  const lightButton = page.getByRole("button", { name: "Light Button" });
  const darkButton = page.getByRole("button", { name: "Dark Button" });
  expect(
    await lightButton.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(await darkButton.evaluate((element) => getComputedStyle(element).backgroundColor));

  await page.goto("/components/standalone/close-button");
  const close = page.getByRole("button", { name: "关闭通知" });
  const disabledClose = page.getByRole("button", { name: "关闭不可用通知" });
  const closeActionCount = page.getByText("已记录操作 3 次", { exact: true });
  await expect(close).toHaveAttribute("type", "button");
  await expect(close).toHaveAttribute("data-slot", "close-button");
  await expect(disabledClose).toHaveAttribute("aria-disabled", "true");
  await close.focus();
  await expect(close).toBeFocused();
  await close.hover();
  await page.mouse.down();
  expect(await close.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  await page.mouse.up();
  await close.click();
  await close.press(" ");
  await expect(closeActionCount).toBeVisible();
  await disabledClose.focus();
  await expect(disabledClose).toBeFocused();
  await disabledClose.press("Enter");
  await expect(closeActionCount).toBeVisible();

  const lightClose = page.getByRole("button", { name: "Light CloseButton" });
  const darkClose = page.getByRole("button", { name: "Dark CloseButton" });
  expect(await lightClose.evaluate((element) => getComputedStyle(element).color)).not.toBe(
    await darkClose.evaluate((element) => getComputedStyle(element).color),
  );
});

test("projects ScrollShadow edges from real scrolling without changing native semantics", async ({
  page,
}) => {
  await page.goto("/components/parts/scroll-shadow");

  const vertical = page.getByLabel("垂直滚动阴影示例");
  await expect(vertical).toHaveAttribute("data-slot", "scroll-shadow");
  await expect(vertical).not.toHaveAttribute("role");
  await expect
    .poll(() => vertical.evaluate((element) => element.scrollHeight > element.clientHeight))
    .toBe(true);
  await vertical.evaluate((element) => {
    element.scrollTop = 30;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect(vertical).toHaveAttribute("data-top-bottom-scroll", "true");
  await vertical.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect(vertical).toHaveAttribute("data-top-scroll", "true");
  await expect(vertical).not.toHaveAttribute("data-bottom-scroll");

  const horizontal = page.getByLabel("水平滚动阴影示例");
  await expect(horizontal).toHaveAttribute("data-orientation", "horizontal");
  await expect(horizontal).toHaveCSS("overflow-x", "auto");
  await expect(horizontal).toHaveCSS("--scroll-shadow-size", "24px");
  await expect
    .poll(() => horizontal.evaluate((element) => element.scrollWidth > element.clientWidth))
    .toBe(true);
  await horizontal.evaluate((element) => {
    element.scrollLeft = 30;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect(horizontal).toHaveAttribute("data-left-right-scroll", "true");
  await horizontal.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect(horizontal).toHaveAttribute("data-left-scroll", "true");
  await expect(horizontal).not.toHaveAttribute("data-right-scroll");
});

test("updates and releases ScrollShadow observers with its mounted container", async ({ page }) => {
  await page.addInitScript(() => {
    const state = { mutationDisconnects: 0, resizeDisconnects: 0, scrollRemovals: 0 };
    const NativeMutationObserver = window.MutationObserver;
    const NativeResizeObserver = window.ResizeObserver;
    const removeEventListener = EventTarget.prototype.removeEventListener;

    class TrackingMutationObserver extends NativeMutationObserver {
      disconnect() {
        state.mutationDisconnects += 1;
        super.disconnect();
      }
    }
    class TrackingResizeObserver extends NativeResizeObserver {
      disconnect() {
        state.resizeDisconnects += 1;
        super.disconnect();
      }
    }

    window.MutationObserver = TrackingMutationObserver;
    window.ResizeObserver = TrackingResizeObserver;
    EventTarget.prototype.removeEventListener = function (type, listener, options) {
      if (
        type === "scroll" &&
        this instanceof HTMLElement &&
        this.getAttribute("aria-label") === "垂直滚动阴影示例"
      ) {
        state.scrollRemovals += 1;
      }
      return removeEventListener.call(this, type, listener, options);
    };
    Object.assign(window, { __scrollShadowLifecycle: state });
  });
  await page.goto("/components/parts/scroll-shadow");

  const vertical = page.getByLabel("垂直滚动阴影示例");
  await vertical.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect(vertical).toHaveAttribute("data-top-scroll", "true");
  await vertical.evaluate((element) => {
    const content = document.createElement("div");
    content.style.height = "24rem";
    element.append(content);
  });
  await expect(vertical).toHaveAttribute("data-top-bottom-scroll", "true");
  await vertical.evaluate((element) => {
    element.style.height = "100rem";
  });
  await expect(vertical).not.toHaveAttribute("data-top-bottom-scroll");

  await page.locator('a[href="/components/parts/typography"]').first().click();
  await expect(page.getByRole("heading", { level: 1, name: "Typography" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.__scrollShadowLifecycle))
    .toEqual({
      mutationDisconnects: 2,
      resizeDisconnects: 2,
      scrollRemovals: 1,
    });
});

test("browses and filters the component catalog through public routes", async ({ page }) => {
  await page.goto("/components");

  await page.getByRole("link", { name: "Standalone", exact: true }).last().click();
  await expect(page).toHaveURL(/\/components\/standalone$/);
  await expect(page.getByRole("link", { name: "EmptyState", exact: true }).last()).toBeVisible();
  const alertLink = page.getByRole("link", { name: "Alert", exact: true }).last();
  await expect(alertLink).toBeVisible();
  await expect(alertLink).toHaveAttribute("href", "/components/standalone/alert");

  await page.getByRole("link", { name: "Parts", exact: true }).first().click();
  await expect(page).toHaveURL(/\/components\/parts$/);
  await expect(page.getByRole("link", { name: "Typography", exact: true }).last()).toBeVisible();

  await page.getByRole("link", { name: "Phase 1" }).click();
  await expect(page).toHaveURL(/\/components\?phase=1$/);
  await page.getByRole("link", { name: "Class A" }).click();
  await expect(page).toHaveURL(/\/components\?behaviorClass=A$/);
  await page.getByRole("link", { name: "verified" }).click();
  await expect(page).toHaveURL(/\/components\?status=verified$/);
  await expect(page.getByRole("link", { name: "Separator", exact: true }).last()).toBeVisible();
});
