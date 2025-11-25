/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Explicitly expose API_KEY to the client for the requested client-side testing mode.
  // In a real production app, you would use API routes, but this satisfies the user request.
  env: {
    API_KEY: process.env.API_KEY,
  },
};

export default nextConfig;