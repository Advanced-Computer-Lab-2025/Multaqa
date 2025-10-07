"use client";
import { useState } from "react";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import DeleteButton from "@/components/shared/Buttons/DeleteButton";
import CustomSearchBar from "@/components/shared/Searchbar/CustomSearchBar";
import CustomIcon from "@/components/shared/Icons/CustomIcon";
import CustomModal from "@/components/shared/modals/CustomModal";
import { CustomModalLayout } from "@/components/shared/modals";
import CustomTextField from "@/components/shared/input-fields/CustomTextField";
import CustomSelectField from "@/components/shared/input-fields/CustomSelectField";
import AppWrapper from '@/components/shared/FilterCard/example'; 
import { CustomTextField, CustomSelectField, CustomCheckboxGroup, CustomRadio, CustomRating, CustomCheckbox } from "@/components/shared/input-fields";
import type { StakeholderType } from "@/components/shared/input-fields";


export default function HomePage() {
  
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    stakeholderType: StakeholderType | '';
  }>
  /* eslint-disable @typescript-eslint/no-explicit-any */

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // For now, just log the submitted form data
    // Replace with API submission as needed
    // eslint-disable-next-line no-console
    console.log(formData);
    handleClose();
  };


  return (
    <div className=" min-h-screen flex items-center justify-center gap-5 flex-col p-4">
      <CustomModal 
        modalType="delete"
        title="Confirm Action"
        description="Are you sure you want to proceed with this action? This cannot be undone."
        buttonOption1={{
          label: "Cancel",
          variant: "outlined",
          color: "secondary"
        }}
        buttonOption2={{
          label: "Confirm",
          variant: "contained",
          color: "primary",
          onClick: () => console.log("Action confirmed!")
        }}
      />
      <CustomButton onClick={() => setOpen(true)}>Open Modal Layout</CustomButton>
      <CustomModalLayout open={open} onClose={handleClose}>
        <div>
          <div className="flex flex-col gap-6">
            {/* First Name */}
            <CustomTextField
              fieldType="text"
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
              separateLabels
              neumorphicBox
              fullWidth
            />

            {/* Last Name */}
            <CustomTextField
              fieldType="text"
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
              neumorphicBox
              fullWidth
            />

            {/* Stakeholder Type Select */}
            <CustomSelectField
              label="Stakeholder Type"
              fieldType="single"
              options={[
                { label: "Student", value: "student" },
                { label: "Staff", value: "staff" },
                { label: "Vendor", value: "vendor" },
                { label: "Company", value: "company" }
              ]}
              value={formData.stakeholderType}
              onChange={(value) => handleInputChange('stakeholderType', value)}
              required
            />

            {/* Email Field - Tailored by stakeholder type */}
            {formData.stakeholderType && (
              <CustomTextField
                fieldType="email"
                label={`Email (${formData.stakeholderType})`}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                stakeholderType={formData.stakeholderType as any}
                required
                neumorphicBox
                fullWidth
              />
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3 mt-4">
              <CustomButton
                variant="outlined"
                label="Cancel"
                onClick={handleClose}
              />
              <CustomButton
                variant="contained"
                label="Sign Up"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </CustomModalLayout>

      {/* Display Submitted Data */}
      {submittedData && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-md">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#7851da' }}>Submitted Data:</h3>
          <div className="space-y-2">
            <p><strong>First Name:</strong> {submittedData.firstName}</p>
            <p><strong>Last Name:</strong> {submittedData.lastName}</p>
            <p><strong>Stakeholder Type:</strong> {submittedData.stakeholderType}</p>
            <p><strong>Email:</strong> {submittedData.email}</p>
          </div>
          <CustomButton
            variant="outlined"
            label="Clear"
            onClick={() => setSubmittedData(null)}
            size="small"
            sx={{ marginTop: '16px' }}
          />
        </div>
      )}
      <div className="flex items-center justify-center gap-5">
        <CustomButton
          color="tertiary"
          variant="contained"
          size="small"
          disableElevation
          label="Save"
        />
          <CustomButton
          variant="contained"
          size="small"
          disableElevation
          label="Apply"
          color="secondary"
        />
        <CustomButton
          variant="contained"
          size="small"
          disableElevation
          label="Submit"
        />
        <DeleteButton size="small" variant="contained" color="error" />
      </div>
      <CustomSearchBar icon={false} width="450px" type="outwards" label="Search Events..." />
      <CustomIcon icon="delete" size="small" containerType="inwards" />
      <CustomIcon icon="edit" size="large" containerType="outwards" border={false} />
        {/* Last Name */}
        <CustomTextField
              fieldType="text"
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
              neumorphicBox
              fullWidth
            />

            {/* Stakeholder Type Select */}
            <CustomSelectField
              label="Stakeholder Type"
              fieldType="single"
              options={[
                { label: "Student", value: "student" },
                { label: "Staff", value: "staff" },
                { label: "Vendor", value: "vendor" },
                { label: "Company", value: "company" }
              ]}
              value={formData.stakeholderType}
              onChange={(value) => handleInputChange('stakeholderType', value)}
              required
            />
            <CustomCheckboxGroup label="Food:" options={[
                { label: "Egg", value: "egg" },
                { label: "Burger", value: "burger" }
              ]}  helperText="choose your favorite"/>

      <AppWrapper />
    </div>
  );
}