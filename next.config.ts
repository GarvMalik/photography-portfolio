import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Shaders served from /public/shaders/, fetched at runtime — no webpack loader needed.
  // OGL is ESM-only; Next.js 16 bundler moduleResolution handles it natively.
};

export default nextConfig;
