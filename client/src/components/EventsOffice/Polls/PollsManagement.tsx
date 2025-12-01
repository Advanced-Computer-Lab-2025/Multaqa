"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { Plus } from "lucide-react";
import PollList from "@/components/Polls/PollList";
import CreatePollForm from "./CreatePollForm";
import ContentWrapper from "@/components/shared/containers/ContentWrapper";
import CustomButton from "@/components/shared/Buttons/CustomButton";

const PollsManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleCreateSuccess = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <ContentWrapper
      title="Vendor Polls"
      description="Manage and monitor vendor polls for student engagement."
    >
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <CustomButton
          onClick={() => setIsCreateModalOpen(true)}
          variant="contained"
          label="Create Poll"
          startIcon={<Plus size={20} />}
        />
      </Box>

      <PollList showHeader={false} key={refresh ? "refreshed" : "initial"} />

      <CreatePollForm
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </ContentWrapper>
  );
};

export default PollsManagement;
