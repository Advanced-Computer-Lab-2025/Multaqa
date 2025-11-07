"use client";

import { useState } from "react";
import {
  alpha,
  Box,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PlaceIcon from "@mui/icons-material/Place";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PaletteIcon from "@mui/icons-material/Palette";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Link } from "@/i18n/navigation";
import CustomButton from "@/components/shared/Buttons/CustomButton";

const signUpOptions = [
  {
    label: "Join as University Member",
    href: "/register?userType=university-member",
    description: "Access exclusive campus events and resources.",
  },
  {
    label: "Join as Vendor",
    href: "/register?userType=vendor",
    description: "Collaborate with GUC events and bazaars.",
  },
];

const featureHighlights = [
  {
    icon: <PaletteIcon fontSize="large" />,
    title: "Curated Experiences",
    copy: "Discover artful events tailored for every member of the GUC community.",
  },
  {
    icon: <ScheduleIcon fontSize="large" />,
    title: "Effortless Booking",
    copy: "Reserve spots, courts, and workshops in just a few clicks.",
  },
  {
    icon: <PlaceIcon fontSize="large" />,
    title: "Campus Connected",
    copy: "Stay in sync with what's happening across every faculty and venue.",
  },
];

export default function HomePage() {
  const theme = useTheme();
  const [showSignUpOptions, setShowSignUpOptions] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box component="section" sx={{ position: "relative", overflow: "hidden" }}>
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 10, md: 14 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            gap: { xs: 6, md: 10 },
          }}
        >
          <Box sx={{ flex: { md: 1 }, position: "relative", zIndex: 1 }}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: theme.palette.secondary.dark,
                fontWeight: 600,
              }}
            >
              Multaqa • GUC
            </Typography>
            <Typography
              component="h1"
              variant="h1"
              sx={{
                fontSize: { xs: "2.75rem", md: "3.75rem" },
                fontWeight: 600,
                letterSpacing: { xs: "0.4px", md: "1px" },
                lineHeight: 1.1,
                color: theme.palette.text.primary,
                mt: 2,
              }}
            >
              Artful events for every voice on campus.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 3,
                maxWidth: 520,
                color: alpha(theme.palette.text.primary, 0.75),
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              Multaqa reimagines campus life with a vibrant hub for showcasing
              events, workshops, and cultural experiences inspired by the GUC
              community.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} sx={{ mt: 5 }}>
              <CustomButton
                variant="contained"
                color="secondary"
                component={Link}
                href="/login"
                label="Login"
                sx={{
                  width: { xs: "100%", sm: "160px" },
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
                endIcon={<ArrowForwardIcon />}
              />

              <Box
                onMouseEnter={() => setShowSignUpOptions(true)}
                onMouseLeave={() => setShowSignUpOptions(false)}
                sx={{ position: "relative", width: { xs: "100%", sm: "200px" } }}
              >
                <CustomButton
                  variant="outlined"
                  color="primary"
                  label="Sign Up"
                  endIcon={<ArrowOutwardIcon />}
                  sx={{
                    width: "100%",
                    fontWeight: 700,
                    backdropFilter: "blur(4px)",
                  }}
                />

                <Paper
                  elevation={8}
                  sx={{
                    position: "absolute",
                    top: { xs: "64px", sm: "54px" },
                    left: 0,
                    width: { xs: "100%", sm: 260 },
                    borderRadius: 3,
                    p: 2,
                    background: theme.palette.common.white,
                    boxShadow: `0 18px 40px ${alpha(theme.palette.primary.main, 0.18)}`,
                    opacity: showSignUpOptions ? 1 : 0,
                    transform: showSignUpOptions
                      ? "translateY(0)"
                      : "translateY(-10px)",
                    pointerEvents: showSignUpOptions ? "auto" : "none",
                    transition: "all 0.28s ease",
                    zIndex: 3,
                  }}
                >
                  <Stack spacing={1.5}>
                    {signUpOptions.map((option) => (
                      <Box
                        key={option.label}
                        component={Link}
                        href={option.href}
                        sx={{
                          borderRadius: 2,
                          p: 1.5,
                          display: "block",
                          color: theme.palette.text.primary,
                          textDecoration: "none",
                          transition: "background 0.2s ease",
                          "&:hover": {
                            background: alpha(theme.palette.secondary.main, 0.35),
                          },
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {option.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: alpha(theme.palette.text.primary, 0.7),
                            mt: 0.5,
                          }}
                        >
                          {option.description}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              flex: { md: 1 },
              position: "relative",
              minHeight: { xs: 360, sm: 420 },
              width: "100%",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: 6,
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.12
                )}, ${alpha(theme.palette.secondary.main, 0.25)})`,
                filter: "blur(60px)",
                zIndex: 0,
              }}
            />

            <Box
              sx={{
                position: "relative",
                height: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gridTemplateRows: "repeat(6, 1fr)",
                gap: 14,
              }}
            >
              <Box
                sx={{
                  gridColumn: "1 / span 2",
                  gridRow: "1 / span 3",
                  borderRadius: "999px",
                  bgcolor: theme.palette.primary.main,
                }}
              />
              <Box
                sx={{
                  gridColumn: "3 / span 3",
                  gridRow: "1 / span 2",
                  borderRadius: 2,
                  bgcolor: theme.palette.secondary.main,
                }}
              />
              <Box
                sx={{
                  gridColumn: "6 / span 1",
                  gridRow: "1 / span 2",
                  borderRadius: "20px",
                  bgcolor: theme.palette.tertiary.main,
                }}
              />
              <Box
                sx={{
                  gridColumn: "1 / span 2",
                  gridRow: "4 / span 2",
                  borderRadius: 2,
                  bgcolor: theme.palette.tertiary.dark,
                }}
              />
              <Box
                sx={{
                  gridColumn: "4 / span 2",
                  gridRow: "3 / span 3",
                  borderRadius: "50%",
                  bgcolor: theme.palette.primary.light,
                }}
              />
              <Box
                sx={{
                  gridColumn: "3 / span 1",
                  gridRow: "4 / span 3",
                  bgcolor: theme.palette.secondary.dark,
                  borderRadius: 1,
                }}
              />
              <Box
                sx={{
                  gridColumn: "5 / span 2",
                  gridRow: "5 / span 2",
                  borderRadius: "999px",
                  bgcolor: theme.palette.primary.dark,
                }}
              />
              <Box
                sx={{
                  gridColumn: "2 / span 2",
                  gridRow: "3 / span 2",
                  bgcolor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "80%",
                    height: 6,
                    bgcolor: theme.palette.common.black,
                    borderRadius: 3,
                  }}
                />
              </Box>
              <Box
                sx={{
                  gridColumn: "2 / span 1",
                  gridRow: "6 / span 1",
                  width: "70%",
                  justifySelf: "center",
                  borderRadius: 1,
                  bgcolor: theme.palette.secondary.main,
                }}
              />
              <Box
                sx={{
                  gridColumn: "6 / span 1",
                  gridRow: "3 / span 3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: "100%",
                    bgcolor: theme.palette.text.primary,
                    borderRadius: 999,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: theme.palette.common.white }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            sx={{
              textAlign: "center",
              fontWeight: 600,
              fontSize: { xs: "2.1rem", md: "2.6rem" },
            }}
          >
            A curated space for collaboration and celebration.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 640,
              mx: "auto",
              textAlign: "center",
              mt: 2.5,
              color: alpha(theme.palette.text.primary, 0.7),
            }}
          >
            Multaqa streamlines event planning, registration, and discovery, so
            every voice on campus can connect through meaningful experiences.
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{ mt: { xs: 6, md: 8 } }}
          >
            {featureHighlights.map((feature) => (
              <Paper
                key={feature.title}
                elevation={0}
                sx={{
                  flex: 1,
                  p: { xs: 3.5, md: 4 },
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  background: alpha(theme.palette.primary.light, 0.04),
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha(theme.palette.secondary.main, 0.4),
                    color: theme.palette.tertiary.dark,
                    mb: 2.5,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha(theme.palette.text.primary, 0.75) }}>
                  {feature.copy}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>

      <Box component="footer" sx={{ bgcolor: theme.palette.primary.dark, color: theme.palette.common.white }}>
        <Container
          maxWidth="lg"
          sx={{ py: { xs: 6, md: 8 }, display: "flex", flexDirection: "column", gap: 4 }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Multaqa
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75, mt: 1, maxWidth: 320 }}>
                Bringing the GUC community together through dynamic events and collaborative storytelling.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              {[{
                icon: <FacebookIcon />, href: "https://facebook.com"
              }, {
                icon: <InstagramIcon />, href: "https://instagram.com"
              }, {
                icon: <LinkedInIcon />, href: "https://linkedin.com"
              }].map((social) => (
                <IconButton
                  key={social.href}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    backgroundColor: alpha(theme.palette.common.white, 0.12),
                    color: theme.palette.common.white,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.common.white, 0.25),
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1.5, sm: 3 }}>
              <Typography component={Link} href="/privacy" sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: theme.palette.secondary.main } }}>
                Privacy Policy
              </Typography>
              <Typography component={Link} href="/terms" sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: theme.palette.secondary.main } }}>
                Terms of Service
              </Typography>
              <Typography component={Link} href="/support" sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: theme.palette.secondary.main } }}>
                Support
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.15) }} />

          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} Multaqa. Crafted with care by the GUC community.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
