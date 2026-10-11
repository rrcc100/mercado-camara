import type { MetadataRoute } from "next";
import { config } from "@/lib/config";
import { getRepository } from "@/data/repository";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { indexable, origin } = config();
  if (!indexable) return [];
  const repo = await getRepository();
  const [slugs, categories] = await Promise.all([
    repo.publishedSlugs(),
    repo.categories(),
  ]);
  return [
    "/",
    "/cursos",
    "/instituciones",
    ...categories.map((c) => `/categorias/${c.slug}`),
    ...slugs.courses.map((s) => `/cursos/${s}`),
    ...slugs.institutions.map((s) => `/instituciones/${s}`),
  ].map((path) => ({ url: `${origin}${path}` }));
}
