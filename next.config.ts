import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Keep Next type checking active via the compiler API: the CLI path receives empty --showConfig output here.
  experimental: { useTypeScriptCli: false },
  allowedDevOrigins: ["127.0.0.1"],
};
export default nextConfig;
