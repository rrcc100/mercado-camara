import { z } from "zod";
export async function graphqlRequest<T>(
  endpoint: string,
  query: string,
  variables: Record<string, unknown>,
  schema: z.ZodType<T>,
): Promise<T> {
  const url = new URL(endpoint);
  if (
    url.protocol !== "https:" &&
    !(
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    )
  )
    throw new Error(
      "El endpoint GraphQL requiere HTTPS (excepto desarrollo local).",
    );
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json, application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok)
    throw new Error(`GraphQL no disponible (${response.status}).`);
  const payload: unknown = await response.json();
  const envelope = z
    .object({
      data: z.unknown().optional(),
      errors: z.array(z.unknown()).optional(),
    })
    .parse(payload);
  if (envelope.errors?.length || !envelope.data)
    throw new Error("La API GraphQL no pudo completar la consulta.");
  const parsed = schema.parse(envelope.data);
  // A live API may never pass demo fixtures through the production adapter.
  if (JSON.stringify(parsed).includes('"demo":true'))
    throw new Error("La API real devolvió contenido de demostración.");
  return parsed;
}
