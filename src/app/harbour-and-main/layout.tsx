import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Harbour and Main - SyllabiQ',
  description: 'Harbour and Main builds beautiful, high-performance websites and web applications for local businesses and academic communities.',
  alternates: {
    canonical: '/harbour-and-main'
  },
  openGraph: {
    title: 'Harbour and Main - SyllabiQ',
    description: 'Harbour and Main builds beautiful, high-performance websites and web applications for local businesses and academic communities.',
    url: 'https://syllabiq.ca/harbour-and-main',
    siteName: 'SyllabiQ',
    type: 'website'
  }
};

export default function HarbourAndMainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
