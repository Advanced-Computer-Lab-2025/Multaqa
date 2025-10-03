/*import { Button } from "@/components/shared/mui";
import CustomButton from "@/components/Buttons/CustomButton";
import DeleteButton from "@/components/Buttons/DeleteButton";
import SearchTextField from "@/components/SearchBar/SearchTextField";

export default function HomePage() {
  return (
    <div className=" min-h-screen flex items-center justify-center gap-5 flex-col">
    <div className="flex items-center justify-center gap-5">
        <CustomButton variant="outlined" size="small" disableElevation  label="Save"  /> 
        <CustomButton variant="contained" size="small" disableElevation  label="Submit"  /> 
        <DeleteButton size="small" variant="contained" color="error"/>
    </div>
       
    </div>
  );
}*/

// src/app/page.tsx (Temporary change for demo)

// Path: From src/app/ -> ../mui/Example
import AppWrapper from '../../components/FilterCard/example'; 

export default function HomePage() {
  // This will now render the FilterBox demo
  return <AppWrapper />; 
}