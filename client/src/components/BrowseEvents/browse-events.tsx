"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
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
import CreateBazaar from "../tempPages/CreateBazaar/CreateBazaar";
import Create from "../tempPages/CreateConference/CreateConference";
import CreateParent from "../createButton/createParent";

import { deleteEvent, frameData } from "./utils";
import { mockEvents, mockUserInfo } from "./mockData";
import { EventType, BaseEvent, Filters, FilterValue } from "./types";
import MenuOptionComponent from "../createButton/MenuOptionComponent";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import EventIcon from "@mui/icons-material/Event";
import CreateTrip from "../tempPages/CreateTrip/CreateTrip";
import EmptyState from "../shared/states/EmptyState";
import ErrorState from "../shared/states/ErrorState";
import SortByDate from '@/components/shared/SortBy/sortByDate';

interface BrowseEventsProps {
  registered: boolean;
  user: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userInfo: any;
  userID: string;
}

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

type Event =
  | ConferenceEvent
  | WorkshopEvent
  | BazaarEvent
  | BoothEvent
  | TripEvent;

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
  userInfo,
  userID,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('none'); // Default: no sorting
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

  // Separate effect for initial user data
  useEffect(() => {
    getUserData();
  }, []);

  // Separate effect for loading events
  useEffect(() => {
    if (!registered) {
      handleCallAPI();
    } else {
      handleRegistered();
    }
  }, [registered, refresh]);

  const getUserData = () => {
    const user = {
      id: userInfo._id,
      name: `${userInfo.firstName} ${userInfo.lastName}`,
      email: userInfo.email,
    };
    setUserInfo(user);
    setReady(true);
  };

  const handleRegistered = () => {
    setLoading(true);
    const registeredEvents = userInfo.registeredEvents;
    const result = frameData(registeredEvents);
    setEvents(result);
    setLoading(false);
  };

  async function handleCallAPI() {
    try {
      setLoading(true);
      setError(null);
      if (!registered) {
        const res = await api.get("/events");
        const data = res.data.data;
        const result = frameData(data);
        const newResults =
          user === "vendor"
            ? result.filter((event) => event.type === "bazaar")
            : result;
        setEvents(newResults);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (error: any) {
      window.alert(error.response.data.error);
    }
  };

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((event) => {
        const query = searchQuery.toLowerCase();

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

    // Apply sorting logic
    const parseDate = (dateStr: string | undefined) => {
      if (!dateStr) return 0; // Default to earliest possible date
      const parsedDate = Date.parse(dateStr); // Handles ISO 8601 format
      return isNaN(parsedDate) ? 0 : parsedDate; // Fallback to 0 if parsing fails
    };

    switch (sortBy) {
      case "start_asc":
        filtered.sort((a, b) => {
          const dateA = parseDate(a.details["Start Date"]);
          const dateB = parseDate(b.details["Start Date"]);
          console.log(`Comparing: ${dateA} vs ${dateB}`);
          return dateA - dateB;
        });
        break;

      case "start_desc":
        filtered.sort((a, b) => {
          const dateA = parseDate(a.details["Start Date"]);
          const dateB = parseDate(b.details["Start Date"]);
          console.log(`Comparing: ${dateA} vs ${dateB}`);
          return dateB - dateA;
        });
        break;
      default:
        break;
    }
    return filtered;
  }, [searchQuery, filters, events, sortBy]);

  const handleFilterChange = useCallback(
    (groupId: string, value: FilterValue) => {
      setFilters((prev) => ({
        ...prev,
        [groupId]: value,
      }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters({});
    setSearchQuery("");
  }, []);

  const Eventoptions = [
    { label: "Gym", icon: FitnessCenterIcon },
    { label: "Bazaars", icon: StorefrontIcon },
    { label: "Trips", icon: FlightTakeoffIcon },
    { label: "Conference", icon: EventIcon },
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
            professorsId={event.professorsId}
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

      {/* Search, Filter, and Sort Row */}
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
            onChange={handleSearchChange}
            storageKey="browseEventsSearchHistory"
            autoSaveDelay={2000}
          />
        </Box>
        <FilterPanel
          filterGroups={filterGroups}
          onFilterChange={handleFilterChange}
          currentFilters={filters}
          onReset={handleResetFilters}
        />
        <SortByDate value={sortBy} onChange={handleSortChange} />
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
        <ErrorState
          title={error}
          description="Oops! Something has occurred on our end. Please try again"
          imageAlt="Server error illustration"
        />
      )}

      {/* Events Grid */}
      {!loading && !error && (
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

          {/* No results message */}
          {filteredEvents.length === 0 && events.length === 0 && (
            <EmptyState
              title="No events available"
              description="There are no events in our archives yet. Check back later!"
              imageAlt="No events illustration"
            />
          )}

          {/* No results message */}
          {filteredEvents.length === 0 && events.length > 0 && (
            <EmptyState
              title="No events found"
              description="Try adjusting your search or filters"
              imageAlt="Empty search results illustration"
            />
          )}
        </Box>
      )}

      <CreateTrip
        open={createTrip}
        onClose={() => setTrip(false)}
        setRefresh={setRefresh}
      />
      <CreateBazaar
        open={createBazaar}
        onClose={() => setBazaar(false)}
        setRefresh={setRefresh}
      />
      {/* Create Conference Form */}
      <Create
        open={createconference}
        onClose={() => setConference(false)}
        setRefresh={setRefresh}
      />
    </Container>
  );
};

export default BrowseEvents;