import { Button } from "@/components/shared/mui";
import CustomButton from "@/components/Buttons/CustomButton";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center gap-5">

        <CustomButton variant="outlined" size="medium" disableElevation  label="Save"  /> 
        <CustomButton variant="contained" size="medium" disableElevation  label="Submit"  /> 
    
    </div>
  );
}