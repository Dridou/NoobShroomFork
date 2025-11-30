/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.discordapp.com"],
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:all*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
			// value: "s-maxage=86400, stale-while-revalidate=59",
          },
        ],
      },
      // Ajoute d'autres configurations de cache ici si nécessaire
    ];
  },
  async redirects() {
    return [
      {
        source: "/about-us",
        destination: "/posts/about-us",
        permanent: true,
      },
      {
        source: "/tips/packs-to-choose",
        destination: "/posts/most-profitable-packs",
        permanent: true,
      },
      {
        source: "/tips/cross-server-arena",
        destination: "/posts/cross-server-arena",
        permanent: true,
      },
      {
        source: "/class-guides/crossbow",
        destination: "/posts/arrowgod-class-guide",
        permanent: true,
      },
      {
        source: "/tips/wheel",
        destination: "/",
        permanent: false,
      },
      {
        source: "/updates",
        destination: "/",
        permanent: false,
      },
      {
        source: "/tips/spending-gems",
        destination: "/posts/spending-red-gems",
        permanent: true,
      },
      {
        source: "/class_guides/crossbow",
        destination: "/posts/arrowgod-class-guide",
        permanent: true,
      },
      {
        source: "/tips/parking-war",
        destination: "/posts/parking-wars",
        permanent: true,
      },
      {
        source: "/tips/battle-plans",
        destination: "/posts/battle-plans",
        permanent: true,
      },
      {
        source: "/tips/understanding_the_game",
        destination: "/",
        permanent: false,
      },
      {
        source: "/tips/stats-information",
        destination: "/posts/character-attributes",
        permanent: true,
      },
      {
        source: "/tips/cross-server-showdown",
        destination: "/posts/cross-server-showdown",
        permanent: true,
      },
      {
        source: "/tips/gear-plans",
        destination: "/posts/gear-plans",
        permanent: true,
      },
      {
        source: "/tips/dungeons",
        destination: "/",
        permanent: false,
      },
      {
        source: "/class_guides/berserker",
        destination: "/posts/berseker-class-guide",
        permanent: true,
      },
      {
        source: "/tips/technologies",
        destination: "/",
        permanent: false,
      },
      {
        source: "/class-guides/sacred-hunter",
        destination: "/",
        permanent: false,
      },
      {
        source: "/tips/rush",
        destination: "/",
        permanent: false,
      },
      {
        source: "/tips/events",
        destination: "/",
        permanent: false,
      },
      {
        source: "/source_credits",
        destination: "/posts/source-credit",
        permanent: true,
      },
      {
        source: "/class_guides/plume_monarch",
        destination: "/posts/arrowgod-class-guide",
        permanent: true,
      },
      {
        source: "/class-guides/warbringer",
        destination: "/posts/berseker-class-guide",
        permanent: true,
      },
      {
        source: "/database/mount_upgrade",
        destination: "/",
        permanent: false,
      },
      {
        source: "/tips/what_to_buy",
        destination: "/posts/most-profitable-packs",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
