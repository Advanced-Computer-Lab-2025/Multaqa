"use client";

import { useMemo } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import VectorFloating from "@/components/shared/VectorFloating";

export default function LoadingBlocks() {
  const theme = useTheme();

  const blocks = [
    theme.palette.primary.main,
    theme.palette.primary.dark,
    theme.palette.tertiary.main,
    theme.palette.secondary.main,
    theme.palette.tertiary.dark,
  ];

  const blockWidth = 50;
  const gap = 12; // 1.5 * 8 = 12px gap
  const onePosition = blockWidth + gap; // One block + gap distance
  const jumpHeight = 80;
  const blockCount = blocks.length;
  const segment = blockCount > 0 ? 100 / blockCount : 100;
  const animationDuration = 5;

  // Precompute queue positions so each block stays in sync while cycling.
  const boundaryPositions = useMemo(() => {
    const positions = Array.from({ length: blockCount }, () => [] as number[]);

    if (blockCount === 0) {
      return positions;
    }

    let current = Array.from({ length: blockCount }, (_, idx) => idx);

    for (let step = 0; step <= blockCount; step += 1) {
      current.forEach((pos, idx) => {
        positions[idx][step] = pos;
      });

      if (step === blockCount) {
        break;
      }

      const jumper = step % blockCount;

      current = current.map((pos, idx) =>
        idx === jumper ? blockCount - 1 : pos - 1
      );
    }

    return positions;
  }, [blockCount]);

  const keyframesPerBlock = useMemo(
    () =>
      boundaryPositions.map((positionsForBlock, blockIndex) => {
        const frames = new Map<number, { transform: string }>();

        const toTransform = (slot: number, vertical: number) => ({
          transform: `translateX(${(slot - blockIndex) * onePosition}px) translateY(${vertical}px)`,
        });

        const formatPercent = (value: number) =>
          Number.isInteger(value)
            ? `${value}`
            : value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");

        positionsForBlock.forEach((slot, step) => {
          const percentage = Number((step * segment).toFixed(3));
          frames.set(percentage, toTransform(slot, 0));
        });

        if (blockCount > 1) {
          const segmentStart = blockIndex * segment;
          const jumpUpPercent = Number(
            (segmentStart + segment * 0.2).toFixed(3)
          );
          const jumpAcrossPercent = Number(
            (segmentStart + segment * 0.6).toFixed(3)
          );
          const startSlot = positionsForBlock[blockIndex] ?? 0;
          const endSlot = positionsForBlock[blockIndex + 1] ?? startSlot;

          frames.set(jumpUpPercent, toTransform(startSlot, -jumpHeight));
          frames.set(jumpAcrossPercent, toTransform(endSlot, -jumpHeight));
        }

        return Array.from(frames.entries())
          .sort((a, b) => a[0] - b[0])
          .reduce<Record<string, { transform: string }>>((acc, [percent, value]) => {
            acc[`${formatPercent(percent)}%`] = value;
            return acc;
          }, {});
      }),
    [boundaryPositions, blockCount, onePosition, segment, jumpHeight]
  );

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: 0.22,
          pointerEvents: "none",
        }}
      >
        <VectorFloating />
      </Box>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: 120,
          width: blockWidth * blockCount + gap * (blockCount - 1),
          zIndex: 1,
        }}
      >
        {blocks.map((color, index) => {
          const animationName = `blockQueue-${index}`;
          const animationKeyframes =
            keyframesPerBlock[index] ?? {
              "0%": { transform: "translateX(0px) translateY(0px)" },
              "100%": { transform: "translateX(0px) translateY(0px)" },
            };

          return (
          <Box
            key={animationName}
            sx={{
              width: blockWidth,
              height: blockWidth,
              backgroundColor: color,
              borderRadius: 2,
              position: "absolute",
              left: index * onePosition,
              willChange: "transform",
              animation: `${animationName} ${animationDuration}s linear infinite`,
              animationFillMode: "both",
              [`@keyframes ${animationName}`]: animationKeyframes,
            }}
          />
          );
        })}
      </Box>
    </Box>
  );
}
