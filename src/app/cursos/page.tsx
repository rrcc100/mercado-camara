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
  const filters = parseFilters(await searchParams);
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Cursos" }]} />
      <div className="page-heading">
        <span className="eyebrow">ENCONTRÁ TU PRÓXIMO PASO</span>
        <h1>Un curso para lo que querés lograr.</h1>
        <p>
          Buscá por tema o habilidad y encontrá una propuesta que vaya con vos.
        </p>
      </div>
      <Catalog key={JSON.stringify(filters)} filters={filters} />
    </div>
  );
}
