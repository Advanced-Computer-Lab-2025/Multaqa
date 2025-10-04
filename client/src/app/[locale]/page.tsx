"use client";

import { useState } from "react";
import CustomButton from "@/components/Buttons/CustomButton";
import DeleteButton from "@/components/Buttons/DeleteButton";
import SearchTextField from "@/components/SearchBar/SearchTextField";
import CustomTextField from "@/components/shared/input-fields/CustomTextField";
import CustomRating from "@/components/shared/input-fields/CustomRating";
import CustomCheckbox from "@/components/shared/input-fields/CustomCheckbox";
import CustomCheckboxGroup from "@/components/shared/input-fields/CustomCheckboxGroup";
import CustomSelectField from "@/components/shared/input-fields/CustomSelectField";
import NeumorphicBox from "@/components/shared/containers/NeumorphicBox";

export default function HomePage() {
  const [selectedValue, setSelectedValue] = useState<string | number | string[] | number[]>("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className=" min-h-screen flex items-center justify-center gap-5 flex-col">
      <div className="flex items-center justify-center gap-5">
        <CustomButton variant="outlined" size="small" disableElevation label="Save" />
        <CustomButton variant="contained" size="small" disableElevation label="Submit" />
        <DeleteButton size="small" variant="contained" color="error" />
      </div>
      <NeumorphicBox containerType="inwards" width="w-fit" borderRadius="50px" padding="2px">
        <SearchTextField id="outlined-suffix-shrink" fullWidth label="Search Events..." variant="outlined" size="small" sx={{width:300}}/>
      </NeumorphicBox>
      <div className="flex items-center justify-center gap-5 flex-col">
        <CustomTextField 
          fieldType="email" 
          label="Email" 
          stakeholderType="student" 
          neumorphicBox 
        />
        <CustomTextField 
          fieldType="email" 
          label="Email" 
          stakeholderType="staff" 
          neumorphicBox 
          disableDynamicMorphing 
        />
        <CustomTextField fieldType="email" label="Email" stakeholderType="vendor" />
        <CustomTextField fieldType="text" label="Username" />
        <CustomTextField fieldType="password" label="Password" />
        <CustomTextField fieldType="numeric" label="Phone Number" />
      </div>

      <CustomRating name="venue-rating" defaultValue={3.5} precision={0.5} />
      <CustomRating name="venue-rating-read" defaultValue={4} precision={0.5} readOnly />
      <CustomRating name="venue-rating" defaultValue={3.5} precision={0.5} multaqaFill />
      <CustomRating name="venue-rating-read" defaultValue={4} precision={0.5} readOnly multaqaFill />

      <div className="flex items-center justify-center gap-5">
        <CustomCheckbox defaultChecked size="small" />
        <CustomCheckbox defaultChecked size="medium" />
        <CustomCheckbox defaultChecked sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }} />
        <CustomCheckbox defaultChecked multaqaFill={false} />
      </div>

      <div className="flex items-center justify-center gap-8">
        <CustomCheckboxGroup
          label="What amenities do you prefer?"
          options={[
            { label: "WiFi", value: "wifi", checked: true },
            { label: "Parking", value: "parking" },
            { label: "Catering", value: "catering", checked: true },
            { label: "AV Equipment", value: "av" },
          ]}
          onChange={(values) => console.log("Selected:", values)}
        />

        <CustomCheckboxGroup
          label="Event Type (Row Layout)"
          options={[
            { label: "Workshop", value: "workshop" },
            { label: "Conference", value: "conference" },
            { label: "Seminar", value: "seminar" },
          ]}
          row
          size="small"
        />
      </div>

      <div className="flex items-center justify-center gap-8">
        <CustomCheckboxGroup
          label="Select your gender"
          options={[
            { label: "Female", value: "female", checked: true },
            { label: "Male", value: "male" },
            { label: "Other", value: "other" },
          ]}
          enableMoreThanOneOption={false}
          // onRadioChange={(value) => console.log("Selected gender:", value)}
        />

        <CustomCheckboxGroup
          label="Preferred event duration (Row Layout)"
          options={[
            { label: "1-2 hours", value: "short" },
            { label: "Half day", value: "half" },
            { label: "Full day", value: "full" },
          ]}
          enableMoreThanOneOption
          row
          size="small"
          // onRadioChange={(value) => console.log("Selected duration:", value)}
        />

        <div className="w-[600px]">
          <CustomSelectField
            label="Select Option"
            fieldType="single"
            neumorphicBox={true}
            options={[
              { label: "Option 1", value: "opt1" },
              { label: "Option 2", value: "opt2" },
              { label: "Option 3", value: "opt3" },
              { label: "Disabled", value: "disabled", disabled: true }
            ]}
            value={selectedValue}
            onChange={(value) => setSelectedValue(value)}
            placeholder="New custom version..."
            placeholderStyle={isFocused ? '' : 'transparent'}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>
    </div>
  );
}