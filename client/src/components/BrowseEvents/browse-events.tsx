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
import { mockEvents, mockUserInfo } from "./mockData";
import { EventType, BaseEvent, Filters, FilterValue } from "./types";
import MenuOptionComponent from "../createButton/MenuOptionComponent";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import EventIcon from "@mui/icons-material/Event";
// import PollIcon from '@mui/icons-material/Poll';
import CreateTrip from "../tempPages/CreateTrip/CreateTrip";

interface BrowseEventsProps {
  registered: boolean;
  user: string;
  userID: string;
}
// Event types and interfaces are now imported from ./types

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

// Filter types are now imported from ./types

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

const BrowseEvents: React.FC<BrowseEventsProps> = ({
  registered,
  user,
  userID,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createconference, setConference] = useState(false);
  const [createBazaar, setBazaar] = useState(false);
  const [createTrip, setTrip] = useState(false);
  const [createWorkshop, setWorkshop] = useState(false);
  const [createSession, setSession] = useState(false);
  const [UserInfo, setUserInfo] = useState<{
    id: string;
    name: string;
    email: string;
  }>({ id: userID, name: "", email: "" });
  const [isReady, setReady] = useState(false);

  // useEffect(() => {
  //   if(!registered){
  //   handleCallAPI2();
  //   }
  // }, []);

  useEffect(() => {
    handleCallAPI();
  }, [refresh]);
  // Handle event deletion
  async function handleCallAPI2() {
    const res = await api.get(`/users/${userID}`);
    const data = res.data.data;
    const user = {
      id: data._id,
      name: `${data.firstName}  ${data.lastName}`,
      email: data.email,
    };
    setUserInfo(user);
    setReady(true);
  }

  async function handleCallAPI() {
    try {
      setLoading(true);
      setError(null);
      if (!registered) {
        const res = await api.get("/events");
        const data = res.data.data;
        const result = frameData(data);
        setEvents(result);
        // console.log(data);
      } else {
        const res = await api.get(`/users/${userID}`);
        const data2 = res.data.data.registeredEvents;
        const result = frameData(data2);
        setEvents(result);
        // console.log(data2);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (user === "events-only") {
      filtered = filtered = filtered.filter((event) =>
        ["bazaar", "trip", "conference"].includes(event.type)
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((event) => {
        const query = searchQuery.toLowerCase();

        // Handle booth events differently since they don't have name/description
        if (event.type === EventType.BOOTH) {
          return (
            (event.company?.toLowerCase() || "").includes(query) ||
            (event.details?.Description?.toLowerCase() || "").includes(query) ||
            (Array.isArray(event.people)
              ? event.people.some((p) =>
                  (p?.toString().toLowerCase() || "").includes(query)
                )
              : false) ||
            Object.values(event.details ?? {}).some((value) =>
              String(value ?? "")
                .toLowerCase()
                .includes(query)
            )
          );
        }

        // Handle other event types
        return (
          ("name" in event && event.name.toLowerCase().includes(query)) ||
          ("description" in event &&
            event.description.toLowerCase().includes(query)) ||
          Object.values(event.details ?? {}).some((value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(query)
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
  const Eventoptions = [
    { label: "Gym", icon: FitnessCenterIcon },
    { label: "Bazaars", icon: StorefrontIcon },
    { label: "Trips", icon: FlightTakeoffIcon },
    { label: "Conference", icon: EventIcon },
    // { label: 'Polls', icon: PollIcon },
  ];
  const EventOptionsSetters = [setSession, setBazaar, setTrip, setConference];

  // Render event component based on type
  const renderEventComponent = (event: Event, registered: boolean) => {
    switch (event.type) {
      case EventType.CONFERENCE:
        return (
          <ConferenceView
            id={event.id}
            setRefresh={setRefresh}
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            agenda={event.agenda}
            user={user}
            registered={registered}
            userInfo={UserInfo}
            onDelete={() => handleDeleteEvent(event.id)}
            isReady={isReady}
          />
        );
      case EventType.WORKSHOP:
        return (
          <WorkshopView
            id={event.id}
            setRefresh={setRefresh}
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            professors={event.professors}
            agenda={event.agenda}
            user={user}
            registered={registered}
            userInfo={UserInfo}
            onDelete={() => handleDeleteEvent(event.id)}
            isReady={isReady}
          />
        );
      case EventType.BAZAAR:
        return (
          <BazarView
            id={event.id}
            setRefresh={setRefresh}
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            user={user}
            registered={registered}
            userInfo={UserInfo}
            onDelete={() => handleDeleteEvent(event.id)}
            isReady={isReady}
          />
        );
      case EventType.BOOTH:
        return (
          <BoothView
            id={event.id}
            setRefresh={setRefresh}
            key={event.id}
            company={event.company}
            people={event.people}
            details={event.details}
            user={user}
            registered={registered}
            userInfo={UserInfo}
            onDelete={() => handleDeleteEvent(event.id)}
            isReady={isReady}
          />
        );
      case EventType.TRIP:
        return (
          <TripView
            id={event.id}
            setRefresh={setRefresh}
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            user={user}
            registered={registered}
            userInfo={UserInfo}
            onDelete={() => handleDeleteEvent(event.id)}
            isReady={isReady}
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
          {user !== "events-only"
            ? registered
              ? "Keep track of which events you have registered for"
              : "Take a look at all the opportunities we have to offer and find your perfect match(es)"
            : "Keep track of and manage events you have created"}
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
          <CustomSearchBar
            width="60vw"
            type="outwards"
            icon
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
        <FilterPanel
          filterGroups={filterGroups}
          onFilterChange={handleFilterChange}
          currentFilters={filters}
          onReset={handleResetFilters}
        />
        {user === "events-only" && (
          <MenuOptionComponent
            options={Eventoptions}
            setters={EventOptionsSetters}
          />
        )}
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Loading events...
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Make sure your backend server is running on the correct port
          </Typography>
        </Box>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <>
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
              <Box key={event.id}>
                {renderEventComponent(event, registered)}
              </Box>
            ))}

            {/* No results message */}
            {filteredEvents.length === 0 && events.length === 0 && (
              <Box sx={{ textAlign: "center", py: 8, gridColumn: "1 / -1" }}>
                <Typography variant="h6" color="text.secondary">
                  No events available
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  There are no events in the database yet
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
        </>
      )}
      <CreateTrip
        open={createTrip}
        onClose={() => setTrip(false)}
        setRefresh={setRefresh}
      />
    </Container>
  );
};

export default BrowseEvents;