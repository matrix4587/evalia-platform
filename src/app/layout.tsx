import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css"; // THIS IS CRITICAL
import { SessionProvider } from "next-auth/react";

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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