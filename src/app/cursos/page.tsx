import { Breadcrumbs } from "@/components/ui";
import { Catalog } from "@/components/catalog";
import { parseFilters } from "@/domain/search";
import { pageMetadata } from "@/lib/seo";
type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  return pageMetadata(
    "Explorá todos los cursos",
    "Encontrá cursos por habilidades, área de formación, modalidad y ubicación.",
    "/cursos",
    Object.keys(params).length > 0,
  );
}
export default async function Courses({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseFilters(params);
  return (
    <div className="container page catalog-page">
      <Breadcrumbs items={[{ label: "Cursos" }]} />
      <div className="page-heading">
        <h1>
          {filters.q
            ? `Resultados para “${filters.q}”`
            : "Explorá todos los cursos"}
        </h1>
        <p>Elegí por tema, modalidad e institución.</p>
      </div>
      <Catalog
        key={JSON.stringify(params)}
        filters={filters}
        view={params.view === "grid" ? "grid" : "list"}
      />
    </div>
  );
}
