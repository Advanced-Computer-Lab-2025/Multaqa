// ReportData.ts

import { ReportColumn, ReportRow} from './types';

// --- ATTENDEES REPORT ---
export const ATTENDEES_COLUMNS: ReportColumn[] = [
    { id: 'eventName', label: 'Event Name', minWidth: 200, align: 'left' },
    { id: 'eventType', label: 'Event Type', minWidth: 100, align: 'left' }, // NEW
    { id: 'attendeesCount', label: 'Attendees', minWidth: 100, align: 'left' },
    { id: 'location', label: 'Location', minWidth: 150, align: 'left' },
    { id: 'date', label: 'Date', minWidth: 150, align: 'left' },
];

export const MOCK_ATTENDEES_DATA: ReportRow[] = [
    { eventName: 'Torathna 2', eventType: 'Bazaar', attendeesCount: 450, location: 'Platform 2',date: '2025-10-21' },
    { eventName: 'Inspire Bazaar', eventType: 'Conference', attendeesCount: 120, location: 'Hall A', date: '2025-11-11' },
    { eventName: 'Tech Summit', eventType: 'Trip', attendeesCount: 980, location: 'Auditorium', date: '2025-09-01'},
];

// --- SALES/REVENUE REPORT ---
export const SALES_COLUMNS: ReportColumn[] = [
    { id: 'eventName', label: 'Event Name', minWidth: 200, align: 'left' },
    { id: 'eventType', label: 'Event Type', minWidth: 100, align: 'left' }, 
    { 
        id: 'revenue', 
        label: 'Total Revenue', 
        minWidth: 150, 
        align: 'left', 
        format: (value: number) => `$${value.toFixed(2)}` 
    },
    { id: 'totalSales', label: 'Total Sales', minWidth: 100, align: 'left' },
    { id: 'date', label: 'Date', minWidth: 150, align: 'left' },
];

export const MOCK_SALES_DATA: ReportRow[] = [
    { eventName: 'Torathna 2', eventType: 'Bazaar', revenue: 15490.50, totalSales: 250, date: '2025-10-21' },
    { eventName: 'Inspire Bazaar', eventType: 'Conference', revenue: 5440.00, totalSales: 120, date: '2025-11-11' },
    { eventName: 'Tech Summit', eventType: 'Trip', revenue: 9200.75, totalSales: 350, date: '2025-09-01' },
];
