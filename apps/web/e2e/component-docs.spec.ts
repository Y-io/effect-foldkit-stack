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
