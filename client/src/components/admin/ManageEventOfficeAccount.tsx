"use client";

import React, { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTheme } from "@mui/material/styles";
import DeleteButton from "../shared/Buttons/DeleteButton";
import CustomButton from "../shared/Buttons/CustomButton";
import { CustomModal, CustomModalLayout } from "../shared/modals";
import { CustomTextField, CustomSelectField } from "../shared/input-fields";

type Account = {
  id: string;
  name: string;
  email: string;
  accountType: "Admin" | "Event Office";
  createdDate: string;
};

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
  const [newName, setNewName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newType, setNewType] = useState<string | number>("");

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

  const handleDeleteAccount = () => {
    if (accountToDelete) {
      // TODO: API call to delete account
      setAccounts(accounts.filter((acc) => acc.id !== accountToDelete.id));
      handleCloseDeleteModal();
    }
  };

  const handleOpenCreate = () => setCreateOpen(true);
  const handleCloseCreate = () => {
    setCreateOpen(false);
    setNewName("");
    setNewLastName("");
    setNewEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setNewType("");
  };

  const handleAccountTypeChange = (
    value: string | number | string[] | number[]
  ) => {
    const nextValue = Array.isArray(value)
      ? ((value[0] ?? "") as string | number)
      : (value as string | number);
    setNewType(nextValue);
  };

  const canCreate =
    newName.trim().length > 0 &&
    newLastName.trim().length > 0 &&
    newEmail.trim().length > 0 &&
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword &&
    Boolean(newType);

  const handleCreateAccount = () => {
    if (!canCreate) return;
    // TODO: API call to create account
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const createdDate = `${dd}/${mm}/${yyyy}`;

    const created: Account = {
      id: String(Date.now()),
      name: `${newName.trim()} ${newLastName.trim()}`,
      email: newEmail.trim(),
      accountType: newType as "Admin" | "Event Office",
      createdDate,
    };
    setAccounts((prev) => [created, ...prev]);
    handleCloseCreate();
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "transparent",
        minHeight: "100vh",
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontWeight: 700,
            color: "#1E1E1E",
            mb: 1,
          }}
        >
          Manage Accounts
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#757575",
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
          }}
        >
          Create, review, and manage admin and event office accounts
        </Typography>
      </Box>

      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            border: "2px solid #3a4f99",
            borderRadius: "16px",
            padding: "24px",
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  backgroundColor: "rgba(58, 79, 153, 0.1)",
                  color: "#3a4f99",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "14px",
                  fontFamily: "var(--font-poppins), system-ui, sans-serif",
                }}
              >
                <ManageAccountsIcon fontSize="small" />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    fontWeight: 600,
                    color: "#3a4f99",
                    fontSize: "18px",
                    mb: 0.5,
                  }}
                >
                  Account Management
                </Typography>
                <Typography
                  sx={{
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  Create new accounts or remove existing ones as needed
                </Typography>
              </Box>
            </Box>

            <CustomButton
              label="Create Account"
              variant="contained"
              width="auto"
              color="primary"
              onClick={handleOpenCreate}
              startIcon={<PersonAddIcon />}
              sx={{ borderRadius: "12px", fontWeight: 700 }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
            }}
          >
            {accounts.map((account) => (
              <Box
                key={account.id}
                sx={{
                  border: "2px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "16px",
                  backgroundColor: "#fff",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#3a4f99",
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
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "var(--font-jost), system-ui, sans-serif",
                        fontWeight: 600,
                        color: "#1E1E1E",
                        fontSize: "16px",
                        mb: 0.5,
                      }}
                    >
                      {account.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: "14px",
                        mb: 1,
                      }}
                    >
                      {account.email}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9e9e9e",
                        fontSize: "12px",
                      }}
                    >
                      Created: {account.createdDate}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor:
                        account.accountType === "Admin"
                          ? "rgba(58, 79, 153, 0.1)"
                          : "rgba(98, 153, 208, 0.1)",
                      color:
                        account.accountType === "Admin" ? "#3a4f99" : "#6299d0",
                      borderRadius: "16px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      fontFamily: "var(--font-poppins), system-ui, sans-serif",
                    }}
                  >
                    {account.accountType}
                  </Box>
                </Box>

                <DeleteButton
                  label="Delete"
                  variant="outlined"
                  onClick={() => handleOpenDeleteModal(account)}
                  startIcon={<DeleteIcon />}
                  sx={{
                    fontSize: "14px",
                    width: "100%",
                    maxWidth: "120px",
                    display: "flex",
                    alignSelf: "flex-end",
                    justifySelf: "flex-end",
                  }}
                />
              </Box>
            ))}
          </Box>

          {accounts.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "#757575",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                No Accounts Available
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>
                There are no admin or event office accounts to display.
              </Typography>
            </Box>
          )}
        </Box>

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
              onClick: handleDeleteAccount,
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
                  color: "#1E1E1E",
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
                  color: "#db3030",
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
                label="First Name"
                fieldType="text"
                placeholder="Enter first name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                neumorphicBox
                required
                fullWidth
              />

              <CustomTextField
                label="Last Name"
                fieldType="text"
                placeholder="Enter last name"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                neumorphicBox
                required
                fullWidth
              />

              <CustomTextField
                label="Email"
                fieldType="email"
                placeholder="Enter GUC email (name@guc.edu.eg)"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                neumorphicBox
                required
                fullWidth
              />

              <CustomTextField
                label="Password"
                fieldType="password"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                neumorphicBox
                required
                fullWidth
              />

              <CustomTextField
                label="Confirm Password"
                fieldType="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                neumorphicBox
                required
                fullWidth
              />

              <CustomSelectField
                label="Account Type"
                fieldType="single"
                options={accountTypeOptions}
                value={newType}
                onChange={handleAccountTypeChange}
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
                variant="contained"
                color="primary"
                onClick={handleCreateAccount}
                disabled={!canCreate}
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
        </CustomModalLayout>
      </Box>
    </Box>
  );
}
