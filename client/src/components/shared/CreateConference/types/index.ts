import { FormEvent } from 'react';

export interface EventFormData {
    eventName:string,
    eventStartDate:string,
    location:string,
    eventEndDate:string,
    eventStartTime:string,
    eventEndTime:string,
    description:string,
    fullAgenda: string,
    websiteLink: string, 
    requiredBudget:string,
    fundingSource:string,
    extraRequiredResources:string[] 
}

export interface Step1Props {
    onClose: () => void;
}

export interface Step2Props {
    onClose: () => void;
    onFinalSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void;
}