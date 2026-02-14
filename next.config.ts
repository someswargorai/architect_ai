import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
  },
} satisfies NextConfig;

export default withPWA({
  dest: "public",
   runtimeCaching: [
    // ✅ API caching with fallback to cache
   {
  urlPattern: /^\/api\/(?!auth).*$/,
  handler: "StaleWhileRevalidate",
  options: {
    cacheName: "api-cache",
    expiration: {
      maxEntries: 100,
      maxAgeSeconds: 60 * 5,
    },
    cacheableResponse: {
      statuses: [0, 200],
    },
  },
},

    // ❌ NEVER cache auth
    {
      urlPattern: /^\/api\/auth\/.*$/,
      handler: "NetworkOnly",
    },

    // ❌ NEVER cache liveblocks auth
    {
      urlPattern: /^\/api\/liveblocks-auth$/,
      handler: "NetworkOnly",
    },

    // ✅ Pages
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 5,
      },
    },

    // ✅ Static assets
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
      },
    },
  ],
})(nextConfig);
