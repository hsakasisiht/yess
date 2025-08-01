/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://konohabazar.store',
  generateRobotsTxt: true,
  exclude: [
    '/admin*', // Exclude admin pages from public indexing
    '/api/*',  // Exclude API routes
    '/cart*',  // Exclude cart pages (user-specific)
    '/account*', // Exclude account pages (user-specific)
    '/checkout', // Exclude checkout (user-specific)
    '/invoice/*', // Exclude invoices (user-specific)
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/cart/',
          '/account/',
          '/checkout',
          '/invoice/',
        ],
      },
    ],
    additionalSitemaps: [
      'https://konohabazar.store/sitemap.xml',
    ],
  },
  // Add priority and changefreq for better SEO
  priority: null,
  changefreq: null,
  transform: async (config, path) => {
    // Set custom priorities for different page types
    let priority = 0.7;
    let changefreq = 'weekly';
    
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/products/')) {
      priority = 0.9;
      changefreq = 'daily';
    } else if (path === '/login' || path === '/signup') {
      priority = 0.6;
      changefreq = 'monthly';
    } else if (path.includes('/contact') || path.includes('/social')) {
      priority = 0.8;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
}; 