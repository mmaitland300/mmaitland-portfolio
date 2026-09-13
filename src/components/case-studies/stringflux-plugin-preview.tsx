"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";

/** Left-to-right: simplest surface first, then waveform, then advanced. */
const views = [
  {
    src: "/images/stringflux/ui-preset.png",
    alt: "StringFlux core layout: primary controls and mod-source envelope meters with live levels",
    label: "Core",
    width: 577,
    height: 461,
  },
  {
    src: "/images/stringflux/ui-waveform.png",
    alt: "StringFlux waveform layout: core controls, waveform editor with region highlight, and mod-source envelope meters with live levels",
    label: "Waveform",
    width: 576,
    height: 579,
  },
  {
    src: "/images/stringflux/ui-advanced.png",
    alt: "StringFlux advanced layout: modulation matrix, string transients, modulation sources, core controls, and mod-source envelope meters with live levels",
    label: "Advanced",
    width: 577,
    height: 902,
  },
] as const;

export function StringFluxPluginPreview() {
  const [active, setActive] = useState(0);
  const activeView = views[active];

  return (
    <Dialog.Root>
      <figure className="overflow-hidden rounded-xl border border-border bg-zinc-950">
        <div
          id="stringflux-plugin-preview-panel"
          className="flex justify-center bg-zinc-950 p-2"
        >
          <Dialog.Trigger
            className="group flex w-full justify-center cursor-zoom-in"
            aria-label={`Open StringFlux ${activeView.label} layout screenshot in full resolution`}
          >
            <Image
              key={activeView.src}
              src={activeView.src}
              alt={activeView.alt}
              width={activeView.width}
              height={activeView.height}
              quality={100}
              unoptimized
              className="h-auto w-auto max-h-[680px] max-w-full object-contain transition-opacity group-hover:opacity-95"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 700px"
              priority
            />
          </Dialog.Trigger>
        </div>
        <div className="flex items-center justify-center gap-2 border-t border-border bg-zinc-950/80 px-4 py-2.5">
          <div
            role="group"
            aria-label="Plugin interface layout"
            className="flex items-center gap-2"
          >
            {views.map((view, i) => (
              <button
                key={view.label}
                type="button"
                aria-pressed={i === active}
                aria-controls="stringflux-plugin-preview-panel"
                onClick={() => setActive(i)}
                className={`rounded-md px-3 py-1 font-mono text-xs transition-colors ${
                  i === active
                    ? "bg-brand-violet/20 text-brand-violet"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground/50">
            v0.3-dev
          </span>
        </div>
      </figure>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/90" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Popup
            className="relative max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] rounded-lg bg-zinc-950 p-3 outline-none"
          >
            <Dialog.Title className="sr-only">
              StringFlux {activeView.label} layout full resolution preview
            </Dialog.Title>
            <div className="mb-3 flex justify-end">
              <Dialog.Close
                className="rounded border border-white/20 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Close full resolution preview"
              >
                Close
              </Dialog.Close>
            </div>
            <div
              className="max-h-[calc(100dvh-7rem)] max-w-full overflow-auto focus-visible:outline-2 focus-visible:outline-white"
              tabIndex={0}
              role="region"
              aria-label="Scrollable full resolution screenshot"
            >
              <Image
                src={activeView.src}
                alt={activeView.alt}
                width={activeView.width}
                height={activeView.height}
                quality={100}
                unoptimized
                className="h-auto w-auto max-w-none"
                sizes="95vw"
                priority
              />
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
