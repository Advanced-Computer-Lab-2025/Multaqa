import { Button } from "@/components/shared/mui";
import CustomButton from "@/components/Buttons/CustomButton";
import DeleteButton from "@/components/Buttons/DeleteButton";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center gap-5">

        <CustomButton variant="outlined" size="small" disableElevation  label="Save"  /> 
        <CustomButton variant="contained" size="small" disableElevation  label="Submit"  /> 
        <DeleteButton size="small" variant="contained" color="error"/>
    
    </div>
  );
}