"use client";

import { useEffect, useRef, useState } from "react";
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
import type { Theme } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import PlaceIcon from "@mui/icons-material/Place";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PaletteIcon from "@mui/icons-material/Palette";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Flag from "react-world-flags";
import { Link } from "@/i18n/navigation";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import CustomAccordion from "@/components/shared/Accordions/CustomAccordion";
import CustomModalLayout from "@/components/shared/modals/CustomModalLayout";

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

const faqItems = [
  {
    title: "How do I register for an event on Multaqa?",
    content:
      "Log in with your university account, browse any event, and tap the register button. We’ll confirm your spot instantly and send reminders as the event approaches.",
  },
  {
    title: "Can external vendors participate in campus events?",
    content:
      "Yes. Vendors can create a Multaqa profile, submit booth or activity details, and coordinate with the Events Office for approval and logistics directly through the platform.",
  },
  {
    title: "What information is required during sign up?",
    content:
      "Students and staff sign up with their GUC credentials, while vendors provide business details, contact information, and any required documentation so we can verify them quickly.",
  },
  {
    title: "Does Multaqa support mobile access?",
    content:
      "Multaqa is fully responsive, so you can explore events, manage bookings, and receive updates from any device—desktop, tablet, or mobile.",
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <InstagramIcon fontSize="small" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: <LinkedInIcon fontSize="small" />,
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: <FacebookIcon fontSize="small" />,
  },
  {
    label: "X",
    href: "https://twitter.com",
    icon: <XIcon fontSize="small" />,
  },
];

