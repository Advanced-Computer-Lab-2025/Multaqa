import { Button } from "@/components/shared/mui";
import CustomButton from "@/components/Buttons/CustomButton";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { CustomTextField, EmailField, PasswordField } from "@/components/shared/input-fields";
import { Person, Phone } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import NeumorphicBox from "@/components/shared/containers/NeumorphicBox";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        
        {/* Buttons Section */}
        <div className="flex items-center gap-5">
          <CustomButton variant="outlined" size="small" disableElevation label="Save" /> 
          <CustomButton variant="contained" size="small" disableElevation label="Submit" /> 
          <DeleteButton size="small" variant="contained" color="error"/>
        </div>

        {/* Input Fields Section */}
        <div className="flex flex-col gap-6 w-full">
          <h2 className="text-xl font-jost font-semibold text-center text-minsk-700">
            Test Input Fields
          </h2>
          
          <CustomTextField
            label="Full Name"
            fullWidth
            startIcon={
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            }
          />
          
          <CustomTextField
            label="Phone Number"
            fullWidth
            startIcon={
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            }
          />
          
          <EmailField
            stakeholderType="student"
            label="Student Email"
            showDomainHint={true}
            fullWidth
            size="small"
          />
          
          <EmailField
            stakeholderType="professor"
            label="Professor Email"
            showDomainHint={true}
            fullWidth
            size="small"
          />
          
          <PasswordField
            label="Password"
            fullWidth
          />
          
          <PasswordField
            label="Confirm Password"
            fullWidth
          />
        </div>
        

        <NeumorphicBox containerType="inwards" padding="24px" margin="0" width="100px" height="100px" borderRadius="9999px">
          Salma please 
        </NeumorphicBox>
      </div>
    </div>
  );
}