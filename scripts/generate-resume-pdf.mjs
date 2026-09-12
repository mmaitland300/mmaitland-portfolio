/**
 * Renders the print-first route /resume/print with Chromium and writes public/resume.pdf.
 * Requires a running site (dev or production server) on the origin below.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { recordResumePdf } from "./resume-pdf-manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPath = join(root, "public", "resume.pdf");

const baseURL = (process.env.RESUME_PDF_ORIGIN ?? "http://localhost:3000").replace(
  /\/$/,
  ""
);

const PRINT_PATH = "/resume/print";

async function main() {
  await mkdir(dirname(outPath), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.emulateMedia({ media: "print" });

  try {
    const response = await page.goto(`${baseURL}${PRINT_PATH}`, {
      waitUntil: "load",
      timeout: 60_000,
    });
    if (!response || !response.ok()) {
      throw new Error(
        `Expected HTTP 2xx from ${PRINT_PATH}, got ${response?.status() ?? "no response"}`
      );
    }

    await page.locator("[data-resume-print-ready]").waitFor({
      state: "attached",
      timeout: 15_000,
    });

    const heading = page.locator("h1").first();
    await heading.waitFor({ state: "visible", timeout: 10_000 });
    const title = (await heading.textContent())?.trim() ?? "";
    if (!title.includes("Matt Maitland")) {
      throw new Error(
        `Resume print layout missing expected name in h1 (got "${title.slice(0, 80)}")`
      );
    }

    await page.evaluate(() => document.fonts.ready);

    await page.pdf({
      path: outPath,
      format: "Letter",
      printBackground: true,
      margin: {
        top: "0.45in",
        right: "0.45in",
        bottom: "0.45in",
        left: "0.45in",
      },
    });
  } finally {
    await browser.close();
  }

  await recordResumePdf();
  console.log(`Wrote ${outPath} and recorded source/PDF fingerprints`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
