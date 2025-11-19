# Court Colors Update

**Date:** November 19, 2025

## Overview
The color mapping for the sports courts has been updated to visually distinguish the different court types using the existing project theme palette.

## Color Mappings

| Sport | Color Description | Theme Palette Key |
| :--- | :--- | :--- |
| **Basketball** | Orange | `warning` |
| **Football** | Dark Blue | `tertiary` |
| **Tennis** | Purple | `secondary` |

## Implementation Details

### Modified Files

1.  **`client/src/components/CourtBooking/types.ts`**
    *   Updated the `CourtPaletteKey` type definition to include `'warning'` as a valid option.

2.  **`client/src/components/CourtBooking/CourtsBookingContent.tsx`**
    *   Updated the `courtTypeMap` object to assign the specific palette keys to each sport.

3.  **`client/src/components/CourtBooking/SlotCard.tsx`**
    *   Updated the component `Props` interface to accept `'warning'` in the `color` property.

### Theme Reference
The colors are pulled from the Material UI theme configuration (`client/src/themes/lightTheme.ts`):
*   `theme.palette.warning.main` (Orange)
*   `theme.palette.tertiary.main` (Dark Blue)
*   `theme.palette.secondary.main` (Purple)
