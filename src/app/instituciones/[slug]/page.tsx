import Link from "next/link";
import { MapPin, CalendarDays, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import {
  Breadcrumbs,
  CourseGrid,
  Credential,
  InstitutionLogo,
  JsonLd,
} from "@/components/ui";
import { getInstitution, getRepository } from "@/data/repository";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { config } from "@/lib/config";
import { institutionLocation, categoryName } from "@/domain/catalog";
import { searchCourses } from "@/domain/search";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params, searchParams }: Props) {
  const institution = await getInstitution((await params).slug);
  if (!institution) notFound();
  return pageMetadata(
    institution.name,
    institution.description ?? `Oferta de ${institution.name}`,
    `/instituciones/${institution.slug}`,
    institution.demo || Object.keys(await searchParams).length > 0,
  );
}
export default async function InstitutionPage({ params, searchParams }: Props) {
  const institution = await getInstitution((await params).slug);
  if (!institution) notFound();
  const courses = await (
    await getRepository()
  ).institutionCourses(institution.id);
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.slice(0, 160).trim() : "";
  const category = typeof query.category === "string" ? query.category : "";
  const filtered = searchCourses(courses, { q, category });
  const areas = [
    ...new Map(
      courses
        .filter((c) => c.category)
        .map((c) => [c.category!, categoryName(c)]),
    ).entries(),
  ];
  const path = `/instituciones/${institution.slug}`;
  const areaUrl = (area: string) =>
    `${path}?${new URLSearchParams({ ...(q ? { q } : {}), ...(area ? { category: area } : {}) })}#oferta`;
  return (
    <div className="container page institution-store">
      <Breadcrumbs
        items={[
          { label: "Instituciones", href: "/instituciones" },
          { label: institution.name },
        ]}
      />
      {!institution.demo && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Organization",
              name: institution.name,
              description: institution.description ?? undefined,
              url: `${config().origin}/instituciones/${institution.slug}`,
              logo: institution.logo
                ? `${config().origin}${institution.logo}`
                : undefined,
              sameAs: institution.socials.map((s) => s.url),
            }}
          />
          <JsonLd
            data={breadcrumbSchema([
              { label: "Inicio", href: "/" },
              { label: "Instituciones", href: "/instituciones" },
              {
                label: institution.name,
                href: `/instituciones/${institution.slug}`,
              },
            ])}
          />
        </>
      )}
      <div className="institution-hero">
        <InstitutionLogo institution={institution} size={120} />
        <div>
          <span className="eyebrow">{institution.specialty}</span>
          <h1>{institution.name}</h1>
          <p className="store-description">
            {institution.description ??
              "Presentación institucional pendiente de completar."}
          </p>
          <div className="detail-meta">
            <span>
              <MapPin size={18} aria-hidden />
              {institutionLocation(institution)}
            </span>
            {institution.foundedYear !== null && (
              <span>
                <CalendarDays size={18} aria-hidden />
                Fundación: {institution.foundedYear}
                {institution.demo && " · ejemplo"}
              </span>
            )}
          </div>
          <div className="store-links">
            <a href="#oferta" className="text-link">
              Ver sus {courses.length} cursos
            </a>
            <a href="#institucion" className="text-link">
              Sobre la institución y su sello
            </a>
            {institution.demo && (
              <span className="demo-rating-label">Institución de ejemplo</span>
            )}
          </div>
        </div>
      </div>
      <section className="section store-offer" id="oferta">
        <div className="section-heading">
          <div>
            <h2>Cursos de {institution.name}</h2>
            <p>
              {filtered.length} de {courses.length} propuestas
              {institution.demo && " de demostración"}.
            </p>
          </div>
        </div>
        <form
          className="institution-search"
          action={`${path}#oferta`}
          role="search"
          aria-label="Buscar dentro de la institución"
        >
          <label htmlFor="institution-query">Buscá en esta institución</label>
          <div>
            <input
              key={q}
              id="institution-query"
              type="search"
              name="q"
              defaultValue={q}
              maxLength={160}
              placeholder="Curso o habilidad"
            />
            {category && (
              <input type="hidden" name="category" value={category} />
            )}
            <button className="button" type="submit">
              Buscar
            </button>
          </div>
        </form>
        {areas.length > 0 && (
          <nav
            className="institution-areas"
            aria-label="Áreas de esta institución"
          >
            <Link
              href={areaUrl("")}
              aria-current={!category ? "page" : undefined}
            >
              Todas las áreas
            </Link>
            {areas.map(([slug, name]) => (
              <Link
                key={slug}
                href={areaUrl(slug)}
                aria-current={category === slug ? "page" : undefined}
              >
                {name}
              </Link>
            ))}
          </nav>
        )}
        {filtered.length ? (
          <CourseGrid courses={filtered} />
        ) : (
          <div className="empty-state">
            <h3>
              {courses.length
                ? "No encontramos cursos con esa búsqueda"
                : "Sin cursos activos por el momento"}
            </h3>
            <Link
              href={courses.length ? `${path}#oferta` : "/cursos"}
              className="button secondary"
            >
              {courses.length
                ? "Ver toda su oferta"
                : "Explorar otras propuestas"}
            </Link>
          </div>
        )}
      </section>
      <div className="institution-layout" id="institucion">
        <div>
          <section className="detail-section">
            <h2>Formación con una mirada propia</h2>
            <p className="lead">
              {institution.description ??
                "Presentación institucional pendiente de completar."}
            </p>
            {institution.demo && (
              <p className="subtle-box">
                Esta institución, su identidad y su oferta son ficticias. Se
                muestran para explorar la experiencia de Forma.
              </p>
            )}
            <h3>En la web y las redes</h3>
            {institution.website || institution.socials.length ? (
              <div className="social-links">
                {institution.website && (
                  <a
                    href={institution.website}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Sitio web <ExternalLink size={14} />
                  </a>
                )}
                {institution.socials.map((s) => (
                  <a
                    href={s.url}
                    key={s.network}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {s.network} <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            ) : (
              <p>No hay enlaces públicos confirmados para esta institución.</p>
            )}
          </section>
        </div>
        <Credential institution={institution} full />
      </div>
    </div>
  );
}
