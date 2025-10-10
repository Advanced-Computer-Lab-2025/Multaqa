import Image from "next/image";
import NeumorphicBox from "../containers/NeumorphicBox";
import { BoothCurvePosition } from "../Booth/types";
import { Box } from "@mui/material";
import Booth from "../Booth/Booth";
import CheckIcon from "@mui/icons-material/Check";
import  {PlatformMapProps}  from "./types";

const mockBoothList: number[] = [1, 2, 3, 5, 6, 8, 9, 10]; // available ones mock data

const boothList: number[] = Array.from({ length: 10 }, (_, i) => i + 1); //10 booths

// Booth configuration based on the image layout
const boothConfigurations = [
  {
    id: 1,
    top: "33%",
    left: "18%",
    curvePosition: "upleft" as BoothCurvePosition,
  },
  {
    id: 2,
    top: "44%",
    left: "18%",
    curvePosition: "bottomleft" as BoothCurvePosition,
  },
  {
    id: 3,
    top: "33%",
    left: "78%",
    curvePosition: "upright" as BoothCurvePosition,
  },
  {
    id: 4,
    top: "44%",
    left: "78%",
    curvePosition: "bottomright" as BoothCurvePosition,
  },
  {
    id: 5,
    top: "55%",
    left: "18%",
    curvePosition: "upleft" as BoothCurvePosition,
  },
  {
    id: 6,
    top: "66%",
    left: "18%",
    curvePosition: "bottomleft" as BoothCurvePosition,
  },
  {
    id: 7,
    top: "55%",
    left: "78%",
    curvePosition: "upright" as BoothCurvePosition,
  },
  {
    id: 8,
    top: "66%",
    left: "78%",
    curvePosition: "bottomright" as BoothCurvePosition,
  },
  {
    id: 9,
    top: "80%",
    left: "38%",
    curvePosition: "bottomleft" as BoothCurvePosition,
  },
  {
    id: 10,
    top: "80%",
    left: "58%",
    curvePosition: "bottomright" as BoothCurvePosition,
  },
];

const PlatformMap: React.FC<PlatformMapProps> = ({
  onBoothSelect,
  selectedBooth: externalSelectedBooth,
}) => {
  const selectedBooth =
    externalSelectedBooth 

  const handleBoothClick = (boothId: number) => {
      onBoothSelect(boothId);
  };

  return (
    <NeumorphicBox
      containerType="inwards"
      width="600px"
      height="600px"
      borderRadius="20px"
      padding="1px"
      margin="2px"
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
        data-booths={boothList.join(",")}
      >
        {/* Platform Map Background */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "30px",
          }}
          data-booths={boothList.join(",")}
        >
          <Image
            src="/platformMap.svg"
            alt="Platform Map"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>

        {/* Booths positioned over the map */}
        {boothConfigurations.map((booth) => (
          <Box
            key={booth.id}
            sx={{
              position: "absolute",
              top: booth.top,
              left: booth.left,
              transform: "translate(-50%, -50%)", // Center the booth on the position
              zIndex: 2,
            }}
          >
            {/* selected icon from MUI if selected on top right corner */}
            {selectedBooth === booth.id && (
              <CheckIcon
                sx={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  color: "#4caf50",
                  backgroundColor: "#ffffff",
                  borderRadius: "50%",
                  zIndex: 11,
                  border: "2px solid #4caf50",
                }}
              />
            )}
            <Booth
              id={booth.id}
              isSelected={selectedBooth === booth.id}
              isAvailable={mockBoothList.includes(booth.id)}
              curvePosition={booth.curvePosition}
              onClick={handleBoothClick}
            />
          </Box>
        ))}
      </Box>
    </NeumorphicBox>
  );
};

export default PlatformMap;
