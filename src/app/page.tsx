import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Compass,
  GraduationCap,
} from "lucide-react";
import { CategoryLinks, CourseGrid, SearchForm } from "@/components/ui";
import { getRepository } from "@/data/repository";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Aprendé algo que te lleve más lejos",
  "Explorá cursos de tecnología, administración, oficios y más. Encontrá habilidades para tu próximo paso con Forma, el portal de la Cámara.",
  "/",
);
export default async function Home() {
  const repo = await getRepository();
  const { items, categories } = await repo.catalog();
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="tiny-line" /> FORMACIÓN QUE TE CONECTA CON EL
            FUTURO
          </span>
          <h1>
            Tu próximo paso
            <br />
            empieza <em>aprendiendo.</em>
          </h1>
          <p>
            Encontrá el curso que va con vos. Desarrollá habilidades prácticas y
            abrí nuevas posibilidades para tu trabajo.
          </p>
          <SearchForm large />
          <div className="popular">
            <span>Para inspirarte:</span>
            <Link href="/cursos?q=Excel">Excel</Link>
            <Link href="/cursos?q=Marketing">Marketing digital</Link>
            <Link href="/cursos?q=oficios">Oficios</Link>
          </div>
        </div>
        <div className="hero-visual">
          <Image
            src="/assets/digital-learning.webp"
            alt="Ilustración de personas aprendiendo herramientas digitales"
            fill
            sizes="(max-width: 760px) 100vw, 46vw"
            priority
          />
          <span className="image-note">Imagen ilustrativa</span>
          <div className="hero-caption">
            <span>
              <GraduationCap size={24} aria-hidden />
            </span>
            <div>
              <strong>Aprender para hacer.</strong>
              <small>Habilidades que se llevan a la práctica.</small>
            </div>
          </div>
        </div>
      </section>
      <div className="container trust-strip">
        <span>
          <Compass aria-hidden size={23} />
          <span>
            <strong>Encontrá tu camino</strong>
            <small>Cursos por tema, modalidad y ubicación</small>
          </span>
        </span>
        <span>
          <BookOpen aria-hidden size={23} />
          <span>
            <strong>Sabé qué vas a aprender</strong>
            <small>Objetivos y resultados claros</small>
          </span>
        </span>
        <span>
          <BadgeCheck aria-hidden size={23} />
          <span>
            <strong>Conocé quién te forma</strong>
            <small>Información y sello institucional</small>
          </span>
        </span>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">UN MUNDO DE POSIBILIDADES</span>
            <h2>¿Por dónde querés empezar?</h2>
          </div>
          <Link href="/cursos" className="text-link">
            Ver todos los cursos <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
        <CategoryLinks categories={categories} />
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HABILIDADES PARA TU DÍA A DÍA</span>
            <h2>Descubrí tu próxima oportunidad</h2>
            <p>Explorá propuestas y elegí qué querés aprender.</p>
          </div>
          <Link href="/cursos" className="text-link">
            Explorar catálogo <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
        <CourseGrid courses={items.slice(0, 3)} />
      </section>
      <section className="container chamber-banner">
        <div className="banner-symbol">
          <GraduationCap size={58} strokeWidth={1.3} aria-hidden />
        </div>
        <div>
          <span className="eyebrow">CON INFORMACIÓN PARA ELEGIR</span>
          <h2>Detrás de cada curso, una institución.</h2>
          <p>
            Conocé su propuesta, sus especialidades y el significado del Sello
            de Desarrollo Formativo de la Cámara.
          </p>
        </div>
        <Link className="button light" href="/instituciones">
          Conocer instituciones <ArrowRight size={17} aria-hidden />
        </Link>
      </section>
    </>
  );
}
