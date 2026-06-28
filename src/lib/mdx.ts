import fs from "fs";
import path from "path";
import readingTime from "reading-time";
import { parse as parseYaml } from "yaml";
import { parseDateValue } from "@/lib/date";

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

export const BLOG_POST_TYPES = [
  "Case Study",
  "Decision Record",
  "Field Note",
] as const;
export type BlogPostType = (typeof BLOG_POST_TYPES)[number];

export const BLOG_CORE_TAGS = [
  "Troubleshooting",
  "Web Architecture",
  "TypeScript",
  "Next.js",
  "Audio DSP",
] as const;
export type BlogCoreTag = (typeof BLOG_CORE_TAGS)[number];

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  type: BlogPostType;
  tags: BlogCoreTag[];
  published: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  readingTime: string;
  content: string;
}

export interface TocEntry {
  id: string;
  text: string;
  depth: number;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

function parseMdxFrontmatter(raw: string, slug: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) {
    return { data: {}, content: raw };
  }

  const [, frontmatterBlock] = match;
  try {
    return {
      data: parseYaml(frontmatterBlock) ?? {},
      content: raw.slice(match[0].length),
    };
  } catch (error) {
    throw new Error(`${slug}: invalid frontmatter YAML`, { cause: error });
  }
}

function parseFrontmatter(rawData: unknown, slug: string): BlogFrontmatter {
  const data = (rawData ?? {}) as Record<string, unknown>;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const date = typeof data.date === "string" ? data.date.trim() : "";
  const type = typeof data.type === "string" ? data.type.trim() : "";
  const tags = toStringArray(data.tags);
  const published = Boolean(data.published);

  if (!title) throw new Error(`${slug}: missing title`);
  if (!description) throw new Error(`${slug}: missing description`);
  if (!date) throw new Error(`${slug}: missing date`);
  if (Number.isNaN(new Date(date).getTime())) {
    throw new Error(`${slug}: invalid date "${date}"`);
  }
  if (!BLOG_POST_TYPES.includes(type as BlogPostType)) {
    throw new Error(
      `${slug}: invalid type "${type}". Allowed: ${BLOG_POST_TYPES.join(", ")}`
    );
  }
  if (tags.length === 0) throw new Error(`${slug}: tags must not be empty`);
  for (const tag of tags) {
    if (!BLOG_CORE_TAGS.includes(tag as BlogCoreTag)) {
      throw new Error(
        `${slug}: invalid tag "${tag}". Allowed: ${BLOG_CORE_TAGS.join(", ")}`
      );
    }
  }

  return {
    title,
    description,
    date,
    type: type as BlogPostType,
    tags: tags as BlogCoreTag[],
    published,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = path.join(CONTENT_DIR, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = parseMdxFrontmatter(raw, slug);
      const frontmatter = parseFrontmatter(data, slug);

      return {
        slug,
        frontmatter,
        readingTime: readingTime(content).text,
        content,
      };
    })
    .filter((post) => post.frontmatter.published)
    .sort(
      (a, b) =>
        parseDateValue(b.frontmatter.date).getTime() -
        parseDateValue(a.frontmatter.date).getTime()
    );

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseMdxFrontmatter(raw, slug);
  const frontmatter = parseFrontmatter(data, slug);

  if (!frontmatter.published) return null;

  return {
    slug,
    frontmatter,
    readingTime: readingTime(content).text,
    content,
  };
}

export function getAllTags(): BlogCoreTag[] {
  const posts = getAllPosts();
  const tags = new Set<BlogCoreTag>();
  posts.forEach((post) => post.frontmatter.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export function extractToc(content: string): TocEntry[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const entries: TocEntry[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    entries.push({ id, text, depth });
  }

  return entries;
}
