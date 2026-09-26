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

const canonicalUrl = "https://syllabiq.ca";

export const metadata: Metadata = {
  metadataBase: new URL(canonicalUrl),
  title: {
    default: "SyllabiQ - Your Whole Semester Organized In Seconds",
    template: "%s | SyllabiQ"
  },
  description: "Upload your syllabus or import calendar feeds. SyllabiQ builds your semester timeline, syncs to Google Calendar, and keeps you organized. First month free, then $5/month.",
  keywords: ["syllabus planner", "academic calendar", "college organization", "student planner", "deadline tracker", "canvas calendar", "google calendar sync"],
  authors: [{ name: "Harbour & Main" }],
  creator: "Harbour & Main",
  publisher: "Harbour & Main",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: canonicalUrl,
    title: "SyllabiQ - Your Whole Semester Organized In Seconds",
    description: "Upload your syllabus or import calendar feeds. SyllabiQ builds your semester timeline automatically. First month free, then $5/month.",
    siteName: "SyllabiQ",
    images: [
      {
        url: "https://syllabiq.ca/og-image.png",
        width: 1200,
        height: 630,
        alt: "SyllabiQ - Academic Planning Made Simple"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SyllabiQ - Your Whole Semester Organized In Seconds",
    description: "Upload your syllabus or import calendar feeds. SyllabiQ builds your semester timeline automatically.",
    images: ["https://syllabiq.ca/og-image.png"]
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
