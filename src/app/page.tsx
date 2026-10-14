import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Monitor, Building2 } from "lucide-react";
import { CategoryLinks, CourseGrid } from "@/components/ui";
import { getRepository } from "@/data/repository";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Encontrá tu próximo curso",
  "Explorá cursos por tema, modalidad e institución. Encontrá una propuesta para tu próximo paso con Forma, el portal de la Cámara.",
  "/",
);

export default async function Home() {
  const repo = await getRepository();
  const [{ items, categories }, online] = await Promise.all([
    repo.catalog(),
    repo.catalog({ mode: "ONLINE" }),
  ]);
  return (
    <div className="market-home">
      <section className="market-hero">
        <div className="container market-hero-inner">
          <div className="market-hero-copy">
            <span className="eyebrow">EL PORTAL DE CURSOS DE LA CÁMARA</span>
            <h1>
              Lo que querés aprender.
              <br />
              <em>Tu próximo paso.</em>
            </h1>
            <p>
              Explorá propuestas, conocé a las instituciones y encontrá el curso
              que va con vos.
            </p>
            <Link href="/cursos" className="button">
              Explorar cursos <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <div className="market-hero-image">
            <Image
              src="/assets/digital-learning.webp"
              alt="Ilustración de personas aprendiendo herramientas digitales"
              fill
              sizes="(max-width: 760px) 40vw, 42vw"
              loading="eager"
            />
            <span>Imagen ilustrativa</span>
          </div>
        </div>
      </section>

      <div className="container quick-access" aria-label="Accesos al catálogo">
        {[
          {
            icon: Monitor,
            title: "Aprendé online",
            description: "Explorá propuestas a distancia",
            href: "/cursos?mode=ONLINE",
          },
          {
            icon: Clock3,
            title: "Cursos de hasta 40 horas",
            description: "Encontrá una formación corta",
            href: "/cursos?duration=short",
          },
          {
            icon: Building2,
            title: "Conocé quién te forma",
            description: "Visitá los perfiles institucionales",
            href: "/instituciones",
          },
        ].map(({ icon: Icon, title, description, href }) => (
          <Link href={href} key={href}>
            <span className="quick-icon">
              <Icon size={25} strokeWidth={1.6} aria-hidden />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <ArrowRight size={18} aria-hidden />
          </Link>
        ))}
      </div>

      <section className="container market-section">
        <div className="section-heading">
          <div>
            <h2>Cursos para dar el próximo paso</h2>
            <p>Distintas propuestas, toda la información para elegir.</p>
          </div>
          <Link className="text-link" href="/cursos">
            Ver catálogo <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        {items.length ? (
          <CourseGrid courses={items.slice(0, 4)} />
        ) : (
          <p className="subtle-box">Todavía no hay cursos publicados.</p>
        )}
      </section>

      <section
        className="container market-section category-section"
        id="categorias"
      >
        <div className="section-heading">
          <h2>Explorá por área de formación</h2>
          <Link className="text-link" href="/cursos">
            Ver todos los cursos <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <CategoryLinks categories={categories} />
      </section>

      <section className="container discovery-banner">
        <div>
          <span className="eyebrow">ELEGÍ CON MÁS INFORMACIÓN</span>
          <h2>
            El curso importa.
            <br />
            Quién te forma, también.
          </h2>
          <p>
            Conocé las instituciones, su propuesta y el significado del sello
            formativo.
          </p>
          <Link href="/instituciones" className="text-link">
            Explorar instituciones <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
        <Link href="/el-sello" className="discovery-seal">
          <Building2 size={40} strokeWidth={1.2} aria-hidden />
          <strong>Sello de Desarrollo Formativo</strong>
          <span>
            Conocé la propuesta y sus criterios{" "}
            <ArrowRight size={16} aria-hidden />
          </span>
        </Link>
      </section>

      {online.items.length > 0 && (
        <section className="container market-section">
          <div className="section-heading">
            <div>
              <h2>Explorá cursos online</h2>
              <p>Formación a distancia, en un solo lugar.</p>
            </div>
            <Link className="text-link" href="/cursos?mode=ONLINE">
              Ver cursos online <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <CourseGrid courses={online.items.slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
