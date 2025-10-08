"use client";

import React from "react";
import { Box } from "@mui/material";
import { AccentContainer, EventBox, DescriptionAccordion, DetailsAccordion } from "./Event";
import CustomButton from "./shared/Buttons/CustomButton";

export type BazarViewProps = {
  details: Record<string, string>;
  name: string;
  description: string;
};


const BazarView: React.FC<BazarViewProps> = ({ details, name, description }) => {
  return (
    <AccentContainer title="Bazaar" accent="info">
      <EventBox
        sections={[
          <DescriptionAccordion
            key="desc"
            name={name}
            description={description}
            accent="info"
          />,
          <DetailsAccordion key="details" details={details} accent="info"/>,
          <Box key="cta" sx={{ display:"flex", justifyContent:"center", alignItems:"center"}}>
            <CustomButton fullWidth size="small" variant="contained" color="info" sx={{ borderRadius: 999}}>
              Register
            </CustomButton>
          </Box>,
        ]}
      />
    </AccentContainer>
  );
};

export default BazarView;


