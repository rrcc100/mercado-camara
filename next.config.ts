import type { NextConfig } from "next";
const config: NextConfig = {
  // Keep the regular `pnpm build && pnpm start` workflow outside Docker.
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  poweredByHeader: false,
  // Resolve metadata before sending headers, including for missing course slugs.
  htmlLimitedBots: /.*/,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};
export default config;