const MenuToggleButton = ({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) => (
  <IconButton
    onClick={onClick}
    aria-label={open ? "Close menu" : "Open menu"}
    sx={(theme) => ({
      borderRadius: 12,
      backgroundColor: alpha(theme.palette.common.white, 0.65),
      boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.12)}`,
      width: 44,
      height: 44,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.82),
      },
    })}
  >
    <Box
      sx={{
        position: "relative",
        width: 20,
        height: 14,
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          component="span"
          sx={(theme) => ({
            position: "absolute",
            left: 0,
            width: "100%",
            height: 2,
            borderRadius: 1,
            backgroundColor: theme.palette.text.primary,
            transition: "transform 0.35s ease, opacity 0.35s ease",
            transformOrigin: "center",
            top: index === 0 ? 0 : index === 1 ? "50%" : "100%",
            transform: open
              ? index === 0
                ? "translateY(6px) rotate(45deg)"
                : index === 1
                ? "scaleX(0)"
                : "translateY(-6px) rotate(-45deg)"
              : "translateY(0) rotate(0)",
            opacity: open && index === 1 ? 0 : 1,
          })}
        />
      ))}
    </Box>
  </IconButton>
);

export default function HomePage() {
  const theme = useTheme();
  const [showSignUpOptions, setShowSignUpOptions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLocaleModalOpen, setIsLocaleModalOpen] = useState(false);
  const lastScrollY = useRef(0);
  const signUpHoverRef = useRef<HTMLDivElement | null>(null);
  const signUpHoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 24);

      if (currentY > lastScrollY.current && currentY > 120) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      const element = previousFocusRef.current as HTMLElement | null;
      element?.focus?.();
      return;
    }

    previousFocusRef.current = document.activeElement;

    const dialog = dialogRef.current;
    const focusableSelectors =
      'a[href], button:not([disabled]), [tabindex="0"], [role="menuitem"]';

    const setInitialFocus = () => {
      const initial = dialog?.querySelector<HTMLElement>(focusableSelectors);
      initial?.focus();
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter((el) => !el.hasAttribute("data-disabled"));

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement;

      if (event.shiftKey) {
        if (active === first || !dialog.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    setTimeout(setInitialFocus, 10);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const openLocaleModal = () => setIsLocaleModalOpen(true);
  const closeLocaleModal = () => {
    setIsLocaleModalOpen(false);
  };

  const locales = [
    {
      code: "en",
      label: "English",
      localePath: "/en",
      flagCode: "GB",
      abbreviation: "EN",
    },
    {
      code: "ar",
      label: "العربية",
      localePath: "/ar",
      flagCode: "EG",
      abbreviation: "AR",
    },
    {
      code: "de",
      label: "Deutsch",
      localePath: "/de",
      flagCode: "DE",
      abbreviation: "DE",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          transform:
            showNavbar || isMenuOpen ? "translateY(0)" : "translateY(-120%)",
          transition:
            "transform 0.4s ease, background-color 0.3s ease, box-shadow 0.3s ease",
          backgroundColor:
            isScrolled || isMenuOpen
              ? alpha(theme.palette.background.default, 0.92)
              : "transparent",
          backdropFilter: isScrolled || isMenuOpen ? "blur(12px)" : "none",
          boxShadow:
            isScrolled || isMenuOpen
              ? `0 12px 32px ${alpha(theme.palette.common.black, 0.08)}`
              : "none",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 1.75, md: 2.25 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            component={Link}
            href="/"
            variant="h6"
            sx={{
              textDecoration: "none",
              color: theme.palette.text.primary,
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 600,
              letterSpacing: "0.08em",
            }}
          >
            MULTAQA
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 1.5, md: 2.5 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <IconButton
                onClick={openLocaleModal}
                aria-label="Change locale"
                sx={{
                  height: 40,
                  borderRadius: 14,
                  px: 2,
                  border: `1px solid ${alpha(
                    theme.palette.text.primary,
                    0.12
                  )}`,
                  backgroundColor: alpha(theme.palette.common.white, 0.75),
                  display: "flex",
                  alignItems: "center",
                  gap: 0.9,
                }}
              >
                <LanguageIcon
                  sx={{
                    fontSize: 18,
                    color: alpha(theme.palette.text.primary, 0.7),
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  EN
                </Typography>
              </IconButton>

              <Typography
                component={Link}
                href="/support"
                sx={{
                  fontSize: "0.9rem",
                  color: alpha(theme.palette.text.primary, 0.65),
                  textDecoration: "none",
                  fontWeight: 500,
                  px: 0.5,
                  "&:hover": { color: theme.palette.text.primary },
                }}
              >
                Support
              </Typography>

              <CustomButton
                variant="contained"
                color="secondary"
                component={Link}
                href="/login"
                label="Login"
                size="small"
                sx={{
                  px: 2.4,
                  height: 40,
                  width: "auto",
                  fontWeight: 700,
                  boxShadow: `0 10px 24px ${alpha(
                    theme.palette.secondary.main,
                    0.3
                  )}`,
                }}
              />
            </Stack>

            <IconButton
              onClick={openLocaleModal}
              aria-label="Change locale"
              sx={{
                display: { xs: "inline-flex", md: "none" },
                borderRadius: 12,
                width: 44,
                height: 44,
                backgroundColor: alpha(theme.palette.common.white, 0.65),
                boxShadow: `0 6px 16px ${alpha(
                  theme.palette.common.black,
                  0.12
                )}`,
              }}
            >
              <LanguageIcon />
            </IconButton>

            <MenuToggleButton open={isMenuOpen} onClick={toggleMenu} />
          </Stack>
        </Container>
      </Box>

      <CustomModalLayout
        open={isLocaleModalOpen}
        onClose={closeLocaleModal}
        width="w-[90vw] sm:w-[420px]"
      >
        <Stack spacing={3}>
          <Stack spacing={0.5} textAlign="center">
            <Typography component="h2" variant="h5" sx={{ fontWeight: 600 }}>
              Choose Language
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
            >
              Select the language you’d like to use across Multaqa.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            {locales.map((locale) => (
              <Box
                key={locale.code}
                component={Link}
                href={locale.localePath}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textDecoration: "none",
                  backgroundColor: alpha(theme.palette.primary.light, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.secondary.main, 0.25),
                  },
                }}
                onClick={closeLocaleModal}
              >
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Flag
                    code={locale.flagCode}
                    style={{ width: 30, height: 20, borderRadius: 6 }}
                  />
                  <Typography
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    {locale.label}
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: alpha(theme.palette.text.primary, 0.6),
                  }}
                >
                  {locale.abbreviation}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </CustomModalLayout>

      <Box
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: alpha(theme.palette.background.default, 0.96),
          backdropFilter: "blur(18px)",
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
        onClick={() => setIsMenuOpen(false)}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            py: { xs: 6, md: 10 },
            gap: 6,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Explore Multaqa
            </Typography>
            <IconButton
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              sx={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: alpha(theme.palette.common.black, 0.06),
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 4, md: 6 }}
            sx={{ flexGrow: 1 }}
          >
            <Stack spacing={3} sx={{ flex: 2 }}>
              <Typography
                variant="overline"
                sx={{ letterSpacing: "0.3em", fontWeight: 600 }}
              >
                Events
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                <Stack spacing={1.5} sx={{ flex: 1 }}>
                  <Typography
                    component={Link}
                    href="/events"
                    variant="h6"
                    sx={menuLinkStyles(theme)}
                  >
                    Discover Events
                  </Typography>
                  <Typography
                    component={Link}
                    href="/events/workshops"
                    sx={menuSubLinkStyles(theme)}
                  >
                    Workshops & Seminars
                  </Typography>
                  <Typography
                    component={Link}
                    href="/events/competitions"
                    sx={menuSubLinkStyles(theme)}
                  >
                    Competitions & Hackathons
                  </Typography>
                  <Typography
                    component={Link}
                    href="/events/festivals"
                    sx={menuSubLinkStyles(theme)}
                  >
                    Cultural Festivals
                  </Typography>
                </Stack>
                <Stack spacing={1.5} sx={{ flex: 1 }}>
                  <Typography
                    component={Link}
                    href="/events/trips"
                    variant="h6"
                    sx={menuLinkStyles(theme)}
                  >
                    Trips & Exchanges
                  </Typography>
                  <Typography
                    component={Link}
                    href="/events/camps"
                    sx={menuSubLinkStyles(theme)}
                  >
                    Student Retreats
                  </Typography>
                  <Typography
                    component={Link}
                    href="/events/sports"
                    sx={menuSubLinkStyles(theme)}
                  >
                    Sports & Recreation
                  </Typography>
                  <Typography
                    component={Link}
                    href="/events/archives"
                    sx={menuSubLinkStyles(theme)}
                  >
                    Event Archive
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Stack spacing={3} sx={{ flex: 1.3 }}>
              <Typography
                variant="overline"
                sx={{ letterSpacing: "0.3em", fontWeight: 600 }}
              >
                Partners & Vendors
              </Typography>
              <Stack spacing={1.5}>
                <Typography
                  component={Link}
                  href="/vendor"
                  variant="h6"
                  sx={menuLinkStyles(theme)}
                >
                  Become a Vendor
                </Typography>
                <Typography
                  component={Link}
                  href="/vendor/resources"
                  sx={menuSubLinkStyles(theme)}
                >
                  Resources & Guidelines
                </Typography>
                <Typography
                  component={Link}
                  href="/vendor/success"
                  sx={menuSubLinkStyles(theme)}
                >
                  Success Stories
                </Typography>
                <Typography
                  component={Link}
                  href="/vendor/support"
                  sx={menuSubLinkStyles(theme)}
                >
                  Vendor Support
                </Typography>
              </Stack>
            </Stack>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                background: alpha(theme.palette.primary.light, 0.12),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, lineHeight: 1.2 }}
              >
                Ready to craft the next Multaqa story?
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: alpha(theme.palette.text.primary, 0.75) }}
              >
                Choose the pathway that fits you best—organize, collaborate, or
                discover unforgettable campus events.
              </Typography>
              <Stack spacing={4}>
                <Stack spacing={1}>
                  <Typography
                    variant="overline"
                    sx={{
                      letterSpacing: "0.25em",
                      fontWeight: 600,
                      color: alpha(theme.palette.text.primary, 0.6),
                    }}
                  >
                    Sign up as
                  </Typography>
                  <CustomButton
                    component={Link}
                    href="/register?userType=university-member"
                    color="secondary"
                    variant="contained"
                    sx={{
                      width: "100%",
                      height: 58,
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                    }}
                  >
                    University Member
                  </CustomButton>
                </Stack>
                <Stack spacing={1}>
                  <Typography
                    variant="overline"
                    sx={{
                      letterSpacing: "0.25em",
                      fontWeight: 600,
                      color: alpha(theme.palette.text.primary, 0.6),
                    }}
                  >
                    Sign up as
                  </Typography>
                  <CustomButton
                    component={Link}
                    href="/register?userType=vendor"
                    color="primary"
                    variant="outlined"
                    sx={{
                      width: "100%",
                      height: 58,
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
                  >
                    Vendor
                  </CustomButton>
                </Stack>
                <Typography
                  sx={{
                    ...menuSubLinkStyles(theme),
                    mt: 3,
                    color: theme.palette.text.primary,
                    fontWeight: 400,
                    display: "flex",
                    gap: 0.5,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  Already have an account?
                  <Typography
                    component={Link}
                    href="/login"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Login
                  </Typography>
                </Typography>
              </Stack>

              <Divider
                sx={{
                  borderColor: alpha(theme.palette.text.primary, 0.1),
                  my: 1,
                }}
              />

              <Stack spacing={1}>
                <Typography
                  component={Link}
                  href="/about"
                  sx={menuSubLinkStyles(theme)}
                >
                  About Multaqa
                </Typography>
                <Typography
                  component={Link}
                  href="/contact"
                  sx={menuSubLinkStyles(theme)}
                >
                  Contact Team
                </Typography>
                <Typography
                  component={Link}
                  href="/privacy"
                  sx={menuSubLinkStyles(theme)}
                >
                  Privacy & Terms
                </Typography>
                <Typography
                  component={Link}
                  href="/gdpr"
                  sx={menuSubLinkStyles(theme)}
                >
                  GDPR Compliance
                </Typography>
              </Stack>
            </Paper>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 4 }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Stack direction="row" spacing={2.5}>
              {socialLinks.map((item) => (
                <Stack
                  key={item.label}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  component={Link}
                  href={item.href}
                  sx={{
                    textDecoration: "none",
                    color: alpha(theme.palette.text.primary, 0.75),
                    "&:hover": { color: theme.palette.text.primary },
                  }}
                >
                  <IconButton
                    size="small"
                    sx={(theme) => ({
                      borderRadius: "999px",
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.dark,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      },
                      width: 36,
                      height: 36,
                    })}
                  >
                    {item.icon}
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, letterSpacing: "0.02em" }}
                  >
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, sm: 3 }}
            >
              <Typography
                component={Link}
                href="/terms"
                sx={menuSubLinkStyles(theme)}
              >
                Terms of Service
              </Typography>
              <Typography
                component={Link}
                href="/privacy"
                sx={menuSubLinkStyles(theme)}
              >
                Privacy Policy
              </Typography>
              <Typography
                component={Link}
                href="/cookies"
                sx={menuSubLinkStyles(theme)}
              >
                Cookies
              </Typography>
              <Typography
                component={Link}
                href="/gdpr"
                sx={menuSubLinkStyles(theme)}
              >
                GDPR
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box
        component="section"
        sx={{ position: "relative", overflow: "visible" }}
      >
        <Container
          maxWidth="lg"
          sx={{
            pt: { xs: 16, md: 18 },
            pb: { xs: 10, md: 14 },
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

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2.5}
              sx={{ mt: 5 }}
            >
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
                ref={signUpHoverRef}
                onMouseEnter={() => {
                  if (signUpHoverTimeout.current) {
                    clearTimeout(signUpHoverTimeout.current);
                    signUpHoverTimeout.current = null;
                  }
                  setShowSignUpOptions(true);
                }}
                onMouseLeave={(event) => {
                  const nextTarget = event.relatedTarget as Node | null;
                  if (
                    nextTarget &&
                    signUpHoverRef.current?.contains(nextTarget)
                  ) {
                    return;
                  }
                  if (signUpHoverTimeout.current) {
                    clearTimeout(signUpHoverTimeout.current);
                  }
                  signUpHoverTimeout.current = setTimeout(() => {
                    setShowSignUpOptions(false);
                    signUpHoverTimeout.current = null;
                  }, 150);
                }}
                sx={{
                  position: "relative",
                  width: { xs: "100%", sm: "200px" },
                }}
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
                  onMouseEnter={() => {
                    if (signUpHoverTimeout.current) {
                      clearTimeout(signUpHoverTimeout.current);
                      signUpHoverTimeout.current = null;
                    }
                    setShowSignUpOptions(true);
                  }}
                  onMouseLeave={(event) => {
                    const nextTarget = event.relatedTarget as Node | null;
                    if (
                      nextTarget &&
                      signUpHoverRef.current?.contains(nextTarget)
                    ) {
                      return;
                    }
                    if (signUpHoverTimeout.current) {
                      clearTimeout(signUpHoverTimeout.current);
                    }
                    signUpHoverTimeout.current = setTimeout(() => {
                      setShowSignUpOptions(false);
                      signUpHoverTimeout.current = null;
                    }, 150);
                  }}
                  sx={{
                    position: "absolute",
                    top: { xs: "64px", sm: "54px" },
                    left: 0,
                    width: { xs: "100%", sm: 260 },
                    borderRadius: 3,
                    p: 2,
                    background: theme.palette.common.white,
                    boxShadow: `0 18px 40px ${alpha(
                      theme.palette.primary.main,
                      0.18
                    )}`,
                    opacity: showSignUpOptions ? 1 : 0,
                    transform: showSignUpOptions
                      ? "translateY(0)"
                      : "translateY(-10px)",
                    pointerEvents: showSignUpOptions ? "auto" : "none",
                    transition: "all 0.28s ease",
                    zIndex: 60,
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
                            background: alpha(
                              theme.palette.secondary.main,
                              0.35
                            ),
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
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

      <Box
        component="section"
        sx={{ py: { xs: 8, md: 12 }, bgcolor: theme.palette.common.white }}
      >
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
                  border: `1px solid ${alpha(
                    theme.palette.primary.main,
                    0.15
                  )}`,
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
                <Typography
                  variant="body2"
                  sx={{ color: alpha(theme.palette.text.primary, 0.75) }}
                >
                  {feature.copy}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>

      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: alpha(theme.palette.primary.light, 0.05),
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 600,
              fontSize: { xs: "2rem", md: "2.4rem" },
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 600,
              mx: "auto",
              textAlign: "center",
              mt: 2,
              color: alpha(theme.palette.text.primary, 0.7),
            }}
          >
            Quick answers to help students, staff, and partners get the most out
            of Multaqa.
          </Typography>

          <Box
            sx={{
              mt: { xs: 5, md: 6 },
              maxWidth: 900,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {faqItems.map((faq) => (
              <CustomAccordion key={faq.title} title={faq.title}>
                <Typography
                  variant="body2"
                  sx={{ color: alpha(theme.palette.text.primary, 0.75) }}
                >
                  {faq.content}
                </Typography>
              </CustomAccordion>
            ))}
          </Box>
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: theme.palette.primary.dark,
          color: theme.palette.common.white,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 6, md: 8 },
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
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
              <Typography
                variant="body2"
                sx={{ opacity: 0.75, mt: 1, maxWidth: 320 }}
              >
                Bringing the GUC community together through dynamic events and
                collaborative storytelling.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              {[
                {
                  icon: <InstagramIcon />,
                  href: "https://instagram.com",
                },
                {
                  icon: <LinkedInIcon />,
                  href: "https://linkedin.com",
                },
                {
                  icon: <XIcon />,
                  href: "https://twitter.com",
                },
              ].map((social) => (
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

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, sm: 3 }}
            >
              <Typography
                component={Link}
                href="/privacy"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": { color: theme.palette.secondary.main },
                }}
              >
                Privacy Policy
              </Typography>
              <Typography
                component={Link}
                href="/terms"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": { color: theme.palette.secondary.main },
                }}
              >
                Terms of Service
              </Typography>
              <Typography
                component={Link}
                href="/support"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": { color: theme.palette.secondary.main },
                }}
              >
                Support
              </Typography>
            </Stack>
          </Stack>

          <Divider
            sx={{ borderColor: alpha(theme.palette.common.white, 0.15) }}
          />

          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} Multaqa. Crafted with care by the GUC
            community.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

const menuLinkStyles = (theme: Theme) => ({
  textDecoration: "none",
  color: theme.palette.text.primary,
  fontWeight: 600,
  transition: "color 0.2s ease",
  "&:hover": {
    color: theme.palette.secondary.dark,
  },
});

const menuSubLinkStyles = (theme: Theme) => ({
  display: "inline-block",
  textDecoration: "none",
  color: alpha(theme.palette.text.primary, 0.7),
  fontSize: "0.95rem",
  transition: "color 0.2s ease",
  "&:hover": {
    color: theme.palette.text.primary,
  },
});
