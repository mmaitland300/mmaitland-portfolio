import { describe, expect, it } from "vitest";
import { compileMDX } from "next-mdx-remote/rsc";
import { renderToStaticMarkup } from "react-dom/server";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { createTocPlugin, type TocEntry } from "./mdx";

async function compileArticle(source: string) {
  const toc: TocEntry[] = [];
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, createTocPlugin(toc)],
      },
    },
  });
  return { toc, html: renderToStaticMarkup(content) };
}

describe("article table of contents", () => {
  it("uses rendered text and GitHub IDs for punctuation, formatting, and Unicode", async () => {
    const { toc, html } = await compileArticle([
      "## Why Next.js?",
      "## What I've **learned** so far",
      "### Option A: API route + client fetch",
      "#### Use `code` & [links](https://example.com)",
      "## Café 東京",
    ].join("\n\n"));

    expect(toc).toEqual([
      { id: "why-nextjs", text: "Why Next.js?", depth: 2 },
      { id: "what-ive-learned-so-far", text: "What I've learned so far", depth: 2 },
      { id: "option-a-api-route--client-fetch", text: "Option A: API route + client fetch", depth: 3 },
      { id: "use-code--links", text: "Use code & links", depth: 4 },
      { id: "café-東京", text: "Café 東京", depth: 2 },
    ]);
    for (const { id, depth } of toc) {
      expect(html).toContain(`<h${depth} id="${id}">`);
    }
  });

  it("accounts for every heading when deduplicating but lists only levels 2–4", async () => {
    const { toc } = await compileArticle([
      "# Repeat",
      "## Repeat",
      "##### Repeat",
      "### Repeat",
      "## Repeat-1",
    ].join("\n\n"));

    expect(toc.map(({ id }) => id)).toEqual(["repeat-1", "repeat-3", "repeat-1-1"]);
  });

  it("ignores code samples and includes setext and nested block headings", async () => {
    const { toc } = await compileArticle([
      "```md\n## Not a section\n```",
      "~~~md\n## Also a code example\n~~~",
      "A setext heading\n----------------",
      "> ### Quoted heading",
      "## Closing hashes ##",
    ].join("\n\n"));

    expect(toc).toEqual([
      { id: "a-setext-heading", text: "A setext heading", depth: 2 },
      { id: "quoted-heading", text: "Quoted heading", depth: 3 },
      { id: "closing-hashes", text: "Closing hashes", depth: 2 },
    ]);
  });
});
