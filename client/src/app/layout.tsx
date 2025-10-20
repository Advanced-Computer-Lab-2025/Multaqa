import type { Metadata } from "next";
import { Poppins, Jost } from "next/font/google";
import "./globals.css";
import { getLocale } from "next-intl/server";

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../themes/lightTheme";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Multaqa - University Event Management Platform",
  description:
    "Multaqa is a comprehensive university event management platform designed for the German University in Cairo...",
  keywords:
    "university events, event management, GUC, German University Cairo...",
  authors: [{ name: "Advanced Computer Lab Team - Winter 2025" }],
  creator: "GUC Students - CSEN 704/DMET 706",
  publisher: "German University in Cairo",
  // ... keep the rest of your metadata unchanged
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${poppins.variable} ${jost.variable} antialiased font-sans`}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
