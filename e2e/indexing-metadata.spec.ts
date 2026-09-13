import { test, expect } from "@playwright/test";

const publicRoutes = [
  "/", "/about", "/projects", "/stringflux", "/projects/stringflux",
  "/projects/full-swing-tech-support", "/projects/portfolio-site",
  "/projects/research-radar", "/projects/snake-detector",
  "/blog", "/contact", "/music", "/resume",
];

for (const route of publicRoutes) {
  test(`${route} canonical matches its sitemap URL`, async ({ page, request }) => {
    const sitemap = await request.get("/sitemap.xml");
    const urls = Array.from((await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g), ([, url]) => url);
    const expected = urls.find((url) => new URL(url).pathname === route);
    expect(expected, `${route} is in the sitemap`).toBeTruthy();

    await page.goto(`${route}?ref=canonical-check`);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(new URL((await canonical.getAttribute("href"))!).href).toBe(new URL(expected!).href);
  });
}

for (const route of ["/admin", "/admin/login", "/admin/inbox", "/resume/print", "/vault"]) {
  test(`${route} remains excluded from indexing`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });
}

test("robots.txt excludes admin root and descendants", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBe(true);
  expect(await response.text()).toMatch(/^Disallow: \/admin$/m);
});
