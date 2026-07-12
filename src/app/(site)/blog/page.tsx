import type { Metadata } from "next";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { getAllPosts, getAllTags } from "@/lib/mdx";
import { BlogList } from "@/components/sections/blog-list";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Troubleshooting writeups, notes from side projects, and explanations of technical decisions I made along the way.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="py-32">
      <MainContentAnchor />
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader
          eyebrow="Writing"
          title="Notes and Decision Records"
          description="Troubleshooting writeups, notes from side projects, and explanations of technical decisions I made along the way."
          className="mb-16"
        />

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No posts are published yet.
            </p>
          </div>
        ) : (
          <BlogList posts={posts} tags={tags} />
        )}
      </div>
    </div>
  );
}
