import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SyllabiQ Privacy Policy',
  description: 'Read SyllabiQ\'s published privacy information about student accounts and course-related data.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    type: 'website',
    url: 'https://syllabiq.ca/privacy',
    title: 'SyllabiQ Privacy Policy',
    description: 'Read SyllabiQ\'s published privacy information about student accounts and course-related data.',
  },
}

export default function PublicPageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
