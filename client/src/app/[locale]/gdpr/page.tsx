"use client";

import { Box, Container, Divider, Stack, Typography, alpha, useTheme } from "@mui/material";
import BackButton from "@/components/shared/Navigation/BackButton";

const sections = [
  {
    title: "Our GDPR Commitment",
    body:
      "Multaqa aligns with the General Data Protection Regulation by minimizing data collection, documenting processing purposes, and ensuring users can exercise their rights to access, rectification, and erasure.",
  },
  {
    title: "Lawful Basis for Processing",
    body:
      "User data is processed under the legitimate interest of the German University in Cairo to manage academic and extracurricular events. Vendor data is handled under contractual necessity once participation requests are approved.",
  },
  {
    title: "International Transfers",
    body:
      "All primary services are hosted within the university’s infrastructure. If third-party services are introduced, we will evaluate their compliance with GDPR and provide relevant transfer safeguards.",
  },
  {
    title: "Contact & Data Rights",
    body:
      "Reach the Multaqa team at multaqa-support@guc.edu.eg to request data exports, corrections, or deletion. We coordinate with the Events Office to respond within statutory timelines.",
  },
];

export default function GdprCompliancePage() {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
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
              GDPR Compliance
            </Typography>
            <Typography variant="body1" sx={{ color: alpha(theme.palette.text.primary, 0.7) }}>
              This guide explains how Multaqa incorporates GDPR principles while supporting events at the German
              University in Cairo.
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
            Last updated: {new Date().getFullYear()} &mdash; Prepared by the Multaqa development team to document GDPR
            alignment during the pilot phase.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}


