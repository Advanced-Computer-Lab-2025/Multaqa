// ReportTable.types.ts

export interface ReportRow {
    [key: string]: any;
}

export interface ReportColumn {
    id: string; 
    label: string; 
    minWidth?: number;
    format?: (value: any) => string; 
    align?: 'left' | 'right' | 'center'; 
}
