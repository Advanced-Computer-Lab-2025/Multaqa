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
import Create from "../shared/CreateConference/CreateConference";

import { deleteEvent, frameData } from "./utils";
import { EventType, BaseEvent, Filters, FilterValue } from "./types";
import MenuOptionComponent from "../createButton/MenuOptionComponent";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import EventIcon from "@mui/icons-material/Event";
import CreateTrip from "../tempPages/CreateTrip/CreateTrip";
import EmptyState from "../shared/states/EmptyState";
import ErrorState from "../shared/states/ErrorState";
import SellIcon from '@mui/icons-material/Sell';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { EventCardsListSkeleton } from "./utils/EventCardSkeleton";


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

const EventColor = [
   {
    color:"#6e8ae6", // Trips
    icon: FlightTakeoffIcon , //indigo
  },
  {
    icon:StorefrontIcon, //Booth
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


const BrowseEvents: React.FC<BrowseEventsProps> = ({
  registered,
  user,
  userInfo,
  userID,
}) => {
  console.log(userInfo);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createconference, setConference] = useState(false);
  const [createBazaar, setBazaar] = useState(false);
  const [createTrip, setTrip] = useState(false);
  const registeredEvents = userInfo.registeredEvents;

 

  // Separate effect for loading events
  useEffect(() => {
    if (!registered) {
      handleCallAPI();
    } else {
      handleRegistered();
    }
  }, [registered, refresh]);



  const handleRegistered = () => {
    setLoading(true);
    const result = frameData(registeredEvents);
    console.log("register events:" + registeredEvents[0]);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      window.alert(error.response.data.error);
    }
  };

  // Use useCallback to memoize the search handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (user === "events-only") {
      filtered = filtered.filter((event) =>
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
    { label: "Bazaars", icon: StorefrontIcon },
    { label: "Trips", icon: FlightTakeoffIcon },
    { label: "Conference", icon: EventIcon },
  ];
  const EventOptionsSetters = [setBazaar, setTrip, setConference];

  // Render event component based on type
  const renderEventComponent = (event: Event, registered: boolean) => {
    //here you can check if attended should be set to true by cheking if it exists in the attended list of the current user 
    switch (event.type) {
      case EventType.CONFERENCE:
        return (
          <ConferenceView
            id={event.id}
            setRefresh={setRefresh}
            background={EventColor[2].color}
            icon={EventColor[2].icon}
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            agenda={event.agenda}
            user={user}
            registered={registered}
            userInfo={userInfo}
            onDelete={() => handleDeleteEvent(event.id)}
          />
        );
      case EventType.WORKSHOP:
        return (
          <WorkshopView
            id={event.id}
            background={EventColor[4].color}
            icon={EventColor[4].icon}
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
            userInfo={userInfo}
            onDelete={() => handleDeleteEvent(event.id)}
          />
        );
      case EventType.BAZAAR:
        return (
          <BazarView
            id={event.id}
            vendors={event.vendors}
            background={EventColor[3].color}
            icon={EventColor[3].icon}
            setRefresh={setRefresh}
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            user={user}
            registered={registered}
            userInfo={userInfo}
            onDelete={() => handleDeleteEvent(event.id)}
          />
        );
      case EventType.BOOTH:
        return (
          <BoothView
            id={event.id}
            background={EventColor[1].color}
            icon={EventColor[1].icon}
            setRefresh={setRefresh}
            key={event.id}
            company={event.company}
            people={event.people}
            description={event.description}
            details={event.details}
            user={user}
            registered={registered}
            userInfo={userInfo}
            onDelete={() => handleDeleteEvent(event.id)}
          />
        );
      case EventType.TRIP:
        return (
          <TripView
            background={EventColor[0].color}
            icon={EventColor[0].icon}
            id={event.id}
            setRefresh={setRefresh}
            key={event.id}
            details={event.details}
            name={event.name}
            description={event.description}
            user={user}
            registered={registered}
            userInfo={userInfo}
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
          {user !== "events-only"? registered ? " My Registered Events" : "Browse Events":"Manage Events"}
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
            width="64vw"
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
        {user === "events-only" && (
          <MenuOptionComponent
            options={Eventoptions}
            setters={EventOptionsSetters}
          />
        )}
      </Box>

      {/* Loading State */}
      {loading && (
       <EventCardsListSkeleton />
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
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: 3,
              padding:"0px 40px"
            }}
          >
            {filteredEvents.map((event) => (
              <Box key={event.id}>
                {renderEventComponent(event, registered)}
              </Box>
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

          {/* Results counter */}
          {events.length > 0 && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                {registered?`Viewing ${filteredEvents.length} of ${events.length} events`:`Browsing ${filteredEvents.length} of ${events.length} events`}
              </Typography>
            </Box>
          )}
        </>
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
