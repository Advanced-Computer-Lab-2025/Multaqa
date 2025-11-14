type BackendReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
};

type FrontendReview = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const frameData = (data: BackendReview[]): FrontendReview[] => {
  return data.map((item) => ({
    id: item.id,
    userId: item.reviewer.id,
    firstName: item.reviewer.firstName,
    lastName: item.reviewer.lastName,
    rating: item.rating,
    comment: item.comment,
    createdAt: item.createdAt,
  }));
};
