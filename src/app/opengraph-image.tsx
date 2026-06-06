import { createOgImage, ogSize } from "@/lib/og-image";

export const runtime = "edge";
export const alt =
  "Matt Maitland | Robotics technician and software builder";
export const size = ogSize;
export const contentType = "image/png";

export default function OgImage() {
  return createOgImage(
    "Matt Maitland",
    "Robotics technician building web software, audio DSP tools, music, and research prototypes"
  );
}
