"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import { Poll } from "@/types/poll";
import { getActivePolls } from "@/services/pollService";
import PollCard from "./PollCard";
import { useAuth } from "@/context/AuthContext";
import EmptyState from "@/components/shared/states/EmptyState";
import ContentWrapper from "@/components/shared/containers/ContentWrapper";

interface PollListProps {
  showHeader?: boolean;
}

const PollList: React.FC<PollListProps> = ({ showHeader = true }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const isEventsOffice =
    user?.role === "administration" &&
    (user as { roleType?: string })?.roleType === "eventsOffice";

  useEffect(() => {
    let isMounted = true;

    const fetchPolls = async () => {
      setLoading(true);
      setError(null);

      try {
        const activePolls = await getActivePolls();
        if (!isMounted) {
          return;
        }

        if (Array.isArray(activePolls)) {
          setPolls(activePolls);
        } else {
          setPolls([]);
        }
      } catch (fetchError) {
        console.error("Failed to fetch polls", fetchError);
        if (!isMounted) {
          return;
        }
        setError("Unable to load polls. Please try again later.");
        setPolls([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPolls();

    return () => {
      isMounted = false;
    };
  }, []);

  const pollsGrid =
    polls.length === 0 ? (
      <EmptyState
        title="No Active Polls"
        description={
          isEventsOffice
            ? "Create a new poll to get started."
            : "There are no active polls at the moment."
        }
      />
    ) : (
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "repeat(auto-fill, minmax(240px, 1fr))",
            sm: "repeat(auto-fill, minmax(260px, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
          },
          alignItems: "stretch",
        }}
      >
        {polls.map((poll) => (
          <Box key={poll.id} sx={{ display: "flex" }}>
            <PollCard poll={poll} readOnly={isEventsOffice} />
          </Box>
        ))}
      </Box>
    );

  const body = (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {isEventsOffice && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Events Office users can monitor poll progress but cannot cast votes.
        </Alert>
      )}
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {pollsGrid}
    </Box>
  );

  if (showHeader) {
    return (
      <ContentWrapper
        title={isEventsOffice ? "Active Polls Overview" : "Active Vendor Polls"}
        description={
          isEventsOffice
            ? "Monitor the voting progress for active vendor polls."
            : "Vote for the vendors you want to see at the upcoming events!"
        }
      >
        {body}
      </ContentWrapper>
    );
  }

  return body;
};

export default PollList;
