import type { NextConfig } from "next";
import { site, indexingEnabled } from "./lib/site-config.ts";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  basePath: site.basePath,
  async headers() {
    return indexingEnabled()
      ? []
      : [
          {
            source: "/:path*",
            headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
          },
        ];
  },
  // Keep Next type checking active via the compiler API: the CLI path receives empty --showConfig output here.
  experimental: { useTypeScriptCli: false },
  allowedDevOrigins: ["127.0.0.1"],
};
export default nextConfig;
