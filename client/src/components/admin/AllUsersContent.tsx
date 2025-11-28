"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { capitalizeName } from "../shared/input-fields/utils";
import CustomButton from "../shared/Buttons/CustomButton";
import { CustomModalLayout } from "../shared/modals";
import { CustomTextField, CustomSelectField } from "../shared/input-fields";
import StatusChip from "../shared/StatusChip";
import ManagementScreen from "./shared/ManagementScreen";
import { User } from "./types";
import { userCreationSchema, handleCreateUser, fetchAllUsers } from "./utils";

export default function AllUsersContent() {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userRole: "",
    },
    validationSchema: userCreationSchema,
    onSubmit: (values) => {
      const normalizedValues = {
        ...values,
        fullName: capitalizeName(String(values.fullName ?? ""), false),
      };

      handleCreateUser(normalizedValues, setUsers, handleCloseCreate);
    },
  });

  const userRoleOptions = useMemo(
    () => [
      { label: "Student", value: "Student" },
      { label: "Staff", value: "Staff" },
      { label: "TA", value: "TA" },
      { label: "Professor", value: "Professor" },
      { label: "Admin", value: "Admin" },
      { label: "Event Office", value: "Event Office" },
      { label: "Vendor", value: "Vendor" },
    ],
    []
  );

  const handleOpenCreate = () => setCreateOpen(true);
  const handleCloseCreate = () => {
    setCreateOpen(false);
    formik.resetForm();
  };

  const renderUserCard = (user: User) => (
    <Box
      key={user.id}
      sx={{
        border: "2px solid #e0e0e0",
        borderRadius: "12px",
        padding: "16px",
        backgroundColor: "#fff",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "220px",
        "&:hover": {
          borderColor: theme.palette.tertiary.main,
          boxShadow: "0 2px 8px rgba(58, 79, 153, 0.1)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
          flexGrow: 1,
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 600,
              color: "text.primary",
              fontSize: "16px",
              mb: 0.5,
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {user.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: "14px",
              mb: 1,
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {user.email}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#9e9e9e",
              fontSize: "12px",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            Registered:{" "}
            {user.verifiedAt
              ? new Date(user.verifiedAt).toLocaleDateString("en-GB")
              : user.createdDate}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "rgba(98, 153, 208, 0.1)",
            color: theme.palette.primary.main,
            borderRadius: "16px",
            padding: "4px 12px",
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {user.role}
        </Box>
      </Box>

      <Box sx={{ mt: "auto" }}>
        <StatusChip status={user.status} />
      </Box>
    </Box>
  );

  return (
    <>
      <ManagementScreen
        pageTitle="All Users"
        pageSubtitle="View all registered users and their current status"
        boxTitle="User Overview"
        boxSubtitle="Create new user accounts or review existing ones"
        boxIcon={<ManageAccountsIcon fontSize="small" />}
        borderColor={theme.palette.tertiary.main}
        items={loading ? [] : users}
        renderItem={renderUserCard}
        noItemsMessage={loading ? "Loading users..." : "No Users Found"}
        noItemsSubtitle={
          loading
            ? "Please wait while we fetch the users"
            : "There are no users to display."
        }
      />

      {/* Create Account Modal */}
      <CustomModalLayout
        open={createOpen}
        onClose={handleCloseCreate}
        width="w-[90vw] sm:w-[80vw] md:w-[600px]"
        borderColor={theme.palette.primary.main}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontWeight: 700,
                color: theme.palette.primary.main,
                textAlign: "center",
                mb: 3,
              }}
            >
              Create New Account
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <CustomTextField
                label="Full Name"
                fieldType="name"
                placeholder="Enter full name"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={
                  formik.touched.fullName ? formik.errors.fullName : ""
                }
                neumorphicBox
                required
                fullWidth
              />

              <CustomTextField
                label="Email"
                fieldType="email"
                placeholder="Enter GUC email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isError={
                  formik.touched.email ? Boolean(formik.errors.email) : false
                }
                helperText={formik.touched.email ? formik.errors.email : ""}
                neumorphicBox
                required
                fullWidth
              />

              <CustomTextField
                label="Password"
                fieldType="password"
                placeholder="Minimum 8 characters"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isError={
                  formik.touched.password
                    ? Boolean(formik.errors.password)
                    : false
                }
                helperText={
                  formik.touched.password ? formik.errors.password : ""
                }
                neumorphicBox
                required
                fullWidth
              />

              <CustomTextField
                label="Confirm Password"
                fieldType="password"
                placeholder="Re-enter password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isError={
                  formik.touched.confirmPassword
                    ? Boolean(formik.errors.confirmPassword)
                    : false
                }
                helperText={
                  formik.touched.confirmPassword
                    ? formik.errors.confirmPassword
                    : ""
                }
                neumorphicBox
                required
                fullWidth
              />

              <CustomSelectField
                name="userRole"
                label="User Role"
                fieldType="single"
                options={userRoleOptions}
                value={formik.values.userRole}
                onChange={(value) => formik.setFieldValue("userRole", value)}
                onBlur={() => formik.setFieldTouched("userRole", true)}
                isError={
                  formik.touched.userRole
                    ? Boolean(formik.errors.userRole)
                    : false
                }
                helperText={
                  formik.touched.userRole ? formik.errors.userRole : ""
                }
                placeholder="Select user role"
                neumorphicBox
                required
                fullWidth
                usePortalPositioning={true}
              />
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
            >
              <CustomButton
                label="Cancel"
                variant="outlined"
                color="primary"
                onClick={handleCloseCreate}
                sx={{ width: "160px", height: "44px", borderRadius: "12px" }}
              />
              <CustomButton
                label="Create"
                type="submit"
                variant="contained"
                color="primary"
                disabled={!(formik.isValid && formik.dirty)}
                startIcon={<PersonAddIcon />}
                sx={{
                  width: "160px",
                  height: "44px",
                  borderRadius: "12px",
                  fontWeight: 700,
                }}
              />
            </Box>
          </Box>
        </form>
      </CustomModalLayout>
    </>
  );
}
