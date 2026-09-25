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

    // Play one complete action after loading, then return to the original pose.
    const timings = [900, 1610, 2320, 3160, 3970, 4860];
    const timers = timings.map((time, index) =>
      window.setTimeout(() => setActiveFrame(index < frames.length ? index : -1), time),
    );
    return () => timers.forEach(window.clearTimeout);
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
