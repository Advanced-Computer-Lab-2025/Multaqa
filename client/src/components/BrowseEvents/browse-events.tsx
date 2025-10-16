//Notes:
//

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";
import FilterPanel from "../shared/FilterCard/FilterPanel";
import { FilterGroup } from "../shared/FilterCard/types";
import ConferenceView from "../Event/ConferenceView";
import WorkshopView from "../Event/WorkshopView";
import BazarView from "../Event/BazarView";
import BoothView from "../Event/BoothView";
import TripView from "../Event/TripView";
import {
  ConferenceViewProps,
  WorkshopViewProps,
  BazarViewProps,
  BoothViewProps,
} from "../Event/types";
import CustomSearchBar from "../shared/Searchbar/CustomSearchBar";
import theme from "@/themes/lightTheme";
import { api } from "@/api";
import { frameData } from "./utils";


interface BrowseEventsProps {
  registered: boolean;
  user: string;
}
// Define the event type enum
export enum EventType {
  CONFERENCE = "conference",
  WORKSHOP = "workshop",
  BAZAAR = "bazaar",
  BOOTH = "booth",
  TRIP = "trip",
}

// Define the base event interface
interface BaseEvent {
  id: string;
  type: EventType;
}

// Define specific event interfaces using your existing types
interface ConferenceEvent extends BaseEvent, ConferenceViewProps {
  type: EventType.CONFERENCE;
}

interface WorkshopEvent extends BaseEvent, WorkshopViewProps {
  type: EventType.WORKSHOP;
}

interface BazaarEvent extends BaseEvent, BazarViewProps {
  type: EventType.BAZAAR;
}

interface BoothEvent extends BaseEvent, BoothViewProps {
  type: EventType.BOOTH;
}

interface TripEvent extends BaseEvent, BazarViewProps {
  type: EventType.TRIP;
}

// Union type for all events
type Event =
  | ConferenceEvent
  | WorkshopEvent
  | BazaarEvent
  | BoothEvent
  | TripEvent;

// Define filter value types
type FilterValue = string | string[] | number | boolean;

// Define filters type
interface Filters {
  eventType?: string[];
  [key: string]: FilterValue | undefined;
}

// Filter groups for the filter panel
const filterGroups: FilterGroup[] = [
  {
    id: "eventType",
    title: "Event Type",
    type: "chip",
    options: [
      { label: "Conference", value: EventType.CONFERENCE },
      { label: "Workshop", value: EventType.WORKSHOP },
      { label: "Bazaar", value: EventType.BAZAAR },
      { label: "Booth", value: EventType.BOOTH },
      { label: "Trip", value: EventType.TRIP },
    ],
  },
];

const BrowseEvents: React.FC<BrowseEventsProps> = ({ registered, user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    handleCallAPI()
  }, []); 
  // Handle event deletion

  async function handleCallAPI (){
    try{
      const res = await api.get("/events");
      const data = res.data.data;
      const result = frameData(data);
      setEvents(result);
      console.log(res.data.data);
    }
    catch(err){
      console.error(err);
    }
 
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((event) => {
        const query = searchQuery.toLowerCase();

        // Handle booth events differently since they don't have name/description
        if (event.type === EventType.BOOTH) {
          return (
            event.company.toLowerCase().includes(query) ||
            event.details.Description?.toLowerCase().includes(query) ||
            Object.values(event.details).some((value) =>
              value.toString().toLowerCase().includes(query)
            )
          );
        }

        // Handle other event types
        return (
          ("name" in event && event.name.toLowerCase().includes(query)) ||
          ("description" in event &&
            event.description.toLowerCase().includes(query)) ||
          Object.values(event.details).some((value) =>
            value.toString().toLowerCase().includes(query)
          )
        );
      });
    }

    // Apply type filter
    if (filters.eventType && filters.eventType.length > 0) {
      const eventTypes = filters.eventType;
      filtered = filtered.filter((event) => eventTypes.includes(event.type));
    }

    return filtered;
  }, [searchQuery, filters, events]);

  const handleFilterChange = (groupId: string, value: FilterValue) => {
    setFilters((prev) => ({
      ...prev,
      [groupId]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  // Render event component based on type
  const renderEventComponent = (event: Event, registered: boolean) => {
    switch (event.type) {
      case EventType.CONFERENCE:
        return (
          <ConferenceView
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            agenda={event.agenda}
            user={user}
            registered={registered}
            onDelete={() => handleDeleteEvent(event.id)}
          />
        );
      case EventType.WORKSHOP:
        return (
          <WorkshopView
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            agenda={event.agenda}
            user={user}
            registered={registered}
            onDelete={() => handleDeleteEvent(event.id)}
          />
        );
      case EventType.BAZAAR:
        return (
          <BazarView
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            user={user}
            registered={registered}
            onDelete={() => handleDeleteEvent(event.id)}
          />
        );
      case EventType.BOOTH:
        return (
          <BoothView
            key={event.id}
            company={event.company}
            people={event.people}
            details={event.details}
            user={user}
            registered={registered}
            onDelete={() => handleDeleteEvent(event.id)}
          />
        );
      case EventType.TRIP:
        return (
          <TripView
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            user={user}
            registered={registered}
            onDelete={() => handleDeleteEvent(event.id)}
          />
        );
      default:
        return null;
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
          {registered ? " My Registered Events" : "Browse Events"}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#757575", fontFamily: "var(--font-poppins)", mb: 4 }}
        >
          {registered
            ? "Keep track of which events you have registered for"
            : "Take a look at all the opportunities we have to offer and find your perfect match(es)"}
        </Typography>
      </Box>

      {/* Search and Filter Row */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 6,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ flexGrow: 0.3, minWidth: "300px" }}>
          <CustomSearchBar width="60vw" type="outwards" />
        </Box>
        <FilterPanel
          filterGroups={filterGroups}
          onFilterChange={handleFilterChange}
          currentFilters={filters}
          onReset={handleResetFilters}
        />
      </Box>

      {/* Events Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {filteredEvents.map((event) => (
          <Box key={event.id}>{renderEventComponent(event, registered)}</Box>
        ))}

        {/* Results count */}
        {filteredEvents.length > 0 && (
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredEvents.length} of {events.length} events
            </Typography>
          </Box>
        )}

        {/* No results message */}
        {filteredEvents.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No events found matching your criteria
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default BrowseEvents;
