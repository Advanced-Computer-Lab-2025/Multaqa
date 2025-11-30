"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import DeleteButton from "../shared/Buttons/DeleteButton";
import { CustomModal, CustomModalLayout } from "../shared/modals";
import { CustomTextField, CustomSelectField } from "../shared/input-fields";
import ManagementScreen from "./shared/ManagementScreen";
import CustomButton from "../shared/Buttons/CustomButton";
import ManagementCard from "../shared/containers/ManagementCard";
import { Account } from "./types";
import {
  accountCreationSchema,
  handleCreateAccount,
  handleDeleteAccount,
  fetchAdminAccounts,
} from "./utils";
import { capitalizeName } from "../shared/input-fields/utils";

export default function ManageEventOfficeAccountContent() {
  const theme = useTheme();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch admin accounts on component mount
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true);
        const fetchedAccounts = await fetchAdminAccounts();
        setAccounts(fetchedAccounts);
        setError(null);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load accounts";
        setError(errorMessage);
        console.error("Error loading accounts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "",
    },
    validationSchema: accountCreationSchema,
    onSubmit: async (values) => {
      try {
        const normalizedValues = {
          ...values,
          fullName: capitalizeName(String(values.fullName ?? ""), false),
        };

        await handleCreateAccount(
          normalizedValues,
          setAccounts,
          handleCloseCreate
        );
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create account";
        console.error("Error creating account:", errorMessage);
      }
    },
  });

  const accountTypeOptions = useMemo(
    () => [
      { label: "Admin", value: "Admin" },
      { label: "Event Office", value: "Event Office" },
    ],
    []
  );

  const handleOpenDeleteModal = (account: Account) => {
    setAccountToDelete(account);
  };

  const handleCloseDeleteModal = () => {
    setAccountToDelete(null);
  };

  const deleteAccountHandler = async () => {
    if (accountToDelete) {
      try {
        await handleDeleteAccount(
          accountToDelete,
          accounts,
          setAccounts,
          handleCloseDeleteModal
        );
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete account";
        console.error("Error deleting account:", errorMessage);
      }
    }
  };

  const handleOpenCreate = () => setCreateOpen(true);
  const handleCloseCreate = () => {
    setCreateOpen(false);
    formik.resetForm();
  };

  const renderAccountCard = (account: Account) => (
    <ManagementCard
      key={account.id}
      name={account.name}
      email={account.email}
      details={
        <Typography
          variant="caption"
          sx={{
            color: "#9e9e9e",
            fontSize: "12px",
          }}
        >
          Created: {account.createdDate}
        </Typography>
      }
      statusComponent={
        <Box
          sx={{
            backgroundColor:
              account.accountType === "Admin"
                ? "rgba(58, 79, 153, 0.1)"
                : "rgba(98, 153, 208, 0.1)",
            color:
              account.accountType === "Admin"
                ? theme.palette.tertiary.main
                : theme.palette.primary.main,
            borderRadius: "16px",
            padding: "4px 12px",
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
          }}
        >
          {account.accountType}
        </Box>
      }
      actions={
        <DeleteButton
          label="Delete"
          variant="outlined"
          size="small"
          onClick={() => handleOpenDeleteModal(account)}
          startIcon={<DeleteIcon />}
          sx={{
            width: "100%",
            maxWidth: "100px !important",
            padding: "4px 16px !important",
            fontSize: "14px !important",
            height: "40px !important",
            minHeight: "40px !important",
            "& .MuiButton-startIcon": {
              marginRight: "4px",
              "& svg": {
                fontSize: "16px",
              },
            },
          }}
        />
      }
      hoverBorderColor={theme.palette.tertiary.main}
      hoverBoxShadow="0 2px 8px rgba(58, 79, 153, 0.1)"
    />
  );

  return (
    <>
      {error && (
        <Box
          sx={{
            backgroundColor: "rgba(211, 47, 47, 0.1)",
            border: "1px solid",
            borderColor: "error.main",
            borderRadius: "12px",
            padding: "16px",
            margin: "16px 0",
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
          }}
        >
          <Typography color="error" sx={{ fontWeight: 600 }}>
            Error loading accounts: {error}
          </Typography>
        </Box>
      )}

      <ManagementScreen
        pageTitle="Manage Accounts"
        pageSubtitle="Create, review, and manage admin and event office accounts"
        boxTitle="Account Management"
        boxSubtitle="Create new accounts or remove existing ones as needed"
        boxIcon={<ManageAccountsIcon fontSize="small" />}
        borderColor={theme.palette.tertiary.main}
        createButtonLabel="Create Account"
        createButtonIcon={<PersonAddIcon />}
        onOpenCreate={handleOpenCreate}
        items={loading ? [] : accounts}
        renderItem={renderAccountCard}
        noItemsMessage={
          loading ? "Loading accounts..." : "No Accounts Available"
        }
        noItemsSubtitle={
          loading
            ? "Please wait while we fetch the accounts"
            : "There are no admin or event office accounts to display."
        }
      />

      {/* Delete Confirmation Modal */}
      {accountToDelete && (
        <CustomModal
          open={accountToDelete !== null}
          onClose={handleCloseDeleteModal}
          title="Delete Account"
          description={`Are you sure you want to delete the account for "${accountToDelete.name}"? (${accountToDelete.email} - ${accountToDelete.accountType}). This action cannot be undone.`}
          modalType="delete"
          borderColor={theme.palette.error.main}
          buttonOption1={{
            label: "Delete Account",
            variant: "contained",
            color: "error",
            onClick: deleteAccountHandler,
          }}
          buttonOption2={{
            label: "Cancel",
            variant: "outlined",
            color: "error",
            onClick: handleCloseDeleteModal,
          }}
        >
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-poppins), system-ui, sans-serif",
                color: "text.primary",
                mb: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              {accountToDelete.name}
            </Typography>

            <Typography
              sx={{
                fontFamily: "var(--font-poppins), system-ui, sans-serif",
                color: "#666",
                mb: 1,
                fontSize: "0.95rem",
              }}
            >
              {accountToDelete.email}
            </Typography>

            <Typography
              sx={{
                fontFamily: "var(--font-poppins), system-ui, sans-serif",
                color: "#666",
                mb: 3,
                fontSize: "0.9rem",
              }}
            >
              {accountToDelete.accountType} • Created:{" "}
              {accountToDelete.createdDate}
            </Typography>

            <Typography
              sx={{
                fontFamily: "var(--font-poppins), system-ui, sans-serif",
                color: theme.palette.error.main,
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Are you sure you want to delete this account? This action cannot
              be undone.
            </Typography>
          </Box>
        </CustomModal>
      )}

      {/* Create Account Modal */}
      <CustomModalLayout
        open={createOpen}
        onClose={handleCloseCreate}
        width="w-[90vw] sm:w-[80vw] md:w-[600px]"
        borderColor={theme.palette.primary.main}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
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
                onChange={(event) => {
                  // Let CustomTextField handle capitalization first, then update Formik
                  formik.setFieldValue("fullName", event.target.value);
                }}
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
                placeholder="Enter GUC email (name@guc.edu.eg)"
                name="email"
                value={formik.values.email}
                onChange={(event) => {
                  // Let CustomTextField handle email domain appending, then update Formik
                  formik.setFieldValue("email", event.target.value);
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email ? formik.errors.email : ""}
                neumorphicBox
                required
                fullWidth
                stakeholderType="staff"
              />

              <CustomTextField
                label="Password"
                fieldType="password"
                placeholder="Minimum 8 characters"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
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
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
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
              name="accountType"
                label="Account Type"
                fieldType="single"
                options={accountTypeOptions}
                value={formik.values.accountType}
                onChange={(value) => {
                  formik.setFieldValue("accountType", value);
                }}
                onBlur={() => {
                  formik.setFieldTouched("accountType", true);
                }}
                isError={
                  formik.touched.accountType
                    ? Boolean(formik.errors.accountType)
                    : false
                }
                helperText={
                  formik.touched.accountType ? formik.errors.accountType : ""
                }
                placeholder="Select account type"
                neumorphicBox
                required
                fullWidth
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
                sx={{ width: "160px", height: "44px" }}
              />
              <CustomButton
                label="Create"
                type="submit"
                variant="contained"
                color="primary"
                disabled={!(formik.isValid && formik.dirty)}
                startIcon={<PersonAddIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
                sx={{
                  width: "160px",
                  height: "44px",
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
