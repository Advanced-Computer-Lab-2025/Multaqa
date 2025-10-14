"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Typography, Badge } from "@mui/material";
import NeumorphicBox from "../shared/containers/NeumorphicBox";
import SortableRegistree from "./SortableRegistree";
import { KanbanColumnProps } from "./types";

/**
 * KanbanColumn component - Represents a single column in the Kanban board
 * Styled with neumorphic design matching the screenshot
 */
const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  items,
  count,
  color,
  onRoleChange,
}) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <NeumorphicBox
      containerType="inwards"
      sx={{
        backgroundColor: color.background,
        borderRadius: "24px",
        padding: "20px",
        height: "fit-content",
        minHeight: "500px",
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: `2px solid ${color.border}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Status Indicator Dot */}
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: color.badge,
              boxShadow: `0 0 8px ${color.badge}`,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: color.text,
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Count Badge */}
        <Badge
          badgeContent={count}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: color.badge,
              color: "#ffffff",
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              height: "28px",
              minWidth: "28px",
              borderRadius: "14px",
              padding: "0 8px",
              boxShadow: `
                -3px -3px 6px 0 rgba(255, 255, 255, 0.8),
                3px 3px 6px 0 rgba(0, 0, 0, 0.15)
              `,
            },
          }}
        />
      </Box>

      {/* Column Content - Droppable Area */}
      <Box
        ref={setNodeRef}
        sx={{
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.length > 0 ? (
            items.map((item) => (
              <SortableRegistree
                key={item.id}
                item={item}
                onRoleChange={(newRole) => {
                  if (onRoleChange) {
                    onRoleChange(item.id, newRole);
                  }
                }}
              />
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                color: "#9CA3AF",
                fontFamily: "var(--font-poppins), system-ui, sans-serif",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                No items yet
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  textAlign: "center",
                  marginTop: "8px",
                }}
              >
                Drag items here
              </Typography>
            </Box>
          )}
        </SortableContext>
      </Box>
    </NeumorphicBox>
  );
};

export default KanbanColumn;