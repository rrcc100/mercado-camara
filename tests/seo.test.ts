import { describe, expect, it } from "vitest";
import { siteConfig } from "../src/lib/config";
const production = {
  NODE_ENV: "production",
  DATA_SOURCE: "graphql",
  CONTENT_APPROVED: "true",
  ALLOW_INDEXING: "true",
  SITE_URL: "https://formacion.example.org",
};
describe("protección de indexación", () => {
  it("la demo nunca se indexa, incluso con banderas de producción", () => {
    expect(siteConfig({ ...production, DATA_SOURCE: "demo" }).indexable).toBe(
      false,
    );
    expect(siteConfig({}).indexable).toBe(false);
  });
  it("exige ambiente, contenido, origen y habilitación explícitos", () => {
    expect(siteConfig(production).indexable).toBe(true);
    for (const override of [
      { NODE_ENV: "development" },
      { CONTENT_APPROVED: "false" },
      { ALLOW_INDEXING: "false" },
      { SITE_URL: "http://localhost:3000" },
    ])
      expect(siteConfig({ ...production, ...override }).indexable).toBe(false);
  });
  it("rechaza fuentes desconocidas y orígenes que contienen rutas o credenciales", () => {
    expect(() => siteConfig({ DATA_SOURCE: "mysql" })).toThrow();
    expect(() =>
      siteConfig({ SITE_URL: "https://example.org/path" }),
    ).toThrow();
    expect(() =>
      siteConfig({ SITE_URL: "https://user:pass@example.org" }),
    ).toThrow();
  });
});
