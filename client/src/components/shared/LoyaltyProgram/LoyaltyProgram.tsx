import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CustomButton from "../Buttons/CustomButton";
import { CustomModalLayout, CustomModal } from "../modals";
import LoyaltyProgramForm from "./LoyaltyProgramForm";
import { useTheme } from "@mui/material/styles";
import { LoyaltyProgramProps } from "./types";
import { handleCancelLoyaltyProgram, LOYALTY_PROGRAM_TERMS } from "./utils";
import NeumorphicBox from "../containers/NeumorphicBox";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import PercentIcon from "@mui/icons-material/Percent";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EventIcon from "@mui/icons-material/Event";
import SellIcon from "@mui/icons-material/Sell";
import Diversity3Icon from "@mui/icons-material/Diversity3";

const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({
  isSubscribed,
  discountRate,
  promoCode,
  termsAndConditions,
  onStatusChange,
}) => {
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenConfirmModal = () => setIsConfirmModalOpen(true);
  const handleCloseConfirmModal = () => setIsConfirmModalOpen(false);

  const handleConfirmCancel = async () => {
    await handleCancelLoyaltyProgram(() => {
      handleCloseConfirmModal();
      if (onStatusChange) onStatusChange();
    });
  };

  const handleSuccessApply = () => {
    handleCloseModal();
    if (onStatusChange) onStatusChange();
  };

  if (isSubscribed) {
    return (
      <Box className="w-full p-6 md:p-6">
        <Box className="flex items-center gap-4 mb-10 text-center">
          <Typography
            variant="h4"
            component="h2"
            className="font-bold"
            color="primary"
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              mb: 4,
            }}
          >
            My Loyalty Program Participation
          </Typography>
        </Box>

        <Box className="mb-12">
          <Typography
            variant="h6"
            className="mb-6 font-semibold flex items-center gap-2"
            color="textPrimary"
          >
            <InfoOutlinedIcon color="action" fontSize="medium" /> Program Details
          </Typography>
          <Box className="flex flex-wrap gap-6 justify-center">
            <NeumorphicBox
              containerType="outwards"
              sx={{
                p: 4,
                borderRadius: 4,
                minWidth: "280px",
                maxWidth: "350px",
                flex: "1 1 280px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transition: "transform 0.2s",
                border: `2px solid ${theme.palette.primary.main}`,
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Box className="mb-4 p-3 rounded-full bg-gray-50">
                <PercentIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h6" className="font-bold mb-2">
                Discount Rate
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                {discountRate}%
              </Typography>
            </NeumorphicBox>
            <NeumorphicBox
              containerType="outwards"
              sx={{
                p: 4,
                borderRadius: 4,
                minWidth: "280px",
                maxWidth: "350px",
                flex: "1 1 280px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transition: "transform 0.2s",
                border: `2px solid ${theme.palette.secondary.main}`,
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Box className="mb-4 p-3 rounded-full bg-gray-50">
                <ConfirmationNumberIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
              </Box>
              <Typography variant="h6" className="font-bold mb-2">
                Promo Code
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                {promoCode}
              </Typography>
            </NeumorphicBox>
          </Box>
        </Box>

        <Box className="mb-12">
          <Typography
            variant="h6"
            className="mb-6 font-semibold flex items-center gap-2"
            color="textPrimary"
          >
            <DescriptionIcon color="action" fontSize="medium" /> Terms and Conditions
          </Typography>
          <NeumorphicBox
            containerType="inwards"
            sx={{ p: 4, borderRadius: 4, bgcolor: "rgba(0,0,0,0.02)" }}
          >
            <Typography
              variant="body2"
              className="whitespace-pre-wrap text-gray-700 leading-relaxed"
            >
              {termsAndConditions}
            </Typography>
          </NeumorphicBox>
        </Box>

        <Box className="flex justify-end mt-8">
          <CustomButton
            type="button"
            variant="outlined"
            color="error"
            width="200px"
            height="40px"
            label="Cancel Participation"
            onClick={handleOpenConfirmModal}
            sx={{ fontSize: "0.9rem" }}
          />
        </Box>

        <CustomModal
          title="Confirm Cancellation"
          modalType="warning"
          open={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          buttonOption1={{
            label: "Confirm",
            variant: "contained",
            color: "warning",
            onClick: handleConfirmCancel,
          }}
          buttonOption2={{
            label: "Cancel",
            variant: "outlined",
            color: "warning",
            onClick: handleCloseConfirmModal,
          }}
        >
          <Typography>
            Are you sure you want to cancel your participation in the GUC Loyalty Program? This
            action cannot be undone.
          </Typography>
        </CustomModal>
      </Box>
    );
  }

  return (
    <Box className="w-full p-8">
      {/* Hero Section */}
      <Box className="mb-20 text-center">
        <Typography
          variant="h4"
          component="h3"
          className="font-bold mb-8"
          color="primary"
          sx={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            mb: 4,
          }}
        >
          GUC Loyalty Program
        </Typography>
        <Typography
          variant="h6"
          className="max-w-4xl leading-relaxed text-gray-600"
          sx={{
            textAlign: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Unlock exclusive opportunities by joining the GUC Loyalty Program.
          Connect directly with the vibrant GUC community of students, staff,
          and faculty.
        </Typography>
      </Box>

      {/* Benefits Section */}
      <Box className="mb-20">
        <Typography
          variant="h4"
          className="mb-10 font-bold text-center"
          color="textPrimary"
          sx={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            mb: 4,
          }}
        >
          Why Join Us?
        </Typography>
        <Box className="flex flex-wrap gap-8 justify-center">
          {[
            {
              title: "Increase Visibility",
              desc: "Showcase your brand to thousands of potential customers within the GUC campus.",
              icon: StorefrontIcon,
              color: "#2196f3", // Blue
            },
            {
              title: "Boost Sales",
              desc: "Drive more traffic to your business with exclusive offers and promotions.",
              icon: SellIcon,
              color: "#e91e63", // Pink
            },
            {
              title: "Build Relationships",
              desc: "Foster long-term loyalty with the GUC community through consistent engagement.",
              icon: Diversity3Icon,
              color: "#9c27b0", // Purple
            },
            {
              title: "Exclusive Marketing",
              desc: "Gain access to exclusive marketing channels and events at GUC.",
              icon: EventIcon,
              color: "#ff9800", // Orange
            },
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <NeumorphicBox
                key={index}
                containerType="outwards"
                sx={{
                  p: 4,
                  borderRadius: 4,
                  minWidth: "280px",
                  maxWidth: "350px",
                  flex: "1 1 280px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  transition: "transform 0.2s",
                  border: `2px solid ${benefit.color}`,
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Box className="mb-4 p-3 rounded-full bg-gray-50">
                  <Icon sx={{ fontSize: 40, color: benefit.color }} />
                </Box>
                <Typography variant="h6" className="font-bold mb-2">
                  {benefit.title}
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  {benefit.desc}
                </Typography>
              </NeumorphicBox>
            );
          })}
        </Box>
      </Box>

      {/* Terms Section */}
      <Box className="mb-16">
        <Typography
          variant="h5"
          className="mb-6 font-bold flex items-center gap-2"
          color="textPrimary"
          sx={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
          }}
        >
          <DescriptionIcon fontSize="medium" color="action" /> Terms and
          Conditions
        </Typography>
        <NeumorphicBox containerType="inwards" sx={{ p: 4, borderRadius: 3 }}>
          <Box className="flex flex-col gap-3">
            {LOYALTY_PROGRAM_TERMS.map((term, index) => (
              <Box key={index} className="flex items-start gap-2">
                <Box
                  className="mt-2 w-2 h-2 rounded-full flex-shrink-0"
                  sx={{ bgcolor: theme.palette.primary.main }}
                />
                <Typography variant="body1" className="text-gray-700">
                  {term}
                </Typography>
              </Box>
            ))}
          </Box>
        </NeumorphicBox>
      </Box>

      {/* CTA Section */}
      <Box className="flex flex-col items-center justify-center mt-8 mb-6">
        <Typography variant="h6" className="mb-10 font-medium text-gray-600">
          Ready to grow your business with GUC?
        </Typography>
        <CustomButton
          type="button"
          variant="contained"
          width="250px"
          height="50px"
          label="Apply Now"
          onClick={handleOpenModal}
          sx={{ fontSize: "1.1rem", fontWeight: "bold",mt: 2 }}
        />
      </Box>

      <CustomModalLayout
        open={isModalOpen}
        title="Apply for Loyalty Program"
        onClose={handleCloseModal}
        width="w-[95vw] xs:w-[80vw] lg:w-[50vw] xl:w-[40vw]"
        borderColor={theme.palette.primary.main}
      >
        <LoyaltyProgramForm onSuccess={handleSuccessApply} />
      </CustomModalLayout>
    </Box>
  );
};

export default LoyaltyProgram;
