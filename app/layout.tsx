import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/components/providers/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Job Application Tracker - Organize Your Job Search",
    template: "%s | Job Tracker",
  },
  description:
    "Track and manage your job applications with ease. Organize job postings, monitor application status, and stay on top of your job search journey.",
  keywords: [
    "job application tracker",
    "job search organizer",
    "application management",
    "job hunt",
    "career search",
    "job tracking",
    "application status",
  ],
  authors: [{ name: "Matt Wood" }],
  creator: "Matt Wood",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Job Application Tracker - Organize Your Job Search",
    description:
      "Track and manage your job applications with ease. Organize job postings, monitor application status, and stay on top of your job search journey.",
    siteName: "Job Application Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Application Tracker - Organize Your Job Search",
    description:
      "Track and manage your job applications with ease. Organize job postings, monitor application status, and stay on top of your job search journey.",
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
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
