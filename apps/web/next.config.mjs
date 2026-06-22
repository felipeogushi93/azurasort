/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // os pacotes internos do monorepo sao TS puro — Next transpila on the fly
  transpilePackages: ["@prizegram/reveal-spec", "@prizegram/ui-tokens"],
};

export default nextConfig;
