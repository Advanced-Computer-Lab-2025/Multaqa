// Define the event type enum
export enum EventType {
  CONFERENCE = "conference",
  WORKSHOP = "workshop",
  BAZAAR = "bazaar",
  BOOTH = "booth",
  TRIP = "trip",
}

// Define the base event interface
export interface BaseEvent {
  id: string;
  type: EventType;
}

// Define filter value types
export type FilterValue = string | string[] | number | boolean;

// Define filters type
export interface Filters {
  eventType?: string[];
  eventStatus?: string[];
  [key: string]: FilterValue | undefined;
}
