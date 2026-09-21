"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Six-second module intro (Remotion, video/src/ModuleIntro.tsx).
 * Plays once, muted, with no controls - it's a title card, not content.
 * When the viewer has reduced motion enabled, only the still poster is shown.
 */
export function ModuleIntroClip({
  moduleOrder,
  title,
}: {
  moduleOrder: number;
  title: string;
}) {
  const [reduced, setReduced] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const src = `/intro/module-${moduleOrder}.mp4`;
  const poster = `/intro/module-${moduleOrder}.jpg`;
  const alt = `Uvod u modul ${moduleOrder}: ${title}`;

  // Until we know the setting, show the poster - never play video "just in case".
  if (reduced !== false) {
    return (
      <Image
        src={poster}
        alt={alt}
        width={1920}
        height={1080}
        className="h-auto w-full rounded border border-line"
        priority={false}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      muted
      playsInline
      preload="metadata"
      aria-label={alt}
      className="w-full rounded border border-line"
    />
  );
}
