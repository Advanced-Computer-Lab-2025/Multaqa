"use client";
import { useTheme } from "@mui/material/styles";
import CustomModalLayout from "../../../components/shared/modals/CustomModalLayout";
import BazarForm from "../../../components/shared/BazarApplicationForm/BazarApplicationForm";

interface BazarFormModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  bazarId: string;
  location: string;
}

const BazarFormModalWrapper: React.FC<BazarFormModalWrapperProps> = ({
  isOpen,
  onClose,
  bazarId,
  location,
}) => {
  const theme = useTheme();
  const modalWidthClass = "w-[65vw] md:w-[55vw] lg:w-[45vw] xl:w-[45vw]";
  
  return (
    <CustomModalLayout
      open={isOpen}
      onClose={onClose}
      width={modalWidthClass}
      borderColor={theme.palette.primary.main}  // Use actual color, not string
    >
      <BazarForm eventId={bazarId} location={location} />
    </CustomModalLayout>
  );
};

export default BazarFormModalWrapper;