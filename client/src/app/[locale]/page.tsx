"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
  Stack,
  Card,
  CardContent,
  IconButton,
  alpha,
} from "@mui/material";
import Link from "next/link";

// Icons
import SchoolIcon from "@mui/icons-material/School";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function HomePage() {
  const theme = useTheme();

  const userTypes = [
    {
      type: "university member",
      path: `/register?userType=university-member`,
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      description:
        "Register as a university member to access courses, events, and academic resources",
    },
    {
      type: "vendor",
      path: `/register?userType=vendor`,
      icon: <StorefrontIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.dark,
      description:
        "Register as a vendor to provide services for university events",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `${theme.palette.primary.main}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: `${theme.palette.primary.main}`,
          zIndex: 0,
        }}
      />

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          color: theme.palette.common.white,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              letterSpacing: "0.02em",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              fontWeight: 600,
            }}
          >
            Multaqa
          </Typography>
          <Typography
            variant="h5"
            component="p"
            gutterBottom
            sx={{
              mb: 4,
              maxWidth: "700px",
              mx: "auto",
              opacity: 0.9,
              fontSize: { xs: "1.1rem", md: "1.3rem" },
            }}
          >
            Your University Event Management Platform
          </Typography>

          <Stack
            direction="row"
            spacing={3}
            justifyContent="center"
            sx={{ mb: 6 }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              href={`/login`}
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
                py: 1.5,
                px: 4,
                borderRadius: "50px",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                },
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Login
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Registration Section */}
      <Container
        maxWidth="lg"
        sx={{ py: 6, flexGrow: 1, position: "relative", zIndex: 1 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: theme.palette.background.default,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `${theme.palette.secondary.main}`,
            }}
          />

          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            align="center"
            color="primary"
            sx={{
              mb: 5,
              fontWeight: 600,
              position: "relative",
              "&:after": {
                content: '""',
                display: "block",
                width: "80px",
                height: "4px",
                backgroundColor: theme.palette.secondary.main,
                position: "absolute",
                bottom: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "2px",
              },
            }}
          >
            Register as
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
            flexWrap="wrap"
          >
            {userTypes.map((user) => (
              <Box
                key={user.type}
                sx={{
                  flexBasis: { xs: "100%", sm: "45%" },
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card
                  elevation={2}
                  sx={{
                    width: "100%",
                    maxWidth: "400px",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    transition: "all 0.3s ease-in-out",
                    overflow: "hidden",
                    border: `1px solid ${alpha(user.color, 0.2)}`,
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 12px 28px ${alpha(user.color, 0.2)}`,
                      "& .icon-container": {
                        backgroundColor: user.color,
                        "& svg": {
                          color: "#fff",
                          transform: "scale(1.1)",
                        },
                      },
                      "& .arrow-icon": {
                        opacity: 1,
                        transform: "translateX(0)",
                      },
                    },
                  }}
                  component={Link}
                  href={user.path}
                >
                  <CardContent
                    sx={{
                      p: 0,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Box
                      className="icon-container"
                      sx={{
                        backgroundColor: alpha(user.color, 0.1),
                        p: 3,
                        display: "flex",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        "& svg": {
                          color: user.color,
                          transition: "all 0.3s ease",
                        },
                      }}
                    >
                      {user.icon}
                    </Box>

                    <Box sx={{ p: 3, flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 600,
                          color: user.color,
                        }}
                      >
                        {user.type}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {user.description}
                      </Typography>

                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <IconButton
                          className="arrow-icon"
                          size="small"
                          sx={{
                            color: user.color,
                            opacity: 0.5,
                            transform: "translateX(-8px)",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: "auto",
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.common.white,
          position: "relative",
          zIndex: 1,
          borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box textAlign={{ xs: "center", md: "left" }}>
              <Typography variant="h6" gutterBottom>
                Multaqa
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Connecting university events and communities
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="text"
                color="inherit"
                component={Link}
                href="/about"
              >
                About
              </Button>
              <Button
                variant="text"
                color="inherit"
                component={Link}
                href="/contact"
              >
                Contact
              </Button>
              <Button
                variant="text"
                color="inherit"
                component={Link}
                href="/help"
              >
                Help
              </Button>
            </Stack>

            <Typography
              variant="body2"
              sx={{
                opacity: 0.7,
                textAlign: { xs: "center", md: "right" },
              }}
            >
              © {new Date().getFullYear()} Multaqa - University Event Management
              Platform
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
