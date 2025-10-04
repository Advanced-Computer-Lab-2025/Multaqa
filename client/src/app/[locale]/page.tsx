"use client";

import { useState } from "react";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import DeleteButton from "@/components/shared/Buttons/DeleteButton";
import CustomSearchBar from "@/components/shared/Searchbar/CustomSearchBar";
import CustomIcon from "@/components/shared/Icons/CustomIcon";
import CustomModal from "@/components/shared/modals/CustomModal";
import { CustomModalLayout } from "@/components/shared/modals";
import AppWrapper from '@/components/shared/FilterCard/example'; 

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <div className=" min-h-screen flex items-center justify-center gap-5 flex-col">
      <CustomModal 
        title="Confirm Action"
        description="Are you sure you want to proceed with this action? This cannot be undone."
        buttonOption1={{
          label: "Cancel",
          variant: "outlined",
          color: "secondary"
        }}
        // buttonOption2={{
        //   label: "Confirm",
        //   variant: "contained",
        //   color: "primary",
        //   onClick: () => console.log("Action confirmed!")
        // }}
      />
      <CustomButton onClick={() => setOpen(true)}>Open Modal Layout</CustomButton>
      <CustomModalLayout open={open} onClose={handleClose}>
        <div className="p-4">
          <h2 className="text-lg font-semibold">Modal Title</h2>
          <p className="mt-2">Modal content goes here.</p>
          <h2 className="text-lg font-semibold">Modal Title</h2>
          <p className="mt-2">Modal content goes here.</p>
          <h2 className="text-lg font-semibold">Modal Title</h2>
          <p className="mt-2">Modal content goes here.</p>
          <h2 className="text-lg font-semibold">Modal Title</h2>
          <p className="mt-2">Modal content goes here.</p>
        </div>
      </CustomModalLayout>
      <div className="flex items-center justify-center gap-5">
        <CustomButton
          variant="outlined"
          size="small"
          disableElevation
          label="Save"
        />
        <CustomButton
          variant="contained"
          size="small"
          disableElevation
          label="Submit"
        />
        <DeleteButton size="small" variant="contained" color="error" />
      </div>
      <CustomSearchBar icon={false} width="450px" type="outwards" />
      <CustomIcon icon="delete" size="small" containerType="inwards" />
      <CustomIcon icon="edit" size="large" containerType="outwards" border={false} />
      <AppWrapper />
    </div>
  );
}