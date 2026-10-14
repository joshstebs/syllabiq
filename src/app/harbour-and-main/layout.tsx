import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Harbour & Main',
  description: 'Learn about Harbour & Main, the independent Windsor–Essex team behind the SyllabiQ planning project.',
  alternates: { canonical: '/harbour-and-main' },
  openGraph: {
    type: 'website',
    url: 'https://syllabiq.ca/harbour-and-main',
    title: 'About Harbour & Main',
    description: 'Learn about Harbour & Main, the independent Windsor–Essex team behind the SyllabiQ planning project.',
  },
}

export default function PublicPageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
