"use client";

import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import BackButton from "@/components/shared/Navigation/BackButton";

const sections = [
  {
    title: "Information We Collect",
    body: "Multaqa stores only the minimum information required to facilitate event registration and platform access. This includes account details provided by the German University in Cairo and any data you willingly submit, such as vendor profiles or event preferences.",
  },
  {
    title: "How We Use Your Information",
    body: "Collected information is used to authenticate users, manage event participation, coordinate with organizers and vendors, and deliver updates or reminders. We do not sell or share personal information outside the Multaqa project team and relevant university stakeholders.",
  },
  {
    title: "Your Privacy Choices",
    body: "You may review, update, or request removal of your data by contacting the Multaqa team. Sensitive operations, such as account deletion, may require verification through official university channels to protect all parties involved.",
  },
];

export default function PrivacyPolicyPage() {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: alpha(theme.palette.primary.light, 0.04),
        py: { xs: 8, md: 12 },
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="flex-start">
            <BackButton label="Back to previous" />
          </Stack>

          <Stack spacing={1.5}>
            <Typography component="h1" variant="h3" sx={{ fontWeight: 600 }}>
              Privacy Policy
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: alpha(theme.palette.text.primary, 0.7) }}
            >
              This document outlines how Multaqa handles member, staff, and
              vendor information. It will be expanded with official legal
              language as the platform moves toward production release.
            </Typography>
          </Stack>

          <Divider />

          <Stack spacing={4}>
            {sections.map((section) => (
              <Stack key={section.title} spacing={1.5}>
                <Typography
                  component="h2"
                  variant="h5"
                  sx={{ fontWeight: 600 }}
                >
                  {section.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha(theme.palette.text.primary, 0.78),
                    lineHeight: 1.7,
                  }}
                >
                  {section.body}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Divider />

          <Typography
            variant="body2"
            sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
          >
            Last updated: {new Date().getFullYear()} &mdash; This page is a
            working draft prepared by the CSEN 704 team for internal use at the
            German University in Cairo.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
