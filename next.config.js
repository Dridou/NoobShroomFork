/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
	  domains: ["lh3.googleusercontent.com", "firebasestorage.googleapis.com", 'cdn.discordapp.com'],
	},
	async headers() {
	  return [
		{
		  source: "/api/posts/:slug", // S'applique aux routes API sous /api/posts/
		  headers: [
			{
			  key: "Cache-Control",
			  value: "s-maxage=86400, stale-while-revalidate=59", // Cache pendant 24 heures
			},
		  ],
		},
		// Ajoute d'autres configurations de cache ici si nécessaire
	  ];
	},
  }

  module.exports = nextConfig;
