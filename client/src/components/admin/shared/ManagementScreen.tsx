"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import ContentWrapper from "@/components/shared/containers/ContentWrapper";
import { ManagementScreenProps } from "../types";
import { useTheme } from "@mui/material/styles";

export default function ManagementScreen<T>({
  pageTitle,
  pageSubtitle,
  boxTitle,
  boxSubtitle,
  boxIcon,
  borderColor,
  createButtonLabel,
  createButtonIcon,
  onOpenCreate,
  items,
  renderItem,
  noItemsMessage,
  noItemsSubtitle,
  gridColumns = {
    xs: "1fr",
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
  },
}: ManagementScreenProps<T>) {
  const theme = useTheme();
  return (
    <ContentWrapper title={pageTitle} description={pageSubtitle}>
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            border: `2px solid ${borderColor}`,
            borderRadius: "16px",
            padding: "24px",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  backgroundColor: `${borderColor}1a`, // Hex to RGBA
                  color: borderColor,
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {boxIcon}
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    fontWeight: 600,
                    color: borderColor,
                    fontSize: "18px",
                    mb: 0.5,
                  }}
                >
                  {boxTitle}
                </Typography>
                <Typography
                  sx={{
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  {boxSubtitle}
                </Typography>
              </Box>
            </Box>

            {createButtonLabel && onOpenCreate && (
              <CustomButton
                label={createButtonLabel}
                variant="contained"
                width="auto"
                color="primary"
                onClick={onOpenCreate}
                startIcon={createButtonIcon}
                sx={{ borderRadius: "12px", fontWeight: 700 }}
              />
            )}
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: gridColumns,
            }}
          >
            {items.map((item, index) => renderItem(item))}
          </Box>

          {items.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "#757575",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                {noItemsMessage}
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>
                {noItemsSubtitle}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </ContentWrapper>
  );
}
