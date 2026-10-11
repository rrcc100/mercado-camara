import { BookOpen } from "lucide-react";
import { Breadcrumbs, ChamberLogo } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "El Sello de Desarrollo Formativo",
  "Conocé la escala institucional y la propuesta de evaluación progresiva de la Cámara.",
  "/el-sello",
  true,
);
export default function SealPage() {
  return (
    <div className="container page methodology">
      <Breadcrumbs items={[{ label: "El sello formativo" }]} />
      <div className="page-heading">
        <span className="eyebrow">INFORMACIÓN PARA ELEGIR</span>
        <h1>
          Un sello que acompaña
          <br />
          el desarrollo formativo.
        </h1>
        <p>
          Una propuesta de evaluación institucional que reconoce la preparación
          y, progresivamente, la experiencia de quienes aprenden.
        </p>
      </div>
      <div className="notice">
        <strong>Modelo en discusión con la Cámara.</strong> Los niveles
        mostrados en la demo son ilustrativos. Las ponderaciones, rúbricas y
        umbrales todavía requieren validación institucional.
      </div>
      <section className="section">
        <div className="seal-heading">
          <ChamberLogo />
          <h2>Cuatro niveles. Un camino de mejora.</h2>
        </div>
        <div className="level-grid">
          {[
            "Base formativa",
            "Solidez formativa",
            "Distinción formativa",
            "Referente formativo",
          ].map((level, i) => (
            <article key={level}>
              <BookOpen aria-hidden />
              <span className="roman">{["I", "II", "III", "IV"][i]}</span>
              <h3>{level}</h3>
              <p>
                {
                  [
                    "Propuesta evaluada, con oportunidades de mejora documentadas.",
                    "Propuesta documentada y experiencia formativa consistente.",
                    "Preparación sólida, con evidencia revisada. También accesible en etapa inicial.",
                    "Requiere evidencia suficiente y sostenida de experiencia real.",
                  ][i]
                }
              </p>
            </article>
          ))}
        </div>
        <p className="subtle-box">
          <strong>En evaluación</strong> es un estado separado. La información
          faltante no equivale a una mala nota.
        </p>
      </section>
      <section className="section">
        <h2>La evidencia define la etapa</h2>
        <p>
          Una institución nueva puede alcanzar Distinción por su documentación y
          propuesta revisadas, sin necesitar opiniones previas. El paso del
          tiempo, por sí solo, no cambia su evaluación.
        </p>
        <div
          className="table-wrap"
          tabIndex={0}
          role="region"
          aria-label="Pesos propuestos por etapa"
        >
          <table>
            <caption>
              Ponderaciones propuestas para validar con la Cámara
            </caption>
            <thead>
              <tr>
                <th>Dimensión</th>
                <th>Inicio</th>
                <th>Primeras experiencias</th>
                <th>Evidencia suficiente</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Documentación y respaldo", 30, 15, 10],
                ["Propuesta formativa", 40, 30, 20],
                ["Información y actualización", 30, 15, 10],
                ["Experiencia de alumnos", 0, 25, 40],
                ["Actividad y certificaciones", 0, 15, 20],
              ].map(([label, ...weights]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {weights.map((w, i) => (
                    <td key={i}>{w}%</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Las transiciones deberán ser graduales y auditables. Las
          certificaciones tendrán un peso relevante, con criterios que
          contemplen instituciones de diferentes tamaños.
        </p>
      </section>
      <section className="section two-columns">
        <div>
          <h2>El sello y las opiniones</h2>
          <p>
            El sello describe la evaluación institucional. Las opiniones
            corresponden a experiencias de estudiantes y se presentan por
            separado. En esta versión no hay valoraciones verificadas.
          </p>
        </div>
        <div>
          <h2>La búsqueda y la afinidad</h2>
          <p>
            Los resultados priorizan lo que querés aprender. Los cursos
            relacionados se eligen por tema y habilidades; la modalidad y
            dificultad resuelven empates. El nivel institucional no altera esa
            relevancia.
          </p>
        </div>
      </section>
    </div>
  );
}
