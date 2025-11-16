"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import ConferenceDetails from './Details/ConferenceDetails';
import WorkshopDetails from './Details/WorkshopDetails';
import BazaarDetails from './Details/BazaarDetails';
import BoothDetails from './Details/BoothDetails';
import TripDetails from './Details/TripDetails';
import { mapDetailsToType } from './utils/detailsMapper';
import ExportButton from '@/components/shared/ExportButton/ExportButton';

interface EventTypeDetailsProps {
  type: string;
  details: Record<string, any>;
  color: string;
}


const EventTypeDetails: React.FC<EventTypeDetailsProps> = ({ type, details, color }) => {
  const mappedDetails = mapDetailsToType(type, details, color);

  if (!mappedDetails) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No additional details available</Typography>
      </Box>
    );
  }

  const renderContent = () => {
    switch (type.toLowerCase()) {
      case 'conference':
        return <ConferenceDetails {...mappedDetails} />;
      case 'workshop':
        return <WorkshopDetails {...mappedDetails} />;
      case 'bazaar':
        return <BazaarDetails {...mappedDetails} />;
      case 'booth':
        return <BoothDetails {...mappedDetails} />;
      case 'trip':
        return <TripDetails {...mappedDetails} />;
      default:
        return <Typography>No additional details available</Typography>;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {renderContent()}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        {type.toLowerCase() !== "conference" && (
          <ExportButton
            onClick={() => {
            }}
            sx={{ width: "fit-content", mr: 3}}
          />
        )}
      </Box>
    </Box>
  );
};

export default EventTypeDetails;
