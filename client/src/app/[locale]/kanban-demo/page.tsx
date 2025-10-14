"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import KanbanContainer from "@/components/KanbanComponent/KanbanContainer";
import { KanbanItem } from "@/components/KanbanComponent/types";
import { generateMockKanbanData } from "@/components/KanbanComponent/utils";
import NeumorphicBox from "@/components/shared/containers/NeumorphicBox";
import CustomButton from "@/components/shared/Buttons/CustomButton";

/**
 * Kanban Demo Page
 * Showcases the Kanban board component with neumorphic design
 */
export default function KanbanDemoPage() {
  const [items, setItems] = useState<KanbanItem[]>(generateMockKanbanData());

  const handleItemsChange = (newItems: KanbanItem[]) => {
    setItems(newItems);
  };

  const handleRoleChange = (id: string, newRole: string) => {
    console.log(`Role changed for item ${id}: ${newRole}`);
  };

  const handleResetData = () => {
    setItems(generateMockKanbanData());
  };

  const handleAddNewApplicant = () => {
    const newItem: KanbanItem = {
      id: `${Date.now()}`,
      name: `New Applicant ${items.length + 1}`,
      email: `applicant${items.length + 1}@example.com`,
      registrationDate: new Date().toLocaleDateString("en-GB"),
      role: "N/A",
      status: "pending",
    };
    setItems([...items, newItem]);
  };

  // Calculate statistics
  const stats = {
    total: items.length,
    pending: items.filter((item) => item.status === "pending").length,
    accepted: items.filter((item) => item.status === "accepted").length,
    rejected: items.filter((item) => item.status === "rejected").length,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#e5e7eb",
        paddingTop: "32px",
        paddingBottom: "32px",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          maxWidth: "1600px",
          margin: "0 auto",
          paddingX: {
            xs: "16px",
            sm: "48px",
            md: "64px",
            lg: "80px",
            xl: "120px",
          },
          marginBottom: "32px",
        }}
      >
        <NeumorphicBox
          containerType="outwards"
          sx={{
            padding: "24px",
            borderRadius: "16px",
            backgroundColor: "#e5e7eb",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: "16px",
            }}
          >
            {/* Title and Description */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: { xs: "24px", md: "32px" },
                  color: "#1E1E1E",
                  marginBottom: "8px",
                }}
              >
                Applicant Management Board
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "var(--font-poppins), system-ui, sans-serif",
                  fontSize: "14px",
                  color: "#6B7280",
                }}
              >
                Drag and drop applicants between columns to manage their status
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <CustomButton
                variant="contained"
                size="medium"
                onClick={handleAddNewApplicant}
                sx={{
                  fontFamily: "var(--font-poppins), system-ui, sans-serif",
                }}
              >
                Add Applicant
              </CustomButton>
              <CustomButton
                variant="outlined"
                size="medium"
                onClick={handleResetData}
                sx={{
                  fontFamily: "var(--font-poppins), system-ui, sans-serif",
                }}
              >
                Reset Data
              </CustomButton>
            </Box>
          </Box>

          {/* Statistics */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(4, 1fr)",
              },
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {[
              { label: "Total", value: stats.total, color: "#7851da" },
              { label: "Pending", value: stats.pending, color: "#FF9B85" },
              { label: "Accepted", value: stats.accepted, color: "#FFD966" },
              { label: "Rejected", value: stats.rejected, color: "#B0B0B0" },
            ].map((stat) => (
              <NeumorphicBox
                key={stat.label}
                containerType="inwards"
                sx={{
                  padding: "16px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "var(--font-poppins), system-ui, sans-serif",
                    fontSize: "12px",
                    color: "#6B7280",
                    marginBottom: "4px",
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "24px",
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </Typography>
              </NeumorphicBox>
            ))}
          </Box>
        </NeumorphicBox>
      </Box>

      {/* Kanban Board */}
      <KanbanContainer
        items={items}
        onItemsChange={handleItemsChange}
        onRoleChange={handleRoleChange}
      />
    </Box>
  );
}
