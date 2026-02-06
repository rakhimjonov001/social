/**
 * Root Layout
 *
 * Global layout with providers and metadata
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "../app/api/uploadthing/core";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Social - Connect with the World",
    template: "%s | Social",
  },
  description: "A modern social media platform to connect, share, and discover.",
  keywords: ["social media", "social network", "posts", "sharing", "community"],
  authors: [{ name: "Social Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://social.app",
    siteName: "Social",
    title: "Social - Connect with the World",
    description: "A modern social media platform to connect, share, and discover.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social - Connect with the World",
    description: "A modern social media platform to connect, share, and discover.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
