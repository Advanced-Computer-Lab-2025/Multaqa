import type { Metadata } from "next";
import { PT_Sans, Jost } from "next/font/google";
import "./globals.css";

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
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
    "Multaqa is a comprehensive university event management platform designed for the German University in Cairo. Streamline campus events including bazaars, trips, competitions, workshops, and conferences. Built with MERN stack for efficient event planning and participation.",
  keywords:
    "university events, event management, GUC, German University Cairo, campus events, student activities, workshops, conferences, bazaars, academic events, event registration, student platform",
  authors: [{ name: "Advanced Computer Lab Team - Winter 2025" }],
  creator: "GUC Students - CSEN 704/DMET 706",
  publisher: "German University in Cairo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multaqa-guc.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Multaqa - University Event Management Platform",
    description:
      "Comprehensive event management platform for German University in Cairo. Discover, register, and participate in campus events including workshops, competitions, trips, and conferences.",
    url: "https://multaqa-guc.com",
    siteName: "Multaqa",
    images: [
      {
        url: "/multaqa-logo.svg",
        width: 512,
        height: 512,
        alt: "Multaqa Logo - University Event Management Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multaqa - University Event Management Platform",
    description:
      "Comprehensive event management platform for German University in Cairo. Discover and participate in campus events.",
    images: ["/multaqa-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${ptSans.variable} ${jost.variable} antialiased font-sans`}
      >
          {children}
      </body>
    </html>
  );
}
