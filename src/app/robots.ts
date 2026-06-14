import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/archive', '/smart', '/admin', '/profile'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://orananaliz.com'}/sitemap.xml`,
  }
}
