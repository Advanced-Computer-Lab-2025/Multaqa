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
      <Box sx={{ width: "100%", p: { xs: 3, md: 6 } }}>
        {/* Header - Centered */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            color="primary"
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              fontWeight: "medium",
              textAlign: "center",
            }}
          >
            My Loyalty Program Participation
          </Typography>
        </Box>

        {/* Program Details Section */}
        <Box>
          <Typography
            variant="h6"
            color="textPrimary"
            sx={{
              mb: 4,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <InfoOutlinedIcon color="action" fontSize="medium" /> Program
            Details
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
            }}
          >
            <NeumorphicBox
              containerType="outwards"
              sx={{
                p: 3,
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  mb: 3,
                  py: 2,
                  px: 3,
                }}
              >
                <Typography
                  color={theme.palette.primary.main}
                  sx={{ fontSize: 45 }}
                >
                  {discountRate}
                </Typography>
                <PercentIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.primary.main,
                    mt: 1,
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "medium", mb: 2, color: "#6b7280" }}
              >
                Discount Rate
              </Typography>
            </NeumorphicBox>
            <NeumorphicBox
              containerType="outwards"
              sx={{
                p: 3,
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  mb: 3,
                  py: 2,
                  px: 3,
                }}
              >
                <ConfirmationNumberIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.secondary.main,
                    mt: 1,
                    mr: 1,
                  }}
                />
                <Typography
                  color={theme.palette.secondary.main}
                  sx={{ fontSize: 35,mt:1 }}
                >
                  {promoCode}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "medium", color: "#6b7280" }}
              >
                Promo Code
              </Typography>
            </NeumorphicBox>
          </Box>
        </Box>

        <Divider sx={{ my: 8, opacity: 1 }} />

        {/* Terms and Conditions Section */}
        <Box>
          <Typography
            variant="h6"
            color="textPrimary"
            sx={{
              mb: 4,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <DescriptionIcon color="action" fontSize="medium" /> Terms and
            Conditions
          </Typography>
          <NeumorphicBox
            containerType="inwards"
            sx={{ p: 3, borderRadius: 4, bgcolor: "rgba(0,0,0,0.02)" }}
          >
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                color: "#6b7280",
                lineHeight: 1.8,
              }}
            >
              {termsAndConditions}
            </Typography>
          </NeumorphicBox>
        </Box>

        {/* Cancel Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 6 }}>
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
            Are you sure you want to cancel your participation in the GUC
            Loyalty Program? This action cannot be undone.
          </Typography>
        </CustomModal>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: { xs: 3, md: 8 } }}>
      {/* Hero Section */}
      <Box sx={{ mb: 10, textAlign: "center" }}>
        <Typography
          variant="h4"
          component="h3"
          color="primary"
          sx={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            fontWeight: "bold",
            mb: 4,
          }}
        >
          GUC Loyalty Program
        </Typography>
        <Typography
          variant="h6"
          sx={{
            maxWidth: "900px",
            lineHeight: 1.8,
            color: "#4b5563",
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
      <Box sx={{ mb: 10 }}>
        <Typography
          variant="h4"
          color="textPrimary"
          sx={{
            mb: 6,
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
          }}
        >
          Why Join Us?
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {[
            {
              title: "Increase Visibility",
              desc: "Showcase your brand to thousands of potential customers within the GUC campus.",
              icon: StorefrontIcon,
              color: "#2196f3",
            },
            {
              title: "Boost Sales",
              desc: "Drive more traffic to your business with exclusive offers and promotions.",
              icon: SellIcon,
              color: "#e91e63",
            },
            {
              title: "Build Relationships",
              desc: "Foster long-term loyalty with the GUC community through consistent engagement.",
              icon: Diversity3Icon,
              color: "#9c27b0",
            },
            {
              title: "Exclusive Marketing",
              desc: "Gain access to exclusive marketing channels and events at GUC.",
              icon: EventIcon,
              color: "#ff9800",
            },
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <NeumorphicBox
                key={index}
                containerType="outwards"
                sx={{
                  px: 4,
                  py: 2,
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
                <Box
                  sx={{
                    mb: 3,
                    p: 3,
                    borderRadius: "50%",
                    bgcolor: "rgba(0,0,0,0.03)",
                  }}
                >
                  <Icon sx={{ fontSize: 40, color: benefit.color }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  {benefit.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#6b7280" }}>
                  {benefit.desc}
                </Typography>
              </NeumorphicBox>
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ my: 8, opacity: 1 }} />

      {/* Terms Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h5"
          color="textPrimary"
          sx={{
            mb: 4,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
          }}
        >
          <DescriptionIcon fontSize="medium" color="action" /> GUC Terms and
          Conditions
        </Typography>
        <NeumorphicBox containerType="inwards" sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {LOYALTY_PROGRAM_TERMS.map((term, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
              >
                <Box
                  sx={{
                    mt: 1.5,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    flexShrink: 0,
                    bgcolor: theme.palette.primary.main,
                  }}
                />
                <Typography variant="body1" sx={{ color: "#374151" }}>
                  {term}
                </Typography>
              </Box>
            ))}
          </Box>
        </NeumorphicBox>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 8,
          mb: 6,
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 500, color: "#4b5563" }}
        >
          Ready to grow your business with GUC?
        </Typography>
        <CustomButton
          type="button"
          variant="contained"
          width="250px"
          height="50px"
          label="Apply Now"
          onClick={handleOpenModal}
          sx={{ fontSize: "1.1rem", fontWeight: "bold", mt: 2 }}
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
