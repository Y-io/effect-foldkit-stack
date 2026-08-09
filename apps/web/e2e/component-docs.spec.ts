import { expect, test } from "@playwright/test";

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

test("browses and filters the component catalog through public routes", async ({ page }) => {
  await page.goto("/components");

  await page.getByRole("link", { name: "Standalone", exact: true }).last().click();
  await expect(page).toHaveURL(/\/components\/standalone$/);
  await expect(page.getByText("当前筛选没有组件。")).toBeVisible();

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
