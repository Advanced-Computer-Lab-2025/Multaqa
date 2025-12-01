"use client";

import React, { useState, useEffect, useRef } from "react";
import RegisterBox from "@/components/admin/shared/RegistredComponent/Registree";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import NeumorphicBox from "@/components/shared/containers/NeumorphicBox";
import ContentWrapper from "@/components/shared/containers/ContentWrapper";
import { Box, Typography, useTheme } from "@mui/material";
import { DndContext, DragOverlay, useDroppable } from "@dnd-kit/core";
import { SortableTicket } from "@/components/admin/shared/RegistredComponent/SortableTicket";
import { Applicant } from "./types";
import {
  handleDragStart,
  assignToRole,
  handleAssignRole,
  fetchUnassignedStaff,
  fetchAllTAs,
  fetchAllProfessors,
  fetchAllStaff,
} from "./utils";
import CustomModal from "@/components/shared/modals/CustomModal";
import type { DragEndEvent } from "@dnd-kit/core";
import { capitalizeFullName } from "@/components/shared/utils/nameUtils";
import { toast } from "react-toastify";

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

export default function RoleAssignmentContent() {
  const theme = useTheme();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const roleKeys = ["staff", "ta", "professor"] as const;
  const roleLabels: Record<(typeof roleKeys)[number], string> = {
    staff: "Staff",
    ta: "TA",
    professor: "Professor",
  };

  // Backend expects lowercase for staff and professor, uppercase for TA
  const roleBackendValues: Record<(typeof roleKeys)[number], string> = {
    staff: "staff",
    ta: "TA",
    professor: "professor",
  };

  const [assigned, setAssigned] = useState<Record<string, Applicant[]>>({
    staff: [],
    ta: [],
    professor: [],
  });

  const [activeRoleIndex, setActiveRoleIndex] = useState<number>(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [assignedBoxHeight, setAssignedBoxHeight] = useState<number>(100);
  const assignedBoxRef = useRef<HTMLDivElement>(null);

  // Modal state for confirmation
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState<{
    role: string;
    applicant: Applicant;
  } | null>(null);

  // Track assigned box height changes dynamically
  useEffect(() => {
    if (!assignedBoxRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setAssignedBoxHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(assignedBoxRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeRoleIndex, assigned]);

  // Fetch unassigned staff members and assigned roles on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch unassigned staff for pending section
        const unassignedStaff = await fetchUnassignedStaff();
        setApplicants(unassignedStaff);

        // Fetch already assigned staff for each role
        const [assignedStaff, assignedTAs, assignedProfessors] = await Promise.all([
          fetchAllStaff(),
          fetchAllTAs(),
          fetchAllProfessors(),
        ]);

        // Set the assigned users for each role
        setAssigned({
          staff: assignedStaff,
          ta: assignedTAs,
          professor: assignedProfessors,
        });

      } catch (error) {
        console.error("Failed to load data:", error);
        // You might want to show an error toast/notification here
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const activeDraggedUser =
    applicants.find((a) => a.id === activeId) ||
    Object.values(assigned)
      .flat()
      .find((u) => u.id === activeId);

  // Handler to confirm the assignment
  const handleConfirmAssignment = async () => {
    if (!pendingAssignment) return;

    try {
      console.log("Confirming assignment:", pendingAssignment);
      // Call the API to assign the role
      await handleAssignRole(
        pendingAssignment.applicant.id,
        roleBackendValues[pendingAssignment.role as keyof typeof roleBackendValues],
        pendingAssignment.applicant,
        setAssigned,
        setApplicants
      );

      // Assignment successful, close modal
      setModalOpen(false);
      setPendingAssignment(null);
    } catch (err: any) {
      const errorMessage =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err.message||
          "Failed to assign role";
    
        toast.error(errorMessage, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      // The revert has already been handled in handleAssignRole
      setModalOpen(false);
      setPendingAssignment(null);
      // You might want to show an error toast/notification here
    }
  };

  // Handler to cancel the assignment - revert the optimistic update
  const handleCancelAssignment = () => {
    if (pendingAssignment) {
      // Move the applicant back to pending
      setAssigned((prev) => ({
        ...prev,
        [pendingAssignment.role]: prev[pendingAssignment.role].filter(
          (a) => a.id !== pendingAssignment.applicant.id
        ),
      }));
      setApplicants((prev) => [...prev, pendingAssignment.applicant]);
    }
    setModalOpen(false);
    setPendingAssignment(null);
  };

  // Custom drag end handler that triggers confirmation
  const handleDragEndWithConfirmation = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);

    if (!over) return;

    const draggedId = String(active.id);
    const targetRole = String(over.id);

    // Check if the target is a valid role
    if (!roleKeys.includes(targetRole as (typeof roleKeys)[number])) return;

    // Find the applicant being dragged
    const applicant = applicants.find((a) => a.id === draggedId);

    if (applicant) {
      // Optimistically assign the role first (move visually)
      assignToRole(targetRole, applicant, setAssigned, setApplicants);

      // Switch to the correct tab to show where it was assigned
      const roleIndex = roleKeys.indexOf(
        targetRole as (typeof roleKeys)[number]
      );
      if (roleIndex !== -1) {
        setActiveRoleIndex(roleIndex);
      }

      // Then show confirmation modal
      setPendingAssignment({ role: targetRole, applicant });
      setModalOpen(true);
    }
  };

  // Calculate pending box height based on measured assigned box height
  const pendingBoxHeight = assignedBoxHeight > 100 ? `${assignedBoxHeight + 50}px` : "150px";

  return (
    <DndContext
      onDragStart={(e) => handleDragStart(e, setActiveId)}
      onDragEnd={handleDragEndWithConfirmation}
    >
      <ContentWrapper
        title="Assign Roles"
        description="Drag tickets to assign roles or expand and select from dropdown"
      >
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
              display: "flex",
              flexDirection: "column",
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
                  color: theme.palette.tertiary.main,
                  fontSize: "18px",
                }}
              >
                Pending Applicants
              </Typography>
              <Box
                sx={{
                  backgroundColor: theme.palette.tertiary.main,
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
                flex: 1,
                minHeight: pendingBoxHeight,
                justifyContent: applicants.length === 0 && !loading ? "center" : "flex-start",
                alignItems: applicants.length === 0 && !loading ? "center" : "stretch",
              }}
            >
              {loading && (
                <Typography
                  sx={{
                    color: "#757575",
                    fontSize: "14px",
                    textAlign: "center",
                    py: 4,
                  }}
                >
                  Loading unassigned staff...
                </Typography>
              )}

              {!loading && applicants.length === 0 && (
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
                        id={applicant.gucId}
                        email={applicant.email}
                        registrationDate={applicant.registrationDate}
                        role="N/A"
                        onRoleChange={(newRole: string) => {
                          if (newRole !== "N/A") {
                            const role = newRole.toLowerCase();
                            // Optimistically assign the role first (move visually)
                            assignToRole(
                              role,
                              applicant,
                              setAssigned,
                              setApplicants
                            );

                            // Switch to the correct tab to show where it was assigned
                            const roleIndex = roleKeys.indexOf(
                              role as (typeof roleKeys)[number]
                            );
                            if (roleIndex !== -1) {
                              setActiveRoleIndex(roleIndex);
                            }

                            // Then show confirmation modal
                            setPendingAssignment({ role, applicant });
                            setModalOpen(true);
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
            <Box className="w-full flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center mb-3 gap-2">
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontWeight: 600,
                  color: theme.palette.tertiary.main,
                  fontSize: "18px",
                  whiteSpace: "nowrap",
                }}
              >
                Assigned Users
              </Typography>

              <NeumorphicBox
                containerType="inwards"
                className="w-full 2xl:w-fit"
                sx={{
                  padding: "8px",
                  borderRadius: "9999px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  maxWidth: { xs: "100%", xl: "400px" },
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
                    height="36px"
                    className="w-1/3 2xl:w-auto"
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
                  {roleLabels[roleKey]} ({(assigned[roleKey] || []).length}{" "}
                  {(assigned[roleKey] || []).length === 1 ? "user" : "users"})
                </Typography>

                {/* Droppable zone for this role */}
                <DroppableZone id={roleKey}>
                  {/* Inner container with background */}
                  <Box
                    ref={assignedBoxRef}
                    sx={{
                      backgroundColor: "rgba(98, 153, 208, 0.05)",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      minHeight: "100px",
                      justifyContent: (assigned[roleKey] || []).length === 0 ? "center" : "flex-start",
                      alignItems: (assigned[roleKey] || []).length === 0 ? "center" : "stretch",
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
                            id={user.gucId}
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
      </ContentWrapper>
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

      {/* Confirmation Modal */}
      <CustomModal
        title="Confirm Role Assignment"
        modalType="warning"
        open={modalOpen}
        onClose={handleCancelAssignment}
        buttonOption1={{
          label: "Confirm",
          variant: "contained",
          color: "warning",
          onClick: handleConfirmAssignment,
        }}
        buttonOption2={{
          label: "Cancel",
          variant: "outlined",
          color: "warning",
          onClick: handleCancelAssignment,
        }}
      >
        <Typography
          sx={{
            mt: 2,
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          Are you sure you want to assign{" "}
          <strong>{capitalizeFullName(pendingAssignment?.applicant.name)}</strong> to the role of{" "}
          <strong>
            {pendingAssignment?.role &&
              roleLabels[pendingAssignment.role as keyof typeof roleLabels]}
          </strong>
          ?
          <br />
          <br />
          This action is <strong>irreversible</strong>.
        </Typography>
      </CustomModal>
    </DndContext>
  );
}
