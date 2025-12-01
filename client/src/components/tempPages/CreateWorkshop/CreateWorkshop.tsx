// components/CreateWorkshop/CreateWorkshop.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Chip,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AddIcon from "@mui/icons-material/Add";
import {
  CustomSelectField,
  CustomTextField,
} from "@/components/shared/input-fields";
import { detailTitleStyles } from "@/components/shared/styles";
import { api } from "../../../api";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import { CustomModalLayout } from "@/components/shared/modals";
import { workshopSchema } from "./schemas/workshop";
import { toast } from "react-toastify";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ProfessorOption {
  label: string;
  value: string;
}

// Create tertiaryInputStyles as a function that accepts color
const createTertiaryInputStyles = (accentColor: string, theme: any) => ({
  "& .MuiInputLabel-root": {
    color: theme.palette.grey[500],
    "&.Mui-focused": { color: accentColor },
  },
  "& .MuiInputBase-input": {
    color: "#000000",
    "&::placeholder": {
      color: theme.palette.grey[400],
      opacity: 1,
    },
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: theme.palette.grey[400],
  },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: accentColor,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: accentColor,
  },
});

// Create contentPaperStyles as a function that accepts color
const createContentPaperStyles = (accentColor: string, theme: any) => ({
  p: { xs: 1, md: 3 },
  borderRadius: "32px",
  background: theme.palette.background.paper,
  border: `2px solid ${accentColor}`,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  boxShadow: `0 4px 24px 0 ${accentColor}14`,
  transition: "box-shadow 0.2s",
});

