/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { hostname: "sfds.usualsmart.com", protocol: "https", port: "" },
      { hostname: "safetyfirstds.com", protocol: "https", port: "" },
      { hostname: "safetyfirstds.com", protocol: "http", port: "" },
      { hostname: "*.qa.safetyfirstds.com", protocol: "https", port: "" },
      { hostname: "*.qa.safetyfirstds.com", protocol: "http", port: "" },
      { hostname: "*.unsplash.com", protocol: "https", port: "" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/apiNext/:path*",
        destination: "/api/:path*",
      },
    ];
  },
  transpilePackages: ["mui-tel-input"],
};

export default nextConfig;
