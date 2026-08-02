import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const isCapacitorBuild = process.env.CAPACITOR_BUILD === "true";
const isStaticExport = isGitHubPages || isCapacitorBuild;

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
        ...(isGitHubPages
          ? {
              basePath: "/Spatial-Engineer",
              assetPrefix: "/Spatial-Engineer/",
            }
          : {}),
      }
    : {}),
};

export default nextConfig;
