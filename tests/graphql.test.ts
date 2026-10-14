import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { graphqlRequest } from "../src/data/graphql/client";
const endpoint = "https://api.example.org/graphql",
  query = "query Course($slug: String!) { course(slug: $slug) { id } }";
afterEach(() => vi.unstubAllGlobals());
describe("transporte GraphQL", () => {
  it("usa variables, POST y respuestas validadas", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(Response.json({ data: { id: "curso-1" } }));
    vi.stubGlobal("fetch", fetch);
    expect(
      await graphqlRequest(
        endpoint,
        query,
        { slug: 'texto"seguro' },
        z.object({ id: z.string() }),
      ),
    ).toEqual({ id: "curso-1" });
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
      query,
      variables: { slug: 'texto"seguro' },
    });
    expect(fetch.mock.calls[0][1]).toMatchObject({
      method: "POST",
      cache: "no-store",
    });
  });
  it.each([
    { errors: [{ message: "Fallo" }], data: { id: "parcial" } },
    { data: { id: 9 } },
    { data: { id: "demo", demo: true } },
  ])(
    "rechaza errores, contratos inválidos y demos sin fallback",
    async (body) => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(body)));
      await expect(
        graphqlRequest(
          endpoint,
          query,
          {},
          z.object({ id: z.string(), demo: z.boolean().optional() }),
        ),
      ).rejects.toThrow();
    },
  );
  it("propaga fallas HTTP y de red sin sustituir por fixtures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Error", { status: 503 })),
    );
    await expect(
      graphqlRequest(endpoint, query, {}, z.object({})),
    ).rejects.toThrow("503");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Sin conexión")),
    );
    await expect(
      graphqlRequest(endpoint, query, {}, z.object({})),
    ).rejects.toThrow("Sin conexión");
  });
  it("rechaza valoraciones ficticias anidadas en una respuesta real", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          data: { course: { demo: false, rating: { demo: true } } },
        }),
      ),
    );
    await expect(
      graphqlRequest(
        endpoint,
        query,
        {},
        z.object({
          course: z.object({
            demo: z.boolean(),
            rating: z.object({ demo: z.boolean() }),
          }),
        }),
      ),
    ).rejects.toThrow("contenido de demostración");
  });
});
