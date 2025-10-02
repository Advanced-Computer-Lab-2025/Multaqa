import { Button } from "@/components/shared/mui";
import CustomButton from "@/components/Buttons/CustomButton";

import CustomIcon from "@/components/Icons/CustomIcon";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <CustomIcon icon="delete" />
      <CustomIcon icon="edit" size="small" />
      <CustomIcon icon="add" size="medium" />
      <CustomIcon icon="save" size="large" />
    </div>
  );
}