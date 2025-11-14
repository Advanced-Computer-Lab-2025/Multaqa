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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { Theme, SxProps } from "@mui/material/styles";
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
import HomeIcon from "@mui/icons-material/Home";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/shared/LoginForm/LoginForm";
import RegistrationForm from "@/components/shared/RegistrationForm/RegistrationForm";

const consentStorageKey = "multaqa-consent-v1";

type Shape = {
  id: string;
  type: "circle" | "rectangle" | "triangle";
  color: string;
  size: number;
  width?: number;
  height?: number;
  padding?: number;
  initialPos: { x: number; y: number };
  targetPosLogin: { x: number; y: number };
  targetPosRegister: { x: number; y: number };
  rotation?: number;
  targetRotation?: number;
  scale?: number;
  targetScale?: number;
};

const getShapeStyle = (shape: Shape, isAligned: boolean) => {
  const w = shape.width ?? shape.size;
  const h = shape.height ?? shape.size;
  const p = shape.padding ?? 0;

  if (shape.type === "triangle") {
    return {
      width: 0,
      height: 0,
      borderLeft: `${w / 2}px solid transparent`,
      borderRight: `${w / 2}px solid transparent`,
      borderBottom: `${h}px solid ${alpha(shape.color, 1)}`,
      padding: p,
      backgroundColor: "transparent",
      boxShadow: "none",
    };
  }

  return {
    width: w,
    height: h,
    padding: p,
    backgroundColor: shape.color,
    borderRadius: shape.type === "circle" ? "50%" : "12px",
    boxShadow: isAligned
      ? `0 15px 40px ${alpha(shape.color, 0.4)}`
      : `0 8px 25px ${alpha(shape.color, 0.25)}`,
  };
};

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
      "Log in with your university account, browse any event, and tap the register button. We'll confirm your spot instantly and send reminders as the event approaches.",
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
  sx,
}: {
  open: boolean;
  onClick: () => void;
  sx?: SxProps<Theme>;
}) => (
  <IconButton
    onClick={onClick}
    aria-label={open ? "Close menu" : "Open menu"}
    sx={[
      (theme) => ({
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
      }),
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
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
            transition: "transform 0.52s ease, opacity 0.52s ease",
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

const CustomAccordion = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          p: 2,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography
          sx={{
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.3s",
          }}
        >
          ▼
        </Typography>
      </Box>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ p: 2, pt: 0 }}>{children}</Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
};

const CustomModalLayout = ({
  open,
  onClose,
  children,
  width,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}) => {
  const theme = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: alpha(theme.palette.common.black, 0.5),
              backdropFilter: "blur(4px)",
            }}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              backgroundColor: theme.palette.background.paper,
              borderRadius: 16,
              padding: 24,
              maxWidth: width || "500px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            {children}
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

