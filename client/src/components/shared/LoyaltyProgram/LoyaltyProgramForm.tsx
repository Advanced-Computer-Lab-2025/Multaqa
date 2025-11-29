import React, { useState } from "react";
import { Formik } from "formik";
import {
  Box,
  Typography,
  CircularProgress,
  FormControlLabel,
  Collapse,
  IconButton,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { CustomTextField, CustomCheckbox } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import {
  getValidationSchema,
  handleLoyaltyProgramSubmit,
  LOYALTY_PROGRAM_TERMS,
} from "./utils";
import { LoyaltyProgramFormValues } from "./types";

interface LoyaltyProgramFormProps {
  onSuccess: () => void;
}

const LoyaltyProgramForm: React.FC<LoyaltyProgramFormProps> = ({
  onSuccess,
}) => {
  const [showTerms, setShowTerms] = useState(false);
  const initialValues: LoyaltyProgramFormValues = {
    discountRate: "",
    promoCode: "",
    termsAndConditions: "",
    agreedToTerms: false,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={(values, formikHelpers) =>
        handleLoyaltyProgramSubmit(values, formikHelpers, onSuccess)
      }
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit} className="w-full">
          <Box className="flex flex-col gap-6 p-4 ">
            <Typography
              variant="h4"
              component="h3"
              className="font-bold mb-8"
              color="primary"
              sx={{
                textAlign: "center",
                fontFamily: "var(--font-poppins), system-ui, sans-serif",
                mb: 4,
              }}
            >
              Loyalty Program
            </Typography>

            {/* Discount Rate */}
            <div className="w-full">
              <CustomTextField
                id="discountRate"
                label="Discount Rate (%)"
                fieldType="numeric"
                neumorphicBox
                onChange={(e) => {
                  formik.setFieldValue("discountRate", e.target.value);
                }}
                onBlur={() => {
                  formik.setFieldTouched("discountRate", true);
                }}
                name="discountRate"
                value={formik.values.discountRate}
              />
              {formik.touched.discountRate && formik.errors.discountRate && (
                <Box display="flex" alignItems="center" mt={1}>
                  <ErrorOutlineIcon
                    color="error"
                    sx={{ fontSize: 16, mr: 0.5 }}
                  />
                  <Typography variant="caption" color="error">
                    {formik.errors.discountRate}
                  </Typography>
                </Box>
              )}
            </div>

            {/* Promo Code */}
            <div className="w-full">
              <CustomTextField
                id="promoCode"
                label="Promo Code"
                fieldType="text"
                neumorphicBox
                autoCapitalizeName={false} // Explicitly disable auto-capitalization
                onChange={(e) => {
                  formik.setFieldValue("promoCode", e.target.value); // Removed transformation to lowercase
                }}
                onBlur={() => {
                  formik.setFieldTouched("promoCode", true);
                }}
                name="promoCode"
                value={formik.values.promoCode}
              />
              {formik.touched.promoCode && formik.errors.promoCode && (
                <Box display="flex" alignItems="center" mt={1}>
                  <ErrorOutlineIcon
                    color="error"
                    sx={{ fontSize: 16, mr: 0.5 }}
                  />
                  <Typography variant="caption" color="error">
                    {formik.errors.promoCode}
                  </Typography>
                </Box>
              )}
            </div>

            {/* Vendor Terms and Conditions */}
            <div className="w-full">
              <CustomTextField
                id="termsAndConditions"
                label="Your Terms and Conditions"
                fieldType="text"
                multiline
                rows={4}
                neumorphicBox
                borderRadius="20px"
                autoCapitalizeName={false} // Explicitly disable auto-capitalization
                onChange={(e) => {
                  formik.setFieldValue("termsAndConditions", e.target.value); // Removed transformation to lowercase
                }}
                onBlur={() => {
                  formik.setFieldTouched("termsAndConditions", true);
                }}
                name="termsAndConditions"
                value={formik.values.termsAndConditions}
              />
              {formik.touched.termsAndConditions &&
                formik.errors.termsAndConditions && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <ErrorOutlineIcon
                      color="error"
                      sx={{ fontSize: 16, mr: 0.5 }}
                    />
                    <Typography variant="caption" color="error">
                      {formik.errors.termsAndConditions}
                    </Typography>
                  </Box>
                )}
            </div>

            {/* GUC Terms Agreement */}
            <div className="w-full">
              <Box
                className="flex items-center justify-between mb-2 cursor-pointer"
                onClick={() => setShowTerms(!showTerms)}
              >
                <Typography
                  variant="subtitle2"
                  color="text-gray-500"
                  className="font-semibold hover:underline"
                >
                  View GUC Loyalty Program Terms & Conditions
                </Typography>
                <IconButton size="small">
                  {showTerms ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              <Collapse in={showTerms}>
                <Box className="p-4 bg-gray-50 rounded-lg mb-4 border border-gray-200 text-sm text-gray-600 max-h-40 overflow-y-auto">
                  <ul className="list-disc pl-4 space-y-1">
                    {LOYALTY_PROGRAM_TERMS.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </Box>
              </Collapse>

              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={formik.values.agreedToTerms}
                    onChange={(e) =>
                      formik.setFieldValue("agreedToTerms", e.target.checked)
                    }
                    name="agreedToTerms"
                  />
                }
                label={
                  <Typography variant="body2" color="textSecondary">
                    I agree to the GUC Loyalty Program Terms and Conditions
                  </Typography>
                }
              />
              {formik.touched.agreedToTerms && formik.errors.agreedToTerms && (
                <Box display="flex" alignItems="center" mt={0.5} ml={1}>
                  <ErrorOutlineIcon
                    color="error"
                    sx={{ fontSize: 16, mr: 0.5 }}
                  />
                  <Typography variant="caption" color="error">
                    {formik.errors.agreedToTerms}
                  </Typography>
                </Box>
              )}
            </div>

            {/* Submit Button */}
            <div className="w-full mt-2">
              <div style={{ position: "relative", width: "100%" }}>
                <CustomButton
                  type="submit"
                  variant="contained"
                  width="100%"
                  disableElevation
                  label={formik.isSubmitting ? "" : "Apply"}
                  disabled={formik.isSubmitting || !formik.isValid}
                  className="w-full"
                />
                {formik.isSubmitting && (
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  </span>
                )}
              </div>
            </div>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default LoyaltyProgramForm;
