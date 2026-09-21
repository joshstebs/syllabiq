import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Who It\'s For - SyllabiQ',
  description: 'SyllabiQ is built for STEM students, pre-med, humanities majors, student athletes, graduate students, and first-year college students.',
  alternates: {
    canonical: '/who-its-for'
  },
  openGraph: {
    title: 'Who It\'s For - SyllabiQ',
    description: 'SyllabiQ is built for STEM students, pre-med, humanities majors, student athletes, graduate students, and first-year college students.',
    url: 'https://syllabiq.ca/who-its-for',
    siteName: 'SyllabiQ',
    type: 'website'
  }
};

export default function WhoItsForLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
