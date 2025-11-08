import { api } from "@/api";
import { EventType } from "../types";


export const frameData = (data: any) => {
  const res: any[] = [];

  for (const event of data) {  // ✅ use 'of' if 'data' is an array
    const transformed = transformEvent(event);
    res.push(transformed);
  }

  return res;
};

const flattenName = (profs: { firstName: string; lastName: string }[]) => {
  return profs.map(prof => `${prof.firstName} ${prof.lastName}`);
}
const flattenId = (profs:{ id: string }[])=>{
  return profs.map(prof => `${prof.id}`);
}

// Helper to clean ISO date strings (like "2025-12-31T22:00:00.000Z")
const cleanDateString = (isoDate: string | undefined): string => {
  if (!isoDate) return '';
  // Splits the string at 'T' and returns the first element (the date part)
  return isoDate.split('T')[0]; 
};


function transformEvent(event: any) {
  const id = event._id?.$oid || event._id || "";
  const registrationDeadline = event.registrationDeadline;
  const startDate = event.eventStartDate;
  const endDate = event.eventEndDate;
  // console.log("look here")
  // console.log(event.createdBy)

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
          "Spots Left": (event.capacity - event.attendees.length)
        },
      };

    case "workshop":
      return {
        id,
        type: EventType.WORKSHOP,
        name: event.eventName,
        description: event.description,
        agenda: event.fullAgenda,
        professors: flattenName(event.associatedProfs),
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
          Location: event.location,
          Capacity: event.capacity?.$numberInt || event.capacity,
          "Spots Left": (event.capacity - event.attendees.length),
          "Status": event.approvalStatus,
        },
      };

    // You can add more cases:
    case "conference":
      return {
        id,
        type: EventType.CONFERENCE,
        name: event.eventName,
        description:
          event.description,
        agenda: event.fullAgenda,
        details: {
          "Start Date": cleanDateString(startDate),
          "End Date": cleanDateString(endDate),
          "Start Time": event.eventStartTime,
          "End Time": event.eventEndTime,
          "Extra Required Resources": event.extraRequiredResources,
          "Funding Source": event.fundingSource,
          "Required Budget": event.requiredBudget,
          Location: event.location,
          "Link": event.websiteLink,
        }
      };
    case "bazaar":
      return {
        id,
        type: EventType.BAZAAR,
        name: event.eventName,
        description:
          event.description,
        // vendors: event.vendors,
        details: {
          "Registration Deadline": cleanDateString(registrationDeadline),
          "Start Date": cleanDateString(startDate),
          "End Date": cleanDateString(endDate),
          "Start Time": event.eventStartTime,
          "End Time": event.eventEndTime,
          Time: `${event.eventStartTime} - ${event.eventEndTime}`,
          Location: event.location,
          "Vendor Count": event.vendors.length,
        }
      };
    case "platform_booth":
      return {
        id,
        type: EventType.BOOTH,
        company: event.eventName,
        people: event.RequestData.boothAttendees,
        description:event.description,
        details: {
          "Setup Duration": `${event.RequestData.boothSetupDuration} weeks` ,
          "Location": event.RequestData.boothLocation,
          "Booth Size": event.RequestData.boothSize,
        },
      };

    default:
      return {
        id,
        type: event.type,
        name: event.eventName,
        description: event.description,
        details: {},
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