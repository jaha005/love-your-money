"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Šestosekundni uvod u modul (Remotion, video/src/ModuleIntro.tsx).
 * Pušta se jednom, bez zvuka i bez kontrola - to je naslovna kartica, ne sadržaj.
 * Kad korisnica ima uključeno smanjeno kretanje, prikaže se samo statična sličica.
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

  const src = `/intro/modul-${moduleOrder}.mp4`;
  const poster = `/intro/modul-${moduleOrder}.jpg`;
  const alt = `Uvod u modul ${moduleOrder}: ${title}`;

  // Prije nego znamo postavku, pokaži sličicu - nikad ne pusti video "za svaki slučaj".
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
