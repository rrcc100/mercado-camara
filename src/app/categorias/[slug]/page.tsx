import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui";
import { Catalog } from "@/components/catalog";
import { getRepository } from "@/data/repository";
import { parseFilters } from "@/domain/search";
import { pageMetadata } from "@/lib/seo";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params,
    item = (await (await getRepository()).categories()).find(
      (c) => c.slug === slug,
    );
  if (!item) notFound();
  return pageMetadata(
    `Cursos de ${item.name}`,
    item.description ?? `Cursos de ${item.name}`,
    `/categorias/${slug}`,
    Object.keys(await searchParams).length > 0,
  );
}
export default async function Category({ params, searchParams }: Props) {
  const { slug } = await params,
    category = (await (await getRepository()).categories()).find(
      (c) => c.slug === slug,
    );
  if (!category) notFound();
  const filters = { ...parseFilters(await searchParams), category: slug };
  return (
    <div className="container page">
      <Breadcrumbs
        items={[{ label: "Cursos", href: "/cursos" }, { label: category.name }]}
      />
      <div className="page-heading">
        <span className="eyebrow">EXPLORÁ POR ÁREA</span>
        <h1>Cursos de {category.name}</h1>
        <p>
          {category.description ??
            "Explorá los cursos disponibles en esta área."}
        </p>
      </div>
      <Catalog
        key={JSON.stringify(filters)}
        filters={filters}
        fixedCategory={slug}
        basePath={`/categorias/${slug}`}
      />
    </div>
  );
}
