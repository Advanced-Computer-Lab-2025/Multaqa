"use client";

import React, { useState } from "react";
import RegisterBox from "@/components/admin/shared/RegistredComponent/Registree";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import NeumorphicBox from "@/components/shared/containers/NeumorphicBox";
import { Box, Typography } from "@mui/material";
import { DndContext, DragOverlay, useDroppable } from "@dnd-kit/core";
import { SortableTicket } from "@/components/admin/shared/RegistredComponent/SortableTicket";
import { Applicant } from "./types";
import { handleDragStart, handleDragEnd, assignToRole } from "./utils";

// Droppable zone component
function DroppableZone({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
}

const initialApplicants: Applicant[] = [
  {
    id: "58-5727",
    name: "Angelina J",
    email: "angelina@gmail.com",
    registrationDate: "25/08/2025",
  },
  {
    id: "58-5728",
    name: "Vini JR",
    email: "vinijr@gmail.com",
    registrationDate: "26/08/2025",
  },
  {
    id: "58-5729",
    name: "Sam Carter",
    email: "sam.carter@example.com",
    registrationDate: "27/08/2025",
  },
];

export default function RoleAssignmentContent() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);

  const roleKeys = ["staff", "ta", "professor"] as const;
  const roleLabels: Record<(typeof roleKeys)[number], string> = {
    staff: "Staff",
    ta: "TA",
    professor: "Professor",
  };

  const [assigned, setAssigned] = useState<Record<string, Applicant[]>>({
    staff: [],
    ta: [],
    professor: [],
  });

  const [activeRoleIndex, setActiveRoleIndex] = useState<number>(0);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeDraggedUser =
    applicants.find((a) => a.id === activeId) ||
    Object.values(assigned)
      .flat()
      .find((u) => u.id === activeId);

  return (
    <DndContext
      onDragStart={(e) => handleDragStart(e, setActiveId)}
      onDragEnd={(e) =>
        handleDragEnd(
          e,
          setActiveId,
          applicants,
          roleKeys,
          setAssigned,
          setApplicants
        )
      }
    >
      <Box
        sx={{
          p: 4,
          backgroundColor: "transparent",
          minHeight: "100vh",
          fontFamily: "var(--font-poppins), system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 700,
              color: "#1E1E1E",
              mb: 1,
            }}
          >
            Assign Roles
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#757575",
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
            }}
          >
            Drag tickets to assign roles or expand and select from dropdown
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
          }}
        >
          {/* Left column - Pending Applicants */}
          <Box
            sx={{
              border: "2px solid #3a4f99",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontWeight: 600,
                  color: "#3a4f99",
                  fontSize: "18px",
                }}
              >
                Pending Applicants
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#3a4f99",
                  color: "white",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "14px",
                  fontFamily: "var(--font-poppins), system-ui, sans-serif",
                }}
              >
                {applicants.length}
              </Box>
            </Box>

            {/* Inner container with background */}
            <Box
              sx={{
                backgroundColor: "rgba(98, 153, 208, 0.05)",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minHeight:
                  applicants.length > 0
                    ? `${applicants.length * 150}px`
                    : "100px",
              }}
            >
              {applicants.length === 0 && (
                <Typography
                  sx={{
                    color: "#757575",
                    fontSize: "14px",
                    textAlign: "center",
                    py: 4,
                  }}
                >
                  No pending applicants
                </Typography>
              )}

              {applicants.map((applicant) => (
                <Box
                  key={applicant.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: "280px" }}>
                    <SortableTicket id={applicant.id}>
                      <RegisterBox
                        name={applicant.name}
                        id={applicant.id}
                        email={applicant.email}
                        registrationDate={applicant.registrationDate}
                        role="N/A"
                        onRoleChange={(newRole: string) => {
                          if (newRole !== "N/A") {
                            assignToRole(
                              newRole.toLowerCase(),
                              applicant,
                              setAssigned,
                              setApplicants
                            );
                          }
                        }}
                      />
                    </SortableTicket>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right column - Assigned Roles */}
          <Box
            sx={{
              border: "2px solid #3a4f99",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            {/* Role Tabs */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontWeight: 600,
                  color: "#3a4f99",
                  fontSize: "18px",
                }}
              >
                Assigned Users
              </Typography>

              <NeumorphicBox
                containerType="inwards"
                sx={{
                  width: "auto",
                  padding: "8px",
                  borderRadius: "9999px",
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                {roleKeys.map((roleKey, idx) => (
                  <CustomButton
                    key={roleKey}
                    label={roleLabels[roleKey]}
                    size="small"
                    variant={activeRoleIndex === idx ? "contained" : "outlined"}
                    color={activeRoleIndex === idx ? "tertiary" : "primary"}
                    onClick={() => setActiveRoleIndex(idx)}
                    width="90px"
                    height="36px"
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  />
                ))}
              </NeumorphicBox>
            </Box>

            {/* Role Content */}
            {roleKeys.map((roleKey, idx) => (
              <Box
                key={roleKey}
                sx={{ display: activeRoleIndex === idx ? "block" : "none" }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6299d0",
                    fontWeight: 600,
                    mb: 2,
                    fontSize: "14px",
                  }}
                >
                  {roleLabels[roleKey]} ({(assigned[roleKey] || []).length}
                  users)
                </Typography>

                {/* Droppable zone for this role */}
                <DroppableZone id={roleKey}>
                  {/* Inner container with background */}
                  <Box
                    sx={{
                      backgroundColor: "rgba(98, 153, 208, 0.05)",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      minHeight:
                        (assigned[roleKey] || []).length > 0
                          ? `${(assigned[roleKey] || []).length * 200}px`
                          : "100px",
                    }}
                  >
                    {(assigned[roleKey] || []).length === 0 && (
                      <Typography
                        sx={{
                          color: "#757575",
                          fontSize: "14px",
                          textAlign: "center",
                          py: 4,
                        }}
                      >
                        No users assigned to {roleLabels[roleKey]}
                      </Typography>
                    )}

                    {(assigned[roleKey] || []).map((user) => (
                      <Box
                        key={user.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: { xs: "wrap", sm: "nowrap" },
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: "280px" }}>
                          <RegisterBox
                            name={user.name}
                            id={user.id}
                            email={user.email}
                            registrationDate={user.registrationDate}
                            role={roleLabels[roleKey]}
                            disabled={true}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </DroppableZone>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <DragOverlay>
        {activeId && activeDraggedUser ? (
          <RegisterBox
            name={activeDraggedUser.name}
            id={activeDraggedUser.id}
            email={activeDraggedUser.email}
            registrationDate={activeDraggedUser.registrationDate}
            role="N/A"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
