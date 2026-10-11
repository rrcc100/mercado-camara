import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";
import { levelNames, modeNames, type SearchFilters } from "@/domain/catalog";
import { getRepository } from "@/data/repository";
import { CourseGrid } from "./ui";
function Field({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select name={name} defaultValue={value ?? ""}>
        <option value="">Todas las opciones</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
export async function Catalog({
  filters,
  basePath = "/cursos",
  fixedCategory,
}: {
  filters: SearchFilters;
  basePath?: string;
  fixedCategory?: string;
}) {
  const result = await (await getRepository()).catalog(filters);
  const pages = Math.ceil(result.total / result.pageSize);
  function pageUrl(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters))
      if (value && key !== "page" && !(key === "category" && fixedCategory))
        params.set(key, String(value));
    params.set("page", String(page));
    return `${basePath}?${params}`;
  }
  return (
    <div className="catalog-layout">
      <aside className="filters">
        <details open>
          <summary>
            <SlidersHorizontal size={18} aria-hidden /> Filtrar cursos
          </summary>
          <form action={basePath}>
            <label className="filter-field">
              <span>Palabra clave</span>
              <input
                type="search"
                name="q"
                defaultValue={filters.q}
                placeholder="Tema o habilidad"
                maxLength={160}
              />
            </label>
            {!fixedCategory && (
              <Field
                label="Área de formación"
                name="category"
                value={filters.category}
                options={result.categories.map((c) => ({
                  value: c.slug,
                  label: c.name,
                }))}
              />
            )}
            <Field
              label="Modalidad"
              name="mode"
              value={filters.mode}
              options={Object.entries(modeNames).map(([value, label]) => ({
                value,
                label,
              }))}
            />
            <Field
              label="Provincia del instituto"
              name="province"
              value={filters.province}
              options={result.provinces.map((value) => ({
                value,
                label: value,
              }))}
            />
            <Field
              label="Duración"
              name="duration"
              value={filters.duration}
              options={[
                { value: "short", label: "Hasta 40 horas" },
                { value: "long", label: "Más de 40 horas" },
              ]}
            />
            <Field
              label="Nivel institucional"
              name="level"
              value={filters.level}
              options={Object.entries(levelNames).map(([value, label]) => ({
                value,
                label,
              }))}
            />
            <label className="filter-field">
              <span>Ordenar por</span>
              <select name="sort" defaultValue={filters.sort ?? "relevance"}>
                <option value="relevance">Más relevantes</option>
                <option value="price">Menor precio</option>
                <option value="duration">Menor duración</option>
              </select>
            </label>
            <button className="button" type="submit">
              Aplicar filtros
            </button>
            <Link className="reset-link" href={basePath}>
              Limpiar filtros
            </Link>
          </form>
        </details>
        <p className="filter-note">
          La afinidad con tu búsqueda define la relevancia. El sello
          institucional aporta información para elegir.
        </p>
      </aside>
      <div className="catalog-results">
        <div className="results-heading">
          <p>
            <strong>{result.total}</strong>{" "}
            {result.total === 1 ? "curso encontrado" : "cursos encontrados"}
            {filters.q && (
              <>
                {" "}
                para <strong>“{filters.q}”</strong>
              </>
            )}
          </p>
          <span>
            {result.items.length
              ? `${(result.page - 1) * result.pageSize + 1}–${(result.page - 1) * result.pageSize + result.items.length}`
              : "0"}{" "}
            de {result.total}
          </span>
        </div>
        {result.items.length ? (
          <CourseGrid courses={result.items} />
        ) : (
          <div className="empty-state">
            <SearchX size={42} strokeWidth={1.4} aria-hidden />
            <h2>
              {result.total
                ? "Esta página no tiene resultados"
                : "Todavía no encontramos ese curso"}
            </h2>
            <p>
              Probá con otra palabra o ampliá los filtros para descubrir más
              opciones.
            </p>
            <Link href={basePath} className="button secondary">
              Ver cursos disponibles
            </Link>
          </div>
        )}
        {pages > 1 && (
          <nav className="pagination" aria-label="Páginas del catálogo">
            {result.page > 1 && (
              <Link
                href={pageUrl(result.page - 1)}
                aria-label="Página anterior"
              >
                <ArrowLeft size={18} />
              </Link>
            )}
            {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={pageUrl(page)}
                aria-current={page === result.page ? "page" : undefined}
              >
                {page}
              </Link>
            ))}
            {result.page < pages && (
              <Link
                href={pageUrl(result.page + 1)}
                aria-label="Página siguiente"
              >
                <ArrowRight size={18} />
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
