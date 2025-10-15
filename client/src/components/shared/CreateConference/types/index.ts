import { FormEvent } from 'react';

export interface EventFormData {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    budget: string;
    website: string;
    agenda: string;
    resources: string[]; 
    fundingSource: string;
    extraResources: string[]; 
}

export interface Step1Props {
    onClose: () => void;
}

export interface Step2Props {
    onClose: () => void;
    onFinalSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void;
}