import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import { PopupProvider } from "@/contexts/PopupContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { UsageProvider } from "@/contexts/UsageContext";
import PaymentMessage from "@/components/payment/PaymentMessage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Fiesta - Compare AI Models Side by Side",
  description: "Compare responses from multiple AI models including GPT-4, Claude, Gemini, and more. See how different AI systems respond to the same prompt.",
  keywords: ["AI", "comparison", "GPT-4", "Claude", "Gemini", "OpenRouter", "machine learning"],
  authors: [{ name: "AI Fiesta" }],
  openGraph: {
    title: "AI Fiesta - Compare AI Models Side by Side",
    description: "Compare responses from multiple AI models including GPT-4, Claude, Gemini, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <DarkModeProvider>
              <NotificationProvider>
                <PopupProvider>
                  <SubscriptionProvider>
                    <UsageProvider>
                      {children}
                      <PaymentMessage />
                    </UsageProvider>
                  </SubscriptionProvider>
                </PopupProvider>
              </NotificationProvider>
            </DarkModeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
