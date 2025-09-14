import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/contexts/AuthContext'
import { DarkModeProvider } from '@/contexts/DarkModeContext'
import { PlanProvider } from '@/contexts/PlanContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import ToastContainer from '@/components/ui/ToastContainer'
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
  title: "AI Fiesta",
  description: "Compare responses from multiple AI models simultaneously. Get insights from GPT-5, Claude 4, Gemini 2.5, and more in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <DarkModeProvider>
            <PlanProvider>
              <NotificationProvider>
                {children}
                <ToastContainer />
              </NotificationProvider>
            </PlanProvider>
          </DarkModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}