// Public deployment paths are build-time values. No production origin is guessed.
export function deploymentConfig(env: Record<string, string | undefined>) {
  const basePath = (env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
  if (basePath && !/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(basePath))
    throw new Error(
      "NEXT_PUBLIC_BASE_PATH must be an absolute path without query or fragment",
    );
  let siteUrl: string | undefined;
  if (env.NEXT_PUBLIC_SITE_URL) {
    const url = new URL(env.NEXT_PUBLIC_SITE_URL);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error(
        "NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin, optionally with the deployment path",
      );
    const configuredPath = url.pathname.replace(/\/$/, "");
    if (configuredPath && configuredPath !== basePath)
      throw new Error(
        "The path in NEXT_PUBLIC_SITE_URL must match NEXT_PUBLIC_BASE_PATH",
      );
    if (
      env.NODE_ENV === "production" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    )
      throw new Error("Production metadata cannot point to localhost");
    siteUrl = `${url.origin}${basePath}`;
  } else if (env.NODE_ENV === "development") {
    siteUrl = `http://localhost:3000${basePath}`;
  }
  return { basePath, siteUrl };
}
export const site = deploymentConfig({
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NODE_ENV: process.env.NODE_ENV,
});
export const siteName = "Edilcom Gru";
// Deliberately code-controlled: env settings alone cannot publish demo fixtures.
export const publication = {
  demo: true,
  mode: process.env.SEO_PUBLICATION_MODE,
  authorized: process.env.SEO_INDEXING_AUTHORIZED === "true",
  deployment: process.env.VERCEL_ENV || process.env.DEPLOYMENT_ENV,
  siteUrl: site.siteUrl,
};
export function indexingEnabled(policy = publication) {
  return (
    !policy.demo &&
    policy.mode === "published" &&
    policy.authorized &&
    policy.deployment === "production" &&
    Boolean(policy.siteUrl?.startsWith("https://"))
  );
}
export function absoluteSiteUrl(path: string, config = site) {
  if (!config.siteUrl) return undefined;
  // App-relative paths, not arbitrary external URLs or protocol-relative URLs.
  if (!path.startsWith("/") || path.startsWith("//"))
    throw new Error("Invalid app URL");
  return `${config.siteUrl}${path === "/" ? "/" : path}`;
}
