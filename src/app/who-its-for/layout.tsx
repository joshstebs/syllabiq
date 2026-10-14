import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Who SyllabiQ Is For',
  description: 'See how college and university students can use SyllabiQ to review syllabus deadlines and organize coursework.',
  alternates: { canonical: '/who-its-for' },
  openGraph: {
    type: 'website',
    url: 'https://syllabiq.ca/who-its-for',
    title: 'Who SyllabiQ Is For',
    description: 'See how college and university students can use SyllabiQ to review syllabus deadlines and organize coursework.',
  },
}

export default function PublicPageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
