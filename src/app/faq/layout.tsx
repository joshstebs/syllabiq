import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SyllabiQ Frequently Asked Questions',
  description: 'Answers about SyllabiQ student planning, importing course materials, deadline verification and current integration availability.',
  alternates: { canonical: '/faq' },
  openGraph: {
    type: 'website',
    url: 'https://syllabiq.ca/faq',
    title: 'SyllabiQ Frequently Asked Questions',
    description: 'Answers about SyllabiQ student planning, importing course materials, deadline verification and current integration availability.',
  },
}

export default function PublicPageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
