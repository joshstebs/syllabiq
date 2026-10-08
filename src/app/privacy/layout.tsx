import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Privacy Policy | SyllabiQ',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return children;
}
