import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "SyllabiQ - Your Whole Semester Organized In Seconds",
  description: "Automate your study schedule. Upload your syllabi or connect your LMS to pull every due date and keep you on track."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-[#F8FAFC] text-[#0F172A] dark:bg-[#0B0F19] dark:text-[#F8FAFC] transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
