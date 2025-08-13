"use client";

import { useEffect } from "react";

export default function FaviconSwitcher() {
  useEffect(() => {
    const ensureLink = () => {
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      return link;
    };

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const getFrames = () =>
      mql.matches
        ? ["/favicon-dark-1.svg", "/favicon-dark-2.svg"]
        : ["/favicon-light-1.svg", "/favicon-light-2.svg"];

    const link = ensureLink();
    let frames = getFrames();
    let i = 0;
    link.href = frames[i];

    const interval = setInterval(() => {
      i = (i + 1) % frames.length;
      link.href = frames[i];
    }, 500);

    const handleChange = () => {
      frames = getFrames();
      i = 0;
      link.href = frames[i];
    };
    mql.addEventListener("change", handleChange);

    return () => {
      clearInterval(interval);
      mql.removeEventListener("change", handleChange);
    };
  }, []);

  return null;
}
