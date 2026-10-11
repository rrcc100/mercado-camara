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
import { institutionLocation } from "@/domain/catalog";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const institution = await getInstitution((await params).slug);
  if (!institution) notFound();
  return pageMetadata(
    institution.name,
    institution.description ?? `Oferta de ${institution.name}`,
    `/instituciones/${institution.slug}`,
    institution.demo,
  );
}
export default async function InstitutionPage({ params }: Props) {
  const institution = await getInstitution((await params).slug);
  if (!institution) notFound();
  const courses = await (
    await getRepository()
  ).institutionCourses(institution.id);
  return (
    <div className="container page">
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
        </div>
      </div>
      <div className="institution-layout">
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
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORÁ SU PROPUESTA</span>
            <h2>Cursos de {institution.name}</h2>
            <p>
              {courses.length} propuestas disponibles en el catálogo
              {institution.demo && " de demostración"}.
            </p>
          </div>
        </div>
        {courses.length ? (
          <CourseGrid courses={courses} />
        ) : (
          <div className="empty-state">
            <h3>Sin cursos activos por el momento</h3>
            <Link href="/cursos" className="button secondary">
              Explorar otras propuestas
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
