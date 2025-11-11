"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CustomAccordionProps } from "./types";
import {
  StyledAccordion,
  StyledAccordionSummary,
  StyledAccordionDetails,
  SummaryDescription,
  SummaryTitle,
  SummaryContent,
} from "./styles";

const CustomAccordion: React.FC<CustomAccordionProps> = ({
  title,
  description,
  children,
  ...props
}) => {
  return (
    <StyledAccordion disableGutters square elevation={0} {...props}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <SummaryContent>
          <SummaryTitle variant="h6">{title}</SummaryTitle>
          {description && (
            <SummaryDescription variant="body2">
              {description}
            </SummaryDescription>
          )}
        </SummaryContent>
      </StyledAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default CustomAccordion;


