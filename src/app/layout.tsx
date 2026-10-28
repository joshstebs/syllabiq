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
  description: "Plan course tasks, review syllabus deadlines, and import dated coursework from supported LMS calendar feeds with SyllabiQ.",
  keywords: ["syllabus planner", "academic calendar", "college organization", "student planner", "deadline tracker", "syllabus organizer", "Google Calendar student planner"],
  authors: [{ name: "Harbour & Main" }],
  creator: "Harbour & Main",
  publisher: "Harbour & Main",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: canonicalUrl,
    title: "SyllabiQ - Your Whole Semester Organized In Seconds",
    description: "Explore syllabus-first planning, reviewable deadline checklists, and LMS calendar-feed imports. Direct LMS account sync and Google sync are not enabled.",
    siteName: "SyllabiQ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SyllabiQ - Academic Planning Made Simple"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SyllabiQ - Your Whole Semester Organized In Seconds",
    description: "Explore SyllabiQ's syllabus-first planning workspace. Verify all imported deadlines.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SyllabiQ",
  url: canonicalUrl,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description: "A student planning workspace for organizing course tasks, reviewing syllabus deadlines, and importing dated coursework from iCalendar feeds. Direct LMS account sync and Google sync are not enabled.",
  offers: {
    "@type": "Offer",
    price: "8.00",
    priceCurrency: "CAD",
    description: "One-time SyllabiQ Pro semester pass for $8 CAD. No automatic renewal."
  },
  creator: {
    "@type": "Organization",
    name: "Harbour & Main",
    url: "https://harbourandmain.com",
    logo: "https://harbourandmain.com/assets/logo.svg"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-CA" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-[#F8FAFC] text-[#0F172A] dark:bg-[#0B0F19] dark:text-[#F8FAFC] transition-colors duration-200">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
