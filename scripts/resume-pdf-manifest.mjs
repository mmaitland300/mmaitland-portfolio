import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const manifestPath = new URL("resume-pdf.manifest.json", import.meta.url);
const inputs = [
  "src/content/resume.ts",
  "src/components/resume/resume-document.tsx",
  "src/app/resume/print/page.tsx",
  "src/app/resume/print/layout.tsx",
  "src/app/globals.css",
  "src/lib/site-contact.ts",
  "src/lib/site-url.ts",
  "scripts/generate-resume-pdf.mjs",
  "scripts/resume-pdf-manifest.mjs",
];

async function fingerprint() {
  const sources = {};
  for (const path of inputs) {
    // Git checkouts use different line endings on Windows and Linux.
    const text = (await readFile(new URL(path, root), "utf8")).replace(/\r\n/g, "\n");
    sources[path] = createHash("sha256").update(text).digest("hex");
  }
  const pdf = createHash("sha256")
    .update(await readFile(new URL("public/resume.pdf", root)))
    .digest("hex");
  return { version: 1, sources, pdf };
}

export async function recordResumePdf() {
  await writeFile(manifestPath, `${JSON.stringify(await fingerprint(), null, 2)}\n`);
}

export async function checkResumePdf() {
  const expected = JSON.parse(await readFile(manifestPath, "utf8"));
  const actual = await fingerprint();
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error(
      "Resume inputs or PDF changed. Start a local server with the latest source, run npm run resume:pdf, inspect the PDF, and commit both PDF and manifest."
    );
  }
  console.log("Resume PDF matches its recorded source and artifact fingerprints.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  checkResumePdf().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
