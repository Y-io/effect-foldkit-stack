import { expect, test } from "@playwright/test";

test("lists every official example route", async ({ page }) => {
  await page.goto("/examples");

  await expect(
    page.getByRole("heading", { name: "The complete Foldkit example catalog." }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Official examples" }).getByRole("listitem"),
  ).toHaveCount(31);
});

test("cold-loads and refreshes a deep typed route", async ({ page }) => {
  await page.goto("/examples/routing/teams/7/members/19?tab=Activity");

  await expect(page.getByRole("heading", { name: "Multiple parameters plus query" })).toBeVisible();
  await expect(page.getByText("teamId").locator("..")).toContainText("7");
  await page.reload();
  await expect(page).toHaveURL(/\/examples\/routing\/teams\/7\/members\/19\?tab=Activity$/);
  await expect(page.getByRole("heading", { name: "Multiple parameters plus query" })).toBeVisible();
});

test("uses push, replace, back, and forward history behavior", async ({ page }) => {
  await page.goto("/examples/routing/static");
  await page.getByRole("link", { name: "Integer param" }).click();
  await expect(page).toHaveURL(/\/examples\/routing\/orders\/42$/);

  await page.getByRole("button", { name: "Replace URL" }).click();
  await expect(page).toHaveURL(/\/examples\/routing\/search\?q=replace&page=2&sort=Desc$/);

  await page.getByRole("button", { name: "Back" }).click();
  await expect(page).toHaveURL(/\/examples\/routing\/static$/);

  await page.getByRole("button", { name: "Forward" }).click();
  await expect(page).toHaveURL(/\/examples\/routing\/search\?q=replace&page=2&sort=Desc$/);
});

test("distinguishes URL and resource not-found states", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(
    page.getByRole("heading", { name: "No parser consumed this complete path." }),
  ).toBeVisible();

  await page.goto("/examples/missing-example");
  await expect(
    page.getByRole("heading", { name: "The route matched, but the example does not exist." }),
  ).toBeVisible();

  await page.goto("/examples/routing/orders/404");
  await expect(page.getByRole("heading", { name: "Order not found" })).toBeVisible();
});

test("redirects through a Command guard and then grants local access", async ({ page }) => {
  await page.goto("/examples/routing/guarded");

  await expect(page).toHaveURL(/\/examples\/routing\/sign-in\?redirectTo=/);
  await expect(
    page.getByRole("heading", { name: "Sign in to enter the guarded route." }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Sign in locally" }).click();
  await expect(page).toHaveURL(/\/examples\/routing\/guarded$/);
  await expect(
    page.getByRole("heading", { name: "The Command guard allowed entry." }),
  ).toBeVisible();
});

test("keeps route navigation usable when View Transitions are unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto("/examples/routing");
  await page.getByRole("link", { name: "Static" }).click();

  await expect(page).toHaveURL(/\/examples\/routing\/static$/);
  await expect(page.getByRole("heading", { name: "Static route" })).toBeVisible();
});
