import { Formik } from "formik";
import NeumorphicBox from "../containers/NeumorphicBox";
import { CustomTextField } from "../input-fields";
import CustomButton from "../Buttons/CustomButton";
import { Box, Typography, CircularProgress, Divider } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material/styles";
import { BazarFormValues } from "./types";
import { validationSchema } from "./utils";
import CustomSelectField from "../input-fields/CustomSelectField";
import CustomIcon from "../Icons/CustomIcon";

const BazarForm: React.FC = () => {
  const theme = useTheme();
 
  const initialValues: BazarFormValues = {
    attendees: [{ name: "", email: "" }],
    boothSize: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <NeumorphicBox
            containerType="outwards"
            padding="50px"
            borderRadius="20px"
            className="max-w-[600px] mx-auto"
          >
              
              <div className="flex flex-col flex-1  gap-4">
                {/* Header */}
                <div className="text-center mb-6 w-full">
                  <h1
                    className="text-4xl font-bold mb-2"
                    style={{ color: theme.palette.text.primary }}
                  >
                    Bazar Application
                  </h1>
                  <p style={{ color: theme.palette.text.secondary }}>
                   Join a Bazar event by filling out the application form below
                  </p>
                </div>

                <Divider sx={{ width: "100%", mb: 4 }} />

                {/* Attendee Info */}
                <Box>
                  {formik.values.attendees.map((attendee, index) => (
                    <Box key={index}>
                      <div className="flex items-start gap-5 w-full px-4 mb-5">
                        <div className="w-[300px]">
                          <CustomTextField
                            id={`attendees.${index}.name`}
                            label={`Attendee ${index + 1} name`}
                            fieldType="text"
                            width="300px"
                            onChange={(e) => {
                              formik.setFieldValue(
                                `attendees.${index}.name`,
                                e.target.value
                              );
                            }}
                            onBlur={() =>
                              formik.setFieldTouched(
                                `attendees.${index}.name`,
                                true
                              )
                            }
                          />
                          {formik.touched.attendees?.[index]?.name &&
                            typeof formik.errors.attendees?.[index] !==
                              "string" &&
                            formik.errors.attendees?.[index]?.name && (
                              <Box display="flex" alignItems="center" mt={1}>
                                <ErrorOutlineIcon
                                  color="error"
                                  sx={{ fontSize: 16, mr: 0.5 }}
                                />
                                <Typography variant="caption" color="error">
                                  {typeof formik.errors.attendees?.[index] !==
                                  "string"
                                    ? formik.errors.attendees?.[index]?.name
                                    : formik.errors.attendees?.[index]}
                                </Typography>
                              </Box>
                            )}
                        </div>
                        <div className="w-[300px]">
                          <CustomTextField
                            id={`attendees.${index}.email`}
                            label={`Attendee ${index + 1} email`}
                            fieldType="email"
                            width="300px"
                            stakeholderType="vendor"
                            onChange={(e) => {
                              formik.setFieldValue(
                                `attendees.${index}.email`,
                                e.target.value
                              );
                            }}
                            onBlur={() =>
                              formik.setFieldTouched(
                                `attendees.${index}.email`,
                                true
                              )
                            }
                          />
                          {formik.touched.attendees?.[index]?.email &&
                            typeof formik.errors.attendees?.[index] !==
                              "string" &&
                            formik.errors.attendees?.[index]?.email && (
                              <Box display="flex" alignItems="center" mt={1}>
                                <ErrorOutlineIcon
                                  color="error"
                                  sx={{ fontSize: 16, mr: 0.5 }}
                                />
                                <Typography variant="caption" color="error">
                                  {typeof formik.errors.attendees?.[index] !==
                                  "string"
                                    ? formik.errors.attendees?.[index]?.email
                                    : formik.errors.attendees?.[index]}
                                </Typography>
                              </Box>
                            )}
                        </div>
                        <div className="w-10 flex items-center mt-6">
                          {index > 0 ? (
                            <CustomIcon
                              icon="delete"
                              size="medium"
                              onClick={() => {
                                const newAttendees =
                                  formik.values.attendees.filter(
                                    (_, i) => i !== index
                                  );
                                formik.setFieldValue("attendees", newAttendees);
                              }}
                              containerType="inwards"
                              sx={{
                                cursor: "pointer",
                                color: theme.palette.error.main,
                              }}
                            />
                          ) : (
                            <div className="w-10">
                              <CustomIcon
                                icon="add"
                                size="medium"
                                onClick={() => {
                                  if (formik.values.attendees.length >= 5)
                                    return; // Limit to 5 attendees
                                  formik.setFieldValue("attendees", [
                                    ...formik.values.attendees,
                                    { name: "", email: "" },
                                  ]);
                                }}
                                sx={{
                                  cursor: "pointer",
                                  color: theme.palette.primary.main,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </Box>
                  ))}
                </Box>

                {/* Booth Size Select */}

                <div className="flex justify-center items-center w-full mb-4">
                  <div className="w-[300px]">
                    <CustomSelectField
                      label="Booth Size"
                      fieldType="single"
                      neumorphicBox
                      options={[
                        { label: "2x2m", value: "2x2" },
                        { label: "4x4m", value: "4x4" },
                      ]}
                      value={formik.values.boothSize}
                      onChange={(value) =>
                        formik.setFieldValue("boothSize", value || "")
                      }
                      onBlur={() => formik.setFieldTouched("boothSize", true)}
                    />
                    {formik.touched.boothSize && formik.errors.boothSize && (
                      <Box display="flex" alignItems="center" mt={1}>
                        <ErrorOutlineIcon
                          color="error"
                          sx={{ fontSize: 16, mr: 0.5 }}
                        />
                        <Typography variant="caption" color="error">
                          {formik.errors.boothSize}
                        </Typography>
                      </Box>
                    )}
                  </div>
                </div>

                {/* Submit */}

                <Box className="w-full mt-auto ">
                  <Box
                    sx={{
                      position: "relative",
                      width: "400px",
                      margin: "0 auto",
                    }}
                  >
                    <CustomButton
                      type="submit"
                      variant="contained"
                      width="100%"
                      disableElevation
                      label={formik.isSubmitting ? "" : "Submit Application"}
                      disabled={formik.isSubmitting}
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
                  </Box>
                </Box>
              </div>

          </NeumorphicBox>
        </form>
      )}
    </Formik>
  );
};

export default BazarForm;
