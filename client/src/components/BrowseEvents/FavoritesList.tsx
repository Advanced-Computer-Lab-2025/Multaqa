"use client";

import React, { useEffect, useState } from "react";
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

interface FavoritesListProps {
  userInfo: any;
  user: string;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ userInfo, user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
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
    };

    fetchFavorites();
  }, [userInfo]);

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
            icon={() => null}
            background={"#6e8ae6"}
            user={user}
            userInfo={userInfo}
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
            agenda={event.agenda}
            icon={() => null}
            background={"#9c27b0"}
            user={user}
            userInfo={userInfo}
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
            icon={() => null}
            background={"#e91e63"}
            user={user}
            userInfo={userInfo}
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
            icon={() => null}
            background={"#2196f3"}
            user={user}
            userInfo={userInfo}
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
            icon={() => null}
            background={"#6e8ae6"}
            user={user}
            userInfo={userInfo}
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
          />
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Favorites
        </Typography>
        <Typography variant="body2" sx={{ color: "#757575" }}>
          Events you marked as favorites are listed here.
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 3 }}>
        {events.map((ev) => renderEvent(ev))}
      </Box>
    </Container>
  );
};

export default FavoritesList;
