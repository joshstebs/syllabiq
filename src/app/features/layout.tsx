import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SyllabiQ Features',
  description: 'Explore the syllabus-first student planner, deadline review, task organization and current feature limitations.',
  alternates: { canonical: '/features' },
  openGraph: {
    type: 'website',
    url: 'https://syllabiq.ca/features',
    title: 'SyllabiQ Features',
    description: 'Explore the syllabus-first student planner, deadline review, task organization and current feature limitations.',
  },
}

export default function PublicPageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
