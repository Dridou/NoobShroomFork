/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "cdn.discordapp.com",
    ],
  },
  reactStrictMode: true,
  async headers() {
    return [
		{
			source: "/:all*",
			headers: [
			  {
				key: "Cache-Control",
				value: "s-maxage=86400, stale-while-revalidate=59", // Cache global de 24 heures
			  },
			],
		  },
      // Ajoute d'autres configurations de cache ici si nécessaire
    ];
  },
};

module.exports = nextConfig;
