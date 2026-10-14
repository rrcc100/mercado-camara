import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  ChefHat,
  Clock3,
  Code2,
  Globe2,
  MapPin,
  Megaphone,
  Monitor,
  Wrench,
  Building2,
  LayoutGrid,
} from "lucide-react";
import {
  type Category,
  categoryName,
  levelNames,
  modeName,
  durationText,
  institutionLocation,
  money,
  stageNames,
  type Course,
  type Institution,
  type SearchSuggestion,
} from "@/domain/catalog";
import { config } from "@/lib/config";
import { HeaderSearch, SearchForm } from "./header-search";
import { CourseRatingSummary } from "./course-rating";

export const categoryIcons = {
  tecnologia: Code2,
  administracion: BriefcaseBusiness,
  comunicacion: Megaphone,
  oficios: Wrench,
  idiomas: Globe2,
  gastronomia: ChefHat,
};
export function ChamberLogo({ small = false }: { small?: boolean }) {
  return (
    <Image
      className={small ? "chamber-logo small" : "chamber-logo"}
      src="/assets/camara-argentina-logo.png"
      width={1600}
      height={642}
      sizes={small ? "133px" : "188px"}
      alt="Cámara Argentina para la Formación Profesional y la Capacitación Laboral"
      loading={small ? "lazy" : "eager"}
    />
  );
}
export function Header({
  suggestions = [],
}: {
  suggestions?: SearchSuggestion[];
}) {
  return (
    <>
      <div className="demo-bar">
        {config().demo ? (
          <>
            <span className="status-dot" /> Versión de demostración{" "}
            <span className="demo-extra">
              · Cursos, instituciones, precios y valoraciones ficticios
            </span>
          </>
        ) : (
          "Formación profesional y capacitación laboral"
        )}
      </div>
      <header className="site-header">
        <div className="container header-main">
          <Link href="/" className="identity" aria-label="Forma, inicio">
            <ChamberLogo />
            <span className="wordmark">
              forma<span>Cursos de la Cámara</span>
            </span>
          </Link>
          <div className="header-search">
            <Suspense fallback={<SearchForm />}>
              <HeaderSearch suggestions={suggestions} />
            </Suspense>
          </div>
          <Link href="/instituciones" className="header-institutions">
            <Building2 size={23} strokeWidth={1.5} aria-hidden />
            <span>
              Conocé a las<strong>instituciones</strong>
            </span>
          </Link>
        </div>
        <nav className="container main-nav" aria-label="Navegación principal">
          <Link href="/#categorias">
            <LayoutGrid size={15} aria-hidden /> Categorías
          </Link>
          <Link href="/cursos">Todos los cursos</Link>
          <Link href="/cursos?mode=ONLINE">Online</Link>
          <Link href="/cursos?duration=short">Cursos cortos</Link>
          <Link href="/instituciones">Instituciones</Link>
          <Link href="/el-sello">El sello formativo</Link>
          <span className="nav-note">Formación para tu próximo paso</span>
        </nav>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Link href="/" className="footer-identity">
            <ChamberLogo small />
            <strong>forma</strong>
          </Link>
          <p>
            Conectamos tus ganas de aprender
            <br />
            con nuevas posibilidades.
          </p>
        </div>
        <div>
          <span className="footer-label">EXPLORÁ</span>
          <Link href="/cursos">Todos los cursos</Link>
          <Link href="/instituciones">Instituciones</Link>
          <Link href="/el-sello">Sello de Desarrollo Formativo</Link>
        </div>
        <div className="footer-about">
          <span className="footer-label">UN ESPACIO DE LA CÁMARA</span>
          <p>
            Formación profesional y capacitación laboral para acompañar tu
            desarrollo.
          </p>
          {config().demo && (
            <small>
              Demo local. No se realizan inscripciones, cobros ni envíos de
              consultas.
            </small>
          )}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>Forma · Mercado Cámara</span>
        <span>
          {config().demo
            ? "Contenido ilustrativo · No representa oferta real"
            : "Cámara Argentina"}
        </span>
      </div>
    </footer>
  );
}
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumbs" aria-label="Ruta de navegación">
      <ol>
        <li>
          <Link href="/">Inicio</Link>
        </li>
        {items.map((item, i) => (
          <li key={i}>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function InstitutionLogo({
  institution,
  size = 44,
}: {
  institution: Institution;
  size?: number;
}) {
  if (!institution.logo)
    return (
      <span
        className="institution-logo logo-placeholder"
        role="img"
        aria-label={`Logo no disponible de ${institution.name}`}
        style={{ width: size, height: size }}
      >
        —
      </span>
    );
  return (
    <Image
      className="institution-logo"
      src={institution.logo}
      alt={`Logo de ${institution.name}${institution.demo ? " (ficticio)" : ""}`}
      width={size}
      height={size}
    />
  );
}
export function Credential({
  institution,
  full = false,
}: {
  institution: Institution;
  full?: boolean;
}) {
  if (!institution.assessment)
    return (
      <div className="credential subtle-box">
        <strong>Sin evaluación institucional publicada</strong>
        <small>La falta de evaluación no representa un nivel de calidad.</small>
      </div>
    );
  const { level, stage, rationale, reviewedAt } = institution.assessment;
  const ordinal =
    ["BASE", "SOLIDITY", "DISTINCTION", "REFERENCE"].indexOf(level) + 1;
  return (
    <div className={`credential ${full ? "full" : "compact"}`}>
      <div className="credential-main">
        <span className="credential-emblem">
          <BookOpen size={18} aria-hidden />
          <b>{ordinal ? ["I", "II", "III", "IV"][ordinal - 1] : "—"}</b>
        </span>
        <div>
          <span className="micro">
            SELLO FORMATIVO{institution.demo ? " · EJEMPLO" : ""}
          </span>
          <strong>{levelNames[level]}</strong>
          <small>{stageNames[stage]}</small>
        </div>
        {!full && <Award size={24} className="credential-award" aria-hidden />}
      </div>
      {full && (
        <>
          <div
            className="credential-scale"
            aria-label={
              ordinal
                ? `Nivel ${ordinal} de 4`
                : "En evaluación, sin nivel asignado"
            }
          >
            {["Base", "Solidez", "Distinción", "Referente"].map((label, i) => (
              <span key={label} className={i < ordinal ? "filled" : ""}>
                <i />
                {label}
              </span>
            ))}
          </div>
          <p>{rationale}</p>
          <small>
            {reviewedAt
              ? `Revisión: ${reviewedAt}`
              : "Sin fecha de revisión real"}
          </small>
          <div className="credential-bottom">
            <ChamberLogo small />
            <Link href="/el-sello">
              Conocer los criterios <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
export function CourseCard({ course }: { course: Course }) {
  const Icon =
    categoryIcons[course.category as keyof typeof categoryIcons] ?? BookOpen;
  // Tiles from the existing demo illustration, never a fallback for real media.
  const demoTile = course.demo
    ? Object.keys(categoryIcons).indexOf(course.category ?? "")
    : -1;
  return (
    <article className="course-card">
      <Link
        href={`/cursos/${course.slug}`}
        className={`card-media ${course.category ?? ""}`}
        aria-label={`Ver curso: ${course.title}`}
        tabIndex={-1}
      >
        {demoTile >= 0 ? (
          <svg
            className="card-demo-art"
            viewBox={`${(demoTile % 3) * (1400 / 3)} ${Math.floor(demoTile / 3) * (933 / 2)} ${1400 / 3} ${933 / 2}`}
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-label={`Imagen ilustrativa de ${categoryName(course)}`}
          >
            <image
              href="/assets/course-category-atlas.webp"
              width="1400"
              height="933"
            />
          </svg>
        ) : course.cover ? (
          <Image
            src={course.cover}
            alt={course.coverAlt ?? ""}
            fill
            sizes="(max-width: 760px) 50vw, 280px"
          />
        ) : (
          <Icon size={48} strokeWidth={1.2} aria-hidden />
        )}
        {(course.cover || demoTile >= 0) && course.demo && (
          <span className="card-image-note">Imagen ilustrativa</span>
        )}
      </Link>
      <div className="card-body">
        <span className="card-category-label">{categoryName(course)}</span>
        <h3>
          <Link href={`/cursos/${course.slug}`}>{course.title}</Link>
        </h3>
        <Link
          className="card-institution"
          href={`/instituciones/${course.institution.slug}`}
        >
          <InstitutionLogo institution={course.institution} size={26} />
          <span>{course.institution.name}</span>
        </Link>
        <p className="card-outcome">
          {course.outcomes[0] ??
            course.description ??
            "Información formativa pendiente de completar."}
        </p>
        <CourseRatingSummary
          rating={course.rating}
          href={`/cursos/${course.slug}#opiniones`}
        />
        <div className="course-meta">
          <span>
            <Monitor size={15} aria-hidden />
            {modeName(course.mode)}
          </span>
          <span>
            <Clock3 size={15} aria-hidden />
            {durationText(course)}
          </span>
          {course.difficulty && <span>{course.difficulty}</span>}
        </div>
        <Link
          className="card-seal"
          href={`/instituciones/${course.institution.slug}`}
        >
          <Award size={14} aria-hidden />
          {course.institution.assessment
            ? `Sello institucional: ${levelNames[course.institution.assessment.level]}${course.institution.demo ? " · ejemplo" : ""}`
            : "Sin evaluación institucional publicada"}
        </Link>
      </div>
      <div className="card-bottom">
        <div>
          <small>{course.demo ? "Precio de ejemplo" : "Precio total"}</small>
          <strong>
            {money(course.price, course.currency)}
            <small> {course.price !== null ? course.currency : ""}</small>
          </strong>
        </div>
        <Link
          href={`/cursos/${course.slug}`}
          aria-label={`Ver curso: ${course.title}`}
          className="card-arrow"
        >
          <span>Ver curso</span>
          <ArrowRight size={17} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
export function CourseGrid({
  courses,
  view = "grid",
}: {
  courses: Course[];
  view?: "grid" | "list";
}) {
  return (
    <div
      className={view === "list" ? "course-grid course-list" : "course-grid"}
    >
      {courses.map((c) => (
        <CourseCard course={c} key={c.id} />
      ))}
    </div>
  );
}
export function CategoryLinks({ categories }: { categories: Category[] }) {
  return (
    <div className="category-grid">
      {categories.map((category) => {
        const Icon =
          categoryIcons[category.slug as keyof typeof categoryIcons] ??
          BookOpen;
        return (
          <Link href={`/categorias/${category.slug}`} key={category.slug}>
            <span className={`category-icon ${category.slug}`}>
              <Icon size={25} strokeWidth={1.6} aria-hidden />
            </span>
            <strong>{category.name}</strong>
            <ArrowRight size={16} aria-hidden />
          </Link>
        );
      })}
    </div>
  );
}
export function InstitutionCard({ institution }: { institution: Institution }) {
  return (
    <article className="institution-card">
      <InstitutionLogo institution={institution} size={68} />
      <span className="eyebrow">{institution.specialty}</span>
      <h2>
        <Link href={`/instituciones/${institution.slug}`}>
          {institution.name}
        </Link>
      </h2>
      <p>
        {institution.description ??
          "Presentación institucional pendiente de completar."}
      </p>
      <span className="location">
        <MapPin size={16} aria-hidden />
        {institutionLocation(institution)}
      </span>
      <Credential institution={institution} />
      <Link href={`/instituciones/${institution.slug}`} className="text-link">
        Conocer la institución <ArrowRight size={17} aria-hidden />
      </Link>
    </article>
  );
}
export function JsonLd({ data }: { data: unknown }) {
  if (!config().indexable) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
