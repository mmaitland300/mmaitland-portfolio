import { test, expect } from "@playwright/test";
import { getAllPosts } from "../src/lib/mdx";

for (const { slug } of getAllPosts()) {
  test(`${slug}: contents links target the rendered article headings`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/blog/${slug}`);
    const links = page.locator('aside a[href^="#"]');
    expect(await links.count()).toBeGreaterThan(0);

    const brokenLinks = await links.evaluateAll((elements) => elements.flatMap((link) => {
      const hash = link.getAttribute("href")?.slice(1) ?? "";
      const target = document.getElementById(decodeURIComponent(hash));
      return target?.matches("article h2, article h3, article h4") ? [] : [hash];
    }));
    expect(brokenLinks).toEqual([]);

    const first = links.first();
    const href = await first.getAttribute("href");
    await first.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.locator(href!)).toBeInViewport();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href", new RegExp(`/blog/${slug}$`)
    );
  });
}
