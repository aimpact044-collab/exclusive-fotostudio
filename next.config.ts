import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Locally, Node can't validate TLS certs for external hosts (network/AV
    // TLS interception), which breaks Next's server-side image optimizer
    // fetch. Set NEXT_IMAGES_UNOPTIMIZED=true in .env.local to bypass it for
    // local testing only — production deployments keep optimization enabled.
    unoptimized: process.env.NEXT_IMAGES_UNOPTIMIZED === "true",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-63d46297e0d5434da838435b3f9eefe6.r2.dev",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);

