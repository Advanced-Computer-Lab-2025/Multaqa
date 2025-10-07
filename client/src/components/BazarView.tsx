"use client";

import React from "react";
import { Box, ButtonProps } from "@mui/material";
import { AccentContainer, EventBox, DescriptionAccordion, DetailsAccordion } from "./Event";
import CustomButton from "./shared/Buttons/CustomButton";

export type BazarViewProps = {
  accent: ButtonProps["color"];
  details: Record<string, string>;
  name: string;
  description: string;
};


const BazarView: React.FC<BazarViewProps> = ({ accent, details, name, description }) => {
  return (
    <AccentContainer title="Bazaar" accent={accent}>
      <EventBox
        sections={[
          <DescriptionAccordion
            key="desc"
            name={name}
            description={description}
            accent={accent}
          />,
          <DetailsAccordion key="details" details={details}/>,
          <Box key="cta" sx={{ pt: 1, display:"flex", justifyContent:"center"}}>
            <CustomButton fullWidth size="large" variant="contained" color={accent} sx={{ borderRadius: 999 }}>
              Register
            </CustomButton>
          </Box>,
        ]}
      />
    </AccentContainer>
  );
};

export default BazarView;


