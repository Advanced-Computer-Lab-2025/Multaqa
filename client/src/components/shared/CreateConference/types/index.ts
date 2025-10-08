// components/Create/types/CreateTypes.ts (New Interface)

// Structure for the data that will live in the parent component (Create.tsx)
export interface EventFormData {
    // Box 1 Fields
    name: string;
    description: string;
    // Box 2 Fields (Partial list for demonstration)
    startDate: string;
    endDate: string;
    budget: string;
    website: string;
    agenda: string;
    resources: string[]; // Assuming resources is an array of strings
    fundingSource: string;
    extraResources: string[]; // New field for extra resources
    // Add any other fields from Box 2 here...
}

// Interface for the handlers passed down by the parent
export interface FormHandlerProps {
    // Handler for updating *any* single field
    onFieldChange: (field: keyof EventFormData, value: any) => void;
    // Handler for finalizing the form
    onFinalSubmit: () => void;
    // Handler for closing the flow
    onClose: () => void;
}

// Minimal props interfaces updated to use the common handler
export interface Step1Props extends FormHandlerProps {}
export interface Step2Props extends FormHandlerProps {
    onBack: () => void;
    onFinalSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
}