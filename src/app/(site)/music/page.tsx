import type { Metadata } from "next";
import { ExternalLink, Music2 } from "lucide-react";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { LazySoundCloudTrack } from "@/components/sections/lazy-soundcloud-track";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Original music by Matt Maitland - written, recorded, produced, and mastered as NEUROCHEMICAL ENTROPY. Listen on SoundCloud.",
};

const SOUNDCLOUD_PROFILE = "https://soundcloud.com/matthew_maitland";

const EMBED_PARAMS =
  "&color=%239333ea&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true";

const tracks = [
  {
    title: "West",
    artist: "NEUROCHEMICAL ENTROPY",
    trackUrl: "https://soundcloud.com/matthew_maitland/west-20d-mp3",
  },
  {
    title: "Gyroscopic Intuition",
    artist: "NEUROCHEMICAL ENTROPY",
    trackUrl: "https://soundcloud.com/matthew_maitland/gyroscopic-intuition-7b",
  },
  {
    title: "Stormy Saturday",
    artist: "NEUROCHEMICAL ENTROPY",
    trackUrl: "https://soundcloud.com/matthew_maitland/renaissance",
  },
  {
    title: "Exinhibitor",
    artist: "NEUROCHEMICAL ENTROPY",
    trackUrl: "https://soundcloud.com/matthew_maitland/exinhibitor-4a",
  },
];

export default function MusicPage() {
  return (
    <div className="py-32">
      <MainContentAnchor />
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12">
          <SectionHeader
            eyebrow="Music"
            title="Playing, Recording & Production"
            description="I play, record, produce, and master original music under the name NEUROCHEMICAL ENTROPY. A few tracks are below - head over to SoundCloud for the full catalog."
          />
          <div className="mt-5 flex justify-center">
            <Music2 className="h-6 w-6 text-[rgba(122,162,247,0.95)]" />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            Making music is also what led me to build audio DSP tools. I can
            try ideas in actual songs and hear whether they help the music or
            get in the way.
          </p>
        </div>

        <div className="space-y-10">
          {tracks.map((track) => (
            <section key={track.title} className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {track.title}
                </h2>
                <p className="text-sm text-muted-foreground">{track.artist}</p>
              </div>

              <LazySoundCloudTrack
                title={track.title}
                trackUrl={track.trackUrl}
                embedParams={EMBED_PARAMS}
              />

              <div className="text-sm text-muted-foreground">
                <a
                  href={track.trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Open {track.title} on SoundCloud
                </a>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={SOUNDCLOUD_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ExternalLink className="h-4 w-4" /> Follow on SoundCloud
          </a>
        </div>
      </div>
    </div>
  );
}