const CustomButton = ({
  variant = "contained",
  color = "primary",
  label,
  onClick,
  endIcon,
  sx,
  component,
  href,
  ...props
}: any) => {
  const theme = useTheme();
  const Component = component || "button";

  const getStyles = () => {
    if (variant === "contained") {
      return {
        backgroundColor: theme.palette[color].main,
        color: theme.palette[color].contrastText,
        "&:hover": {
          backgroundColor: theme.palette[color].dark,
        },
      };
    }
    return {
      backgroundColor: "transparent",
      color: theme.palette[color].main,
      border: `2px solid ${theme.palette[color].main}`,
      "&:hover": {
        backgroundColor: alpha(theme.palette[color].main, 0.1),
      },
    };
  };

  return (
    <Component
      onClick={onClick}
      href={href}
      sx={{
        px: 3,
        py: 1.5,
        borderRadius: 2,
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        textDecoration: "none",
        transition: "all 0.2s ease",
        ...getStyles(),
        ...sx,
      }}
      {...props}
    >
      {label}
      {endIcon}
    </Component>
  );
};

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showSignUpOptions, setShowSignUpOptions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLocaleModalOpen, setIsLocaleModalOpen] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | "login" | "register">(
    "home"
  );
  const [userType, setUserType] = useState<string>("");

  const lastScrollY = useRef(0);
  const signUpHoverRef = useRef<HTMLDivElement | null>(null);
  const signUpHoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<Element | null>(null);

  // Initial shapes scattered on the right side
  const initialShapes: Shape[] = [
    {
      id: "shape-1",
      type: "triangle",
      color: theme.palette.primary.main,
      size: 80,
      width: 80,
      height: 80,
      initialPos: { x: 100, y: 50 },
      targetPosLogin: { x: -50, y: 50 },
      targetPosRegister: { x: -50, y: 80 },
      rotation: 0,
      targetRotation: 0,
      scale: 1,
      targetScale: 1,
    },
    {
      id: "shape-2",
      type: "rectangle",
      color: theme.palette.secondary.main,
      width: 90,
      height: 90,
      size: 90,
      initialPos: { x: 250, y: 20 },
      targetPosLogin: { x: -50, y: 200 },
      targetPosRegister: { x: -50, y: 250 },
      rotation: 15,
      targetRotation: 0,
      scale: 1,
      targetScale: 1,
    },
    {
      id: "shape-3",
      type: "circle",
      color: theme.palette.tertiary?.main || "#ff5722",
      width: 70,
      height: 70,
      size: 70,
      initialPos: { x: 150, y: 150 },
      targetPosLogin: { x: -50, y: 350 },
      targetPosRegister: { x: -50, y: 420 },
      rotation: 0,
      targetRotation: 0,
      scale: 1,
      targetScale: 1,
    },
    {
      id: "shape-4",
      type: "rectangle",
      color: "#9c27b0",
      width: 85,
      height: 85,
      size: 85,
      initialPos: { x: 50, y: 220 },
      targetPosLogin: { x: -50, y: 500 },
      targetPosRegister: { x: -50, y: 580 },
      rotation: -20,
      targetRotation: 0,
      scale: 1,
      targetScale: 1,
    },
    {
      id: "shape-5",
      type: "circle",
      color: "#ff9800",
      width: 95,
      height: 95,
      size: 95,
      initialPos: { x: 300, y: 180 },
      targetPosLogin: { x: -50, y: 650 },
      targetPosRegister: { x: -50, y: 740 },
      rotation: 0,
      targetRotation: 0,
      scale: 1,
      targetScale: 1,
    },
    {
      id: "shape-6",
      type: "rectangle",
      color: "#e91e63",
      width: 75,
      height: 75,
      size: 75,
      initialPos: { x: 180, y: 280 },
      targetPosLogin: { x: 80, y: 50 },
      targetPosRegister: { x: 80, y: 100 },
      rotation: 25,
      targetRotation: 0,
      scale: 1,
      targetScale: 1,
    },
    {
      id: "shape-7",
      type: "circle",
      color: "#00bcd4",
      width: 88,
      height: 88,
      size: 88,
      initialPos: { x: 90, y: 100 },
      targetPosLogin: { x: 80, y: 200 },
      targetPosRegister: { x: 80, y: 260 },
      rotation: 0,
      targetRotation: 0,
      scale: 1,
      targetScale: 1,
    },
    {
      id: "shape-8",
      type: "rectangle",
      color: "#4caf50",
      width: 82,
      height: 82,
      size: 82,
      initialPos: { x: 270, y: 120 },
      targetPosLogin: { x: 80, y: 350 },
      targetPosRegister: { x: 80, y: 420 },
      rotation: -12,
      targetRotation: 0,
      scale: 1,
      targetScale: 1,
    },
    {
      id: "shape-9",
      type: "circle",
      color: theme.palette.primary.dark,
      width: 78,
      height: 78,
      size: 78,
      initialPos: { x: 200, y: 240 },
      targetPosLogin: { x: 80, y: 500 },
      targetPosRegister: { x: 80, y: 580 },
      rotation: 0,
      targetRotation: 0,
      scale: 1,
      targetScale: 1,
    },
    {
      id: "shape-10",
      type: "rectangle",
      color: "#f44336",
      width: 92,
      height: 92,
      size: 92,
      initialPos: { x: 330, y: 80 },
      targetPosLogin: { x: 80, y: 650 },
      targetPosRegister: { x: 80, y: 740 },
      rotation: 18,
      targetRotation: 0,
      scale: 1,
      targetScale: 1,
    },
  ];

  // Additional shapes that appear when transitioning to login
  const extraShapesLogin: Shape[] = [
    {
      id: "extra-login-1",
      type: "circle",
      color: "#673ab7",
      width: 85,
      height: 85,
      size: 85,
      initialPos: { x: -50, y: -150 },
      targetPosLogin: { x: -50, y: 800 },
      targetPosRegister: { x: -50, y: 0 },
      rotation: 0,
      targetRotation: 0,
      scale: 0.8,
      targetScale: 1,
    },
    {
      id: "extra-login-2",
      type: "rectangle",
      color: "#3f51b5",
      width: 90,
      height: 90,
      size: 90,
      initialPos: { x: 80, y: -150 },
      targetPosLogin: { x: 80, y: 800 },
      targetPosRegister: { x: 80, y: 0 },
      rotation: -15,
      targetRotation: 0,
      scale: 0.8,
      targetScale: 1,
    },
    {
      id: "extra-login-3",
      type: "triangle",
      color: "#009688",
      width: 80,
      height: 80,
      size: 80,
      initialPos: { x: -50, y: 1000 },
      targetPosLogin: { x: -50, y: 0 },
      targetPosRegister: { x: -50, y: 900 },
      rotation: 0,
      targetRotation: 0,
      scale: 0.8,
      targetScale: 1,
    },
    {
      id: "extra-login-4",
      type: "circle",
      color: "#ff5722",
      width: 88,
      height: 88,
      size: 88,
      initialPos: { x: 80, y: 1000 },
      targetPosLogin: { x: 80, y: 0 },
      targetPosRegister: { x: 80, y: 900 },
      rotation: 20,
      targetRotation: 0,
      scale: 0.8,
      targetScale: 1,
    },
  ];

  // Additional shapes that appear when transitioning to register
  const extraShapesRegister: Shape[] = [
    {
      id: "extra-register-1",
      type: "rectangle",
      color: "#607d8b",
      width: 95,
      height: 75,
      size: 85,
      initialPos: { x: -50, y: -150 },
      targetPosLogin: { x: -50, y: 0 },
      targetPosRegister: { x: -50, y: 900 },
      rotation: 0,
      targetRotation: 0,
      scale: 0.8,
      targetScale: 1,
    },
    {
      id: "extra-register-2",
      type: "circle",
      color: "#795548",
      width: 80,
      height: 80,
      size: 80,
      initialPos: { x: 80, y: -150 },
      targetPosLogin: { x: 80, y: 0 },
      targetPosRegister: { x: 80, y: 900 },
      rotation: -25,
      targetRotation: 0,
      scale: 0.8,
      targetScale: 1,
    },
    {
      id: "extra-register-3",
      type: "triangle",
      color: "#cddc39",
      width: 85,
      height: 85,
      size: 85,
      initialPos: { x: -150, y: 400 },
      targetPosLogin: { x: -50, y: 900 },
      targetPosRegister: { x: -50, y: 0 },
      rotation: 0,
      targetRotation: 0,
      scale: 0.8,
      targetScale: 1,
    },
    {
      id: "extra-register-4",
      type: "rectangle",
      color: "#ffc107",
      width: 78,
      height: 92,
      size: 85,
      initialPos: { x: -150, y: 200 },
      targetPosLogin: { x: 80, y: 900 },
      targetPosRegister: { x: 80, y: 0 },
      rotation: 15,
      targetRotation: 0,
      scale: 0.8,
      targetScale: 1,
    },
  ];

  const getActiveShapes = () => {
    if (currentView === "login") {
      return [...initialShapes, ...extraShapesLogin];
    } else if (currentView === "register") {
      return [...initialShapes, ...extraShapesRegister];
    }
    return initialShapes;
  };

  const shapes = getActiveShapes();

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
    if (typeof document === "undefined") {
      return;
    }

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
    if (typeof window === "undefined") {
      return;
    }
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

  useEffect(() => {
    if (!isMobile || !showSignUpOptions) {
      return;
    }

    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      if (!signUpHoverRef.current) {
        return;
      }
      const target = event.target as Node | null;
      if (target && signUpHoverRef.current.contains(target)) {
        return;
      }
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
        JSON.stringify({
          status,
          updatedAt: new Date().toISOString(),
        })
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
  const closeLocaleModal = () => {
    setIsLocaleModalOpen(false);
  };

  const handleLoginClick = () => {
    setCurrentView("login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegisterClick = (type: string) => {
    setUserType(type);
    setCurrentView("register");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHomeClick = () => {
    setCurrentView("home");
    setUserType("");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            component="a"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleHomeClick();
            }}
            variant="h6"
            sx={{
              textDecoration: "none",
              color: theme.palette.text.primary,
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 600,
              letterSpacing: "0.08em",
              cursor: "pointer",
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
              {currentView !== "home" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <IconButton
                    onClick={handleHomeClick}
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
                component="a"
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
                  onClick={handleLoginClick}
                  label="Login"
                  size="small"
                  sx={{
                    px: 2.4,
                    height: 40,
                    width: "auto",
                    fontWeight: 700,
                    backgroundColor: theme.palette.tertiary?.main || "#ff5722",
                    color: theme.palette.tertiary?.contrastText || "#fff",
                    border: `2px solid ${
                      theme.palette.tertiary?.dark || "#e64a19"
                    }`,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      borderColor: theme.palette.primary.dark,
                    },
                    boxShadow: `0 10px 24px ${alpha(
                      theme.palette.tertiary?.main || "#ff5722",
                      0.3
                    )}`,
                  }}
                />
              )}
            </Stack>

            {currentView !== "home" && (
              <IconButton
                onClick={handleHomeClick}
                aria-label="Go to home"
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
                <HomeIcon />
              </IconButton>
            )}

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

      {/* Locale Modal */}
      <CustomModalLayout
        open={isLocaleModalOpen}
        onClose={closeLocaleModal}
        width="420px"
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
                component="a"
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
                    backgroundColor: alpha(
                      theme.palette.tertiary?.main || "#ff5722",
                      0.25
                    ),
                  },
                }}
                onClick={closeLocaleModal}
              >
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    sx={{
                      width: 30,
                      height: 20,
                      borderRadius: "6px",
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                    }}
                  >
                    {locale.flagCode}
                  </Box>
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
        width="540px"
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
                  "&:last-child": {
                    mb: 0,
                  },
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
                    component="a"
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

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 3 }}
            justifyContent={{ xs: "center", sm: "flex-start" }}
            alignItems={{ xs: "center", sm: "flex-start" }}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Typography
              component="a"
              href="/terms"
              sx={menuSubLinkStyles(theme)}
            >
              Terms of Service
            </Typography>
            <Typography
              component="a"
              href="/privacy"
              sx={menuSubLinkStyles(theme)}
            >
              Privacy Policy
            </Typography>
            <Typography
              component="a"
              href="/cookies"
              sx={menuSubLinkStyles(theme)}
            >
              Cookies
            </Typography>
            <Typography
              component="a"
              href="/gdpr"
              sx={menuSubLinkStyles(theme)}
            >
              GDPR
            </Typography>
          </Stack>

          <Stack direction="column" spacing={1.25} sx={{ pt: 0.5 }}>
            <CustomButton
              variant="contained"
              onClick={handleAcceptConsent}
              label="Accept all"
              sx={{
                width: "100%",
                fontWeight: 700,
                backgroundColor: theme.palette.tertiary?.main || "#ff5722",
                color: theme.palette.tertiary?.contrastText || "#fff",
                border: `2px solid ${
                  theme.palette.tertiary?.dark || "#e64a19"
                }`,
                "&:hover": {
                  backgroundColor: theme.palette.tertiary?.dark || "#e64a19",
                  borderColor: theme.palette.tertiary?.dark || "#e64a19",
                },
              }}
            />
            <CustomButton
              variant="outlined"
              color="primary"
              onClick={handleDismissConsent}
              label="Continue without optional cookies"
              sx={{
                width: "100%",
                py: 0.75,
              }}
            />
          </Stack>
        </Stack>
      </CustomModalLayout>

      {/* Hero Section */}
      <Box
        component="section"
        sx={{ position: "relative", overflow: "hidden" }}
      >
        <Container
          maxWidth="lg"
          sx={{
            pt: { xs: 16, md: 18 },
            pb: { xs: 10, md: 14 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "center" },
            gap: { xs: 7, md: 10 },
            textAlign: { xs: "center", md: "left" },
            minHeight: {
              xs: "auto",
              md: currentView !== "home" ? "100vh" : "auto",
            },
          }}
        >
          {/* Main Content Area */}
          <AnimatePresence mode="wait">
            {currentView === "home" && (
              <motion.div
                key="home-content"
                initial={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -500 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
                style={{
                  flex: 1,
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                  maxWidth: "560px",
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
                  Artful events for every voice on campus.
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
                  Multaqa reimagines campus life with a vibrant hub for
                  showcasing events, workshops, and cultural experiences
                  inspired by the GUC community.
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
                    onClick={handleLoginClick}
                    label="Login"
                    sx={{
                      width: { xs: "100%", sm: "160px" },
                      fontWeight: 700,
                      backgroundColor:
                        theme.palette.tertiary?.main || "#ff5722",
                      color: theme.palette.tertiary?.contrastText || "#fff",
                      border: `2px solid ${
                        theme.palette.tertiary?.dark || "#e64a19"
                      }`,
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
                      maxWidth: "100%",
                    }}
                  >
                    <CustomButton
                      variant="outlined"
                      color="primary"
                      label="Sign Up"
                      endIcon={<ArrowOutwardIcon />}
                      onClick={() => {
                        if (isMobile) {
                          setShowSignUpOptions((prev) => !prev);
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
                        top: { xs: "72px", sm: "54px" },
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
                            component="a"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              const type = option.href.includes(
                                "university-member"
                              )
                                ? "university-member"
                                : "vendor";
                              handleRegisterClick(type);
                            }}
                            sx={{
                              borderRadius: 2,
                              p: 1.5,
                              display: "block",
                              color: theme.palette.text.primary,
                              textDecoration: "none",
                              transition: "background 0.2s ease",
                              "&:hover": {
                                background: alpha(
                                  theme.palette.primary.main,
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shapes and Form Container */}
          <Box
            sx={{
              flex: { md: 1 },
              position: "relative",
              minHeight: {
                xs: 500,
                sm: 600,
                md: currentView !== "home" ? 900 : 500,
              },
              width: "100%",
              maxWidth: { xs: 520, md: "100%" },
              mx: { xs: "auto", md: 0 },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 4, md: 6 },
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: 6,
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.08
                )}, ${alpha(theme.palette.tertiary?.main || "#ff5722", 0.15)})`,
                filter: "blur(80px)",
                zIndex: 0,
                opacity: 1,
              }}
            />

            {/* Animated Shapes */}
            <Box
              sx={{
                position: "relative",
                height: "100%",
                width: {
                  xs: "100%",
                  md: currentView !== "home" ? "40%" : "100%",
                },
                minHeight: { xs: 400, md: currentView !== "home" ? 900 : 500 },
                transition: "all 0.6s ease",
              }}
            >
              {shapes.map((shape, index) => {
                const isAligned = currentView !== "home";
                const targetX = isAligned
                  ? currentView === "login"
                    ? shape.targetPosLogin.x
                    : shape.targetPosRegister.x
                  : shape.initialPos.x;
                const targetY = isAligned
                  ? currentView === "login"
                    ? shape.targetPosLogin.y
                    : shape.targetPosRegister.y
                  : shape.initialPos.y;
                const targetRot = isAligned
                  ? shape.targetRotation || 0
                  : shape.rotation || 0;
                const targetScl = isAligned
                  ? shape.targetScale || 1
                  : shape.scale || 1;

                const isExtraShape = shape.id.includes("extra");
                const shouldShow =
                  currentView === "home"
                    ? !isExtraShape
                    : currentView === "login"
                    ? !shape.id.includes("register")
                    : !shape.id.includes("login");

                return (
                  <motion.div
                    key={shape.id}
                    initial={false}
                    animate={{
                      x: targetX,
                      y: targetY,
                      rotate: targetRot,
                      scale: targetScl,
                      opacity: shouldShow ? 1 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 60,
                      damping: 20,
                      delay: isAligned
                        ? isExtraShape
                          ? index * 0.06 + 0.3
                          : index * 0.04
                        : 0,
                    }}
                    style={{
                      position: "absolute",
                      width: shape.size,
                      height: shape.size,
                      top: 0,
                      left: 0,
                      zIndex: 1,
                    }}
                  >
                    <motion.div
                      animate={
                        !isAligned
                          ? {
                              y: [0, -15, 0],
                              rotate: [0, 5, -5, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 4 + index * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2,
                      }}
                      style={getShapeStyle(shape, isAligned)}
                    />
                  </motion.div>
                );
              })}
            </Box>

            {/* Login/Registration Form */}
            <Box
              sx={{
                flex: 1,
                width: { xs: "100%", md: "auto" },
                display: currentView !== "home" ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                minHeight: { xs: 400, md: 500 },
                zIndex: 2,
              }}
            >
              <AnimatePresence mode="wait">
                {currentView === "login" && (
                  <motion.div
                    key="login-form"
                    initial={{ opacity: 0, x: 500 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 500 }}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 20,
                      delay: 0.4,
                    }}
                    style={{ width: "100%", maxWidth: 550 }}
                  >
                    <LoginForm />
                  </motion.div>
                )}
                {currentView === "register" && (
                  <motion.div
                    key="register-form"
                    initial={{ opacity: 0, x: 500 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 500 }}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 20,
                      delay: 0.4,
                    }}
                    style={{ width: "100%", maxWidth: 550 }}
                  >
                    <RegistrationForm UserType={userType} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section - Only show on home */}
      <AnimatePresence>
        {currentView === "home" && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              component="section"
              sx={{
                py: { xs: 8, md: 12 },
                bgcolor: theme.palette.common.white,
              }}
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
                  Multaqa streamlines event planning, registration, and
                  discovery, so every voice on campus can connect through
                  meaningful experiences.
                </Typography>

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
                          bgcolor: alpha(theme.palette.primary.main, 0.4),
                          color: theme.palette.tertiary?.dark || "#e64a19",
                          mb: 2.5,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 1.5 }}
                      >
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

            {/* FAQ Section */}
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
                  Quick answers to help students, staff, and partners get the
                  most out of Multaqa.
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

            {/* Footer */}
            <Box
              component="footer"
              sx={{
                background: `linear-gradient(135deg, ${
                  theme.palette.primary.main
                } 0%, ${alpha(
                  theme.palette.tertiary?.main || "#ff5722",
                  0.7
                )} 100%)`,
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
                      Bringing the GUC community together through dynamic events
                      and collaborative storytelling.
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent={{ xs: "center", md: "flex-start" }}
                    sx={{ width: { xs: "100%", md: "auto" } }}
                  >
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
                          backgroundColor: alpha(
                            theme.palette.common.white,
                            0.12
                          ),
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
                      component="a"
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
                      component="a"
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
                      component="a"
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
                  © {new Date().getFullYear()} Multaqa. Crafted with care by the
                  GUC community.
                </Typography>
              </Container>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
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
            <MenuToggleButton
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
                    component="a"
                    href="/events"
                    variant="h6"
                    sx={menuLinkStyles(theme)}
                  >
                    Discover Events
                  </Typography>
                  <Typography
                    component="a"
                    href="/events/workshops"
                    sx={menuSubLinkStyles(theme)}
                  >
                    Workshops & Seminars
                  </Typography>
                  <Typography
                    component="a"
                    href="/events/competitions"
                    sx={menuSubLinkStyles(theme)}
                  >
                    Competitions & Hackathons
                  </Typography>
                  <Typography
                    component="a"
                    href="/events/festivals"
                    sx={menuSubLinkStyles(theme)}
                  >
                    Cultural Festivals
                  </Typography>
                </Stack>
                <Stack spacing={1.5} sx={{ flex: 1 }}>
                  <Typography
                    component="a"
                    href="/events/trips"
                    variant="h6"
                    sx={menuLinkStyles(theme)}
                  >
                    Trips & Exchanges
                  </Typography>
                  <Typography
                    component="a"
                    href="/events/camps"
                    sx={menuSubLinkStyles(theme)}
                  >
                    Student Retreats
                  </Typography>
                  <Typography
                    component="a"
                    href="/events/sports"
                    sx={menuSubLinkStyles(theme)}
                  >
                    Sports & Recreation
                  </Typography>
                  <Typography
                    component="a"
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
                  component="a"
                  href="/vendor"
                  variant="h6"
                  sx={menuLinkStyles(theme)}
                >
                  Become a Vendor
                </Typography>
                <Typography
                  component="a"
                  href="/vendor/resources"
                  sx={menuSubLinkStyles(theme)}
                >
                  Resources & Guidelines
                </Typography>
                <Typography
                  component="a"
                  href="/vendor/success"
                  sx={menuSubLinkStyles(theme)}
                >
                  Success Stories
                </Typography>
                <Typography
                  component="a"
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
                    onClick={() => {
                      handleRegisterClick("university-member");
                      setIsMenuOpen(false);
                    }}
                    label="University Member"
                    variant="contained"
                    sx={{
                      width: "100%",
                      height: 58,
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      backgroundColor:
                        theme.palette.tertiary?.main || "#ff5722",
                      color: theme.palette.tertiary?.contrastText || "#fff",
                      border: `2px solid ${
                        theme.palette.tertiary?.dark || "#e64a19"
                      }`,
                      "&:hover": {
                        backgroundColor:
                          theme.palette.tertiary?.dark || "#e64a19",
                        borderColor: theme.palette.tertiary?.dark || "#e64a19",
                      },
                    }}
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
                    onClick={() => {
                      handleRegisterClick("vendor");
                      setIsMenuOpen(false);
                    }}
                    label="Vendor"
                    color="primary"
                    variant="outlined"
                    sx={{
                      width: "100%",
                      height: 58,
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
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
                    component="a"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLoginClick();
                      setIsMenuOpen(false);
                    }}
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      textDecoration: "none",
                      cursor: "pointer",
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
                  component="a"
                  href="/about"
                  sx={menuSubLinkStyles(theme)}
                >
                  About Multaqa
                </Typography>
                <Typography
                  component="a"
                  href="/contact"
                  sx={menuSubLinkStyles(theme)}
                >
                  Contact Team
                </Typography>
                <Typography
                  component="a"
                  href="/privacy"
                  sx={menuSubLinkStyles(theme)}
                >
                  Privacy & Terms
                </Typography>
                <Typography
                  component="a"
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
                  component="a"
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
          </Stack>
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
