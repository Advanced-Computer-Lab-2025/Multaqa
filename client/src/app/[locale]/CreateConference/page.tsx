"use client";
import React, { useState } from 'react';
import Create from '../../../components/tempPages/CreateConference/CreateConference'; // Adjust path
import CustomModalLayout from '../../../components/shared/modals/CustomModalLayout'; // 💡 Adjust path

const CreateConferenceModalWrapper = () => {
  return (
      <Create open={false} onClose={() => console.log("")} setRefresh={() => console.log("")}/>
  );
};

export default CreateConferenceModalWrapper;