import type { Metadata } from "next";
import localFont from "next/font/local"; // Changed import
import "./globals.css";
import { SessionProvider } from "next-auth/react";

// Point to your local font files
const dmSans = localFont({
  src: [
    {
      path: "./fonts/DMSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/DMSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/DMSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "AI Trainer Platform",
  description: "Train AI models and earn rewards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}