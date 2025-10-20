"use client";
import React, { useState } from 'react';
import Create from '../../../components/shared/CreateConference/CreateConference'; // Adjust path
import CustomModalLayout from '../../../components/shared/modals/CustomModalLayout'; // 💡 Adjust path

const CreateConferenceModalWrapper = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); 

  const handleClose = () => {
    setIsModalOpen(false);
  };
  
  const modalWidthClass = "w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw]";
  return (
    <CustomModalLayout
      open={isModalOpen}
      onClose={handleClose}
      width={modalWidthClass}
      borderColor="#5A67D8"
    >
      <Create open={false} onClose={() => console.log("")} setRefresh={() => console.log("")}/>
    </CustomModalLayout>
  );
};

export default CreateConferenceModalWrapper;