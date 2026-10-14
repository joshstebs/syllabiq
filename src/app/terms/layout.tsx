import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SyllabiQ Terms of Service',
  description: 'Review SyllabiQ\'s terms, service limitations and account responsibilities.',
  alternates: { canonical: '/terms' },
  openGraph: {
    type: 'website',
    url: 'https://syllabiq.ca/terms',
    title: 'SyllabiQ Terms of Service',
    description: 'Review SyllabiQ\'s terms, service limitations and account responsibilities.',
  },
}

export default function PublicPageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
