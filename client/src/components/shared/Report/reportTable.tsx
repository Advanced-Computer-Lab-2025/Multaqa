"use client";

import React, { useMemo, useState, useEffect } from 'react';
import {
    Paper, TableContainer, Table, TableHead, TableRow, 
    TableCell, TableBody, Box, useTheme,
    Chip
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { ContentWrapper } from '../containers'; 
import { ATTENDEES_COLUMNS, SALES_COLUMNS } from './ReportData';
import { ReportRow } from './types';
import FilterPanel from "@/components/shared/FilterCard/FilterPanel";
import { FilterGroup, FilterOption } from '../FilterCard/types';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { api } from '@/api';
import { EventCardsListSkeleton } from '@/components/BrowseEvents/utils/EventCardSkeleton';
import EmptyState from '@/components/shared/states/EmptyState';
import ErrorState from '@/components/shared/states/ErrorState';

/**
 * Helper function to map backend event types to display format
 * @param type - Raw event type from API (e.g., 'conference', 'platform_booth')
 * @returns Capitalized display format (e.g., 'Conference', 'Booth')
 */
const mapEventType = (type: string): string => {
    const typeMap: Record<string, string> = {
        'conference': 'Conference',
        'trip': 'Trip',
        'bazaar': 'Bazaar',
        'workshop': 'Workshop',
        'platform_booth': 'Booth'
    };
    return typeMap[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

/**
 * Helper function to transform API event data to ReportRow format
 * @param event - Raw event object from /events endpoint
 * @returns Transformed ReportRow with calculated fields
 */
const transformEventToReportRow = (event: any): ReportRow => {
    let attendeesCount = 0;
    let revenue = 0;
    let totalSales = 0;
    
    // Handle different event types with specific calculation logic
    if (event.type === 'bazaar') {
        // For bazaar: count vendors who have paid
        if (Array.isArray(event.vendors) && event.vendors.length > 0) {
            const paidVendors = event.vendors.filter((vendor: any) => {
                // Check if RequestData exists and has required fields
                if (!vendor.RequestData) return false;
                if (typeof vendor.RequestData.hasPaid !== 'boolean') return false;
                if (typeof vendor.RequestData.participationFee !== 'number') return false;
                
                return vendor.RequestData.hasPaid === true;
            });
            
            attendeesCount = paidVendors.length;
            
            // Calculate revenue: sum of participation fees from paid vendors
            revenue = paidVendors.reduce((sum: number, vendor: any) => {
                const fee = vendor.RequestData?.participationFee || 0;
                return sum + fee;
            }, 0);
            
            totalSales = attendeesCount;
        }
        // If no vendors or invalid data, all values remain 0
    } else if (event.type === 'platform_booth') {
        // For booth: check if RequestData exists and has required fields
        if (event.RequestData && 
            typeof event.RequestData.hasPaid === 'boolean' && 
            typeof event.RequestData.participationFee === 'number') {
            
            if (event.RequestData.hasPaid === true) {
                attendeesCount = 1;
                totalSales = 1;
                revenue = event.RequestData.participationFee;
            }
            // If hasPaid is false, values remain 0
        }
        // If RequestData is missing or invalid, all values remain 0
    } else {
        // For other event types (trip, workshop): use standard attendees array
        attendeesCount = Array.isArray(event.attendees) ? event.attendees.length : 0;
        const price = event.price || 0;
        revenue = attendeesCount * price;
        totalSales = attendeesCount;
    }
    
    // Format date as YYYY-MM-DD
    const formattedDate = event.eventStartDate 
        ? new Date(event.eventStartDate).toISOString().split('T')[0] 
        : 'N/A';
    
    return {
        eventName: event.eventName || 'N/A',
        eventType: mapEventType(event.type || ''),
        attendeesCount,
        location: event.location || 'N/A',
        date: formattedDate,
        revenue,
        totalSales
    };
};

export const EVENT_TYPE_COLORS: Record<string, string> = {
    Trip: "#6e8ae6",
    Booth: "#2196f3",
    Conference: "#ff9800",
    Bazaar: "#e91e63",
    Workshop: "#9c27b0",
};

interface ReportTableProps {
    reportType: 'attendees' | 'sales';
}

const ReportTable: React.FC<ReportTableProps> = ({ reportType }) => {
    const theme = useTheme();

    // State for managing fetched events data from API
    const [eventsData, setEventsData] = useState<ReportRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch events data from API on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Call /events endpoint
                const response = await api.get('/events');
                const events = response.data?.data || [];
                
                console.log('📡 Raw events data from API:', events);
                
                // Filter logic based on report type:
                // - Attendees report: events must have valid data and eventStartDate
                // - Sales report: events must have revenue-generating data and eventStartDate
                // - Exclude all conference events from both reports
                const validEvents = events.filter((event: any) => {
                    // Exclude conference events
                    if (event.type && event.type.toLowerCase() === 'conference') {
                        return false;
                    }
                    
                    const hasStartDate = !!event.eventStartDate;
                    
                    // Check event type-specific requirements
                    if (event.type === 'bazaar') {
                        // Bazaar: needs vendors array and start date
                        // Shows in both attendees and sales reports
                        const hasVendors = event.vendors && Array.isArray(event.vendors);
                        return hasVendors && hasStartDate;
                    } else if (event.type === 'platform_booth') {
                        // Booth: always show if has start date
                        // Shows in both attendees and sales reports
                        return hasStartDate;
                    } else {
                        // Other event types (trip, workshop): use standard attendees array
                        const hasAttendees = event.attendees && Array.isArray(event.attendees);
                        const hasPrice = typeof event.price === 'number';
                        
                        if (reportType === 'attendees') {
                            // For attendees report: only need attendees and date (price optional)
                            return hasAttendees && hasStartDate;
                        } else {
                            // For sales report: need attendees, price, and date
                            return hasAttendees && hasPrice && hasStartDate;
                        }
                    }
                });
                
                console.log(`✅ Filtered ${validEvents.length} valid events for ${reportType} report out of ${events.length} total`);
                
                // Transform valid events to ReportRow format
                const transformedData = validEvents.map(transformEventToReportRow);
                console.log('🔄 Transformed report data:', transformedData);
                
                setEventsData(transformedData);
            } catch (err: any) {
                console.error('❌ Error fetching events:', err);
                setError(err?.response?.data?.message || err?.message || 'Failed to fetch events data');
                setEventsData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [reportType]); // Re-fetch when reportType changes

    const { columns, data, title, description } = useMemo(() => {
        const isSales = reportType === 'sales';
        return {
            title: isSales ? "Events Sales Report" : "Events Attendance Report",
            description: isSales
                ? "Review total revenue generated and sales performance across all events."
                : "View key attendance metrics and track visitor numbers for each event.",
            columns: isSales ? SALES_COLUMNS : ATTENDEES_COLUMNS,
            data: eventsData // Use fetched data instead of mock data
        };
    }, [reportType, eventsData]);

    // Define Filter State Types
    interface ReportFilters {
        eventType: string[];
        eventName: string[]; 
        date: string;
    }

    const [filters, setFilters] = useState<ReportFilters>({
        eventType: [],
        eventName: [],
        date: "",
    });

    const [eventOptions, setEventOptions] = useState<FilterOption[]>([]);

    // Generate Event Name options (label = original, value = lowercase)
    useEffect(() => {
        if (!data || data.length === 0) return;

        const uniqueNames = Array.from(
            new Set(data.map(row => row.eventName).filter(Boolean))
        );

        const options: FilterOption[] = uniqueNames
            .map(name => ({
                label: name,
                value: name.toLowerCase(),
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        setEventOptions(options);
    }, [data]);

    const getFilterGroups = (): FilterGroup[] => {
        const isSales = reportType === 'sales';

        const groups: FilterGroup[] = [
            { 
                id: "eventType", 
                title: "Event Type", 
                type: "chip", 
                options: [
                    { label: "Trip", value: "Trip" },
                    { label: "Booth", value: "Booth" },
                    { label: "Bazaar", value: "Bazaar" },
                    { label: "Workshop", value: "Workshop" }
                ]
            },
            { 
                id: "date", 
                title: "Date", 
                type: "date" 
            }
        ];

        // Only add Event Name filter for attendees report (and only if options are available)
        if (!isSales && eventOptions.length > 0) {
            groups.unshift({ 
                id: "eventName", 
                title: "Event Name", 
                type: "text", // FilterPanel handles multi-select chips for type="text" with options
                placeholder: "Search by event name",
                options: eventOptions
            });
        }

        return groups;
    };

    const handleFilterChange = (groupId: string, value: any) => {
        setFilters(prev => {
            const isMultiSelectChip = groupId === "eventType";
            const isTextMultiSelect = groupId === "eventName";
            
            // Handle Multi-Select Chip Filters (eventType)
            if (isMultiSelectChip) {
                const current = prev.eventType;
                if (current.includes(value)) {
                    // Remove if already selected
                    return { ...prev, eventType: current.filter(v => v !== value) };
                } else {
                    // Add new
                    return { ...prev, eventType: [...current, value] };
                }
            }

            // Handle Text Multi-Select (eventName) and Date
            let finalValue = value;
            if (isTextMultiSelect && Array.isArray(value)) {
                finalValue = value.map((v: string) => v.toLowerCase());
            }

            return { ...prev, [groupId]: finalValue || "" };
        });
    };

    const handleResetFilters = () => {
        setFilters({ eventType: [], eventName: [], date: "" });
    };

    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (columnId: string) => {
        if (columnId !== 'revenue' || reportType !== 'sales') return;

        setSortConfig(prev => {
            if (!prev || prev.key !== columnId) return { key: columnId, direction: 'asc' };
            if (prev.direction === 'asc') return { key: columnId, direction: 'desc' };
            return null;
        });
    };

    // Filter data
    const filteredData = useMemo(() => {
        return data.filter(row => {
            // Event Name: partial match on any selected term
            if (filters.eventName.length > 0) {
                const rowNameLower = (row.eventName || "").toLowerCase();
                // Check if the event name includes ANY of the selected (lowercase) terms
                const hasMatch = filters.eventName.some(term => rowNameLower.includes(term));
                if (!hasMatch) return false;
            }

            // Event Type: exact match
            if (filters.eventType.length > 0 && !filters.eventType.includes(row.eventType)) {
                return false;
            }

            // Date: exact match
            if (filters.date && row.date !== filters.date) {
                return false;
            }

            return true;
        });
    }, [data, filters]);

    // Sort filtered data (only revenue in sales)
    const sortedData = useMemo(() => {
        if (!sortConfig || reportType !== 'sales') return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig, reportType]);
    
    // Define the border style once
    const BORDER_STYLE = "1px solid #E0E0E0";


    return (
        <ContentWrapper title={title} description={description}>
            <Box sx={{ p: 0, mt: 4 }}> 

                {/* Loading State - Show skeleton while fetching data */}
                {loading && <EventCardsListSkeleton />}

                {/* Error State - Show error message if API call fails */}
                {error && (
                    <ErrorState
                        title={error}
                        description="Oops! Something went wrong while fetching the report data. Please try again later."
                        imageAlt="Error loading reports"
                    />
                )}

                {/* Empty State - No events available in database */}
                {!loading && !error && eventsData.length === 0 && (
                    <EmptyState
                        title="No events available"
                        description={
                            reportType === 'attendees'
                                ? "There are no events with attendees and date data in the system yet."
                                : "There are no events with complete sales data (attendees, price, and date) in the system yet."
                        }
                        imageAlt="No events illustration"
                    />
                )}

                {/* Show filters and table only when data is loaded successfully */}
                {!loading && !error && eventsData.length > 0 && (
                    <>
                        {/* Filter Panel */}
                        <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ mb: 2, mr: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <FilterPanel
                            filterGroups={getFilterGroups()}
                            onFilterChange={handleFilterChange}
                            currentFilters={filters}
                            onReset={handleResetFilters}
                        />
                    </LocalizationProvider>
                </Box>

                {/* Table */}
                <Paper elevation={3} sx={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0px 4px 15px rgba(0,0,0,.08)", mx: 2 }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader sx={{ tableLayout: "auto", width: "100%" }}>
                            <TableHead>
                                <TableRow>
                                    {columns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align || "left"}
                                            sx={{
                                                fontWeight: 600,
                                                fontFamily: "var(--font-poppins), sans-serif",
                                                color: "#666666",
                                                backgroundColor: theme.palette.grey[50],
                                                whiteSpace: "nowrap",
                                                minWidth: column.id === "eventName" ? 220 : 120,
                                                p: 1.5,
                                                // Added border bottom here for the header row
                                                borderRight: BORDER_STYLE,
                                                borderBottom: BORDER_STYLE, 
                                                // Removed border on the last column in the header
                                                "&:last-child": { borderRight: "none" },
                                                cursor: (column.id === 'revenue' && reportType === 'sales') ? 'pointer' : 'default',
                                            }}
                                            onClick={() => handleSort(column.id)}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {column.label}
                                                {column.id === 'revenue' && reportType === 'sales' && (
                                                    sortConfig?.key === column.id ? (
                                                        sortConfig.direction === 'asc' 
                                                            ? <ArrowUpward fontSize="small" sx={{color: "666666"}}/> 
                                                            : <ArrowDownward fontSize="small" sx={{color: "666666"}} />
                                                    ) : <SwapVertIcon fontSize="small" sx={{ color: "666666" }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {sortedData.map((row, i) => (
                                    <TableRow hover key={i} sx={{ height: 56 }}>
                                        {columns.map(column => {
                                            const value = row[column.id];

                                            const commonCellStyles = {
                                                // Apply vertical and bottom borders to body cells
                                                borderRight: BORDER_STYLE,
                                                borderBottom: BORDER_STYLE,
                                                // Remove right border from the last column
                                                "&:last-child": { borderRight: "none" },
                                                // Remove bottom border from the last row
                                                "& tr:last-child &": { borderBottom: "none" }, 
                                                fontFamily: "var(--font-poppins), sans-serif",
                                                whiteSpace: "nowrap",
                                            };

                                            if (column.id === "eventType") {
                                                const color = EVENT_TYPE_COLORS[value] || theme.palette.grey[500];
                                                return (
                                                    <TableCell 
                                                        key={column.id} 
                                                        sx={commonCellStyles}
                                                    >
                                                        <Chip
                                                            label={value}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ 
                                                                borderColor: color, 
                                                                color,
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                    </TableCell>
                                                );
                                            }

                                            return (
                                                <TableCell 
                                                    key={column.id} 
                                                    align={column.align || "left"}
                                                    sx={commonCellStyles}
                                                >
                                                    {column.format ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Empty State - No events match current filters */}
                {sortedData.length === 0 && (
                    <EmptyState
                        title="No events found"
                        description="No events match your current filter selections. Try adjusting your filters."
                        imageAlt="No matching events illustration"
                    />
                )}
                    </>
                )}
            </Box>
        </ContentWrapper>
    );
};

export default ReportTable;