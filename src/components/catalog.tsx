import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  SearchX,
  LayoutGrid,
  List,
  X,
} from "lucide-react";
import { levelNames, modeNames, type SearchFilters } from "@/domain/catalog";
import { getRepository } from "@/data/repository";
import { CourseGrid } from "./ui";
import { ResponsiveFilters } from "./responsive-filters";
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
  view = "list",
}: {
  filters: SearchFilters;
  basePath?: string;
  fixedCategory?: string;
  view?: "grid" | "list";
}) {
  const result = await (await getRepository()).catalog(filters);
  const pages = Math.ceil(result.total / result.pageSize);
  function catalogUrl(changes: Partial<SearchFilters> = {}, nextView = view) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...filters, ...changes }))
      if (value && !(key === "category" && fixedCategory))
        params.set(key, String(value));
    params.set("view", nextView);
    return `${basePath}?${params}`;
  }
  const applied = [
    { key: "q", value: filters.q, label: filters.q },
    {
      key: "category",
      value: fixedCategory ? "" : filters.category,
      label:
        result.categories.find((c) => c.slug === filters.category)?.name ??
        filters.category,
    },
    {
      key: "mode",
      value: filters.mode,
      label: modeNames[filters.mode as keyof typeof modeNames] ?? filters.mode,
    },
    { key: "province", value: filters.province, label: filters.province },
    {
      key: "duration",
      value: filters.duration,
      label:
        filters.duration === "short" ? "Hasta 40 horas" : "Más de 40 horas",
    },
    {
      key: "level",
      value: filters.level,
      label:
        levelNames[filters.level as keyof typeof levelNames] ?? filters.level,
    },
  ].filter((item) => item.value);
  return (
    <div className="catalog-layout">
      <aside className="filters">
        <ResponsiveFilters count={applied.length}>
          <form action={basePath}>
            <input type="hidden" name="view" value={view} />
            <input
              type="hidden"
              name="sort"
              value={filters.sort ?? "relevance"}
            />
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
            <button className="button" type="submit">
              Aplicar filtros
            </button>
            <Link className="reset-link" href={basePath}>
              Limpiar filtros
            </Link>
          </form>
        </ResponsiveFilters>
        <p className="filter-note">
          La afinidad con tu búsqueda define la relevancia. El sello
          institucional aporta información para elegir.
        </p>
      </aside>
      <div className="catalog-results">
        {applied.length > 0 && (
          <div className="applied-filters" aria-label="Filtros aplicados">
            {applied.map((item) => (
              <Link
                key={item.key}
                href={catalogUrl({ [item.key]: "", page: 1 })}
                aria-label={`Quitar filtro: ${item.label}`}
              >
                {item.label}
                <X size={13} aria-hidden />
              </Link>
            ))}
            <Link className="clear-all" href={basePath}>
              Limpiar todos
            </Link>
          </div>
        )}
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
        <div className="catalog-toolbar" id="ordenar-resultados">
          <form action={basePath} className="catalog-sort">
            {Object.entries(filters)
              .filter(
                ([key, value]) =>
                  value &&
                  !["page", "sort"].includes(key) &&
                  !(key === "category" && fixedCategory),
              )
              .map(([key, value]) => (
                <input
                  type="hidden"
                  name={key}
                  value={String(value)}
                  key={key}
                />
              ))}
            <input type="hidden" name="view" value={view} />
            <label htmlFor="catalog-sort">Ordenar por</label>
            <select
              id="catalog-sort"
              name="sort"
              defaultValue={filters.sort ?? "relevance"}
            >
              <option value="relevance">Más relevantes</option>
              <option value="price">Menor precio</option>
              <option value="duration">Menor duración</option>
            </select>
            <button type="submit" aria-label="Aplicar orden">
              <ArrowRight size={17} aria-hidden />
            </button>
          </form>
          <nav className="view-switch" aria-label="Vista de resultados">
            <Link
              href={catalogUrl({}, "grid")}
              aria-label="Ver como tarjetas"
              aria-current={view === "grid" ? "true" : undefined}
            >
              <LayoutGrid size={17} aria-hidden />
            </Link>
            <Link
              href={catalogUrl({}, "list")}
              aria-label="Ver como lista"
              aria-current={view === "list" ? "true" : undefined}
            >
              <List size={18} aria-hidden />
            </Link>
          </nav>
        </div>
        {result.items.length ? (
          <CourseGrid courses={result.items} view={view} />
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
                href={catalogUrl({ page: result.page - 1 })}
                aria-label="Página anterior"
              >
                <ArrowLeft size={18} />
              </Link>
            )}
            {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={catalogUrl({ page })}
                aria-current={page === result.page ? "page" : undefined}
              >
                {page}
              </Link>
            ))}
            {result.page < pages && (
              <Link
                href={catalogUrl({ page: result.page + 1 })}
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
