import { ButtonProps, Theme } from "@mui/material";
import { useParams } from "next/navigation";


// Resolve a Button color to its palette entry in a type-safe way
export const resolveButtonPalette = (
  theme: Theme,
  color: ButtonProps["color"]
) => {
  if (!color || color === "inherit") return theme.palette.primary;
  return theme.palette[color];
};

// export default function extractEntity(){
//   const params = useParams();
//   const entity = params.entity;
//   const userRole = mapEntityToRole(entity);
//   return userRole;
// }