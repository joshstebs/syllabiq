import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - SyllabiQ',
  description: 'Frequently asked questions about SyllabiQ including syllabus formats, Google Cloud storage, academic integrity, and subscription details.',
  alternates: {
    canonical: '/faq'
  },
  openGraph: {
    title: 'FAQ - SyllabiQ',
    description: 'Frequently asked questions about SyllabiQ including syllabus formats, Google Cloud storage, academic integrity, and subscription details.',
    url: 'https://syllabiq.ca/faq',
    siteName: 'SyllabiQ',
    type: 'website'
  }
};

export default function FAQLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
