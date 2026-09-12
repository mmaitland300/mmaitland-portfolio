import { test, expect } from "@playwright/test";

test.describe("skip link", () => {
  test("activating skip link moves focus to main content", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeAttached();

    // Browser tab-focus behavior can vary in CI/headless; focus the skip link directly.
    await skip.focus();
    await expect(skip).toBeFocused();
    await skip.press("Enter");

    const target = page.locator("#main-content");
    await expect(target).toBeFocused();
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeInViewport();
    expect(await target.evaluate((anchor) => {
      const heading = document.querySelector("h1");
      return Boolean(
        heading &&
        (anchor.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)
      );
    })).toBe(true);

    // The first tab after the skip target should reach the introduction's CTA.
    await page.keyboard.press("Tab");
    await expect(page.locator("main a").first()).toBeFocused();
  });
});
