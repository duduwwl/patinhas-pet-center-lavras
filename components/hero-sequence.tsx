"use client";

import { useEffect, useState } from "react";

const frames = [
  "/images/hero-patinhas-frame-turn.png",
  "/images/hero-patinhas-frame-approach.png",
  "/images/hero-patinhas-interaction.png",
  "/images/hero-patinhas-frame-reaction.png",
  "/images/hero-patinhas-frame-release.png",
];

export function HeroSequence() {
  const [activeFrame, setActiveFrame] = useState(-1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let timers: number[] = [];

    // Wait for every full-size frame before starting so a slow connection
    // cannot skip the action while its images are still downloading.
    Promise.all(frames.map((src) => new Promise<void>((resolve) => {
      const image = new window.Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = src;
    }))).then(() => {
      if (cancelled) return;
      const timings = [350, 1400, 2450, 3650, 4750, 6200];
      timers = timings.map((time, index) =>
        window.setTimeout(() => setActiveFrame(index < frames.length ? index : -1), time),
      );
    });

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
    };
  }, []);

  return (
    <div className="hero-sequence" aria-hidden="true">
      {frames.map((src, index) => (
        <div
          key={src}
          className={`hero-frame${activeFrame === index ? " is-active" : ""}`}
          style={{ "--frame-image": `url("${src}")` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
