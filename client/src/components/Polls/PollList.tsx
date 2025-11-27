"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Grid } from "@mui/material";
import { Poll } from "@/types/poll";
import { getActivePolls } from "@/services/pollService";
import PollCard from "./PollCard";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import EmptyState from "@/components/shared/states/EmptyState";

interface PollListProps {
  showHeader?: boolean;
}

const PollList: React.FC<PollListProps> = ({ showHeader = true }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const isEventsOffice = user?.role === "administration" && user?.roleType === "eventsOffice";

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const activePolls = await getActivePolls();
        setPolls(activePolls);
      } catch (error) {
        console.error("Failed to fetch polls", error);
        toast.error("Failed to fetch active polls");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (polls.length === 0) {
    return (
      <EmptyState
        title="No Active Polls"
        description={isEventsOffice ? "Create a new poll to get started." : "There are no active polls at the moment."}
      />
    );
  }

  return (
    <Box className={showHeader ? "max-w-4xl mx-auto" : ""}>
      {showHeader && (
        <>
          <Typography variant="h4" className="mb-6 font-bold text-gray-800 text-center">
            {isEventsOffice ? "Active Polls Overview" : "Active Vendor Polls"}
          </Typography>
          <Typography variant="body1" className="mb-8 text-gray-600 text-center">
            {isEventsOffice 
              ? "Monitor the voting progress for active vendor polls." 
              : "Vote for the vendors you want to see at the upcoming events!"}
          </Typography>
        </>
      )}
      
      <Grid container spacing={3}>
        {polls.map((poll) => (
          <Grid item xs={12} md={showHeader ? 6 : 4} key={poll.id}>
            <PollCard poll={poll} readOnly={isEventsOffice} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PollList;
