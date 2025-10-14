// app/create/page.jsx
"use client";
import React, { useState } from 'react';
import Create from '../../../components/shared/CreateConference/Create'; // Adjust path
import CustomModalLayout from '../../../components/shared/modals/CustomModalLayout'; // 💡 Adjust path
/**
 * Renders the Create Conference page within the CustomModalLayout.
 */
const CreateConferenceModalWrapper = () => {
  // 💡 State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(true); 

  // Handlers for modal control
  const handleClose = () => {
    setIsModalOpen(false);
    // 💡 Optional: Add logic here to redirect or navigate away after closing
    // console.log("Modal closed, navigating away...");
  };
  
  const modalWidthClass = "w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw]";
  return (
    <CustomModalLayout

      open={isModalOpen}
      onClose={handleClose}
      width={modalWidthClass}
      borderColor="#5A67D8" // Example color, adjust as needed
    >
      {/* 💡 The Create component becomes the content (children) of the modal */}
      <Create 
        // Note: The modal's onClose handler is passed to the overall component.
        // If Create has an internal Close button, you might need to pass handleClose 
        // down to handle modal closure from within the form flow.
      />
    </CustomModalLayout>
  );
};

export default CreateConferenceModalWrapper;