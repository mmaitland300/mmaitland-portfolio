import { createOgImage, ogSize } from "@/lib/og-image";
import { siteDescription } from "@/content/resume";

export const runtime = "edge";
export const alt = "Matt Maitland | Software development";
export const size = ogSize;
export const contentType = "image/png";

export default function OgImage() {
  return createOgImage(
    "Matt Maitland",
    siteDescription
  );
}
