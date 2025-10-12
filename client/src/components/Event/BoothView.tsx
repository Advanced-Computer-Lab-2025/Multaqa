"use client";

import React from "react";
import { Box } from "@mui/material";
import { AccentContainer, EventBox } from ".";
import CustomButton from "../shared/Buttons/CustomButton";
import { BoothViewProps } from "./types";
import { BoothData } from "./helpers/Event";

const BoothView: React.FC<BoothViewProps> = ({ company, people, details }) => {
  return (
    <AccentContainer title="Booth" accent="primary">
      <EventBox
        sections={[
          <BoothData company={company } people={people} details={details}/>
          ,
          <Box key="cta" sx={{ display:"flex", justifyContent:"center", alignItems:"center"}}>
            {/* <CustomButton fullWidth size="small" variant="contained" color="primary" sx={{ borderRadius: 999}}>
              Register
            </CustomButton> */}
          </Box>,
        ]}
      />
    </AccentContainer>
  );
};

export default BoothView;


