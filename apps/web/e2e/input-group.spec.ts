import { expect, test } from "@playwright/test";

test("从主 Input 投射 readonly、invalid 与 focus 外观而不改变 standalone Input", async ({
  page,
}) => {
  await page.goto("/examples/ui-showcase");

  const plainInput = page.getByRole("textbox", { name: "Plain grouped input" });
  const readOnlyInput = page.getByRole("textbox", { name: "Readonly grouped input" });
  const invalidInput = page.getByRole("textbox", { name: "Invalid grouped input" });
  const standaloneInput = page.getByRole("textbox", { name: "Standalone invalid input" });

  await expect(readOnlyInput).toHaveAttribute("data-readonly", "");
  await expect(invalidInput).toHaveAttribute("aria-invalid", "true");
  await expect(invalidInput).toHaveAttribute("data-readonly", "");

  const plainSurface = plainInput.locator("..");
  const readOnlySurface = readOnlyInput.locator("..");
  const invalidSurface = invalidInput.locator("..");

  await expect(invalidSurface).not.toHaveAttribute("aria-invalid");
  await expect(readOnlySurface).not.toHaveAttribute("data-readonly");

  const plainBackground = await plainSurface.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const readOnlyBackground = await readOnlySurface.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(readOnlyBackground).not.toBe(plainBackground);

  const plainOutline = await plainSurface.evaluate(
    (element) => getComputedStyle(element).outlineStyle,
  );
  const invalidOutline = await invalidSurface.evaluate(
    (element) => getComputedStyle(element).outlineStyle,
  );
  expect(invalidOutline).not.toBe(plainOutline);
  const invalidBackground = await invalidSurface.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(invalidBackground).not.toBe(readOnlyBackground);

  const plainDescriptionColor = await page
    .getByText("Focus demonstrates the shared and local focus indicators.")
    .evaluate((element) => getComputedStyle(element).color);
  const invalidDescriptionColor = await page
    .getByText("This value is invalid.")
    .evaluate((element) => getComputedStyle(element).color);
  expect(invalidDescriptionColor).not.toBe(plainDescriptionColor);

  const plainShadow = await plainSurface.evaluate((element) => getComputedStyle(element).boxShadow);
  const inputShadowBeforeFocus = await plainInput.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );
  await plainInput.focus();
  expect(await plainSurface.evaluate((element) => element.matches(":focus-within"))).toBe(true);
  expect(await plainSurface.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe(
    plainShadow,
  );
  expect(await plainInput.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe(
    inputShadowBeforeFocus,
  );

  const invalidOutlineColor = await invalidSurface.evaluate(
    (element) => getComputedStyle(element).outlineColor,
  );
  const invalidInputShadowBeforeFocus = await invalidInput.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );
  await invalidInput.focus();
  expect(await invalidSurface.evaluate((element) => element.matches(":focus-within"))).toBe(true);
  expect(await invalidSurface.evaluate((element) => getComputedStyle(element).outlineColor)).toBe(
    invalidOutlineColor,
  );
  expect(await invalidInput.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe(
    invalidInputShadowBeforeFocus,
  );

  expect(
    await standaloneInput.evaluate((element) => getComputedStyle(element).borderRadius),
  ).not.toBe("0px");
});

test("Action Affix 保留行为与局部焦点，Group Disabled 不由 wrapper 拦截伪造", async ({ page }) => {
  await page.goto("/examples/ui-showcase");

  const readOnlyInput = page.getByRole("textbox", { name: "Readonly action grouped input" });
  const enabledAction = page.getByRole("button", { name: "Open from action affix" });
  const disabledInput = page.getByRole("textbox", { name: "Disabled action grouped input" });
  const disabledAction = page.getByRole("button", { name: "Disabled action affix" });

  await expect(readOnlyInput).toHaveAttribute("data-readonly", "");
  await expect(enabledAction).not.toHaveAttribute("aria-disabled");

  const enabledSurface = readOnlyInput.locator("..");
  const enabledSurfaceShadow = await enabledSurface.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );
  const enabledActionShadow = await enabledAction.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );
  await enabledAction.focus();
  await expect(enabledAction).toBeFocused();
  expect(await enabledSurface.evaluate((element) => element.matches(":focus-within"))).toBe(true);
  expect(await enabledSurface.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe(
    enabledSurfaceShadow,
  );
  expect(await enabledAction.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe(
    enabledActionShadow,
  );

  await enabledAction.press("Enter");
  await expect(page.getByRole("dialog", { name: "Foldkit owns the behavior" })).toBeVisible();
  await page.keyboard.press("Escape");

  await expect(disabledInput).toBeDisabled();
  await expect(disabledInput).toHaveAttribute("aria-invalid", "true");
  await expect(disabledInput).toHaveAttribute("data-readonly", "");
  await expect(disabledAction).toHaveAttribute("aria-disabled", "true");
  await expect(disabledAction).toHaveAttribute("data-disabled", "");
  await expect(disabledAction).toHaveJSProperty("tabIndex", 0);

  const disabledSurface = disabledInput.locator("..");
  expect(
    await disabledSurface.evaluate((element) => getComputedStyle(element).pointerEvents),
  ).not.toBe("none");
  expect(await disabledSurface.evaluate((element) => getComputedStyle(element).opacity)).not.toBe(
    "1",
  );
  expect(await disabledSurface.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe(
    "none",
  );
  const disabledBackground = await disabledSurface.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const disabledShadow = await disabledSurface.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );
  const disabledActionBackground = await disabledAction.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await disabledSurface.hover();
  expect(
    await disabledSurface.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).toBe(disabledBackground);
  expect(await disabledSurface.evaluate((element) => getComputedStyle(element).boxShadow)).toBe(
    disabledShadow,
  );
  expect(
    await disabledAction.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).toBe(disabledActionBackground);

  const invalidDescriptionColor = await page
    .getByText("This value is invalid.")
    .evaluate((element) => getComputedStyle(element).color);
  const disabledDescriptionColor = await page
    .getByText("Disabled state overrides this invalid surface.")
    .evaluate((element) => getComputedStyle(element).color);
  expect(disabledDescriptionColor).not.toBe(invalidDescriptionColor);

  await disabledAction.focus();
  await expect(disabledAction).toBeFocused();
  expect(await disabledSurface.evaluate((element) => element.matches(":focus-within"))).toBe(true);
  expect(
    await disabledSurface.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).toBe(disabledBackground);
  expect(await disabledSurface.evaluate((element) => getComputedStyle(element).boxShadow)).toBe(
    disabledShadow,
  );
  await disabledAction.press("Enter");
  expect(
    await disabledAction.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).toBe(disabledActionBackground);
  await expect(page.getByRole("dialog", { name: "Foldkit owns the behavior" })).toBeHidden();
});
