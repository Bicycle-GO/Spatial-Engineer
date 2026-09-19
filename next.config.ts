import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_BASE_PATH: isGitHubPages ? "/Spatial-Engineer" : "" },
  ...(isGitHubPages
    ? {
        output: "export",
        basePath: "/Spatial-Engineer",
        assetPrefix: "/Spatial-Engineer/",
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
      }
    : {}),
};

export default nextConfig;
