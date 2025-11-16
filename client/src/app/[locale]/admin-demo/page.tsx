"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import ManageEventOfficeAccountContent from "@/components/admin/ManageEventOfficeAccountContent";
import RoleAssignmentContent from "@/components/admin/RoleAssignmentContent";
import SidebarNavigation from "@/components/layout/SidebarNavigation";

/**
 * Admin Demo Page
 * Showcases the Event Office Accounts management component and Role Assignment
 */
export default function AdminDemoPage() {
  const [activeSection, setActiveSection] = useState("event-office-accounts");

  const sectionItems = [
    { id: "role-assignment", label: "Role Assignment" },
    { id: "event-office-accounts", label: "Event Office Accounts" },
  ];

  const handleSectionClick = (id: string) => {
    setActiveSection(id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#e6e6da",
      }}
    >
      {/* Sidebar */}
      <SidebarNavigation
        activeItem={activeSection}
        onItemClick={handleSectionClick}
        sectionItems={sectionItems}
      />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          paddingTop: "32px",
          paddingBottom: "32px",
        }}
      >
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
          }}
        >
          {activeSection === "role-assignment" && <RoleAssignmentContent />}
          {activeSection === "event-office-accounts" && (
            <ManageEventOfficeAccountContent />
          )}
        </Box>
      </Box>
    </Box>
  );
}
