import type { Metadata } from "next";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <MainContentAnchor />
      <Hero />
      <FeaturedProjects />
    </>
  );
}
