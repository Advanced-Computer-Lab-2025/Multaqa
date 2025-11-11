"use client";

import {
  Box,
  Container,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Link } from "@/i18n/navigation";
import BackButton from "@/components/shared/Navigation/BackButton";

const topics = [
  {
    title: "Need help registering?",
    body: "Review the event card to confirm eligibility, then follow the on-screen steps. If a registration fails, capture the error message and contact the Events Office through the form below.",
  },
  {
    title: "Questions about vendor participation?",
    body: "Vendors can track booth approvals, upload documentation, and message organizers directly in Multaqa. For urgent issues, email the Events Office team with your vendor ID and event name.",
  },
  {
    title: "Report an issue or suggest an improvement",
    body: "Multaqa is evolving with your feedback. Share bugs, accessibility concerns, or feature requests so the CSEN 704 development team can prioritize fixes for upcoming iterations.",
  },
];

export default function SupportPage() {
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
              Support & Contact
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: alpha(theme.palette.text.primary, 0.7) }}
            >
              We’re here to ensure every campus event runs smoothly. Start with
              the resources below or reach out directly for assistance.
            </Typography>
          </Stack>

          <Divider />

          <Stack spacing={4}>
            {topics.map((topic) => (
              <Stack key={topic.title} spacing={1.5}>
                <Typography
                  component="h2"
                  variant="h5"
                  sx={{ fontWeight: 600 }}
                >
                  {topic.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha(theme.palette.text.primary, 0.78),
                    lineHeight: 1.7,
                  }}
                >
                  {topic.body}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <Typography component="h2" variant="h5" sx={{ fontWeight: 600 }}>
              Contact the Multaqa Team
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: alpha(theme.palette.text.primary, 0.72) }}
            >
              Email us at{" "}
              <MuiLink
                href="mailto:multaqa-support@guc.edu.eg"
                sx={{ fontWeight: 600 }}
              >
                multaqa-support@guc.edu.eg
              </MuiLink>{" "}
              or visit{" "}
              <MuiLink
                component={Link}
                href="/vendor/support"
                sx={{ fontWeight: 600 }}
              >
                Vendor Support
              </MuiLink>{" "}
              for vendor-specific guidance.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
