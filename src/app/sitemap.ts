import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://syllabiq.ca',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: 'https://syllabiq.ca/features',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: 'https://syllabiq.ca/faq',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      url: 'https://syllabiq.ca/who-its-for',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: 'https://syllabiq.ca/harbour-and-main',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6
    }
  ];
}
