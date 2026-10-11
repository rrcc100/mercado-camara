import { Breadcrumbs, InstitutionCard } from "@/components/ui";
import { getRepository } from "@/data/repository";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Instituciones que acompañan tu formación",
  "Conocé las instituciones, sus especialidades y su oferta de formación.",
  "/instituciones",
);
export default async function InstitutionsPage() {
  const institutions = await (await getRepository()).institutions();
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Instituciones" }]} />
      <div className="page-heading">
        <span className="eyebrow">CONOCÉ QUIÉN TE FORMA</span>
        <h1>Instituciones, nuevas posibilidades.</h1>
        <p>Explorá sus propuestas, especialidades y recorridos de formación.</p>
      </div>
      <div className="institution-grid">
        {institutions.map((institution) => (
          <InstitutionCard key={institution.id} institution={institution} />
        ))}
      </div>
      {!institutions.length && (
        <div className="empty-state">
          <h2>Todavía no hay instituciones publicadas</h2>
          <p>Volvé a consultar cuando haya nuevas propuestas.</p>
        </div>
      )}
    </div>
  );
}
