import { createOgImage, ogSize } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "About | Matt Maitland";
export const size = ogSize;
export const contentType = "image/png";

export default function OgImage() {
  return createOgImage(
    "About",
    "Robotics technician, web software, audio DSP, and music"
  );
}
