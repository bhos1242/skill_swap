import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/utils/navbar";
import { Footer } from "@/components/utils/footer";
import { ProfileGuard } from "@/components/profile/profile-guard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Swap - Skill Exchange Platform",
  description:
    "A modern platform that enables users to exchange skills through a barter system for learning. Connect with people who want to teach skills they know in exchange for learning skills they need.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Skill Swap" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <ProfileGuard>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ProfileGuard>
        </Providers>
      </body>
    </html>
  );
}
