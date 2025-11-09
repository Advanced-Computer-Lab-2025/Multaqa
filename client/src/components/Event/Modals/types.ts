export interface Review {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type EventSection = 'general' | 'details' | 'reviews'|'agenda';

export interface EventDetailsProps {
  color: string;
  title: string;
  eventType: string;
  description: string;
  agenda?:string;
  details: Record<string, any>;
  reviews?: Review[];
  button?:React.ReactNode;
  onSubmitReview?: (rating: number, comment: string) => void;
  sections?: EventSection[];
  user:string;
  attended?:boolean;
}

// Mock data for reviews
export const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    rating: 4,
    comment: 'The workshop was very informative and engaging!',
    createdAt: '2025-11-06T10:00:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    firstName: 'Sarah',
    lastName: 'Smith',
    rating: 5,
    comment: 'Excellent content and well-organized event.',
    createdAt: '2025-11-05T15:30:00Z'
  },
  {
    id: '3',
    userId: 'user2',
    firstName: 'Sarah',
    lastName: 'Smith',
    rating: 5,
    comment: 'Excellent content and well-organized event.',
    createdAt: '2025-11-05T15:30:00Z'
  },
  {
    id: '4',
    userId: 'user2',
    firstName: 'Sarah',
    lastName: 'Smith',
    rating: 5,
    comment: 'Excellent content and well-organized event.',
    createdAt: '2025-11-05T15:30:00Z'
  }
];