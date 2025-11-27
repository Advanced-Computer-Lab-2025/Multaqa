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

const DAY_IN_MS = 86_400_000;

const VOTABLE_DEMO_POLLS = new Set([
  "poll-1",
  "poll-2",
  "test-poll-1",
  "test-poll-2",
  "test-poll-3",
]);

const createMockPolls = (): Poll[] => {
  const now = Date.now();

  return [
    {
      id: "test-poll-1",
      title: "Best Campus Coffee 2025",
      description:
        "Vote for your favorite coffee spot on campus! Who brews the best bean?",
      startDate: new Date(now).toISOString(),
      endDate: new Date(now + 3 * DAY_IN_MS).toISOString(),
      isActive: true,
      createdAt: new Date(now).toISOString(),
      options: [
        {
          vendorId: "v1",
          vendorName: "Bean There Done That",
          voteCount: 45,
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bean",
        },
        {
          vendorId: "v2",
          vendorName: "Daily Grind",
          voteCount: 32,
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grind",
        },
        {
          vendorId: "v3",
          vendorName: "Brewed Awakening",
          voteCount: 18,
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brew",
        },
      ],
    },
    {
      id: "test-poll-2",
      title: "Favorite Lunch Spot",
      description:
        "Which food truck serves the best lunch? Let us know your pick!",
      startDate: new Date(now).toISOString(),
      endDate: new Date(now + 5 * DAY_IN_MS).toISOString(),
      isActive: true,
      createdAt: new Date(now).toISOString(),
      options: [
        {
          vendorId: "v4",
          vendorName: "Taco 'Bout It",
          voteCount: 120,
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taco",
        },
        {
          vendorId: "v5",
          vendorName: "Burger King (Not that one)",
          voteCount: 98,
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Burger",
        },
        {
          vendorId: "v6",
          vendorName: "Wok This Way",
          voteCount: 145,
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wok",
        },
      ],
    },
    {
      id: "test-poll-3",
      title: "Best Tech Accessories",
      description:
        "Who has the coolest gadgets and accessories at the tech fair?",
      startDate: new Date(now).toISOString(),
      endDate: new Date(now + 2 * DAY_IN_MS).toISOString(),
      isActive: true,
      createdAt: new Date(now).toISOString(),
      options: [
        {
          vendorId: "v7",
          vendorName: "Gadget Galaxy",
          voteCount: 56,
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gadget",
        },
        {
          vendorId: "v8",
          vendorName: "Cable Guy",
          voteCount: 23,
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cable",
        },
      ],
    },
  ];
};

const PollList: React.FC<PollListProps> = ({ showHeader = true }) => {
  const [polls, setPolls] = useState<Poll[]>(() => createMockPolls());
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(true);
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

        if (Array.isArray(activePolls) && activePolls.length > 0) {
          setPolls(activePolls);
          setUsingMockData(false);
        } else {
          setPolls(createMockPolls());
          setUsingMockData(true);
        }
      } catch (fetchError) {
        console.error("Failed to fetch polls", fetchError);
        if (!isMounted) {
          return;
        }
        setError("Unable to load live polls. Showing demo polls instead.");
        setPolls(createMockPolls());
        setUsingMockData(true);
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
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        {polls.map((poll) => {
          const shouldForceReadOnly =
            isEventsOffice &&
            !usingMockData &&
            !VOTABLE_DEMO_POLLS.has(poll.id);

          return (
            <Box key={poll.id}>
              <PollCard poll={poll} readOnly={shouldForceReadOnly} />
            </Box>
          );
        })}
      </Box>
    );

  const body = (
    <Box>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {usingMockData && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You are viewing demo polls. Voting is simulated locally until the backend is ready.
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
