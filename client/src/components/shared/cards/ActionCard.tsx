"use client";

import React from "react";
import { Box, Stack, Typography, Chip, Collapse } from "@mui/material";
import type { ChipProps, SxProps, Theme } from "@mui/material";

export type ActionCardProps = {
  // Primary heading content (text or node)
  title: React.ReactNode;
  // Optional small element shown to the left of the title (icon/avatar)
  leftIcon?: React.ReactNode;
  // Optional tags rendered next to the title row
  tags?: Array<({ label: React.ReactNode } & Partial<ChipProps>)>;
  // One subtitle/node line below the title row (fully controlled styling)
  subtitleNode?: React.ReactNode;
  // Additional lines below the subtitle (fully controlled styling)
  metaNodes?: React.ReactNode[];
  // Right-aligned slot in the header (e.g., status + actions)
  rightSlot?: React.ReactNode;
  // Optional body content area below the header, above the expandable details
  children?: React.ReactNode;
  // Expandable details area
  expanded?: boolean;
  details?: React.ReactNode;
  // Styling & theming hooks
  sx?: SxProps<Theme>;
  headerSx?: SxProps<Theme>;
  detailsSx?: SxProps<Theme>;
  background?: string;
  borderColor?: string;
  elevation?: "none" | "soft" | "strong";
};

/**
 * ActionCard
 * A flexible, neumorphic-leaning card for listing items with a title, tags, optional metadata, and expandable details.
 *
 * Usage examples:
 * <ActionCard
 *   title="Spring Campus Bazaar"
 *   tags={[{ label: "Bazaar", sx: { bgcolor: "#e5ed6f", color: "#13233d", fontWeight: 600 }, size: "small" }]}
 *   subtitleNode={<Typography variant="body2" sx={{ color: "#6299d0" }}>Main Courtyard</Typography>}
 *   metaNodes={[
 *     <Typography key="range" variant="body2" sx={{ color: "#6b7280" }}>Mar 1 - Mar 2</Typography>,
 *     <Typography key="submitted" variant="caption" sx={{ color: "#6b7280" }}>Submitted: Mar 1, 10:00 AM</Typography>
 *   ]}
 *   rightSlot={<MyActions/>}
 *   expanded={open}
 *   details={<MyDetails/>}
 * />
 */
export default function ActionCard({
  title,
  leftIcon,
  tags,
  subtitleNode,
  metaNodes,
  rightSlot,
  children,
  expanded = false,
  details,
  sx,
  headerSx,
  detailsSx,
  background = "#ffffffaa",
  borderColor,
  elevation = "soft",
}: ActionCardProps) {
  const boxShadow = elevation === "none"
    ? "none"
    : elevation === "strong"
    ? "-8px -8px 16px 0 #FAFBFF, 8px 8px 16px 0 rgba(22, 27, 29, 0.18)"
    : "-5px -5px 10px 0 #FAFBFF, 5px 5px 10px 0 rgba(22, 27, 29, 0.12)";

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        background,
        border: borderColor ? `1px solid ${borderColor}` : "1px solid rgba(0,0,0,0.06)",
        boxShadow,
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, ...headerSx }}>
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flexWrap: "wrap" }}>
            {leftIcon ? <Box sx={{ display: "flex", alignItems: "center" }}>{leftIcon}</Box> : null}
            <Typography sx={{ fontWeight: 700, color: "#1E1E1E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {title}
            </Typography>
            {tags?.map((t, idx) => {
              const { label, size, ...rest } = t as { label: React.ReactNode; size?: ChipProps["size"]; } & Partial<ChipProps>;
              return <Chip key={idx} size={size ?? "small"} label={label} {...rest} />;
            })}
          </Stack>

          {subtitleNode}

          {metaNodes?.map((node, i) => (
            <React.Fragment key={i}>{node}</React.Fragment>
          ))}
        </Stack>
        {rightSlot}
      </Box>

      {children ? <Box sx={{ mt: 1.5 }}>{children}</Box> : null}

      <Collapse in={!!expanded} timeout={250} unmountOnExit appear>
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 1.5,
            background: "rgba(98,153,208,0.06)",
            border: borderColor ? `1px dashed ${borderColor}` : "1px dashed rgba(0,0,0,0.08)",
            ...detailsSx,
          }}
        >
          {details}
        </Box>
      </Collapse>
    </Box>
  );
}
