"use client";

import React, { useEffect, useState } from "react";
import type { CSSProperties } from "react";

interface ScaledViewportProps {
  children: React.ReactNode;
  scale?: number;
}

const clampScale = (rawScale: number) => {
  if (rawScale < 0.5) return 0.5;
  if (rawScale > 1.1) return 1.1;
  return Number(rawScale.toFixed(3));
};

const ScaledViewport: React.FC<ScaledViewportProps> = ({
  children,
  scale = 0.9,
}) => {
  const normalizedScale = clampScale(scale);
  const inverseFactor = 1 / normalizedScale;
  const [canUseZoom, setCanUseZoom] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof CSS !== "undefined" && CSS.supports?.("zoom", "1")) {
      setCanUseZoom(true);
    }
  }, []);

  const zoomStyle: CSSProperties & { zoom?: number } = {
    zoom: normalizedScale,
    transformOrigin: "top left",
  };

  const transformFallback: CSSProperties = {
    transform: `scale(${normalizedScale})`,
    transformOrigin: "top left",
    width: `${inverseFactor * 100}%`,
    minHeight: `${inverseFactor * 100}vh`,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div style={canUseZoom ? zoomStyle : transformFallback}>
        {children}
      </div>
    </div>
  );
};

export default ScaledViewport;
