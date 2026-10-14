import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syllabus Planner Features and Limitations',
  description: 'Explore SyllabiQ\'s syllabus-first planning tools, deadline review workflow and current integration limitations.',
  alternates: {
    canonical: '/features'
  },
  openGraph: {
    title: 'Features',
    description: 'Explore SyllabiQ\'s comprehensive feature suite including AI syllabus parsing, Google Cloud integration, and smart academic scheduling.',
    url: 'https://syllabiq.ca/features',
    siteName: 'SyllabiQ',
    type: 'website'
  }
};

export default function FeaturesLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
