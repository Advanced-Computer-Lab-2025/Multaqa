import { CourtSlot } from './types';

export const groupSlotsByDay = (slots: CourtSlot[]) => {
  const map = new Map<string, CourtSlot[]>();
  for (const s of slots) {
    const key = s.day;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  // Sort each day's slots by start time
  for (const [, value] of map) {
    value.sort((a, b) => a.start.localeCompare(b.start));
  }
  return map; // Map<YYYY-MM-DD, CourtSlot[]>
};

export const formatDayLabel = (isoDay: string) => {
  const d = new Date(isoDay + 'T00:00:00');
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTimeRange = (start: string, end: string) => `${start} - ${end}`;
