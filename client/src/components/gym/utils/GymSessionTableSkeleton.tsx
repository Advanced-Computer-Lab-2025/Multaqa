import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Skeleton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface GymSessionsTableSkeletonProps {
  /** The number of skeleton rows to display. */
  rowCount?: number;
}

export function GymSessionsTableSkeleton({
  rowCount = 5,
}: GymSessionsTableSkeletonProps) {
  const theme = useTheme();

  // Define the column widths to align with the actual table content
  const columnWidths = [
    "15%", // Date
    "10%", // Time
    "12%", // Duration
    "15%", // Type
    "20%", // Trainer
    "15%", // Max Participants
    "13%", // Actions
  ];

  const headerCells = [
    "Date",
    "Time",
    "Duration",
    "Type",
    "Trainer",
    "Max Participants",
    "Actions",
  ];

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        border: `1px solid ${theme.palette.primary.light}`,
        minHeight: 300, // Ensure the box is visible even with few rows
      }}
    >
      <Table>
        <TableHead>
          {/* Header Row (Static) */}
          <TableRow
            sx={{
              backgroundColor: theme.palette.primary.light,
              "& .MuiTableCell-head": {
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontWeight: 700,
                color: theme.palette.tertiary.dark,
                fontSize: "14px",
              },
            }}
          >
            {headerCells.map((label, index) => (
              <TableCell key={label} align={index < 1 ? "left" : "center"} sx={{ width: columnWidths[index] }}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Skeleton Rows (Dynamic) */}
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {/* Date */}
              <TableCell align="left">
                <Skeleton variant="text" width="80%" height={20} />
              </TableCell>
              {/* Time */}
              <TableCell align="center">
                <Skeleton variant="text" width="70%" height={20} />
              </TableCell>
              {/* Duration */}
              <TableCell align="center">
                <Skeleton variant="text" width="90%" height={20} />
              </TableCell>
              {/* Type (Chip) */}
              <TableCell align="center">
                <Skeleton
                  variant="rounded"
                  width="70px"
                  height={24}
                  sx={{ margin: "auto" }}
                />
              </TableCell>
              {/* Trainer */}
              <TableCell align="center">
                <Skeleton variant="text" width="60%" height={20} />
              </TableCell>
              {/* Max Participants */}
              <TableCell align="center">
                <Skeleton variant="text" width="30px" height={20} sx={{ margin: "auto" }} />
              </TableCell>
              {/* Actions (Buttons) */}
              <TableCell align="center">
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="circular" width={24} height={24} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}