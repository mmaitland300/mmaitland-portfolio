import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/components/sections/table-of-contents";
import { formatDisplayDate } from "@/lib/date";
import { getAllPosts, getPostBySlug, createTocPlugin, type TocEntry } from "@/lib/mdx";
import { mdxComponents } from "@/lib/mdx-components";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    alternates: { canonical: `/blog/${slug}` },
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: post.frontmatter.tags,
    openGraph: {
      url: `/blog/${slug}`,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const toc: TocEntry[] = [];
  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          createTocPlugin(toc),
          [rehypePrettyCode, { theme: "github-dark-default", keepBackground: true }],
        ],
      },
    },
  });

  return (
    <div className="py-32">
      <MainContentAnchor />
      <div className="mx-auto max-w-6xl px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to blog
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_220px] gap-12">
          <article className="max-w-3xl">
            <header className="mb-10">
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDisplayDate(post.frontmatter.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readingTime}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                {post.frontmatter.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {post.frontmatter.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.frontmatter.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            <div className="prose-custom">
              {content}
            </div>
          </article>

          <aside>
            <TableOfContents toc={toc} />
          </aside>
        </div>
      </div>
    </div>
  );
}
