import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL('https://syllabiq.ca'),
  title: "SyllabiQ - Your Whole Semester Organized In Seconds",
  description: "Automate your study schedule. Upload your syllabi or connect your LMS to pull every due date and keep you on track.",
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: "SyllabiQ - Your Whole Semester Organized In Seconds",
    description: "Automate your study schedule. Upload your syllabi or connect your LMS to pull every due date and keep you on track.",
    url: 'https://syllabiq.ca',
    siteName: 'SyllabiQ',
    images: [
      {
        url: '/file.svg',
        width: 16,
        height: 16,
        alt: 'SyllabiQ'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: "SyllabiQ - Your Whole Semester Organized In Seconds",
    description: "Automate your study schedule. Upload your syllabi or connect your LMS to pull every due date and keep you on track.",
    images: ['/file.svg']
  }
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
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
