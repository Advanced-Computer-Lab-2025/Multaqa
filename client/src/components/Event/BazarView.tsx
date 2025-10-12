"use client";

import React from "react";
import { Box } from "@mui/material";
import { BazarViewProps } from "./types";
import CustomButton from "../shared/Buttons/CustomButton";
import { AccentContainer, EventBox, DescriptionAccordion, DetailsAccordion } from ".";

const BazarView: React.FC<BazarViewProps> = ({ details, name, description }) => {
  return (
    <AccentContainer title="Bazaar" accent="primary">
      <EventBox
        sections={[
          <DescriptionAccordion
            key="desc"
            name={name}
            description={description}
            accent="primary"
          />,
          <DetailsAccordion key="details" details={details} accent="primary"/>,
          <Box key="cta" sx={{ display:"flex", justifyContent:"center", alignItems:"center"}}>
            {/* <CustomButton fullWidth size="small" variant="contained" color="primary" sx={{ borderRadius: 999}}>
              Register
            </CustomButton> */}
          </Box>
        ]}
      />
    </AccentContainer>
  );
};

export default BazarView;


