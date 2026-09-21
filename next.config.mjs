/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel runs "next build" without NEXT_DIST_DIR and gets the standard .next.
  // Locally, "npm run build:check" builds into .next-check so it never wipes the dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
