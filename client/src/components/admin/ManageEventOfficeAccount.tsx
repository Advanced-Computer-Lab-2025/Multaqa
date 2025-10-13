"use client";

import React, { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
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
} from "./utils";
import { mapEntityToRole } from "@/utils";

const initialAccounts: Account[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@guc.edu.eg",
    accountType: "Admin",
    createdDate: "15/01/2025",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@guc.edu.eg",
    accountType: "Event Office",
    createdDate: "20/01/2025",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@guc.edu.eg",
    accountType: "Admin",
    createdDate: "25/01/2025",
  },
];

export default function ManageEventOfficeAccount() {
  const theme = useTheme();
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "",
    },
    validationSchema: accountCreationSchema,
    onSubmit: (values) => {
      handleCreateAccount(values, setAccounts, handleCloseCreate);
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

  const deleteAccountHandler = () => {
    if (accountToDelete) {
      handleDeleteAccount(
        accountToDelete,
        accounts,
        setAccounts,
        handleCloseDeleteModal
      );
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
          onClick={() => handleOpenDeleteModal(account)}
          startIcon={<DeleteIcon />}
          sx={{
            width: "100%",
            maxWidth: "100px !important",
            padding: "4px 12px !important",
            fontSize: "12px !important",
            height: "32px !important",
            minHeight: "32px !important",
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
        items={accounts}
        renderItem={renderAccountCard}
        noItemsMessage="No Accounts Available"
        noItemsSubtitle="There are no admin or event office accounts to display."
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
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontWeight: 700,
                color: theme.palette.tertiary.main,
                textAlign: "center",
                mb: 3,
              }}
            >
              Create New Account
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <CustomTextField
                label="Full Name"
                fieldType="text"
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
                placeholder="Enter GUC email (name@guc.edu.eg)"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
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
