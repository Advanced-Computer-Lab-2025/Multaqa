"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  alpha,
  Box,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
import AnimatedCloseButton from "@/components/shared/Buttons/AnimatedCloseButton";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/shared/LoginForm/LoginForm";
import RegistrationForm from "@/components/shared/RegistrationForm/RegistrationForm";
import HomeIcon from "@mui/icons-material/Home";
import multaqaLogo from "../../../public/assets/images/multaqa-top-nav.png";
import multaqaIcon from "../../../public/assets/images/multaqa-icon-only.png";
import newMultaqaIcon from "../../../public/assets/images/new-multaqa-logo.png";
import ScaledLogo from "@/components/shared/MultaqaLogos/ScaledLogo";

const MotionBox = motion(Box);

const consentStorageKey = "multaqa-consent-v1";

const signUpOptions = [
  {
    label: "Join as University Member",
    userType: "university-member",
    description: "Access exclusive campus events and resources.",
  },
  {
    label: "Join as Vendor",
    userType: "vendor",
    description: "Collaborate with GUC events and bazaars.",
  },
];

const featureHighlights = [
  {
    icon: <PaletteIcon fontSize="large" />,
    title: "Curated Experiences",
    // Updated copy with line breaks and 'campus'
    copy: (
      <>
        Discover artful events tailored for <br /> every member of the <br />{" "}
        campus.
      </>
    ),
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

export default function HomePage() {
  // We wrap in Suspense just in case, but we removed the hooks that cause the issue
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [showSignUpOptions, setShowSignUpOptions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLocaleModalOpen, setIsLocaleModalOpen] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);

  // View State (Initialized from URL to prevent animation jump)
  const [currentView, setCurrentView] = useState<"home" | "login" | "register">(
    () => {
      if (pathname?.endsWith("/login")) return "login";
      if (pathname?.endsWith("/register")) return "register";
      return "home";
    }
  );

  const [userType, setUserType] = useState<string>(() => {
    return searchParams?.get("userType") || "";
  });

  const lastScrollY = useRef(0);
  const signUpHoverRef = useRef<HTMLDivElement | null>(null);
  const signUpHoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<Element | null>(null);

  const isHome = currentView === "home";

  // --- HELPER TO UPDATE URL WITHOUT RELOAD ---
  const handleViewChange = (
    view: "home" | "login" | "register",
    type: string = ""
  ) => {
    setCurrentView(view);
    setUserType(type);

    let newPath = "/";
    // Adjust based on your locale logic if needed
    if (view === "login") newPath = "/login";
    if (view === "register") newPath = "/register";

    if (view === "register" && type) {
      newPath += `?userType=${type}`;
    }

    // Push new state manually
    window.history.pushState({ view, userType: type }, "", newPath);
  };

  // --- HANDLERS (With Event Prevention) ---
  const handleLoginClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    handleViewChange("login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegisterClick = (type: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    handleViewChange("register", type);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHomeClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    handleViewChange("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- POPSTATE LISTENER (Browser Back Button) ---
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);

      if (path.endsWith("/login")) {
        setCurrentView("login");
      } else if (path.endsWith("/register")) {
        setCurrentView("register");
        setUserType(params.get("userType") || "");
      } else {
        setCurrentView("home");
        setUserType("");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // --- SCROLL LOGIC ---
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
    if (typeof document === "undefined") return;
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px";
    } else {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedConsent = window.localStorage.getItem(consentStorageKey);
    if (!storedConsent) {
      setIsConsentOpen(true);
    }
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
      if (event.key !== "Tab" || !dialog) return;
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
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMobile || !showSignUpOptions) return;
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      if (!signUpHoverRef.current) return;
      const target = event.target as Node | null;
      if (target && signUpHoverRef.current.contains(target)) return;
      setShowSignUpOptions(false);
    };
    document.addEventListener("click", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction);
    return () => {
      document.removeEventListener("click", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, [isMobile, showSignUpOptions]);

  const persistConsent = (status: "accepted" | "dismissed") => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        consentStorageKey,
        JSON.stringify({ status, updatedAt: new Date().toISOString() })
      );
    }
  };

  const handleAcceptConsent = () => {
    persistConsent("accepted");
    setIsConsentOpen(false);
  };

  const handleDismissConsent = () => {
    persistConsent("dismissed");
    setIsConsentOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const openLocaleModal = () => setIsLocaleModalOpen(true);
  const closeLocaleModal = () => setIsLocaleModalOpen(false);

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
      {/* Header */}
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
          {/* LOGO: Changed component={Link} to div to prevent router hijacking */}
          <Box
            onClick={(e) => {
              if (currentView !== "home") {
                handleHomeClick(e);
              }
            }}
            sx={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 2,
            }}
          >
            <ScaledLogo
              image={newMultaqaIcon}
              transparent
              iconOnly
            />
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: "var(--font-jost)", textTransform: "uppercase" }}>
              Multaqa
            </Typography>
          </Box>

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
              {currentView !== "home" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <IconButton
                    onClick={(e) => handleHomeClick(e)}
                    aria-label="Go to home"
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
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <HomeIcon
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
                      Home
                    </Typography>
                  </IconButton>
                </motion.div>
              )}

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

              {currentView === "home" && (
                <CustomButton
                  variant="contained"
                  onClick={(e: any) => handleLoginClick(e)}
                  label="Login"
                  size="small"
                  sx={{
                    px: 2.4,
                    height: 40,
                    width: "auto",
                    fontWeight: 700,
                    backgroundColor: theme.palette.tertiary.main,
                    color: theme.palette.tertiary.contrastText,
                    border: `2px solid ${theme.palette.tertiary.dark}`,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      borderColor: theme.palette.primary.dark,
                    },
                    boxShadow: `0 10px 24px ${alpha(
                      theme.palette.tertiary.main,
                      0.3
                    )}`,
                  }}
                />
              )}
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

            <AnimatedCloseButton open={isMenuOpen} onClick={toggleMenu} />
          </Stack>
        </Container>
      </Box>

      {/* Locale Modal */}
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
              Select the language you&apos;d like to use across Multaqa.
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
                    backgroundColor: alpha(theme.palette.tertiary.main, 0.25),
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

      {/* Consent Modal */}
      <CustomModalLayout
        open={isConsentOpen}
        onClose={handleDismissConsent}
        width="w-[90vw] sm:w-[540px]"
      >
        <Stack spacing={3.5} sx={{ px: { xs: 1, sm: 2 }, py: 1 }}>
          <Stack spacing={2} alignItems="center">
            <Typography
              component="h2"
              variant="h4"
              sx={{
                fontWeight: 700,
                textAlign: "center",
                fontSize: { xs: "1.75rem", sm: "2rem" },
              }}
            >
              Your Privacy Choices
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: alpha(theme.palette.text.primary, 0.75),
                textAlign: "center",
                lineHeight: 1.65,
                maxWidth: "90%",
              }}
            >
              We use essential cookies to keep Multaqa running and optional
              analytics to improve your experience. Review the policies below to
              learn how we process data.
            </Typography>
          </Stack>

          <Box
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
              borderRadius: 2,
              px: 3,
              py: 2.5,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Box
              component="ul"
              sx={{
                m: 0,
                pl: 2,
                listStyleType: "disc",
                listStylePosition: "outside",
                "& li": {
                  mb: 1.25,
                  pl: 0.75,
                  "&:last-child": { mb: 0 },
                },
                "& li::marker": {
                  color: theme.palette.primary.main,
                  fontSize: "1.1rem",
                },
              }}
            >
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/cookies", label: "Cookies Policy" },
                { href: "/gdpr", label: "GDPR Compliance" },
                { href: "/support", label: "Support" },
              ].map((item) => (
                <li key={item.href}>
                  <Typography
                    component={Link}
                    href={item.href}
                    sx={{
                      textDecoration: "none",
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      fontSize: "1rem",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: theme.palette.primary.dark,
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {item.label}
                  </Typography>
                </li>
              ))}
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.text.primary, 0.6),
              textAlign: "center",
              lineHeight: 1.6,
              fontSize: "0.875rem",
              px: 1,
            }}
          >
            You can revisit these settings anytime from the footer links. We
            respect your choices and only store this preference in your browser.
          </Typography>

          <Stack direction="column" spacing={1.25} sx={{ pt: 0.5 }}>
            <CustomButton
              variant="contained"
              onClick={handleAcceptConsent}
              sx={{
                width: "100%",
                fontWeight: 700,
                backgroundColor: theme.palette.tertiary.main,
                color: theme.palette.tertiary.contrastText,
                border: `2px solid ${theme.palette.tertiary.dark}`,
                "&:hover": {
                  backgroundColor: theme.palette.tertiary.dark,
                  borderColor: theme.palette.tertiary.dark,
                },
              }}
            >
              Accept all
            </CustomButton>
            <CustomButton
              variant="outlined"
              color="primary"
              onClick={handleDismissConsent}
              sx={{
                width: "100%",
                py: 0.75,
              }}
            >
              Continue without optional cookies
            </CustomButton>
          </Stack>
        </Stack>
      </CustomModalLayout>

      {/* Main Menu Overlay */}
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
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
        }}
        onClick={() => setIsMenuOpen(false)}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            py: { xs: 1.5, md: 3 },
            gap: 6,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <Box
            sx={{
              position: "relative",
              minHeight: 48,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Explore Multaqa
            </Typography>
            <AnimatedCloseButton
              open
              onClick={() => setIsMenuOpen(false)}
              sx={(theme) => ({
                position: "absolute",
                top: { xs: -4, md: -8 },
                right: 0,
                backgroundColor: alpha(theme.palette.common.white, 0.9),
                boxShadow: `0 8px 20px ${alpha(
                  theme.palette.common.black,
                  0.1
                )}`,
              })}
            />
          </Box>

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
                    variant="contained"
                    onClick={(e: any) => {
                      setIsMenuOpen(false);
                      handleRegisterClick("university-member", e);
                    }}
                    sx={{
                      width: "100%",
                      height: 58,
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      backgroundColor: theme.palette.tertiary.main,
                      color: theme.palette.tertiary.contrastText,
                      border: `2px solid ${theme.palette.tertiary.dark}`,
                      "&:hover": {
                        backgroundColor: theme.palette.tertiary.dark,
                        borderColor: theme.palette.tertiary.dark,
                      },
                    }}
                    label="University Member"
                  />
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
                    variant="outlined"
                    color="primary"
                    onClick={(e: any) => {
                      setIsMenuOpen(false);
                      handleRegisterClick("vendor", e);
                    }}
                    sx={{
                      width: "100%",
                      height: 58,
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
                    label="Vendor"
                  />
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
                    component="button"
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      handleLoginClick(e);
                    }}
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      textDecoration: "none",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "inherit",
                      p: 0,
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
              justifyContent={{ xs: "center", sm: "flex-start" }}
              alignItems={{ xs: "center", sm: "flex-start" }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
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

      {/* ================================================================
      === 
      === HERO / AUTH ANIMATION SECTION (UPDATED: Centered & Compact)
      === 
      ================================================================
      */}
      <Box
        component="section"
        sx={{
          position: "relative",
          overflow: "hidden",
          // Force full viewport height, minus a little for visual balance
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // VERTICAL CENTER
        }}
      >
        <Container
          maxWidth="lg" // TIGHTER WIDTH (was xl)
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center", // VERTICAL CENTER internal items
            // Adjust padding: Enough for mobile navbar, but 0 on desktop to let Flexbox center it
            pt: { xs: 14, md: 0 },
            pb: { xs: 8, md: 0 },
            flexGrow: 1,
          }}
        >
          {/* Shapes Layer (Background) */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              // Optional: constrain shapes to not bleed too far on ultra-wide screens
              left: "50%",
              transform: "translateX(-50%)",
              width: "100vw",
              maxWidth: "100%",
              height: "100%",
            }}
          >
            <Shapes theme={theme} isHome={isHome} />
          </Box>

          {/* Content Layer (Foreground) */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              // Ensure content creates a row for side-by-side logic
              justifyContent: "space-between",
            }}
          >
            <AnimatePresence mode="wait">
              {isHome ? (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    // On desktop, keep text slightly to the left for balance
                    justifyContent: "flex-start",
                  }}
                >
                  <HeroContent
                    theme={theme}
                    isMobile={isMobile}
                    handleLoginClick={handleLoginClick}
                    handleRegisterClick={handleRegisterClick}
                    signUpHoverRef={signUpHoverRef}
                    signUpHoverTimeout={signUpHoverTimeout}
                    showSignUpOptions={showSignUpOptions}
                    setShowSignUpOptions={setShowSignUpOptions}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingLeft: "15%",
                  }}
                >
                  <AuthForm currentView={currentView} userType={userType} />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Container>
      </Box>

      {/* Home Sections */}
      <Box sx={{ display: isHome ? "block" : "none" }}>
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
              Multaqa streamlines event planning, registration, and discovery,
              so every voice on campus can connect through meaningful
              experiences.
            </Typography>
          </Container>
        </Box>

        <Box
          component="footer"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main
              } 0%, ${alpha(theme.palette.tertiary.main, 0.7)} 100%)`,
            color: theme.palette.common.white,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 30% 40%, ${alpha(
                theme.palette.primary.light,
                0.15
              )}, transparent 60%)`,
              pointerEvents: "none",
            },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              py: { xs: 6, md: 8 },
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: { xs: "center", md: "stretch" },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              sx={{
                mt: { xs: 6, md: 8 },
                alignItems: "stretch",
              }}
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
                    height: "100%",
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
                      bgcolor: alpha(theme.palette.primary.main, 0.55),
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
                    sx={{
                      color: alpha(theme.palette.text.primary, 0.75),
                      whiteSpace: "pre-line",
                    }}
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
              Quick answers to help students, staff, and partners get the most
              out of Multaqa.
            </Typography>

            <Box
              sx={{
                mt: { xs: 5, md: 6 },
                maxWidth: 900,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                px: { xs: 1, md: 0 },
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
            background: `linear-gradient(135deg, ${theme.palette.primary.main
              } 0%, ${alpha(theme.palette.tertiary.main, 0.7)} 100%)`,
            color: theme.palette.common.white,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 30% 40%, ${alpha(
                theme.palette.primary.light,
                0.15
              )}, transparent 60%)`,
              pointerEvents: "none",
            },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              py: { xs: 6, md: 8 },
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: { xs: "center", md: "stretch" },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              justifyContent={{ xs: "center", md: "space-between" }}
              alignItems={{ xs: "center", md: "center" }}
              sx={{
                textAlign: { xs: "center", md: "left" },
                gap: { xs: 3, md: 4 },
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", md: "auto" },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", md: "flex-start" },
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Multaqa
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.75,
                    mt: 1,
                    maxWidth: 320,
                    mx: { xs: "auto", md: 0 },
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  Bringing the GUC community together through dynamic events and
                  collaborative storytelling.
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={2}
                justifyContent={{ xs: "center", md: "flex-start" }}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                {[
                  { icon: <InstagramIcon />, href: "https://instagram.com" },
                  { icon: <LinkedInIcon />, href: "https://linkedin.com" },
                  { icon: <XIcon />, href: "https://twitter.com" },
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
                        backgroundColor: alpha(
                          theme.palette.common.white,
                          0.25
                        ),
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
                    color: theme.palette.common.white,
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: alpha(theme.palette.common.white, 0.75),
                    },
                    textAlign: "center",
                  }}
                >
                  Privacy Policy
                </Typography>
                <Typography
                  component={Link}
                  href="/terms"
                  sx={{
                    color: theme.palette.common.white,
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: alpha(theme.palette.common.white, 0.75),
                    },
                    textAlign: "center",
                  }}
                >
                  Terms of Service
                </Typography>
                <Typography
                  component={Link}
                  href="/support"
                  sx={{
                    color: theme.palette.common.white,
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: alpha(theme.palette.common.white, 0.75),
                    },
                    textAlign: "center",
                  }}
                >
                  Support
                </Typography>
              </Stack>
            </Stack>

            <Divider
              sx={{ borderColor: alpha(theme.palette.common.white, 0.15) }}
            />

            <Typography
              variant="body2"
              sx={{ opacity: 0.7, textAlign: { xs: "center", md: "left" } }}
            >
              © {new Date().getFullYear()} Multaqa. Crafted with care by the GUC
              community.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

const HeroContent = ({
  theme,
  isMobile,
  handleLoginClick,
  handleRegisterClick,
  signUpHoverRef,
  signUpHoverTimeout,
  showSignUpOptions,
  setShowSignUpOptions,
}: any) => (
  <Box
    sx={{
      flex: 1,
      position: "relative",
      zIndex: 1,
      width: "100%",
      maxWidth: { xs: 560, md: "650px" },
    }}
  >
    <Typography
      variant="overline"
      sx={{
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: theme.palette.primary.dark,
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
        textAlign: { xs: "center", md: "left" },
      }}
    >
      {/* ADDED LINE BREAKS HERE */}
      Artful events for <br />
      every voice on <br />
      campus.
    </Typography>
    <Typography
      variant="body1"
      sx={{
        mt: 3,
        maxWidth: { xs: 560, md: 520 },
        color: alpha(theme.palette.text.primary, 0.75),
        fontSize: { xs: "1rem", md: "1.1rem" },
        mx: { xs: "auto", md: 0 },
      }}
    >
      Multaqa reimagines campus life with a vibrant hub for showcasing events,
      workshops, and cultural experiences inspired by the GUC community.
    </Typography>

    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2.5}
      sx={{
        mt: 5,
        width: "100%",
        alignItems: {
          xs: "stretch",
          sm: "center",
          md: "flex-start",
        },
        justifyContent: { xs: "center", md: "flex-start" },
      }}
    >
      <CustomButton
        variant="contained"
        onClick={(e: any) => handleLoginClick(e)} // Pass event
        label="Login"
        sx={{
          width: { xs: "100%", sm: "160px" },
          fontWeight: 700,
          backgroundColor: theme.palette.tertiary.main,
          color: theme.palette.tertiary.contrastText,
          border: `2px solid ${theme.palette.tertiary.dark}`,
          "&:hover": {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.dark,
          },
        }}
        endIcon={<ArrowForwardIcon />}
      />

      <Box
        ref={signUpHoverRef}
        onMouseEnter={() => {
          if (isMobile) return;
          if (signUpHoverTimeout.current) {
            clearTimeout(signUpHoverTimeout.current);
            signUpHoverTimeout.current = null;
          }
          setShowSignUpOptions(true);
        }}
        onMouseLeave={(event) => {
          if (isMobile) return;
          const nextTarget = event.relatedTarget as Node | null;
          if (nextTarget && signUpHoverRef.current?.contains(nextTarget))
            return;
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
          maxWidth: "100%",
        }}
      >
        <CustomButton
          variant="outlined"
          color="primary"
          label="Sign Up"
          endIcon={<ArrowOutwardIcon />}
          onClick={(e: any) => {
            if (isMobile) {
              setShowSignUpOptions((prev: boolean) => !prev);
            }
          }}
          aria-haspopup="true"
          aria-expanded={showSignUpOptions}
          sx={{
            width: "100%",
            fontWeight: 700,
            backdropFilter: "blur(4px)",
          }}
        />

        <Paper
          elevation={8}
          onMouseEnter={() => {
            if (isMobile) return;
            if (signUpHoverTimeout.current) {
              clearTimeout(signUpHoverTimeout.current);
              signUpHoverTimeout.current = null;
            }
            setShowSignUpOptions(true);
          }}
          onMouseLeave={(event) => {
            if (isMobile) return;
            const nextTarget = event.relatedTarget as Node | null;
            if (nextTarget && signUpHoverRef.current?.contains(nextTarget))
              return;
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
            top: { xs: "72px", sm: "54px" },
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
            zIndex: 60,
          }}
        >
          <Stack spacing={1.5}>
            {signUpOptions.map((option) => (
              <Box
                key={option.label}
                component="button"
                onClick={(e) => handleRegisterClick(option.userType, e)} // Pass event
                sx={{
                  borderRadius: 2,
                  p: 1.5,
                  display: "block",
                  color: theme.palette.text.primary,
                  textDecoration: "none",
                  transition: "background 0.2s ease",
                  width: "100%",
                  textAlign: "left",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  "&:hover": {
                    background: alpha(theme.palette.primary.main, 0.35),
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
);

const AuthForm = ({ currentView, userType }: any) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: 550,
      mx: { xs: "auto", md: 0 },
    }}
  >
    <AnimatePresence mode="wait">
      {currentView === "login" && (
        <motion.div
          key="login"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <LoginForm />
        </motion.div>
      )}
      {currentView === "register" && (
        <motion.div
          key="register"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <RegistrationForm UserType={userType} />
        </motion.div>
      )}
    </AnimatePresence>
  </Box>
);

/*
---
--- 3. Shapes Component (Matches Your Image / Old Grid Layout)
---
*/

const homeTransition = { type: "spring", stiffness: 55, damping: 20 } as const;
const authTransition = (delay: number) => ({
  type: "spring" as const,
  stiffness: 55,
  damping: 20,
  delay: delay,
});



const Shapes = ({ theme, isHome }: { theme: Theme; isHome: boolean }) => (
  <Box
    sx={{
      position: "relative",
      width: "100%",
      height: "100%",
      // Floating animations
      "@keyframes floatSlow": {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-10px)" },
      },
      "@keyframes floatMed": {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(8px)" },
      },
      "@keyframes floatFast": {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-6px)" },
      },
    }}
  >
    {/* --- Shape 1: Tall Blue Pill (Top Left) --- */}
    <MotionBox
      initial={isHome ? "home" : "auth"}
      animate={isHome ? "home" : "auth"}
      variants={{
        home: {
          top: "20%",
          left: "50%", // Home: Left side of the cluster
          width: "120px",
          height: "250px",
          borderRadius: "999px",
          transition: homeTransition,
        },
        auth: {
          top: "50%",
          left: "20%",
          width: "250px",
          height: "120px",
          borderRadius: "999px",
          transition: authTransition(0.1),
        },
      }}
      sx={{
        position: "absolute",
        bgcolor: "#5696d8", // Matching image light blue
        animation: "floatSlow 9s ease-in-out infinite",
      }}
    />

    {/* --- Shape 2: Wide Purple Rectangle (Top Right) --- */}
    <MotionBox
      initial={isHome ? "home" : "auth"}
      animate={isHome ? "home" : "auth"}
      variants={{
        home: {
          top: "20%",
          left: "70%", // Home: Top Right
          width: "260px",
          height: "110px",
          borderRadius: "12px",
          rotate: 0,
          transition: homeTransition,
        },
        auth: {
          top: "40%",
          left: "0%",
          width: "130px",
          height: "260px",
          borderRadius: "12px",
          rotate: 5, // Slight tilt in auth mode for variety
          transition: authTransition(0.2),
        },
      }}
      sx={{
        position: "absolute",
        bgcolor: "#502ba0", // Matching image purple
        animation: "floatMed 11s ease-in-out infinite",
        animationDelay: "0.5s",
      }}
    />

    {/* --- Shape 3: The Horizontal Line (Center) --- */}
    <MotionBox
      initial={isHome ? "home" : "auth"}
      animate={isHome ? "home" : "auth"}
      variants={{
        home: {
          top: "55%",
          left: "60%", // Home: Center
          width: "170px",
          height: "8px",
          borderRadius: "4px",
          rotate: 0,
          transition: homeTransition,
        },
        auth: {
          top: "15%",
          left: "20%",
          width: "8px",
          height: "160px",
          borderRadius: "4px",
          rotate: 0,
          transition: authTransition(0.4),
        },
      }}
      sx={{
        position: "absolute",
        bgcolor: theme.palette.common.black,
        animation: "floatFast 8s ease-in-out infinite",
        animationDelay: "1s",
      }}
    />

    {/* --- Shape 4: Dark Blue Square (Bottom Left) --- */}
    <MotionBox
      initial={isHome ? "home" : "auth"}
      animate={isHome ? "home" : "auth"}
      variants={{
        home: {
          top: "62%",
          left: "50%",
          width: "130px",
          height: "130px",
          borderRadius: "16px",
          rotate: 0,
          transition: homeTransition,
        },
        auth: {
          top: "20%",
          left: "35%",
          width: "130px",
          height: "130px",
          borderRadius: "16px",
          rotate: -10,
          transition: authTransition(0.15),
        },
      }}
      sx={{
        position: "absolute",
        bgcolor: "#243168", // Matching image dark blue
        animation: "floatSlow 12s ease-in-out infinite",
        animationDelay: "0.2s",
      }}
    />

    {/* --- Shape 5: Light Blue Oval (Middle Right) --- */}
    <MotionBox
      initial={isHome ? "home" : "auth"}
      animate={isHome ? "home" : "auth"}
      variants={{
        home: {
          top: "45%",
          left: "85%",
          width: "120px",
          height: "210px",
          borderRadius: "999px",
          rotate: 0,
          transition: homeTransition,
        },
        auth: {
          top: "10%",
          left: "0%",
          width: "120px",
          height: "210px",
          borderRadius: "999px",
          rotate: 15,
          transition: authTransition(0.25),
        },
      }}
      sx={{
        position: "absolute",
        bgcolor: "#abcce8", // Matching image pale blue
        animation: "floatMed 10s ease-in-out infinite",
        animationDelay: "0.7s",
      }}
    />

    {/* --- Shape 6: Vertical Thin Line (Far Right) --- */}
    <MotionBox
      initial={isHome ? "home" : "auth"}
      animate={isHome ? "home" : "auth"}
      variants={{
        home: {
          top: "20%",
          left: "103%",
          width: "10px",
          height: "125px",
          borderRadius: "4px",
          rotate: 0,
          transition: homeTransition,
        },
        auth: {
          top: "75%",
          left: "35%",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          rotate: 0,
          transition: authTransition(0.4),
        },
      }}
      sx={{
        position: "absolute",
        bgcolor: "#3f4d9b", // Matching image indigo
        animation: "floatSlow 14s ease-in-out infinite",
      }}
    />

    {/* --- Shape 7: Vertical Thin Line Bottom (Far Right Bottom) --- */}
    <MotionBox
      initial={isHome ? "home" : "auth"}
      animate={isHome ? "home" : "auth"}
      variants={{
        home: {
          top: "45%",
          left: "105%",
          width: "8px",
          height: "200px",
          borderRadius: "4px",
          rotate: 0,
          transition: homeTransition,
        },
        auth: {
          top: "30%",
          left: "-8%",
          width: "8px",
          height: "180px",
          borderRadius: "4px",
          rotate: 0,
          transition: authTransition(0.45),
        },
      }}
      sx={{
        position: "absolute",
        bgcolor: theme.palette.common.black,
        animation: "floatSlow 13s ease-in-out infinite",
        animationDelay: "0.5s",
      }}
    />

    {/* --- Shape 8: Pink Circle (Bottom Corner) --- */}
    <MotionBox
      initial={isHome ? "home" : "auth"}
      animate={isHome ? "home" : "auth"}
      variants={{
        home: {
          top: "75%",
          left: "75%",
          width: "110px",
          height: "110px",
          borderRadius: "50%",
          scale: 1,
          transition: homeTransition,
        },
        auth: {
          top: "80%",
          left: "-10%",
          width: "200px",
          height: "90px",
          borderRadius: "999px",
          scale: 1.1,
          transition: authTransition(0.3),
        },
      }}
      sx={{
        position: "absolute",
        bgcolor: "#e91e63", // Matching image pink
        animation: "floatFast 9s ease-in-out infinite",
        animationDelay: "0.3s",
      }}
    />

    {/* --- Background Blur Blob (Subtle atmosphere) --- */}
    <MotionBox
      initial={isHome ? "home" : "auth"}
      animate={isHome ? "home" : "auth"}
      variants={{
        home: { left: "60%", top: "20%" },
        auth: { left: "10%", top: "30%" },
      }}
      transition={{ duration: 2, ease: "easeInOut" }}
      sx={{
        position: "absolute",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${alpha(
          theme.palette.primary.light,
          0.15
        )} 0%, transparent 70%)`,
        filter: "blur(60px)",
        zIndex: -1,
      }}
    />
  </Box>
);
const menuLinkStyles = (theme: Theme) => ({
  textDecoration: "none",
  color: theme.palette.text.primary,
  fontWeight: 600,
  transition: "color 0.2s ease",
  "&:hover": {
    color: theme.palette.primary.dark,
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
