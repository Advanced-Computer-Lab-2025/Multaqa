"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import { VendorParticipationItem, VendorRequestItem } from "./types";
import ActionCard from "@/components/shared/cards/ActionCard";

type Props = {
  item: VendorParticipationItem | VendorRequestItem;
  rightSlot?: React.ReactNode;
  expanded?: boolean;
  details?: React.ReactNode;
};

const typeColor: Record<string, { bg: string; fg: string }> = {
  BAZAAR: { bg: "#e5ed6f", fg: "#13233d" },
  PLATFORM_BOOTH: { bg: "#b2cee2", fg: "#1E1E1E" },
};

export default function VendorItemCard({ item, rightSlot, expanded = false, details }: Props) {
  const [expandedd, setExpanded] = useState(expanded);
  const t = item.type;
  const color = typeColor[t] ?? { bg: "#b2cee2", fg: "#1E1E1E" };

  const dateRange = item.endDate
    ? `${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}`
    : new Date(item.startDate).toLocaleString();

  return (
    <ActionCard
      title={item.title}
      type="vendor"
      tags={[{ label: t === "BAZAAR" ? "Bazaar" : "Platform Booth", sx: { bgcolor: color.bg, color: color.fg, fontWeight: 600 } }]}
      subtitleNode={<Typography variant="body2" sx={{ color: "#575d69" }}>{item.location}</Typography>}
      metaNodes={[
        <Typography key="range" variant="body2" sx={{ color: "#6b7280" }}>{dateRange}</Typography>,
        "status" in item ? (
          <Typography key="submitted" variant="caption" sx={{ color: "#6b7280" }}>
            Submitted: {new Date((item as VendorRequestItem).submittedAt).toLocaleString()}
          </Typography>
        ) : null,
      ].filter(Boolean) as React.ReactNode[]}
      rightSlot={rightSlot}
      expanded={expandedd}
      onExpandChange={setExpanded}
      details={details}
      borderColor={color.bg}
    />
  );
}
