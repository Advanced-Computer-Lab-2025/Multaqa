export interface LoyaltyProgramFormValues {
  discountRate: number | "";
  promoCode: string;
  termsAndConditions: string;
  agreedToTerms: boolean;
}

export interface LoyaltyProgramResponse {
  message: string;
}

export interface LoyaltyProgramProps {
  isSubscribed: boolean;
  discountRate?: number;
  promoCode?: string;
  termsAndConditions?: string;
  onStatusChange?: () => void;
}
