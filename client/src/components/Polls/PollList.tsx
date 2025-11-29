"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import { Poll } from "@/types/poll";
import { getAllPolls } from "@/services/pollService";
import PollCard from "./PollCard";
import { useAuth } from "@/context/AuthContext";
import EmptyState from "@/components/shared/states/EmptyState";
import ContentWrapper from "@/components/shared/containers/ContentWrapper";

type FilterType = "all" | "running" | "ended";

interface PollListProps {
  showHeader?: boolean;
}

const PollList: React.FC<PollListProps> = ({ showHeader = true }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
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
        const allPolls = await getAllPolls();
        if (!isMounted) {
          return;
        }

        if (Array.isArray(allPolls)) {
          setPolls(allPolls);
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

  // Filter polls based on selection
  const filteredPolls = polls.filter((poll) => {
    const isExpired = new Date() > new Date(poll.endDate);
    if (filter === "running") return !isExpired;
    if (filter === "ended") return isExpired;
    return true;
  });

  // Count polls for each filter
  const runningCount = polls.filter((poll) => new Date() <= new Date(poll.endDate)).length;
  const endedCount = polls.filter((poll) => new Date() > new Date(poll.endDate)).length;

  // Define colors for filter chips
  const filterColors = {
    all: "#6299d0",     // Primary blue
    running: "#4caf50", // Green for active
    ended: "#f57c00",   // Orange for ended (warm, readable, indicates completion)
  };

  const filterChips = (
    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
      <Chip
        label={`All (${polls.length})`}
        onClick={() => setFilter("all")}
        variant="outlined"
        sx={{
          fontFamily: "var(--font-poppins)",
          fontWeight: filter === "all" ? 600 : 500,
          borderRadius: "28px",
          px: 1.75,
          height: 32,
          borderWidth: filter === "all" ? 2 : 1,
          borderColor: filterColors.all,
          color: filterColors.all,
          backgroundColor: alpha(filterColors.all, filter === "all" ? 0.12 : 0.08),
          boxShadow: filter === "all"
            ? `0 6px 16px ${alpha(filterColors.all, 0.28)}`
            : `0 1px 3px ${alpha(filterColors.all, 0.18)}`,
          transition: "background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.25s ease",
          "&:hover": { borderWidth: 2 },
        }}
      />
      <Chip
        label={`Running (${runningCount})`}
        onClick={() => setFilter("running")}
        variant="outlined"
        sx={{
          fontFamily: "var(--font-poppins)",
          fontWeight: filter === "running" ? 600 : 500,
          borderRadius: "28px",
          px: 1.75,
          height: 32,
          borderWidth: filter === "running" ? 2 : 1,
          borderColor: filterColors.running,
          color: filterColors.running,
          backgroundColor: alpha(filterColors.running, filter === "running" ? 0.12 : 0.08),
          boxShadow: filter === "running"
            ? `0 6px 16px ${alpha(filterColors.running, 0.28)}`
            : `0 1px 3px ${alpha(filterColors.running, 0.18)}`,
          transition: "background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.25s ease",
          "&:hover": { borderWidth: 2 },
        }}
      />
      <Chip
        label={`Ended (${endedCount})`}
        onClick={() => setFilter("ended")}
        variant="outlined"
        sx={{
          fontFamily: "var(--font-poppins)",
          fontWeight: filter === "ended" ? 600 : 500,
          borderRadius: "28px",
          px: 1.75,
          height: 32,
          borderWidth: filter === "ended" ? 2 : 1,
          borderColor: filterColors.ended,
          color: filterColors.ended,
          backgroundColor: alpha(filterColors.ended, filter === "ended" ? 0.12 : 0.08),
          boxShadow: filter === "ended"
            ? `0 6px 16px ${alpha(filterColors.ended, 0.28)}`
            : `0 1px 3px ${alpha(filterColors.ended, 0.18)}`,
          transition: "background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.25s ease",
          "&:hover": { borderWidth: 2 },
        }}
      />
    </Stack>
  );

  const getEmptyMessage = () => {
    if (filter === "running") {
      return {
        title: "No Running Polls",
        description: isEventsOffice
          ? "There are no active polls at the moment. Create a new poll to get started."
          : "There are no active polls at the moment. Check back later!",
      };
    }
    if (filter === "ended") {
      return {
        title: "No Ended Polls",
        description: "There are no concluded polls yet.",
      };
    }
    return {
      title: "No Polls",
      description: isEventsOffice
        ? "Create a new poll to get started."
        : "There are no polls at the moment.",
    };
  };

  const pollsGrid =
    filteredPolls.length === 0 ? (
      <EmptyState
        title={getEmptyMessage().title}
        description={getEmptyMessage().description}
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
        {filteredPolls.map((poll) => (
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
      {!loading && filterChips}
      {pollsGrid}
    </Box>
  );

  if (showHeader) {
    return (
      <ContentWrapper
        title={isEventsOffice ? "Polls Overview" : "Vendor Polls"}
        description={
          isEventsOffice
            ? "Monitor the voting progress for vendor polls."
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
