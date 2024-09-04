module.exports = {
	siteUrl: 'https://www.noobshroom.com',
	generateRobotsTxt: true,
	sitemapSize: 7000,
	exclude: ['/write', '/login', '/api/*', '/best-class', '/terms', '/privacy-policy', '/source-credit', '/contact-us', '/about-us'], // Exclude these paths from sitemap
	additionalPaths: async (config) => {
	  const paths = [];

	  try {
		const res = await fetch("https://www.noobshroom.com/api/all-posts");
		const data = await res.json();

		const posts = data.posts || [];

		posts.forEach((post) => {
		  if (!['best-class', 'terms', 'privacy-policy', 'source-credit', 'contact-us', 'about-us'].includes(post.slug)) { // Exclude these slugs
			paths.push({ loc: `/posts/${post.slug}`, changefreq: 'weekly', priority: 0.7 });
		  }
		});
	  } catch (error) {
		console.error("Failed to fetch posts for sitemap:", error);
	  }

	  return paths;
	},
  };
