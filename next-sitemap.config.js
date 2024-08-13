module.exports = {
	siteUrl: 'https://www.noobshroom.com',
	generateRobotsTxt: true,
	sitemapSize: 7000,
	additionalPaths: async (config) => {
	  const paths = [];

	  try {
		const res = await fetch("https://www.noobshroom.com/api/all-posts");
		const data = await res.json();

		const posts = data.posts || [];

		posts.forEach((post) => {
			console.log(post.slug);
		  paths.push({ loc: `/posts/${post.slug}`, changefreq: 'weekly', priority: 0.7 });
		});
	  } catch (error) {
		console.error("Failed to fetch posts for sitemap:", error);
	  }

	  return paths;
	},
  };
