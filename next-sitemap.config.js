module.exports = {
	siteUrl: 'https://www.noobshroom.com',
	generateRobotsTxt: true, // (optional)
	sitemapSize: 7000,
	// Optionnel: définir une fonction pour récupérer les pages dynamiques
	additionalPaths: async (config) => {
	  const paths = [];

	  // Par exemple, si vous avez des posts de blog :
	  const res = await fetch("https://www.noobshroom.com/api/posts");
	  const data = await res.json();

	  const posts = data.posts || [];

	  posts.forEach((post) => {
		paths.push({ loc: `/posts/${post.slug}`, changefreq: 'weekly', priority: 0.7 });
	  });

	  return paths;
	},
  };