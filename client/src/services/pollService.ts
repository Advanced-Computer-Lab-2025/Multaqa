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

const DAY_IN_MS = 86_400_000;

const createInitialMockPolls = (): Poll[] => {
  const now = Date.now();
  const dateWithOffset = (offsetDays: number) => new Date(now + offsetDays * DAY_IN_MS).toISOString();

  return [
    {
      id: "poll-1",
      title: "Spring Fair Booth Selection",
      description: "Vote for your favorite vendor to set up a booth at the Spring Fair!",
      startDate: dateWithOffset(-1),
      endDate: dateWithOffset(6),
      isActive: true,
      createdAt: dateWithOffset(-2),
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
    {
      id: "poll-2",
      title: "Campus Coffee Showdown",
      description: "Which coffee cart should take the featured morning slot?",
      startDate: dateWithOffset(0),
      endDate: dateWithOffset(9),
      isActive: true,
      createdAt: dateWithOffset(-1),
      options: [
        {
          vendorId: "v-10",
          vendorName: "Bean There Done That",
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bean",
          voteCount: 34,
        },
        {
          vendorId: "v-11",
          vendorName: "Daily Grind",
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grind",
          voteCount: 27,
        },
        {
          vendorId: "v-12",
          vendorName: "Brewed Awakening",
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brew",
          voteCount: 19,
        },
      ],
    },
    {
      id: "poll-3",
      title: "Lunch Truck Throwdown",
      description: "Pick the two food trucks you want to see every Wednesday!",
      startDate: dateWithOffset(-10),
      endDate: dateWithOffset(-3),
      isActive: false,
      createdAt: dateWithOffset(-12),
      options: [
        {
          vendorId: "v-20",
          vendorName: "Wok This Way",
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wok",
          voteCount: 41,
        },
        {
          vendorId: "v-21",
          vendorName: "Taco 'Bout It",
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taco",
          voteCount: 52,
        },
        {
          vendorId: "v-22",
          vendorName: "Burger Bus",
          vendorLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Burger",
          voteCount: 33,
        },
      ],
    },
  ];
};

let mockPolls: Poll[] = createInitialMockPolls();

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
      const now = Date.now();
      resolve(
        mockPolls.filter((poll) => poll.isActive && new Date(poll.endDate).getTime() > now)
      );
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
