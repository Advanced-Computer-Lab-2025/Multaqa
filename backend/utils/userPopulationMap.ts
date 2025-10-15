// Role-based populate fields
// Role-based populate fields based on discriminator schemas
export const populateMap: Record<string, string[] | undefined> = {
  student: ["favorites", "registeredEvents"],
  staffMember: ["favorites", "registeredEvents", "myWorkshops"],
  administration: [], // No referenced fields to populate
  vendor: ["requestedEvents.event"], // Populate the event inside requestedEvents array
  // Add more roles as needed
};
