"use client";

import React from "react";
import { Box } from "@mui/material";
import { AccentContainer, EventBox, DescriptionAccordion, DetailsAccordion } from "./Event";
import CustomButton from "./shared/Buttons/CustomButton";
import { BazarViewProps } from "./types";


const TripView: React.FC<BazarViewProps> = ({ details, name, description }) => {
  return (
    <AccentContainer title="Trip" accent="tertiary">
      <EventBox
        sections={[
          <DescriptionAccordion
            key="desc"
            name={name}
            description={description}
            accent="tertiary"
          />,
          <DetailsAccordion key="details" details={details} accent="tertiary"/>,
          <Box key="cta" sx={{ display:"flex", justifyContent:"center", alignItems:"center"}}>
            <CustomButton fullWidth size="small" variant="contained" color="tertiary" sx={{ borderRadius: 999}}>
              Register
            </CustomButton>
          </Box>,
        ]}
      />
    </AccentContainer>
  );
};

export default TripView;