interface CreateWorkshopProps {
  professors: [];
  creatingProfessor: string;
  open: boolean;
  onClose: () => void;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateWorkshop: React.FC<CreateWorkshopProps> = ({
  professors,
  creatingProfessor,
  open,
  onClose,
  setRefresh,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingProfessors, setLoadingProfessors] = useState(true);

  // Use tertiary color as accent
  const accentColor = theme.palette.tertiary.main;

  // Create styles with the accent color
  const tertiaryInputStyles = createTertiaryInputStyles(accentColor, theme);
  const contentPaperStyles = createContentPaperStyles(accentColor, theme);

  // Tab sections for sidebar (4 tabs for workshop)
  const tabSections = [
    { key: "general", label: "General", icon: <InfoOutlinedIcon /> },
    {
      key: "description",
      label: "Description",
      icon: <DescriptionOutlinedIcon />,
    },
    {
      key: "fullAgenda",
      label: "Full Agenda",
      icon: <CalendarTodayOutlinedIcon />,
    },
    {
      key: "organization",
      label: "Organization",
      icon: <GroupsOutlinedIcon />,
    },
  ];
  const [activeTab, setActiveTab] = useState("general");
  const [resourceInput, setResourceInput] = useState<string>("");
  const [selectedProf, setSelectedProf] = useState<string>("");
  const [availableProfessors, setAvailableProfessors] = useState<
    ProfessorOption[]
  >([]);

  useEffect(() => {
    handleLoadProfessors();
  }, []);

  const handleLoadProfessors = async () => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
      setLoadingProfessors(true);
      const res = await api.get("/users/professors");
      console.log(res);
      // filter only isVerified = true
      const verifiedProfessors = res?.data?.data;
      const options = verifiedProfessors
        .filter((prof: any) => prof._id !== creatingProfessor)
        .map((prof: any) => ({
          label: `${prof.firstName} ${prof.lastName}`,
          value: prof._id,
        }));

      setAvailableProfessors(options);
    } catch (err: any) {
      setError(err?.message || "API call failed");
    } finally {
      setLoadingProfessors(false);
    }
  };

  const initialValues = {
    workshopName: "",
    budget: 0,
    capacity: 0,
    startDate: null,
    endDate: null,
    registrationDeadline: null,
    description: "",
    agenda: "",
    professors: [] as ProfessorOption[],
    location: "",
    faculty: "",
    fundingSource: "",
    extraResources: [] as string[],
  };

  const handleCallApi = async (payload: any) => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
      const res = await api.post("/workshops/", payload);
      setResponse(res.data);
      toast.success("Workshop created successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      if (setRefresh) setRefresh((prev) => !prev);
    } catch (err: any) {
      setError(err?.message || "API call failed");
      toast.error(
        err.response.data.error ||
          "Failed to create workshop. Please try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: any, actions: any) => {
    const payload = {
      type: "workshop",
      eventName: values.workshopName,
      location: values.location,
      eventStartDate: values.startDate.format("YYYY-MM-DD"),
      eventEndDate: values.endDate.format("YYYY-MM-DD"),
      description: values.description,
      fullAgenda: values.agenda,
      associatedFaculty: values.faculty,
      associatedProfs: values.professors.map(
        (p: { label: string; value: string }) => p.value
      ),
      requiredBudget: values.budget,
      extraRequiredResources: values.extraResources,
      capacity: values.capacity,
      registrationDeadline: values.registrationDeadline.format("YYYY-MM-DD"),
      eventStartTime: values.startDate.format("HH:mm"),
      eventEndTime: values.endDate.format("HH:mm"),
      fundingSource: values.fundingSource,
      price: 5,
    };
    actions.resetForm();
    handleCallApi(payload);
    onClose();
  };

  const {
    handleSubmit,
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: workshopSchema,
    onSubmit: onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Check if tabs have errors
  const generalHasErrors = !!(
    (errors.workshopName && touched.workshopName) ||
    (errors.startDate && touched.startDate) ||
    (errors.endDate && touched.endDate) ||
    (errors.registrationDeadline && touched.registrationDeadline) ||
    (errors.capacity && touched.capacity) ||
    (errors.budget && touched.budget) ||
    (errors.faculty && touched.faculty) ||
    (errors.location && touched.location)
  );

  const descriptionHasErrors = !!(errors.description && touched.description);
  const agendaHasErrors = !!(errors.agenda && touched.agenda);
  const organizationHasErrors = !!(
    (errors.professors && touched.professors) ||
    (errors.fundingSource && touched.fundingSource) ||
    (errors.extraResources && touched.extraResources)
  );

  const handleClose = () => {
    onClose();
    resetForm();
    setActiveTab("general");
  };

  return (
    <CustomModalLayout
      open={open}
      borderColor={accentColor}
      title="Create Workshop"
      onClose={handleClose}
      width="w-[95vw] xs:w-[80vw] lg:w-[70vw] xl:w-[70vw]"
    >
      <Box
        sx={{
          background: "#fff",
          borderRadius: "32px",
          p: 3,
          height: "600px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flex: 1,
              gap: 3,
              minHeight: 0,
            }}
          >
            {/* Sidebar Navigation */}
            <Box
              sx={{
                width: "250px",
                flexShrink: 0,
                background: theme.palette.background.paper,
                borderRadius: "32px",
                border: `2px solid ${accentColor}`,
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                boxShadow: "0 4px 24px 0 rgba(110, 138, 230, 0.08)",
                transition: "box-shadow 0.2s",
                height: "fit-content",
                alignSelf: "flex-start",
              }}
            >
              <List sx={{ width: "100%", height: "100%" }}>
                {tabSections.map((section) => {
                  const hasError =
                    section.key === "general"
                      ? generalHasErrors
                      : section.key === "description"
                      ? descriptionHasErrors
                      : section.key === "fullAgenda"
                      ? agendaHasErrors
                      : section.key === "organization"
                      ? organizationHasErrors
                      : false;

                  return (
                    <ListItem key={section.key} disablePadding>
                      <ListItemButton
                        selected={activeTab === section.key}
                        onClick={() => setActiveTab(section.key)}
                        sx={{
                          borderRadius: "24px",
                          mb: 1.5,
                          px: 2.5,
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: "1.08rem",
                          background:
                            activeTab === section.key
                              ? "rgba(110, 138, 230, 0.08)"
                              : "transparent",
                          color:
                            activeTab === section.key
                              ? accentColor
                              : theme.palette.text.primary,
                          boxShadow:
                            activeTab === section.key
                              ? "0 2px 8px 0 rgba(110, 138, 230, 0.15)"
                              : "none",
                          transition:
                            "background 0.2s, color 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            background: "rgba(110, 138, 230, 0.05)",
                            color: accentColor,
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 36,
                            color:
                              activeTab === section.key
                                ? accentColor
                                : theme.palette.text.primary,
                            "&:hover": {
                              color: accentColor,
                            },
                          }}
                        >
                          {section.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={section.label}
                          primaryTypographyProps={{ fontWeight: 700, mr: 2 }}
                        />
                        {hasError && (
                          <ErrorOutlineIcon
                            sx={{
                              color: "#db3030",
                              fontSize: "20px",
                              ml: "auto",
                            }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
            {/* Content Area */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                height: "100%",
              }}
            >
              {/* General Tab */}
              {activeTab === "general" && (
                <Paper elevation={0} sx={contentPaperStyles}>
                  <CustomTextField
                    name="workshopName"
                    id="workshopName"
                    label="Workshop Name"
                    fullWidth
                    placeholder="Enter Workshop Name"
                    fieldType="text"
                    value={values.workshopName}
                    onChange={handleChange}
                    autoCapitalize="off"
                    autoCapitalizeName={false}
                    sx={{ mt: 1, mb: 2 }}
                  />
                  {errors.workshopName && touched.workshopName ? (
                    <Typography
                      sx={{
                        color: "#db3030",
                        fontSize: "0.875rem",
                        mt: -1.5,
                        mb: 1,
                      }}
                    >
                      {errors.workshopName}
                    </Typography>
                  ) : (
                    <></>
                  )}

                  {/* Date/Time Pickers section */}
                  <Box sx={{ display: "flex", gap: 2, marginBottom: "12px" }}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          name="startDate"
                          label="Start Date and Time"
                          slotProps={{
                            textField: {
                              variant: "standard",
                              fullWidth: true,
                              sx: tertiaryInputStyles,
                              InputLabelProps: {
                                sx: {
                                  color: theme.palette.grey[500],
                                  "&.Mui-focused": {
                                    color: accentColor,
                                  },
                                },
                              },
                            },
                          }}
                          value={values.startDate}
                          onChange={(value) =>
                            setFieldValue("startDate", value)
                          }
                        />
                      </LocalizationProvider>
                      {errors.startDate && touched.startDate && (
                        <Typography
                          sx={{
                            color: "#db3030",
                            fontSize: "0.875rem",
                            mt: 0.5,
                          }}
                        >
                          {errors.startDate}
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="End Date and Time"
                          name="endDate"
                          slotProps={{
                            textField: {
                              variant: "standard",
                              fullWidth: true,
                              sx: tertiaryInputStyles,
                              InputLabelProps: {
                                sx: {
                                  color: theme.palette.grey[500],
                                  "&.Mui-focused": {
                                    color: accentColor,
                                  },
                                },
                              },
                            },
                          }}
                          value={values.endDate}
                          onChange={(value) => setFieldValue("endDate", value)}
                        />
                      </LocalizationProvider>
                      {errors.endDate && touched.endDate && (
                        <Typography
                          sx={{
                            color: "#db3030",
                            fontSize: "0.875rem",
                            mt: 0.5,
                          }}
                        >
                          {errors.endDate}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      name="registrationDeadline"
                      label="Deadline to Register"
                      slotProps={{
                        textField: {
                          variant: "standard",
                          fullWidth: true,
                          sx: tertiaryInputStyles,
                          InputLabelProps: {
                            sx: {
                              color: theme.palette.grey[500],
                              "&.Mui-focused": {
                                color: accentColor,
                              },
                            },
                          },
                        },
                      }}
                      value={values.registrationDeadline}
                      onChange={(value) =>
                        setFieldValue("registrationDeadline", value)
                      }
                    />
                    {errors.registrationDeadline &&
                    touched.registrationDeadline ? (
                      <Typography
                        sx={{
                          color: "#db3030",
                          fontSize: "0.875rem",
                          mt: 0.5,
                          mb: 2,
                        }}
                      >
                        {errors.registrationDeadline}
                      </Typography>
                    ) : (
                      <Box sx={{ mb: 2 }} />
                    )}
                  </LocalizationProvider>

                  {/* Budget and Capacity */}
                  <Box sx={{ display: "flex", gap: 2, marginBottom: "12px" }}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                    >
                      <TextField
                        name="budget"
                        id="budget"
                        label="Budget"
                        type="number"
                        fullWidth
                        variant="standard"
                        placeholder="Enter Budget"
                        value={values.budget}
                        onChange={handleChange}
                        sx={tertiaryInputStyles}
                      />
                      {errors.budget && touched.budget ? (
                        <Typography
                          sx={{
                            color: "#db3030",
                            fontSize: "0.875rem",
                            mt: 0.5,
                          }}
                        >
                          {errors.budget}
                        </Typography>
                      ) : (
                        <></>
                      )}
                    </Box>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                    >
                      <TextField
                        name="capacity"
                        id="capacity"
                        label="Capacity"
                        type="number"
                        fullWidth
                        variant="standard"
                        placeholder="Enter Capacity"
                        value={values.capacity}
                        onChange={handleChange}
                        sx={tertiaryInputStyles}
                      />
                      {errors.capacity && touched.capacity ? (
                        <Typography
                          sx={{
                            color: "#db3030",
                            fontSize: "0.875rem",
                            mt: 0.5,
                          }}
                        >
                          {errors.capacity}
                        </Typography>
                      ) : (
                        <></>
                      )}
                    </Box>
                  </Box>

                  {/* Location and Faculty */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      marginTop: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                    >
                      <CustomSelectField
                        label="Location"
                        fieldType="single"
                        options={[
                          { label: "GUC Cairo", value: "GUC Cairo" },
                          { label: "GUC Berlin", value: "GUC Berlin" },
                        ]}
                        value={values.location}
                        onChange={(e: any) =>
                          setFieldValue(
                            "location",
                            e.target ? e.target.value : e
                          )
                        }
                        name="location"
                        usePortalPositioning={true}
                      />
                      {errors.location && touched.location && (
                        <Typography
                          sx={{
                            color: "#db3030",
                            fontSize: "0.875rem",
                            mt: 0.5,
                          }}
                        >
                          {errors.location}
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                    >
                      <CustomSelectField
                        label="Faculty"
                        fieldType="single"
                        options={[
                          { label: "MET", value: "MET" },
                          { label: "IET", value: "IET" },
                          { label: "EMS", value: "EMS" },
                          { label: "Management", value: "MNGT" },
                          { label: "Applied Arts", value: "AA" },
                          { label: "Architecture", value: "ARCH" },
                          { label: "Law", value: "LAW" },
                          { label: "DMET", value: "DMET" },
                        ]}
                        value={values.faculty}
                        onChange={(e: any) =>
                          setFieldValue(
                            "faculty",
                            e.target ? e.target.value : e
                          )
                        }
                        name="faculty"
                        usePortalPositioning={true}
                      />
                      {errors.faculty && touched.faculty && (
                        <Typography
                          sx={{
                            color: "#db3030",
                            fontSize: "0.875rem",
                            mt: 0.5,
                          }}
                        >
                          {errors.faculty}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              )}

              {/* Description Tab */}
              {activeTab === "description" && (
                <Paper elevation={0} sx={contentPaperStyles}>
                  <TextField
                    name="description"
                    placeholder="Provide a short description of the workshop"
                    value={values.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={16}
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        height: "100%",
                        alignItems: "flex-start",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: accentColor,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: accentColor,
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "16px",
                        borderColor: theme.palette.grey[300],
                      },
                      "& .MuiInputBase-input": {
                        height: "100% !important",
                        overflow: "auto !important",
                      },
                    }}
                  />
                  {errors.description && touched.description && (
                    <Typography
                      sx={{ color: "#db3030", fontSize: "0.875rem", mt: 1 }}
                    >
                      {errors.description}
                    </Typography>
                  )}
                </Paper>
              )}

              {/* Full Agenda Tab */}
              {activeTab === "fullAgenda" && (
                <Paper elevation={0} sx={contentPaperStyles}>
                  <TextField
                    name="agenda"
                    placeholder="Provide the full agenda of the workshop"
                    value={values.agenda}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={16}
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        height: "100%",
                        alignItems: "flex-start",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: accentColor,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: accentColor,
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "16px",
                        borderColor: theme.palette.grey[300],
                      },
                      "& .MuiInputBase-input": {
                        height: "100% !important",
                        overflow: "auto !important",
                      },
                    }}
                  />
                  {errors.agenda && touched.agenda && (
                    <Typography
                      sx={{ color: "#db3030", fontSize: "0.875rem", mt: 1 }}
                    >
                      {errors.agenda}
                    </Typography>
                  )}
                </Paper>
              )}

              {/* Organization Tab */}
              {activeTab === "organization" && (
                <Paper elevation={0} sx={contentPaperStyles}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: "16px",
                    }}
                  >
                    <CustomSelectField
                      label="Funding"
                      fieldType="single"
                      options={[
                        { label: "GUC", value: "GUC" },
                        { label: "External", value: "External" },
                      ]}
                      value={values.fundingSource}
                      onChange={(e: any) =>
                        setFieldValue(
                          "fundingSource",
                          e.target ? e.target.value : e
                        )
                      }
                      name="fundingSource"
                      usePortalPositioning={true}
                    />
                    {errors.fundingSource && touched.fundingSource && (
                      <Typography
                        sx={{ color: "#db3030", fontSize: "0.875rem", mt: 0.5 }}
                      >
                        {errors.fundingSource}
                      </Typography>
                    )}
                  </Box>

                  <Typography
                    sx={{
                      ...detailTitleStyles(theme),
                      fontSize: "16px",
                      mb: 1,
                    }}
                  >
                    Participating Professors
                  </Typography>
                  <CustomSelectField
                    label={
                      availableProfessors.length === 0
                        ? "No available professors"
                        : "Participating Professors"
                    }
                    fieldType="single"
                    options={availableProfessors}
                    value={selectedProf}
                    onChange={(e: any) => {
                      const val = e.target ? e.target.value : e;
                      setSelectedProf(val);
                      const opt = availableProfessors.find(
                        (o) => o.value === val
                      );
                      if (opt) {
                        const already = values.professors.some(
                          (p: any) => p.value === opt.value
                        );
                        if (!already) {
                          setFieldValue("professors", [
                            ...values.professors,
                            opt,
                          ]);
                        }
                      }
                      setSelectedProf("");
                    }}
                    name="professors"
                    usePortalPositioning={true}
                    disabled={availableProfessors.length === 0}
                  />
                  {errors.professors && touched.professors ? (
                    <Typography
                      sx={{ color: "#db3030", fontSize: "0.875rem", mt: 0.5 }}
                    >
                      {errors.professors.toString()}
                    </Typography>
                  ) : (
                    <></>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      marginTop: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    {values.professors.map((prof) => (
                      <Chip
                        key={prof.value}
                        label={prof.label}
                        onDelete={() =>
                          setFieldValue(
                            "professors",
                            values.professors.filter(
                              (p) => p.value !== prof.value
                            )
                          )
                        }
                        sx={{
                          m: 0.5,
                          borderColor: accentColor,
                          color: accentColor,
                          "& .MuiChip-deleteIcon": {
                            color: accentColor,
                            "&:hover": {
                              color: `${accentColor}CC`,
                            },
                          },
                        }}
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Typography
                    sx={{
                      ...detailTitleStyles(theme),
                      fontSize: "16px",
                      mb: 1,
                    }}
                  >
                    Extra Resources
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      marginBottom: "12px",
                      alignItems: "center",
                    }}
                  >
                    <CustomTextField
                      label="Extra Resources"
                      name="extraResources"
                      id="extraResources"
                      fieldType="text"
                      value={resourceInput}
                      onChange={(e: any) => setResourceInput(e.target.value)}
                      placeholder="e.g., Lab Equipment"
                      autoCapitalize="off"
                      autoCapitalizeName={false}
                      fullWidth
                    />
                    <IconButton
                      onClick={() => {
                        const trimmed = resourceInput.trim();
                        if (
                          trimmed &&
                          !values.extraResources.includes(trimmed)
                        ) {
                          setFieldValue("extraResources", [
                            ...values.extraResources,
                            trimmed,
                          ]);
                          setResourceInput("");
                        }
                      }}
                      sx={{
                        backgroundColor: accentColor,
                        color: "white",
                        width: "40px",
                        height: "40px",
                        "&:hover": {
                          backgroundColor: `${accentColor}E6`,
                        },
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      marginBottom: "12px",
                    }}
                  >
                    {values.extraResources.map((res) => (
                      <Chip
                        key={res}
                        label={res}
                        onDelete={() =>
                          setFieldValue(
                            "extraResources",
                            values.extraResources.filter((r) => r !== res)
                          )
                        }
                        sx={{
                          m: 0.5,
                          borderColor: accentColor,
                          color: accentColor,
                          "& .MuiChip-deleteIcon": {
                            color: accentColor,
                            "&:hover": {
                              color: `${accentColor}CC`,
                            },
                          },
                        }}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Paper>
              )}

              {/* Submit Button */}
              <Box
                sx={{
                  mt: 2,
                  textAlign: "right",
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <CustomButton
                  disabled={isSubmitting}
                  label={isSubmitting ? "Creating..." : "Create"}
                  variant="contained"
                  color="tertiary"
                  type="submit"
                  sx={{
                    px: 3,
                    width: "180px",
                    height: "40px",
                    fontWeight: 700,
                    fontSize: "16px",
                    borderRadius: "20px",
                    boxShadow: `0 2px 8px 0 ${accentColor}20`,
                    background: accentColor,
                    "&:hover": {
                      background: `${accentColor}E6`,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </form>
      </Box>
    </CustomModalLayout>
  );
};

export default CreateWorkshop;
