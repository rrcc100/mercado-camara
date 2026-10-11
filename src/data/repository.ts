import "server-only";
import { cache } from "react";
import { config } from "@/lib/config";
import { graphqlRepository } from "./graphql/repository";
export const getRepository = cache(async () => {
  if (config().source === "demo")
    return (await import("./demo/repository")).demoRepository;
  if (!process.env.GRAPHQL_ENDPOINT)
    throw new Error(
      "Falta configurar GRAPHQL_ENDPOINT para DATA_SOURCE=graphql.",
    );
  return graphqlRepository(process.env.GRAPHQL_ENDPOINT);
});
export const getCourse = cache(async (slug: string) =>
  (await getRepository()).course(slug),
);
export const getInstitution = cache(async (slug: string) =>
  (await getRepository()).institution(slug),
);
