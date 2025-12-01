import { api } from "@/api";
import { EventType } from "../types";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const frameData = (data: any, userInfo: any) => {
  const res: any[] = [];

  for (const event of data) {
    // ✅ use 'of' if 'data' is an array
    const transformed = transformEvent(event, userInfo?.attendedEvents);
    res.push(transformed);
  }

  return res;
};

const flattenName = (profs: { firstName: string; lastName: string }[]) => {
  return profs.map(prof => `${prof.firstName} ${prof.lastName}`);
}
const flattenVendors = (vendors: { RequestData: any; vendor: any }[]) => {
  console.log(vendors);
  return vendors.map(vendor => vendor.vendor);
}
// Helper to clean ISO date strings (like "2025-12-31T22:00:00.000Z")
const cleanDateString = (isoDate: string | undefined): string => {
  if (!isoDate) return '';
  // Splits the string at 'T' and returns the first element (the date part)
  return isoDate.split('T')[0];
};
export const capitalizeNamePart = (namePart?: string | null): string => {
  if (!namePart) return "";

  // Convert to string, trim whitespace, and lowercase the rest of the string
  const str = String(namePart).trim().toLowerCase();

  // Capitalize the first letter
  return str.charAt(0).toUpperCase() + str.slice(1);
};


function transformEvent(event: any, attendedEvents?: string[]) {
  const id = event._id?.$oid || event._id || "";
  const registrationDeadline = event.registrationDeadline;
  const allowedUsers = event.allowedUsers;
  const startDate = event.eventStartDate;
  const endDate = event.eventEndDate;
  const attended = attendedEvents ? attendedEvents.includes(id) : false;
  const archived = event.archived;

  switch (event.type?.toLowerCase()) {
    case "trip":
      return {
        id,
        type: EventType.TRIP,
        name: event.eventName,
        description: event.description,
        details: {
          "Registration Deadline": cleanDateString(registrationDeadline),
          "Start Date": cleanDateString(startDate),
          "End Date": cleanDateString(endDate),
          "Start Time": event.eventStartTime,
          "End Time": event.eventEndTime,
          Location: event.location,
          Cost: `${event.price?.$numberInt || event.price} EGP `,
          Capacity: event.capacity?.$numberInt || event.capacity,
          "Spots Left": event.capacity - event.attendees.length,
        },
        attended,
        archived,
        registrationDeadline,
        allowedUsers,
      };

    case "workshop":
      console.log(event);
      const firstName = capitalizeNamePart(event.createdBy.firstName);
      const lastName = capitalizeNamePart(event.createdBy.lastName);
      const nameParts = [firstName, lastName];
      const nonEmptyNameParts = nameParts.filter(part => part);
      const fullName = nonEmptyNameParts.join(' ');
      const profs = [...flattenName(event.associatedProfs), fullName];
      return {
        id,
        type: EventType.WORKSHOP,
        name: event.eventName,
        description: event.description,
        agenda: event.fullAgenda,
        professors: profs,
        comments:event.comments,
        attendees:event.attendees,
        professorsId: event.associatedProfs?.map((prof: any) => prof._id || prof) || [],
        details: {
          "Registration Deadline": cleanDateString(registrationDeadline),
          "Start Date": cleanDateString(startDate),
          "End Date": cleanDateString(endDate),
          "Start Time": event.eventStartTime,
          "End Time": event.eventEndTime,
          "Created By": event.createdBy,
          "Faculty Responsible": event.associatedFaculty,
          "Extra Required Resources": event.extraRequiredResources,
          "Funding Source": event.fundingSource,
          "Required Budget": event.requiredBudget,
          "CreatedId": event.createdBy.id,
          "Deadline": event.registrationDeadline,
          "Created by": fullName,
          Location: event.location,
          Capacity: event.capacity?.$numberInt || event.capacity,
          "Spots Left": event.capacity - event.attendees.length,
          Status: event.approvalStatus,
          Cost: `${event.price?.$numberInt || event.price} EGP `,
        },
        attended,
        archived,
        allowedUsers,
      };

    // You can add more cases:
    case "conference":
      return {
        id,
        type: EventType.CONFERENCE,
        name: event.eventName,
        description: event.description,
        agenda: event.fullAgenda,
        details: {
          "Start Date": cleanDateString(startDate),
          "End Date": cleanDateString(endDate),
          "Start Time": event.eventStartTime,
          "End Time": event.eventEndTime,
          "Extra Required Resources": event.extraRequiredResources,
          "Funding Source": event.fundingSource,
          "Required Budget": event.requiredBudget,
          Link: event.websiteLink,
        },
        attended,
        archived,
        registrationDeadline,
        allowedUsers,
      };
    case "bazaar":
      return {
        id,
        type: EventType.BAZAAR,
        name: event.eventName,
        description: event.description,
        vendors: flattenVendors(event.vendors),
        details: {
          "Registration Deadline": cleanDateString(registrationDeadline),
          "Start Date": cleanDateString(startDate),
          "End Date": cleanDateString(endDate),
          "Start Time": event.eventStartTime,
          "End Time": event.eventEndTime,
          Time: `${event.eventStartTime} - ${event.eventEndTime}`,
          Location: event.location,
          "Vendor Count": event.vendors.length,
        },
        attended,
        archived,
        registrationDeadline,
        allowedUsers,
      };
    case "platform_booth":
      return {
        id,
        type: EventType.BOOTH,
        company: event.eventName,
        people: event.RequestData.boothAttendees,
        description: event.description,
        details: {
          "Setup Duration": event.RequestData.boothSetupDuration,
          Location: event.RequestData.boothLocation,
          "Booth Size": event.RequestData.boothSize,
        },
        attended,
        archived,
        allowedUsers,
      };

    default:
      return {
        id,
        type: event.type,
        name: event.eventName,
        description: event.description,
        details: {},
        attended,
        archived,
      };
  }
}

export const deleteEvent = async (eventId: string) => {
  try {
    const response = await api.delete(`/events/${eventId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};