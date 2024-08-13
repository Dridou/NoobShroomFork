module.exports = {
	siteUrl: 'https://www.noobshroom.com',
	generateRobotsTxt: true,
	sitemapSize: 7000,
	additionalPaths: async (config) => {
	  const paths = [];

	  // Faire un appel à l'API pour récupérer tous les posts
	  const res = await fetch('https://www.noobshroom.com/api/posts?all=true');
	  const data = await res.json();

	  const posts = data.posts || [];

	  posts.forEach((post) => {
		paths.push({ loc: `/posts/${post.slug}`, changefreq: 'weekly', priority: 0.7 });
	  });

	  return paths;
	},
};