"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Box, Typography, Container } from "@mui/material";
import FilterPanel from "../shared/FilterCard/FilterPanel";
import { FilterGroup, FilterOption } from "../shared/FilterCard/types";
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
import { api } from "@/api";
import CreateBazaar from "../tempPages/CreateBazaar/CreateBazaar";
import Create from "../tempPages/CreateConference/CreateConference";

import { deleteEvent, frameData, capitalizeNamePart } from "./utils";
import { EventType, BaseEvent, Filters, FilterValue } from "./types";
import CreationHubDropdown from "../createButton/CreationHubDropdown";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import EventIcon from "@mui/icons-material/Event";
import CreateTrip from "../tempPages/CreateTrip/CreateTrip";
import EmptyState from "../shared/states/EmptyState";
import ErrorState from "../shared/states/ErrorState";
import SellIcon from "@mui/icons-material/Sell";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { EventCardsListSkeleton } from "./utils/EventCardSkeleton";

import SortByDate from "@/components/shared/SortBy/sortByDate";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ContentWrapper from "../shared/containers/ContentWrapper";

interface BrowseEventsProps {
  registered: boolean;
  user: string;

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

const getFilterGroups = (
  userRole: string,
  professorOptions: FilterOption[]
): FilterGroup[] => [
    {
      id: "professorName",
      title: "Professor Name",
      type: "text",
      options: professorOptions,
    },
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
    ...(userRole !== "vendor"
      ? [
        {
          id: "attendance",
          title: "My Status",
          type: "chip" as const,
          options: [{ label: "Attended", value: "attended" }],
        },
      ]
      : []),
    {
      id: "date",
      title: "Date",
      type: "date", // <--- NEW TYPE
    },
  ];

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

const BrowseEvents: React.FC<BrowseEventsProps> = ({
  registered,
  user,
  userInfo,
  userID,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    eventType: [], // Multi-select for event types
    location: [], // Multi-select for locations
    professorName: [], // Filter by professor name
    eventName: [], // Filter by event name
    attendance: [], // Multi-select for attendance status
    date: "", // Single date selection
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("none"); // Default: no sorting
  const [createconference, setConference] = useState(false);
  const [createBazaar, setBazaar] = useState(false);
  const [createTrip, setTrip] = useState(false);
  const [professorOptions, setProfessorOptions] = useState<FilterOption[]>([]);
  const [cachedProfessors, setCachedProfessors] = useState<{ firstName: string, lastName: string }[]>([]);
  const registeredEvents = userInfo?.registeredEvents;

  // Fetch all professors once on mount for filtering
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const res = await api.get("/users/professors");
        const professors = res.data.data.map((prof: any) => ({
          firstName: prof.firstName,
          lastName: prof.lastName,
        }));
        setCachedProfessors(professors);
        console.log("📚 Cached professors for filtering:", professors);
      } catch (err) {
        console.error("Failed to fetch professors:", err);
      }
    };
    fetchProfessors();
  }, []);

  // Separate effect for loading events
  useEffect(() => {
    if (!registered) {
      handleCallAPI();
    } else {
      handleRegistered();
    }
  }, [registered, refresh]);

  // Use cached professors for filter options instead of parsing events
  useEffect(() => {
    if (cachedProfessors.length === 0) return;

    const formatProfessorName = (rawName?: string | null) => {
      if (!rawName || typeof rawName !== "string") return "";
      return rawName
        .trim()
        .split(/\s+/)
        .map((part) => capitalizeNamePart(part))
        .join(" ");
    };

    const options = cachedProfessors.map((prof) => {
      const fullName = `${formatProfessorName(prof.firstName)} ${formatProfessorName(prof.lastName)}`;
      return {
        label: fullName,
        value: fullName.toLowerCase(),
      };
    });

    const sortedOptions = options.sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    setProfessorOptions(sortedOptions);
  }, [cachedProfessors]);

  const getUserData = () => {
    const user = {
      id: userInfo._id,
      name: `${userInfo.firstName} ${userInfo.lastName}`,
      email: userInfo.email,
    };
  };
  const handleRegistered = () => {
    setLoading(true);
    const registeredEvents = userInfo.registeredEvents;
    const result = frameData(registeredEvents, userInfo);
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
        console.log("📡 Raw data from /events endpoint:", data);
        const result = frameData(data, userInfo);
        console.log("🔄 Transformed events data:", result);
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
    if (user === "events-only") {
      filtered = filtered.filter((event) =>
        ["bazaar", "trip", "conference"].includes(event.type)
      );
    }
    // Apply attendance filter
    if (
      filters.attendance &&
      (filters.attendance as string[]).includes("attended")
    ) {
      filtered = filtered.filter((event) => event.attended === true);
    }

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
    const locationFilterValue = filters.location;
    if (Array.isArray(locationFilterValue) && locationFilterValue.length > 0) {
      const selectedLocations = locationFilterValue as string[];
      filtered = filtered.filter((event) => {
        const eventLocationDetail = event.details.Location;
        if (typeof eventLocationDetail === "string") {
          const normalizedLocation = eventLocationDetail.toLowerCase();
          return selectedLocations.includes(normalizedLocation);
        }
        return false;
      });
    }

    const professorNameFilterValue = filters.professorName;
    if (
      Array.isArray(professorNameFilterValue) &&
      professorNameFilterValue.length > 0
    ) {
      const selectedProfessors = professorNameFilterValue as string[];

      filtered = filtered.filter((event) => {
        if (
          event.type === EventType.CONFERENCE ||
          event.type === EventType.WORKSHOP
        ) {
          const professors = (event as any).professors as string[] | undefined;
          const createdByDetail =
            (event.details?.["Created by"] ||
              event.details?.["Created By"] ||
              "") ?? "";
          const createdByText = createdByDetail
            .toString()
            .toLowerCase();

          return selectedProfessors.some((query) => {
            const lowerQuery = query.toLowerCase();

            // Check in professors list
            const inProfessors =
              professors?.some(
                (prof) =>
                  typeof prof === "string" &&
                  prof.toLowerCase().includes(lowerQuery)
              ) ?? false;

            const inCreatedBy = createdByText.includes(lowerQuery);

            // For conferences, also check the agenda
            let inAgenda = false;
            if (event.type === EventType.CONFERENCE && (event as any).agenda) {
              const agenda = ((event as any).agenda as string).toLowerCase();
              inAgenda = agenda.includes(lowerQuery);
            }

            return inProfessors || inCreatedBy || inAgenda;
          });
        }
        return false;
      });
    }

    // 2. Correct Event Name Filter (Multi-select/Additive Text)
    const eventNameFilterValue = filters.eventName;
    if (
      Array.isArray(eventNameFilterValue) &&
      eventNameFilterValue.length > 0
    ) {
      const selectedNames = eventNameFilterValue as string[];

      filtered = filtered.filter((event) => {
        let targetName = "";

        if (event.type === EventType.BOOTH) {
          targetName = (event as BoothEvent).company || "";
        } else if ("name" in event) {
          targetName = (event as any).name || "";
        }

        // Check if ALL selectedNames are included in the event's name
        return selectedNames.every((query) =>
          targetName.toLowerCase().includes(query.toLowerCase())
        );
      });
    }
    //Apply Attendance Filter
    if (
      filters.attendance &&
      (filters.attendance as string[]).includes("attended")
    ) {
      filtered = filtered.filter((event) => event.attended === true);
    }
    // Apply Date Filter
    const dateFilterValue = filters.date;
    if (typeof dateFilterValue === "string" && dateFilterValue) {
      const selectedDate = dayjs(dateFilterValue).format("YYYY-MM-DD");

      filtered = filtered.filter((event) => {
        const eventStartDateString = event.details["Start Date"];

        if (eventStartDateString) {
          // Normalize event date to the same YYYY-MM-DD format
          const eventDate = dayjs(eventStartDateString).format("YYYY-MM-DD");

          // Check for exact date match
          return eventDate === selectedDate;
        }
        return false;
      });
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

  const handleFilterChange = useCallback((groupId: string, value: any) => {
    // Use 'any' or your specific FilterValue type
    setFilters((prev) => {
      const currentVal = prev[groupId as keyof Filters]; // 1. Handle Multi-Select Filters (eventType and location)

      if (
        (groupId === "eventType" ||
          groupId === "location" ||
          groupId === "attendance") &&
        Array.isArray(currentVal)
      ) {
        if (currentVal.includes(value)) {
          return {
            ...prev,
            [groupId]: currentVal.filter((v) => v !== value),
          };
        } else {
          return {
            ...prev,
            [groupId]: [...currentVal, value],
          };
        }
      }
      return {
        ...prev,
        [groupId]: value,
      };
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      eventType: [],
      location: [],
      professorName: [],
      eventName: [],
      attendance: [],
      date: "",
    });
    setSearchQuery("");
  }, []);

  const creationHubOptions = useMemo(
    () => [
      {
        label: "Bazaars",
        icon: StorefrontIcon,
        color: "#e91e63",
        description: "Showcase vendors or student booths",
        onSelect: () => setBazaar(true),
      },
      {
        label: "Trips",
        icon: FlightTakeoffIcon,
        color: "#6e8ae6",
        description: "Plan logistics for student trips",
        onSelect: () => setTrip(true),
      },
      {
        label: "Conference",
        icon: EventIcon,
        color: "#ff9800",
        description: "Organize talks and keynotes",
        onSelect: () => setConference(true),
      },
    ],
    [setBazaar, setTrip, setConference]
  );

  // Calculate title and description based on user role
  const pageTitle =
    user !== "events-only"
      ? user === "events-office"
        ? "Manage Events"
        : registered
          ? " My Registered Events"
          : "Browse Events"
      : "Create Events";

  const pageDescription =
    user !== "events-only"
      ? user === "events-office"
        ? "Manage all events that are on the system"
        : registered
          ? "Keep track of which events you have registered for"
          : "Take a look at all the opportunities we have to offer and find your perfect match(es)"
      : "Create and keep track of events you have created";

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
            cachedProfessors={cachedProfessors}
            user={user}
            registered={registered}
            userInfo={userInfo}
            onDelete={() => handleDeleteEvent(event.id)}
            attended={event.attended}
            archived={event.archived}
            datePassed={new Date(event.details["Start Date"]) < new Date()}
          />
        );
      case EventType.WORKSHOP:
        console.log(event);
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
            isRegisteredEvent={registeredEvents
              ?.map((e: any) => e._id)
              .includes(event.id)}
            userInfo={userInfo}
            onDelete={() => handleDeleteEvent(event.id)}
            attended={event.attended}
            archived={event.archived}
            datePassed={new Date(event.details["Start Date"]) < new Date()}
            registrationPassed={
              new Date(event.details["Registration Deadline"]) < new Date()
            }
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
            isRegisteredEvent={registeredEvents
              ?.map((e: any) => e._id)
              .includes(event.id)}
            userInfo={userInfo}
            onDelete={() => handleDeleteEvent(event.id)}
            attended={event.attended}
            archived={event.archived}
            datePassed={new Date(event.details["Start Date"]) < new Date()}
            registrationPassed={
              new Date(event.details["Registration Deadline"]) < new Date()
            }
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
            isRegisteredEvent={registeredEvents
              ?.map((e: any) => e._id)
              .includes(event.id)}
            userInfo={userInfo}
            onDelete={() => handleDeleteEvent(event.id)}
            attended={event.attended}
            archived={event.archived}
            datePassed={new Date(event.details["Start Date"]) < new Date()}
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
            isRegisteredEvent={registeredEvents
              ?.map((e: any) => e._id)
              .includes(event.id)}
            userInfo={userInfo}
            onDelete={() => handleDeleteEvent(event.id)}
            attended={event.attended}
            archived={event.archived}
            datePassed={new Date(event.details["Start Date"]) < new Date()}
            registrationPassed={
              new Date(event.details["Registration Deadline"]) < new Date()
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, overflow: "auto" }}>
      <ContentWrapper
        title={pageTitle}
        description={pageDescription}
        padding={{ xs: 0 }}
        horizontalPadding={{ xs: 1 }}
      >
        {/* Search and Filter Row */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            mb: 6,
            flexWrap: { xs: "wrap", sm: "nowrap" }, // Only wrap on phones
          }}
        >
          <Box sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: "300px" } }}>
            <CustomSearchBar
              width="100%"
              type="outwards"
              icon
              value={searchQuery}
              onChange={handleSearchChange}
              storageKey="browseEventsSearchHistory"
              autoSaveDelay={2000}
            />
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FilterPanel
              filterGroups={getFilterGroups(user, professorOptions)}
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              onReset={handleResetFilters}
              matchSearchBar
            />
          </LocalizationProvider>
        </Box>

        {/* Sort By and Creation Hub Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <SortByDate value={sortBy} onChange={handleSortChange} />
          {user === "events-only" && (
            <CreationHubDropdown
              options={creationHubOptions}
              helperText="Choose what you would like to create"
              dropdownSide="left"
            />
          )}
        </Box>

        {/* Loading State */}
        {loading && <EventCardsListSkeleton />}

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
                width: "100%",
              }}
            >
              {filteredEvents.map((event) => (
                <Box key={event.id} sx={{ width: "100%" }}>
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
                  {registered
                    ? `Viewing ${filteredEvents.length} of ${events.length} events`
                    : `Browsing ${filteredEvents.length} of ${events.length} events`}
                </Typography>
              </Box>
            )}

            {/* No results message */}
            {filteredEvents.length === 0 && events.length > 0 && (
              <EmptyState
                title="No events found"
                description="Try adjusting your search or filters"
                imageAlt="Empty search results illustration"
              />
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
      </ContentWrapper>
    </Container>
  );
};

export default BrowseEvents;
