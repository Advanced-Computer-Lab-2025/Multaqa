export interface CheckoutSessionData {
  sessionId: string;
  url: string | null;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  message: string;
  data: CheckoutSessionData;
}
