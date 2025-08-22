import { useEffect, useState } from "react";

// Tailwind 기준: sm(640px), md(768px), lg(1024px)
export type ViewportType = "MOBILE" | "TABLET" | "PC";

function getViewportType(width: number): ViewportType {
  if (width < 640) return "MOBILE";
  if (width < 1024) return "TABLET";
  return "PC";
}

export function useViewportType(): ViewportType {
  const [viewport, setViewport] = useState<ViewportType>(() => {
    if (typeof window === "undefined") return "PC";
    return getViewportType(window.innerWidth);
  });

  useEffect(() => {
    function handleResize() {
      setViewport(getViewportType(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return viewport;
}
