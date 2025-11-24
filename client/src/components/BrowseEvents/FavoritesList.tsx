"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Container, Box, Typography } from "@mui/material";
import { api } from "@/api";
import { frameData } from "./utils";
import BrowseEvents from "./browse-events";
import EmptyState from "../shared/states/EmptyState";
import ErrorState from "../shared/states/ErrorState";
import EventCard from "../shared/cards/EventCard";
import ConferenceView from "../Event/ConferenceView";
import WorkshopView from "../Event/WorkshopView";
import BazarView from "../Event/BazarView";
import BoothView from "../Event/BoothView";
import TripView from "../Event/TripView";
import { EventType } from "./types";
import theme from "@/themes/lightTheme";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import EventIcon from "@mui/icons-material/Event";
import SellIcon from "@mui/icons-material/Sell";
import Diversity3Icon from "@mui/icons-material/Diversity3";

interface FavoritesListProps {
  userInfo: any;
  user: string;
}

const EventColor = [
  {
    color: "#6e8ae6", // Trips
    icon: FlightTakeoffIcon, //indigo
  },
  {
    icon: StorefrontIcon, //Booth
    color: "#2196f3", // Blue
  },
  {
    icon: EventIcon, //Conference
    color: "#ff9800", // Orange
  },
  {
    icon: SellIcon, //Bazaar
    color: "#e91e63", // Pink
  },
  {
    icon: Diversity3Icon, //workshop
    color: "#9c27b0", // Purple
  },
];

const FavoritesList: React.FC<FavoritesListProps> = ({ userInfo, user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/users/favorites");
      const data = res.data.data || res.data; // backend returns in data.data sometimes
      const framed = frameData(data, userInfo);
      setEvents(framed);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load favorites. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites, refreshKey]);

  // Listen for custom event to refresh when favorites are toggled
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      // Small delay to ensure backend has updated
      setTimeout(() => {
        setRefreshKey((prev) => prev + 1);
      }, 500);
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    };
  }, []);

  // Update userInfo to include all event IDs in favorites array
  // This ensures View components correctly identify events as favorited
  const updatedUserInfo = useMemo(() => {
    if (!events || events.length === 0) return userInfo;

    // Extract all event IDs from the favorites list
    const favoriteIds = events.map((event) => event.id).filter(Boolean);

    // Create updated userInfo with all event IDs in favorites
    // Format matches what View components expect: { _id: id } or just the ID string
    return {
      ...userInfo,
      favorites: favoriteIds.map((id) => ({ _id: id })),
    };
  }, [events, userInfo]);

  if (loading) return <div />; // let parent show loading skeleton if needed
  if (error)
    return (
      <ErrorState
        title={error}
        description="Unable to load favorites"
        imageAlt="Error"
      />
    );

  if (!events || events.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <EmptyState
          title="No favorites yet"
          description="Add events to your favorites and they'll show up here."
          imageAlt="No favorites"
        />
      </Container>
    );
  }

  const renderEvent = (event: any) => {
    switch (event.type) {
      case EventType.CONFERENCE:
        return (
          <ConferenceView
            id={event.id}
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            agenda={event.agenda}
            icon={EventColor[2].icon}
            background={EventColor[2].color}
            user={user}
            userInfo={updatedUserInfo}
            attended={event.attended}
          />
        );
      case EventType.WORKSHOP:
        return (
          <WorkshopView
            id={event.id}
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            professors={event.professors}
            professorsId={event.professorsId || []}
            agenda={event.agenda}
            icon={EventColor[4].icon}
            background={EventColor[4].color}
            user={user}
            userInfo={updatedUserInfo}
            attended={event.attended}
          />
        );
      case EventType.BAZAAR:
        return (
          <BazarView
            id={event.id}
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            vendors={event.vendors}
            icon={EventColor[3].icon}
            background={EventColor[3].color}
            user={user}
            userInfo={updatedUserInfo}
            attended={event.attended}
          />
        );
      case EventType.BOOTH:
        return (
          <BoothView
            id={event.id}
            key={event.id}
            details={event.details}
            company={event.company}
            people={event.people}
            description={event.description}
            icon={EventColor[1].icon}
            background={EventColor[1].color}
            user={user}
            userInfo={updatedUserInfo}
            attended={event.attended}
          />
        );
      case EventType.TRIP:
        return (
          <TripView
            id={event.id}
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            icon={EventColor[0].icon}
            background={EventColor[0].color}
            user={user}
            userInfo={updatedUserInfo}
            attended={event.attended}
          />
        );
      default:
        return (
          <EventCard
            key={event.id}
            eventId={event.id}
            isFavorite={true}
            title={event.name || "Untitled"}
            startDate={event.details?.["Start Date"]}
            endDate={event.details?.["End Date"]}
            startTime={event.details?.["Start Time"]}
            endTime={event.details?.["End Time"]}
            color={"#6366F1"}
            eventType={event.type}
          />
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, overflow: "auto" }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            mb: 2,
            textAlign: "left",
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            color: `${theme.palette.tertiary.dark}`,
          }}
        >
          My Favorites
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#757575", fontFamily: "var(--font-poppins)", mb: 4 }}
        >
          Events you marked as favorites are listed here.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(1, 1fr)",
          gap: 3,
          width: "100%",
        }}
      >
        {events.map((ev) => renderEvent(ev))}
      </Box>
    </Container>
  );
};

export default FavoritesList;
