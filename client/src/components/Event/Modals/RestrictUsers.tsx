import { CustomModalLayout } from '@/components/shared/modals';
import React from 'react'

interface RestrictUsersProps {
  eventId?:string;
  eventName?:string;
  eventType: string;
  open:boolean;
  onClose:()=>void;
  setRefresh:React.Dispatch<React.SetStateAction<boolean>>;
}

const RestrictUsers = ({eventId, eventName, eventType, open, onClose}: RestrictUsersProps) => {
  return (
    <CustomModalLayout open={open} onClose={onClose}>
        <div>Hello</div>
    </CustomModalLayout>
  )
}

export default RestrictUsers
