import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/'
    },
    sitemap: 'https://syllabiq.ca/sitemap.xml',
    host: 'https://syllabiq.ca'
  };
}
