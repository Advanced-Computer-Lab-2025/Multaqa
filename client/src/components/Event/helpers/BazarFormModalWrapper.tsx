"use client";
import CustomModalLayout from "../../../components/shared/modals/CustomModalLayout"; // 💡 Adjust path
import BazarForm from "../../../components/shared/BazarApplicationForm/BazarApplicationForm";

interface BazarFormModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  bazarId: string;
}

const BazarFormModalWrapper: React.FC<BazarFormModalWrapperProps> = ({
  isOpen,
  onClose,
  bazarId
}) => {
  const modalWidthClass = "w-[65vw] md:w-[55vw] lg:w-[45vw] xl:w-[45vw]";
  return (
    <CustomModalLayout
      open={isOpen}
      onClose={onClose}
      width={modalWidthClass}
      borderColor="theme.palette.primary.main"
    >
      <BazarForm eventId={bazarId} />
    </CustomModalLayout>
  );
};

export default BazarFormModalWrapper;