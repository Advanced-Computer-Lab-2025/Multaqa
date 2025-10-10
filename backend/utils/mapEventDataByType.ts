// utils/mapEventDataByType.ts
export function mapEventDataByType(type: string, data: any) {
  // Shared base fields across ALL event types
  const baseFields = {
    type: data.type,
    eventName: data.eventName,
    eventStartDate: data.eventStartDate,
    eventEndDate: data.eventEndDate,
    eventStartTime: data.eventStartTime,
    eventEndTime: data.eventEndTime,
    registrationDeadline: data.registrationDeadline,
    location: data.location,
    description: data.description,
  };

  switch (type) {
    case "workshop":
      return {
        ...baseFields,
        fullAgenda: data.fullAgenda,
        facultyResponsible: data.facultyResponsible,
        associatedProfs: data.associatedProfs,
        requiredBudget: data.requiredBudget,
        fundingSource: data.fundingSource,
        extraRequiredResources: data.extraRequiredResources,
        capacity: data.capacity,
        createdBy: data.createdBy,
        price: data.price,
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

    case "bazaar":
      return {
        ...baseFields,
      };

    case "trip":
      return {
        ...baseFields,
        capacity: data.capacity,
        price: data.price,
      };

    default:
      return baseFields;
  }
}
