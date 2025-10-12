"use client";

import React from "react";
import { Box } from "@mui/material";
import { AccentContainer, EventBox, DescriptionAccordion, DetailsAccordion } from ".";
import CustomButton from "../shared/Buttons/CustomButton";
import { ConferenceViewProps } from "./types";
import { WorkshopData } from "./helpers/Event";



const WorkshopView: React.FC<ConferenceViewProps> = ({ details, name, description, agenda }) => {
  return (
    <AccentContainer title="Workshop" accent="primary">
      <EventBox
        sections={[
          <DescriptionAccordion
            key="desc"
            name={name}
            description={description}
            accent="primary"
          />,
          <DescriptionAccordion
          key="desc"
          name={"Full Agenda"}
          description={agenda}
          accent="primary"
        />,
        <WorkshopData details={details} name={""} description={""} agenda={""} />
          ,
          <Box key="cta" sx={{ display:"flex", justifyContent:"center", alignItems:"center"}}>
            <CustomButton fullWidth size="small" variant="contained" color="primary" sx={{ borderRadius: 999}}>
              Register
            </CustomButton>
          </Box>,
        ]}
      />
    </AccentContainer>
  );
};

export default WorkshopView;


