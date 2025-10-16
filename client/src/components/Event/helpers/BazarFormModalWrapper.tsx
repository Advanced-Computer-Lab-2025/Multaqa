"use client";
import CustomModalLayout from "../../../components/shared/modals/CustomModalLayout"; // 💡 Adjust path
import BazarForm from "../../../components/shared/BazarApplicationForm/BazarApplicationForm";

interface BazarFormModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

const BazarFormModalWrapper: React.FC<BazarFormModalWrapperProps> = ({
  isOpen,
  onClose,
}) => {
  const modalWidthClass = "w-[60vw] md:w-[50vw] lg:w-[45vw] xl:w-[40vw]";
  return (
    <CustomModalLayout
      open={isOpen}
      onClose={onClose}
      width={modalWidthClass}
      borderColor="theme.palette.primary.main"
    >
      <BazarForm />
    </CustomModalLayout>
  );
};

export default BazarFormModalWrapper;
