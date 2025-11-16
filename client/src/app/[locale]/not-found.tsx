"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Box, Container, Typography, Stack, alpha, useTheme } from "@mui/material";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import VectorFloating from "@/components/shared/VectorFloating";

// Helper: Get stakeholder default route
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDefaultRoute = (user: any): string => {
  if (!user) return "/";

  const roleMap: Record<string, { entity: string; tab: string; section: string }> = {
    student: { entity: "student", tab: "events", section: "browse-events" },
    vendor: { entity: "vendor", tab: "opportunities", section: "bazaars" },
    staff: { entity: "staff", tab: "events", section: "browse-events" },
    ta: { entity: "ta", tab: "events", section: "browse-events" },
    professor: { entity: "professor", tab: "workshops", section: "my-workshops" },
    "events-office": { entity: "events-office", tab: "events", section: "all-events" },
    admin: { entity: "admin", tab: "users", section: "all-users" },
  };

  let roleKey = "student";
  if (user.role === "student") roleKey = "student";
  else if (user.role === "vendor") roleKey = "vendor";
  else if (user.role === "staffMember") {
    if (user.position === "professor") roleKey = "professor";
    else if (user.position === "TA") roleKey = "ta";
    else roleKey = "staff";
  } else if (user.role === "administration") {
    if (user.roleType === "eventsOffice") roleKey = "events-office";
    else roleKey = "admin";
  }

  const config = roleMap[roleKey];
  return `/${config.entity}/${config.tab}/${config.section}`;
};

export default function NotFound() {
  const router = useRouter();
  const theme = useTheme();
  const { user, isLoading } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [redirectPath, setRedirectPath] = useState<string>("/");

  useEffect(() => {
    // Determine redirect path
    if (!isLoading) {
      if (user) {
        // Try to get last valid route from sessionStorage
        const lastValidRoute = sessionStorage.getItem("lastValidRoute");
        if (lastValidRoute) {
          setRedirectPath(lastValidRoute);
        } else {
          // Fallback to stakeholder default
          setRedirectPath(getDefaultRoute(user));
        }
      } else {
        setRedirectPath("/");
      }
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (isLoading || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace(redirectPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, redirectPath, router, isLoading]);

  const handleRedirectNow = () => {
    router.replace(redirectPath);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(circle at top left, ${alpha(
            theme.palette.primary.main,
            0.15
          )}, transparent 50%), radial-gradient(circle at bottom right, ${alpha(
            theme.palette.tertiary.main,
            0.12
          )}, transparent 55%)`,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            opacity: 0.22,
            pointerEvents: "none",
          }}
        >
          <VectorFloating />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at top left, ${alpha(
          theme.palette.primary.main,
          0.15
        )}, transparent 50%), radial-gradient(circle at bottom right, ${alpha(
          theme.palette.tertiary.main,
          0.12
        )}, transparent 55%)`,
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
      }}
    >
      {/* Background animated shapes */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: 0.18,
          pointerEvents: "none",
        }}
      >
        <VectorFloating />
      </Box>

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={5} alignItems="center" textAlign="center">
          {/* 404 Display */}
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "8rem", sm: "12rem", md: "14rem" },
                fontWeight: 700,
                letterSpacing: "0.02em",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                opacity: 0.9,
                lineHeight: 1,
              }}
            >
              404
            </Typography>
          </Box>

          {/* Error Message */}
          <Stack spacing={2} alignItems="center" maxWidth={600}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                color: theme.palette.text.primary,
                letterSpacing: "0.02em",
              }}
            >
              Page Not Found
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.1rem" },
                color: alpha(theme.palette.text.primary, 0.7),
                maxWidth: 480,
                lineHeight: 1.6,
              }}
            >
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              Don&apos;t worry, we&apos;ll get you back on track.
            </Typography>
          </Stack>

          {/* Countdown Display */}
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: -8,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.15
                )}, ${alpha(theme.palette.tertiary.main, 0.15)})`,
                filter: "blur(20px)",
              }}
            />
            <Box
              sx={{
                width: { xs: 100, sm: 120 },
                height: { xs: 100, sm: 120 },
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: theme.palette.background.paper,
                border: `3px solid ${theme.palette.primary.main}`,
                boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: -6,
                  borderRadius: "50%",
                  border: `2px solid ${alpha(theme.palette.tertiary.main, 0.3)}`,
                },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", sm: "3rem" },
                  color: theme.palette.primary.main,
                }}
              >
                {countdown}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem" },
              color: alpha(theme.palette.text.primary, 0.65),
              fontWeight: 500,
            }}
          >
            Redirecting you in {countdown} second{countdown !== 1 ? "s" : ""}...
          </Typography>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              width: "100%",
              maxWidth: 480,
              mt: 2,
            }}
          >
            <CustomButton
              variant="contained"
              onClick={handleRedirectNow}
              sx={{
                flex: 1,
                height: 54,
                fontSize: "1rem",
                fontWeight: 700,
                backgroundColor: theme.palette.tertiary.main,
                color: theme.palette.tertiary.contrastText,
                border: `2px solid ${theme.palette.tertiary.dark}`,
                "&:hover": {
                  backgroundColor: theme.palette.tertiary.dark,
                  borderColor: theme.palette.tertiary.dark,
                },
                boxShadow: `0 10px 24px ${alpha(
                  theme.palette.tertiary.main,
                  0.3
                )}`,
              }}
            >
              Take Me Back Now
            </CustomButton>
            <CustomButton
              variant="outlined"
              color="primary"
              onClick={() => router.push("/")}
              sx={{
                flex: 1,
                height: 54,
                fontSize: "1rem",
                fontWeight: 700,
              }}
            >
              Go to Home
            </CustomButton>
          </Stack>

          {/* Support Link */}
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.875rem",
              color: alpha(theme.palette.text.primary, 0.5),
              mt: 4,
            }}
          >
            If you continue to experience issues, please{" "}
            <Typography
              component="a"
              href="mailto:support@multaqa.com"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: "none",
                fontWeight: 600,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              contact support
            </Typography>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}