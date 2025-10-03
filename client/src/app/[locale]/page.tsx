import { Button } from "@/components/shared/mui";
import CustomButton from "@/components/Buttons/CustomButton";
import DeleteButton from "@/components/Buttons/DeleteButton";
import SearchTextField from "@/components/SearchBar/SearchTextField";
import NeumorphicBox from "@/components/shared/containers/NeumorphicBox";

export default function HomePage() {
  return (
    <div className=" min-h-screen flex items-center justify-center gap-5 flex-col">
    <div className="flex items-center justify-center gap-5">
        <CustomButton variant="outlined" size="small" disableElevation  label="Save"  /> 
        <CustomButton variant="contained" size="small" disableElevation  label="Submit"  /> 
        <DeleteButton size="small" variant="contained" color="error"/>
    </div>
       <NeumorphicBox containerType="inwards" width="w-fit" borderRadius="50px" padding="2px">
        <SearchTextField id="outlined-suffix-shrink" fullWidth label="Search Events..." variant="outlined" size="small" sx={{width:300}}/>
       </NeumorphicBox>
    </div>
  );
}