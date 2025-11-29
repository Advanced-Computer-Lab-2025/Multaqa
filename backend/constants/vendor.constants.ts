// Vendor participation fees in USD
export const VENDOR_PARTICIPATION_FEES = {
  PLATFORM_BOOTH: 100, // $100 for platform booth
  BAZAAR: 150, // $150 for bazaar participation
} as const;

export type VendorEventType = keyof typeof VENDOR_PARTICIPATION_FEES;
