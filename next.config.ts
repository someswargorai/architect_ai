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
  turbopack: {}, 
} satisfies NextConfig;

export default withPWA({
  dest: "public",
})(nextConfig);
