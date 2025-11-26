import React, { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
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
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import CampaignIcon from "@mui/icons-material/Campaign";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

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
      <Box className="w-full p-4 md:p-8">
        <Box className="flex items-center gap-4 mb-8">
          <LoyaltyIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography
            variant="h3"
            component="h1"
            className="font-bold"
            color="primary"
          >
            My Loyalty Program Participation
          </Typography>
        </Box>

        <Box className="mb-10">
          <Typography
            variant="h5"
            className="mb-6 font-semibold flex items-center gap-2"
            color="textPrimary"
          >
            <InfoOutlinedIcon color="action" fontSize="large" /> Program Details
          </Typography>
          <Box className="flex flex-col md:flex-row gap-6">
            <NeumorphicBox
              containerType="inwards"
              sx={{
                p: 6,
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Box className="flex items-center gap-3 mb-3">
                <PercentIcon color="primary" fontSize="large" />
                <Typography
                  variant="h6"
                  color="textSecondary"
                  fontWeight="medium"
                >
                  Discount Rate
                </Typography>
              </Box>
              <Typography variant="h2" color="primary" className="font-bold">
                {discountRate}%
              </Typography>
            </NeumorphicBox>
            <NeumorphicBox
              containerType="inwards"
              sx={{
                p: 6,
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Box className="flex items-center gap-3 mb-3">
                <ConfirmationNumberIcon color="secondary" fontSize="large" />
                <Typography
                  variant="h6"
                  color="textSecondary"
                  fontWeight="medium"
                >
                  Promo Code
                </Typography>
              </Box>
              <Typography
                variant="h3"
                className="font-mono font-bold text-gray-800 tracking-wider"
              >
                {promoCode}
              </Typography>
            </NeumorphicBox>
          </Box>
        </Box>

        <Divider className="my-10" />

        <Box className="mb-10">
          <Typography
            variant="h5"
            className="mb-6 font-semibold flex items-center gap-2"
            color="textPrimary"
          >
            <DescriptionIcon color="action" fontSize="large" /> Terms and
            Conditions
          </Typography>
          <NeumorphicBox
            containerType="inwards"
            sx={{ p: 5, borderRadius: 4, bgcolor: "rgba(0,0,0,0.02)" }}
          >
            <Typography
              variant="body1"
              className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg"
            >
              {termsAndConditions}
            </Typography>
          </NeumorphicBox>
        </Box>

        <Box className="flex justify-end mt-12">
          <CustomButton
            type="button"
            variant="outlined"
            color="error"
            width="280px"
            height="50px"
            label="Cancel Participation"
            onClick={handleOpenConfirmModal}
            sx={{ fontSize: "1.1rem" }}
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
            Are you sure you want to cancel your participation in the GUC
            Loyalty Program? This action cannot be undone.
          </Typography>
        </CustomModal>
      </Box>
    );
  }

  return (
    <Box className="w-full p-4">
      {/* Hero Section */}
      <Box className="mb-8 text-center">
        <Box className="flex justify-center mb-3">
          <LoyaltyIcon color="primary" sx={{ fontSize: 60 }} />
        </Box>
        <Typography
          variant="h3"
          component="h1"
          className="font-bold mb-3"
          color="primary"
        >
          GUC Loyalty Program
        </Typography>
        <Typography
          variant="h6"
          className="text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          Unlock exclusive opportunities by joining the GUC Loyalty Program.
          Connect directly with the vibrant GUC community of students, staff,
          and faculty.
        </Typography>
      </Box>

      {/* Benefits Section */}
      <Box className="mb-10">
        <Typography
          variant="h5"
          className="mb-6 font-bold text-center"
          color="textPrimary"
        >
          Why Join Us?
        </Typography>
        <Box className="flex flex-wrap gap-4 justify-center">
          {[
            {
              icon: <StorefrontIcon fontSize="medium" color="primary" />,
              title: "Increase Visibility",
              desc: "Showcase your brand to thousands of potential customers within the GUC campus.",
            },
            {
              icon: <TrendingUpIcon fontSize="medium" color="secondary" />,
              title: "Boost Sales",
              desc: "Drive more traffic to your business with exclusive offers and promotions.",
            },
            {
              icon: <PeopleIcon fontSize="medium" color="primary" />,
              title: "Build Relationships",
              desc: "Foster long-term loyalty with the GUC community through consistent engagement.",
            },
            {
              icon: <CampaignIcon fontSize="medium" color="secondary" />,
              title: "Exclusive Marketing",
              desc: "Gain access to exclusive marketing channels and events at GUC.",
            },
          ].map((benefit, index) => (
            <NeumorphicBox
              key={index}
              containerType="outwards"
              sx={{
                p: 3,
                borderRadius: 3,
                minWidth: "200px",
                maxWidth: "250px",
                flex: "1 1 200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                },
              }}
            >
              <Box className="mb-2 p-2 rounded-full bg-gray-50">
                {benefit.icon}
              </Box>
              <Typography variant="subtitle1" className="font-bold mb-1">
                {benefit.title}
              </Typography>
              <Typography variant="body2" className="text-gray-600 text-sm">
                {benefit.desc}
              </Typography>
            </NeumorphicBox>
          ))}
        </Box>
      </Box>

      {/* Terms Section */}
      <Box className="mb-10">
        <Typography
          variant="h5"
          className="mb-6 font-bold flex items-center gap-2"
          color="textPrimary"
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
        <Typography variant="h6" className="mb-4 font-medium text-gray-600">
          Ready to grow your business with GUC?
        </Typography>
        <CustomButton
          type="button"
          variant="contained"
          width="250px"
          height="50px"
          label="Apply Now"
          onClick={handleOpenModal}
          sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
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
