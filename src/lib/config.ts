export type Environment = Record<string, string | undefined>;
export function siteConfig(env: Environment) {
  const source = env.DATA_SOURCE ?? "demo";
  if (source !== "demo" && source !== "graphql")
    throw new Error("DATA_SOURCE debe ser demo o graphql.");
  const origin = new URL(env.SITE_URL ?? "http://localhost:3000");
  if (
    !["http:", "https:"].includes(origin.protocol) ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  )
    throw new Error("SITE_URL debe contener solamente el origen público.");
  const publicHost =
    origin.protocol === "https:" &&
    !/^(localhost|127\.|\[::1\])/.test(origin.hostname) &&
    !origin.hostname.endsWith(".local");
  return {
    source,
    origin: origin.origin,
    demo: source === "demo",
    indexable:
      env.NODE_ENV === "production" &&
      source === "graphql" &&
      env.CONTENT_APPROVED === "true" &&
      env.ALLOW_INDEXING === "true" &&
      publicHost,
  };
}
export const config = () => siteConfig(process.env);
