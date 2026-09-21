/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel pokreće "next build" bez NEXT_DIST_DIR i dobije standardni .next.
  // Lokalno "npm run build:check" gradi u .next-check da ne obriše dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
