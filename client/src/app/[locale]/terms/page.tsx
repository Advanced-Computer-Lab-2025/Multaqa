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
    title: "Using Multaqa",
    body: "Multaqa is an academic project that streamlines event engagement at the German University in Cairo. By accessing the platform, you agree to use the service responsibly, respect campus policies, and provide accurate information when registering for activities or proposing events.",
  },
  {
    title: "User Responsibilities",
    body: "Students, staff, vendors, and administrators are expected to protect their account credentials, comply with applicable university regulations, and report suspected misuse. Vendors must maintain valid agreements with the Events Office before offering services through Multaqa.",
  },
  {
    title: "Platform Availability",
    body: "Multaqa is currently under active development. Features, availability, and requirements may change as the project evolves. We reserve the right to update these terms and will communicate significant changes during the project lifecycle.",
  },
];

export default function TermsOfServicePage() {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: theme.palette.background.default,
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
              Terms of Service
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: alpha(theme.palette.text.primary, 0.7) }}
            >
              These terms describe how Multaqa should be used while the platform
              is piloted for campus-wide events. They will be updated with
              formal legal review before public release.
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
            Last updated: {new Date().getFullYear()} &mdash; Drafted by the CSEN
            704 Multaqa team for internal review.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
