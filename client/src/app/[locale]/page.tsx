import { Button } from "@/components/shared/mui";
import CustomButton from "@/components/Buttons/CustomButton";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
       <CustomButton variant="contained" size="small" disableElevation  label="Register Here"/> 
    </div>
  );
}