"use client";

import { Box, Container, Divider, Stack, Typography, alpha, useTheme } from "@mui/material";
import BackButton from "@/components/shared/Navigation/BackButton";

const sections = [
  {
    title: "What Are Cookies?",
    body:
      "Cookies are small text files stored on your device that help Multaqa remember preferences, maintain secure sessions, and provide analytics that improve campus event experiences.",
  },
  {
    title: "How Multaqa Uses Cookies",
    body:
      "We rely on strictly necessary cookies for authentication as well as optional analytics cookies to understand platform usage. Third-party cookies are not used unless explicitly referenced in future integrations.",
  },
  {
    title: "Managing Your Preferences",
    body:
      "You can clear or block cookies through your browser settings. Keep in mind that disabling essential cookies may limit your ability to log in or register for events.",
  },
];

export default function CookiesPage() {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: alpha(theme.palette.tertiary.light, 0.04),
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
              Cookies Notice
            </Typography>
            <Typography variant="body1" sx={{ color: alpha(theme.palette.text.primary, 0.7) }}>
              Learn how Multaqa uses cookies while delivering a streamlined campus event experience. This summary will
              be refined alongside formal privacy documentation.
            </Typography>
          </Stack>

          <Divider />

          <Stack spacing={4}>
            {sections.map((section) => (
              <Stack key={section.title} spacing={1.5}>
                <Typography component="h2" variant="h5" sx={{ fontWeight: 600 }}>
                  {section.title}
                </Typography>
                <Typography variant="body1" sx={{ color: alpha(theme.palette.text.primary, 0.78), lineHeight: 1.7 }}>
                  {section.body}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Divider />

          <Typography variant="body2" sx={{ color: alpha(theme.palette.text.primary, 0.6) }}>
            Last updated: {new Date().getFullYear()} &mdash; Prepared by the Multaqa project team for transparency and
            future compliance considerations.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}


