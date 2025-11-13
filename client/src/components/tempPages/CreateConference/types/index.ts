import dayjs from 'dayjs';
import { FormEvent } from 'react';

export interface EventFormData {
    eventName:string,
    eventStartDate:dayjs.Dayjs | null,
    eventEndDate:dayjs.Dayjs | null,
    location:string,
    description:string,
    fullAgenda: string,
    websiteLink: string, 
    requiredBudget:string,
    fundingSource:string,
    extraRequiredResources:string[],
    registrationDeadline:string
}

export interface Step1Props {
    onClose: () => void;
}

export interface Step2Props {
    onClose: () => void;
}