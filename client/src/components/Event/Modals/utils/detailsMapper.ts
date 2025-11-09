import { 
  ConferenceDetails,
  WorkshopDetails,
  BazaarDetails,
  BoothDetails,
  TripDetails,
} from '../types/eventDetails.types';

export const mapDetailsToType = (type: string, details: Record<string, any>, color: string) => {
  switch (type.toLowerCase()) {
    case 'conference':
      return {
        location: details.location,
        virtualLink: details.virtualLink,
        agenda: details.agenda,
        speakers: details.speakers,
        color
      } as ConferenceDetails;

    case 'workshop':    
      return {
        registrationDeadline: details['Registration Deadline'],
        startDate: details['Start Date'],
        endDate: details['End Date'],
        startTime: details['Start Time'],
        endTime: details['End Time'],
        location: details['Location'],
        cost: details["Cost"],
        capacity: details['Capacity'],
        spotsLeft: details['Spots Left'],
        faculty: details["Faculty Responsible"],
        resources: details["Extra Required Resources"],
        funding: details["Funding Source"],
        budget: details["Required Budget"],
        professors: details.professors,
        color
      } as WorkshopDetails;

    case 'bazaar':
      return {
        color,
        registrationDeadline: details['Registration Deadline'],
        startDate: details['Start Date'],
        endDate: details['End Date'],
        startTime: details['Start Time'],
        endTime: details['End Time'],
        location: details.Location,
        vendors:details.vendors,
        vendorCount: details['Vendor Count'],
        } as BazaarDetails;

    case 'booth':
      return {
        location: details["Location"],
        boothSize : details['Booth Size'],
        setupDuration: details['Setup Duration'],
        people:details.people,
        color
      } as BoothDetails;

    case 'trip':
      return {
        registrationDeadline: details['Registration Deadline'],
        startDate: details['Start Date'],
        endDate: details['End Date'],
        startTime: details['Start Time'],
        endTime: details['End Time'],
        location: details.Location,
        cost: details.Cost,
        capacity: details.Capacity,
        spotsLeft: details['Spots Left'],
        color
      } as TripDetails;

    default:
      return null;
  }
};