// utils/mapEventDataByType.ts
export function mapEventDataByType(type: string, data: any) {
  // Shared base fields across ALL event types
  const baseFields = {
    type: data.type,
    eventName: data.name,
    eventStartDate: data.startDate,
    eventEndDate: data.endDate,
    eventStartTime: data.startTime,
    eventEndTime: data.endTime,
    registrationDeadline: data.registrationDeadline,
    location: data.location,
    description: data.shortDescription,
    price: data.price,
  };

  switch (type) {
    case "workshop":
      return {
        ...baseFields,
        fullAgenda: data.fullAgenda,
        facultyResponsible: data.facultyResponsible,
        associatedProfs: data.professors,
        requiredBudget: data.budget,
        fundingSource: data.fundingSource,
        extraRequiredResources: data.extraResources,
        capacity: data.capacity,
      };

    case "conference":
      return {
        ...baseFields,
        keynoteSpeaker: data.keynoteSpeaker,
        fullAgenda: data.fullAgenda,
        websiteLink: data.websiteLink,
        requiredBudget: data.requiredBudget,
        fundingSource: data.fundingSource,
        extraRequiredResources: data.extraRequiredResources,
        topics: data.topics,
      };

    default:
      // fallback for other future types (seminars, fairs, etc.)
      return baseFields;
  }
}
