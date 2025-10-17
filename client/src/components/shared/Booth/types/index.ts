export type BoothCurvePosition =
  | "upleft"
  | "upright"
  | "bottomleft"
  | "bottomright";

export interface boothProps {
  id: number;
  isSelected?: boolean;
  isAvailable?: boolean;
  curvePosition?: BoothCurvePosition;
  onClick?: (id: number) => void; 
}
