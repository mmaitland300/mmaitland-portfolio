import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/layout/motion-provider";
import { PAGE_TITLE_GRADIENT } from "@/lib/page-title-gradient";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Matt Maitland",
    template: "%s | Matt Maitland",
  },
  description:
    "Robotics technician building web software and audio DSP tools, writing and producing music, and working on research prototypes. Case studies, blog, and contact.",
  keywords: [
    "Matt Maitland",
    "robotics technician",
    "Barn Owl Precision",
    "technical support",
    "Full Swing",
    "web software",
    "audio DSP",
    "music",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Matt Maitland" }],
  creator: "Matt Maitland",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Matt Maitland",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // suppressHydrationWarning on <html>/<body> only suppresses attribute drift
  // injected by browser tooling/extensions (e.g. data-cursor-ref, theme/locale
  // attributes). It does not hide real component-tree hydration mismatches,
  // which still surface from child components.
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--page-title-gradient:${PAGE_TITLE_GRADIENT}}`,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col relative bg-background text-foreground"
        suppressHydrationWarning
      >
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
