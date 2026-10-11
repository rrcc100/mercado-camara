import {
  categoryName,
  modeName,
  type Course,
  type SearchFilters,
} from "./catalog";
export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const aliases: Record<string, string> = {
  computacion: "tecnologia",
  informatica: "tecnologia",
  virtual: "online",
  remoto: "online",
  programar: "programacion",
};
const stopWords = new Set([
  "curso",
  "cursos",
  "de",
  "del",
  "para",
  "en",
  "el",
  "la",
  "los",
  "las",
  "aprender",
  "y",
]);
export function searchCourses(courses: Course[], filters: SearchFilters = {}) {
  const words = normalize(filters.q ?? "")
    .split(/\s+/)
    .filter((w) => w && !stopWords.has(w))
    .map((w) => aliases[w] ?? w);
  return courses
    .filter((c) => c.status === "PUBLISHED")
    .map((course) => {
      const title = normalize(course.title),
        skills = normalize(course.skills.join(" ")),
        outcomes = normalize([...course.outcomes, course.project].join(" ")),
        modules = normalize(
          course.modules.map((m) => [m.title, m.content].join(" ")).join(" "),
        );
      const text = normalize(
        [
          title,
          skills,
          outcomes,
          modules,
          course.description,
          categoryName(course),
          course.institution.name,
          course.institution.city,
          course.institution.province,
          modeName(course.mode),
        ].join(" "),
      );
      return {
        course,
        matches: words.every((w) => text.includes(w)),
        relevance: words.reduce(
          (sum, w) =>
            sum +
            (title.includes(w)
              ? 8
              : skills.includes(w)
                ? 6
                : outcomes.includes(w)
                  ? 4
                  : modules.includes(w)
                    ? 3
                    : text.includes(w)
                      ? 1
                      : 0),
          0,
        ),
      };
    })
    .filter(
      ({ course: c, matches }) =>
        matches &&
        (!filters.category || c.category === filters.category) &&
        (!filters.mode || c.mode === filters.mode) &&
        (!filters.province || c.institution.province === filters.province) &&
        (!filters.level || c.institution.assessment?.level === filters.level) &&
        (!filters.duration ||
          (c.hours !== null &&
            (filters.duration === "short" ? c.hours <= 40 : c.hours > 40))),
    )
    .sort(
      (a, b) =>
        (filters.sort === "price"
          ? (a.course.price ?? Infinity) - (b.course.price ?? Infinity)
          : filters.sort === "duration"
            ? (a.course.hours ?? Infinity) - (b.course.hours ?? Infinity)
            : b.relevance - a.relevance) ||
        a.course.title.localeCompare(b.course.title, "es") ||
        a.course.id.localeCompare(b.course.id),
    )
    .map((item) => item.course);
}
const ignored = new Set([
  ...stopWords,
  "con",
  "al",
  "un",
  "una",
  "por",
  "como",
  "trabajo",
  "formacion",
  "introduccion",
  "inicial",
  "basico",
  "basicos",
  "basicas",
  "primeros",
  "pasos",
  "esenciales",
  "tecnicas",
  "herramientas",
  "practica",
  "practicas",
  "taller",
  "buenas",
]);
const tokens = (value: string) =>
  new Set(
    normalize(value)
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !ignored.has(w)),
  );
const overlap = (a: Set<string>, b: Set<string>) =>
  [...a].filter((w) => b.has(w)).length;
export function relatedCourses(current: Course, courses: Course[], limit = 3) {
  if (!Number.isInteger(limit) || limit < 1) return [];
  const title = tokens(current.title),
    skills = tokens(current.skills.join(" ")),
    seen = new Set([current.id]);
  return courses
    .filter((c) => {
      if (c.status !== "PUBLISHED" || seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    })
    .map((course) => {
      const t = tokens(course.title),
        s = tokens(course.skills.join(" "));
      return {
        course,
        affinity:
          8 * overlap(title, t) +
          6 * overlap(skills, s) +
          2 * (overlap(title, s) + overlap(skills, t)) +
          (current.category && current.category === course.category ? 5 : 0),
        mode: Number(!!current.mode && current.mode === course.mode),
        difficulty: Number(
          !!current.difficulty && current.difficulty === course.difficulty,
        ),
      };
    })
    .filter((c) => c.affinity > 0)
    .sort(
      (a, b) =>
        b.affinity - a.affinity ||
        b.mode - a.mode ||
        b.difficulty - a.difficulty ||
        a.course.title.localeCompare(b.course.title, "es") ||
        a.course.id.localeCompare(b.course.id),
    )
    .slice(0, Math.min(3, limit))
    .map((c) => c.course);
}
export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): SearchFilters {
  const single = (key: string) =>
    typeof params[key] === "string" ? params[key].slice(0, 160) : "";
  const page = Number(single("page"));
  return {
    q: single("q").trim(),
    category: single("category"),
    mode: single("mode"),
    province: single("province"),
    level: single("level"),
    duration: ["short", "long"].includes(single("duration"))
      ? single("duration")
      : "",
    sort: ["price", "duration"].includes(single("sort"))
      ? single("sort")
      : "relevance",
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1,
  };
}
