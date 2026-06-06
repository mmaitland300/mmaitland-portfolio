import { createOgImage, ogSize } from "@/lib/og-image";

export const runtime = "edge";
export const alt =
  "Matt Maitland | Robotics technician and software builder";
export const size = ogSize;
export const contentType = "image/png";

export default function OgImage() {
  return createOgImage(
    "Matt Maitland",
    "Robotics technician building web software and audio DSP tools, writing and producing music, and working on research prototypes"
  );
}
