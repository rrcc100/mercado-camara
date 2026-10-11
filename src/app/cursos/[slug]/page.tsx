import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock3,
  GraduationCap,
  MapPin,
  Monitor,
  Sparkles,
} from "lucide-react";
import {
  Breadcrumbs,
  ChamberLogo,
  CourseGrid,
  Credential,
  InstitutionLogo,
  JsonLd,
} from "@/components/ui";
import { CourseVideo } from "@/components/video";
import { categoryName, modeName, durationText, money } from "@/domain/catalog";
import { getCourse, getRepository } from "@/data/repository";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { config } from "@/lib/config";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const course = await getCourse((await params).slug);
  if (!course) notFound();
  return pageMetadata(
    course.title,
    course.description ?? `Información del curso ${course.title}`,
    `/cursos/${course.slug}`,
    course.status !== "PUBLISHED" || course.demo,
  );
}
export default async function CoursePage({ params }: Props) {
  const course = await getCourse((await params).slug);
  if (!course) notFound();
  if (course.status !== "PUBLISHED")
    return (
      <div className="container page">
        <Breadcrumbs
          items={[
            { label: "Cursos", href: "/cursos" },
            { label: "Curso no disponible" },
          ]}
        />
        <div className="empty-state">
          <h1>Este curso no está disponible.</h1>
          <p>
            La institución retiró temporalmente esta propuesta del portal. No se
            reciben nuevas consultas.
          </p>
          <Link href="/cursos" className="button">
            Explorar otros cursos
          </Link>
        </div>
      </div>
    );
  const related = await (await getRepository()).related(course),
    institution = course.institution;
  return (
    <div className="container page course-page">
      <Breadcrumbs
        items={[
          { label: "Cursos", href: "/cursos" },
          {
            label: categoryName(course),
            href: course.category
              ? `/categorias/${course.category}`
              : undefined,
          },
          { label: course.title },
        ]}
      />
      {!course.demo && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Course",
              name: course.title,
              description: course.description ?? undefined,
              url: `${config().origin}/cursos/${course.slug}`,
              provider: {
                "@type": "Organization",
                name: institution.name,
                url: `${config().origin}/instituciones/${institution.slug}`,
              },
              teaches: course.skills,
              educationalLevel: course.difficulty ?? undefined,
            }}
          />
          <JsonLd
            data={breadcrumbSchema([
              { label: "Inicio", href: "/" },
              { label: "Cursos", href: "/cursos" },
              { label: course.title, href: `/cursos/${course.slug}` },
            ])}
          />
        </>
      )}
      <div className="course-layout">
        <div className="course-main">
          <header className="course-intro">
            <div className="pills">
              {course.category ? (
                <Link href={`/categorias/${course.category}`} className="pill">
                  {categoryName(course)}
                </Link>
              ) : (
                <span className="pill">Categoría por confirmar</span>
              )}
              <span className="pill neutral">
                {course.difficulty
                  ? `Nivel ${course.difficulty.toLowerCase()}`
                  : "Nivel por confirmar"}
              </span>
            </div>
            <h1>{course.title}</h1>
            <p className="lead">
              {course.description ?? "Descripción pendiente de completar."}
            </p>
            <Link
              href={`/instituciones/${institution.slug}`}
              className="course-provider"
            >
              <InstitutionLogo institution={institution} />
              <span>
                <small>CURSO DICTADO POR</small>
                <strong>{institution.name}</strong>
              </span>
              <ArrowRight size={18} aria-hidden />
            </Link>
            <div className="detail-meta">
              <span>
                <Monitor size={18} aria-hidden />
                {modeName(course.mode)}
              </span>
              <span>
                <Clock3 size={18} aria-hidden />
                {durationText(course)}
              </span>
              <span>
                <MapPin size={18} aria-hidden />
                {course.location ??
                  (course.mode === "ONLINE"
                    ? "Cursada online"
                    : "Lugar de cursada por confirmar")}
              </span>
            </div>
          </header>
          {course.cover && (
            <figure className="course-cover">
              <Image
                src={course.cover}
                alt={course.coverAlt ?? ""}
                width={1400}
                height={933}
                sizes="(max-width: 760px) 100vw, 65vw"
                loading="eager"
              />
              <figcaption>
                Imagen ilustrativa
                {course.demo ? " del catálogo de demostración" : ""}
              </figcaption>
            </figure>
          )}
        </div>
        <aside className="course-sidebar">
          <div className="enrollment-card">
            <span className="eyebrow">INVERTÍ EN TU PRÓXIMO PASO</span>
            <small>
              {course.demo
                ? "Precio total de ejemplo"
                : "Precio total informado"}
            </small>
            <div className="detail-price">
              {money(course.price, course.currency)}{" "}
              <span>{course.price !== null ? course.currency : ""}</span>
            </div>
            <p>
              {durationText(course)} · {modeName(course.mode)}
            </p>
            <hr />
            <div className="availability-note">
              <strong>
                {course.demo
                  ? "Estás explorando una demostración"
                  : "Consultas aún no habilitadas"}
              </strong>
              <p>
                {course.demo
                  ? "Los precios y las condiciones son ficticios. No se reciben inscripciones ni consultas en esta versión."
                  : "El canal de consulta se habilitará al completar la integración con la institución."}
              </p>
            </div>
            <button className="button disabled" disabled>
              Consulta no disponible
            </button>
            <small>
              Fechas, horarios, cupos y condiciones de pago: pendientes de
              información de la institución.
            </small>
            <span className="certificate-small">
              <GraduationCap size={20} aria-hidden />
              {course.certificate?.label ??
                "Certificación pendiente de confirmar"}
              {course.demo ? " · ejemplo" : ""}
            </span>
          </div>
          <Credential institution={institution} full />
          <Link
            href={`/instituciones/${institution.slug}`}
            className="provider-link"
          >
            <InstitutionLogo institution={institution} />
            <span>
              <small>Conocé quién te forma</small>
              <strong>{institution.name}</strong>
            </span>
            <ArrowRight size={18} aria-hidden />
          </Link>
        </aside>
        <div className="course-content">
          <nav className="course-tabs" aria-label="Secciones del curso">
            <a href="#resultados">Qué vas a aprender</a>
            <a href="#objetivos">Objetivos</a>
            <a href="#destinatarios">Dirigido a</a>
            <a href="#programa">Programa</a>
            <a href="#certificado">Certificado</a>
          </nav>
          <section className="detail-section" id="resultados">
            <span className="eyebrow">
              CONOCIMIENTOS QUE SE TRANSFORMAN EN PRÁCTICA
            </span>
            <h2>Al terminar, vas a poder…</h2>
            {!course.outcomes.length && (
              <p>Resultados de aprendizaje pendientes de completar.</p>
            )}
            <ul className="outcome-list">
              {course.outcomes.map((outcome) => (
                <li key={outcome}>
                  <span>
                    <Check size={19} aria-hidden />
                  </span>
                  {outcome}
                </li>
              ))}
            </ul>
            <div className="skill-tags">
              {course.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            {course.project && (
              <div className="project-box">
                <Sparkles size={23} aria-hidden />
                <div>
                  <h3>Tu proyecto práctico</h3>
                  <p>{course.project}</p>
                </div>
              </div>
            )}
          </section>
          <section className="detail-section" id="objetivos">
            <h2>Objetivos del curso</h2>
            <p>{course.objectives ?? "Objetivos pendientes de completar."}</p>
          </section>
          <section className="detail-section" id="destinatarios">
            <h2>¿Para quién es este curso?</h2>
            {!course.audience.length && (
              <p>Destinatarios pendientes de completar.</p>
            )}
            <ul className="plain-list">
              {course.audience.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
            <h3>Qué necesitás para empezar</h3>
            <p>
              {course.prerequisites ?? "Requisitos pendientes de confirmar."}
            </p>
          </section>
          <section className="detail-section" id="programa">
            <div className="section-heading">
              <h2>El recorrido de aprendizaje</h2>
              {course.modules.length > 0 && (
                <span>{course.modules.length} módulos</span>
              )}
            </div>
            {!course.modules.length && <p>Programa pendiente de completar.</p>}
            <ol className="module-list">
              {course.modules.map((module, index) => (
                <li key={module.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{module.title}</h3>
                    {module.content && <p>{module.content}</p>}
                  </div>
                  <BookIcon />
                </li>
              ))}
            </ol>
            <h3>Cómo se evalúa</h3>
            <p>{course.evaluation ?? "Evaluación pendiente de confirmar."}</p>
          </section>
          <section className="detail-section" id="certificado">
            {course.certificate ? (
              <div className="certificate-panel">
                <BadgeCheck size={35} strokeWidth={1.5} aria-hidden />
                <div>
                  <span className="eyebrow">TU APRENDIZAJE, CON RESPALDO</span>
                  <h2>{course.certificate.label}</h2>
                  <p>Emisor: {course.certificate.issuerName}</p>
                  <p>
                    Sujeto al cumplimiento de los requisitos de aprobación y
                    validación correspondientes.
                    {course.demo &&
                      " Emisión ilustrativa: este curso ficticio no otorga un certificado real."}
                  </p>
                  {course.certificate.chamberIssued && <ChamberLogo small />}
                </div>
              </div>
            ) : (
              <p className="subtle-box">
                Certificación pendiente de confirmar.
              </p>
            )}
          </section>
          <section className="detail-section">
            <h2>Conocé la experiencia</h2>
            {course.video ? (
              <CourseVideo video={course.video} />
            ) : (
              <p className="subtle-box">
                No hay un video público disponible para este curso.
              </p>
            )}
            <h3>Opiniones de estudiantes</h3>
            <p>Aún no hay opiniones verificadas publicadas para este curso.</p>
          </section>
        </div>
      </div>
      <section className="section related-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SEGUÍ EXPLORANDO</span>
            <h2>También puede interesarte</h2>
            <p>Cursos relacionados por tema y habilidades.</p>
          </div>
          <Link href="/cursos" className="text-link">
            Ver catálogo <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
        {related.length ? (
          <CourseGrid courses={related} />
        ) : (
          <p>
            No hay otras propuestas relacionadas por el momento.{" "}
            <Link href="/cursos">Explorá el catálogo.</Link>
          </p>
        )}
      </section>
    </div>
  );
}
function BookIcon() {
  return <GraduationCap size={20} strokeWidth={1.4} aria-hidden />;
}
