export type CourtPaletteKey = 'primary' | 'secondary' | 'tertiary';

export interface CourtType {
  id: string;
  name: string;
  colorKey: CourtPaletteKey;
}

export type SlotStatus = 'available' | 'reserved' | 'yours';

export interface CourtSlot {
  id: string;
  courtTypeId: string;
  // ISO date (YYYY-MM-DD) to group by day
  day: string;
  start: string; // HH:mm
  end: string;   // HH:mm
  status: SlotStatus;
  reservedBy?: string; // user id/name if reserved
}

export interface CourtBoardProps {
  courts: CourtType[];
  slots: CourtSlot[];
  currentUser?: string;
  onReserve?: (slot: CourtSlot) => void;
  onCancel?: (slot: CourtSlot) => void;
  /**
   * When true, renders the board suitable for embedding inside portal pages
   * without forcing full-screen background and minHeight.
   */
  embedded?: boolean;
}
