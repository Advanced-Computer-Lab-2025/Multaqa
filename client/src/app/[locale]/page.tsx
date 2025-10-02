import { Button } from "@/components/shared/mui";
import CustomButton from "@/components/Buttons/CustomButton";
import DeleteButton from "@/components/Buttons/DeleteButton";
import SearchTextField from "@/components/SearchBar/SearchTextField";
import CustomTextField from "@/components/shared/input-fields/CustomTextField";

export default function HomePage() {
  return (
    <div className=" min-h-screen flex items-center justify-center gap-5 flex-col">
      <div className="flex items-center justify-center gap-5">
        <CustomButton variant="outlined" size="small" disableElevation label="Save" />
        <CustomButton variant="contained" size="small" disableElevation label="Submit" />
        <DeleteButton size="small" variant="contained" color="error" />
        <SearchTextField placeholder="Search..." />
      </div>
      <div className="flex items-center justify-center gap-5 flex-col">
        <CustomTextField fieldType="email" label="Email Address" variant="standard" />
        <CustomTextField fieldType="text" label="Username" variant="standard" />
        <CustomTextField fieldType="password" label="Password" variant="standard" />
        <CustomTextField fieldType="numeric" label="Phone Number" variant="standard" />
      </div>
    </div>
  );
}