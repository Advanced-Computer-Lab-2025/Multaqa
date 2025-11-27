import { Poll, CreatePollDTO } from "@/types/poll";
import { VendorParticipationRequest } from "@/components/EventsOffice/VendorRequests/types";

// Mock data
const mockVendorRequests: VendorParticipationRequest[] = [
  {
    id: "req-1",
    vendorId: "v-1",
    vendorName: "Tasty Bites",
    vendorLogo: "https://placehold.co/100x100?text=TB",
    eventId: "evt-1",
    eventName: "Spring Fair",
    eventType: "platform_booth",
    status: "pending",
    startDate: "2025-04-01",
    endDate: "2025-04-05",
    submittedAt: "2025-03-01",
  },
  {
    id: "req-2",
    vendorId: "v-2",
    vendorName: "Tech Gadgets",
    vendorLogo: "https://placehold.co/100x100?text=TG",
    eventId: "evt-1",
    eventName: "Spring Fair",
    eventType: "platform_booth",
    status: "pending",
    startDate: "2025-04-01",
    endDate: "2025-04-05",
    submittedAt: "2025-03-02",
  },
  {
    id: "req-3",
    vendorId: "v-3",
    vendorName: "Book Worms",
    vendorLogo: "https://placehold.co/100x100?text=BW",
    eventId: "evt-1",
    eventName: "Spring Fair",
    eventType: "platform_booth",
    status: "pending",
    startDate: "2025-04-01",
    endDate: "2025-04-05",
    submittedAt: "2025-03-03",
  },
];

let mockPolls: Poll[] = [
  {
    id: "poll-1",
    title: "Spring Fair Booth Selection",
    description: "Vote for your favorite vendor to set up a booth at the Spring Fair!",
    startDate: "2025-03-10T00:00:00.000Z",
    endDate: "2025-03-20T00:00:00.000Z",
    isActive: true,
    createdAt: "2025-03-09T00:00:00.000Z",
    options: [
      {
        vendorId: "v-1",
        vendorName: "Tasty Bites",
        vendorLogo: "https://placehold.co/100x100?text=TB",
        voteCount: 15,
      },
      {
        vendorId: "v-2",
        vendorName: "Tech Gadgets",
        vendorLogo: "https://placehold.co/100x100?text=TG",
        voteCount: 23,
      },
    ],
  },
];

export const getVendorRequestsForPoll = async (): Promise<VendorParticipationRequest[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockVendorRequests.filter(r => r.eventType === 'platform_booth'));
    }, 500);
  });
};

export const createPoll = async (data: CreatePollDTO): Promise<Poll> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPoll: Poll = {
        id: `poll-${Date.now()}`,
        title: data.title,
        description: data.description,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        options: data.vendorRequestIds.map(reqId => {
          const req = mockVendorRequests.find(r => r.id === reqId);
          return {
            vendorId: req?.vendorId || "unknown",
            vendorName: req?.vendorName || "Unknown Vendor",
            vendorLogo: req?.vendorLogo,
            voteCount: 0,
          };
        }),
      };
      mockPolls.push(newPoll);
      resolve(newPoll);
    }, 1000);
  });
};

export const getActivePolls = async (): Promise<Poll[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPolls.filter(p => p.isActive));
    }, 500);
  });
};

export const votePoll = async (pollId: string, vendorId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const poll = mockPolls.find(p => p.id === pollId);
      if (poll) {
        const option = poll.options.find(o => o.vendorId === vendorId);
        if (option) {
          option.voteCount++;
        }
      }
      resolve();
    }, 500);
  });
};
