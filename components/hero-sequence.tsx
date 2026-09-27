"use client";

import { useEffect, useRef } from "react";

export function HeroSequence() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let disposed = false;
    const sync = () => {
      if (motion.matches || document.hidden || !visible) {
        video.pause();
        if (motion.matches) video.classList.remove("is-playing");
        return;
      }
      if (!video.src) video.src = "/videos/hero-patinhas-completo.mp4";
      video.play().then(() => {
        if (!disposed) video.classList.add("is-playing");
      }).catch(() => video.classList.remove("is-playing"));
    };
    const fallback = () => video.classList.remove("is-playing");
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: .05 });
    observer.observe(video);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    video.addEventListener("error", fallback);
    sync();
    return () => {
      disposed = true;
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      video.removeEventListener("error", fallback);
      video.pause();
    };
  }, []);

  return (
    <div className="hero-sequence" aria-hidden="true">
      <video ref={videoRef} className="hero-video" muted loop playsInline preload="none" tabIndex={-1} />
      <div className="hero-video-shade" />
    </div>
  );
}
