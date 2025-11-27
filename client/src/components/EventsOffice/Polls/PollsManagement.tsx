"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { Plus, ArrowLeft } from "lucide-react";
import PollList from "@/components/Polls/PollList";
import CreatePollForm from "./CreatePollForm";
import ContentWrapper from "@/components/shared/containers/ContentWrapper";
import CustomButton from "@/components/shared/Buttons/CustomButton";

const PollsManagement = () => {
  const [view, setView] = useState<"list" | "create">("list");

  return (
    <ContentWrapper
      title={view === "list" ? "Vendor Polls" : "Create New Poll"}
      description={
        view === "list"
          ? "Manage and monitor vendor polls for student engagement."
          : "Set up a new poll for students to vote on their favorite vendors."
      }
    >
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        {view === "list" ? (
          <CustomButton
            onClick={() => setView("create")}
            variant="contained"
            label="Create Poll"
            startIcon={<Plus size={20} />}
          />
        ) : (
          <CustomButton
            onClick={() => setView("list")}
            variant="outlined"
            label="Back to Polls"
            startIcon={<ArrowLeft size={20} />}
          />
        )}
      </Box>

      {view === "list" ? (
        <PollList showHeader={false} />
      ) : (
        <CreatePollForm onSuccess={() => setView("list")} />
      )}
    </ContentWrapper>
  );
};

export default PollsManagement;
