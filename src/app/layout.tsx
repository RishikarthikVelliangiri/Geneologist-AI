import type { Metadata } from "next";
import { Hanken_Grotesk, Libre_Caslon_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const caslon = Libre_Caslon_Display({
  variable: "--font-caslon",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "The Idea Genealogist",
  description: "Trace the intellectual ancestry of any idea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${hanken.variable} ${caslon.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
