"use client";

import React from "react";
import { Box } from "@mui/material";
import { AccentContainer, EventBox, DescriptionAccordion, DetailsAccordion } from ".";
import CustomButton from "../shared/Buttons/CustomButton";
import { ConferenceViewProps } from "./types";
import { ConferenceData } from "./helpers/Event";



const ConferenceView: React.FC<ConferenceViewProps> = ({ details, name, description, agenda }) => {
  return (
    <AccentContainer title="Conference" accent="primary">
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
        <ConferenceData details={details}/>
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

export default ConferenceView;


