// boothSize.constants.ts
export const BoothSizeEnum = ["2x2", "4x4"] as const;
export type BoothSize = (typeof BoothSizeEnum)[number];
