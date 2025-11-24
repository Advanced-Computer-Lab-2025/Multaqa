// Role-based populate fields based on discriminator schemas
export const populateMap: Record<string, any[] | undefined> = {
  student: [
    { path: "favorites", model: "Event" },
    { path: "registeredEvents", model: "Event" },
  ],
  staffMember: [
    { path: "favorites", model: "Event" },
    { path: "registeredEvents", model: "Event" },
    {
      path: "myWorkshops",
      model: "workshop",
      populate: {
        path: "attendees",
        select: "firstName lastName email",
      },
    },
  ],
  administration: [], // No referenced fields to populate
  vendor: [{ path: "requestedEvents.event", model: "Event" }], // Populate the event inside requestedEvents array
  // Add more roles as needed
};
