import { describe, expect, it } from "vitest";
import {
  courses,
  institutions,
  demoRepository,
} from "../src/data/demo/repository";
import {
  relatedCourses,
  searchCourses,
  parseFilters,
} from "../src/domain/search";
describe("datos de demostración", () => {
  it("conserva 16 cursos, 6 instituciones y contenido de aprendizaje completo", () => {
    expect(courses).toHaveLength(16);
    expect(institutions).toHaveLength(6);
    expect(new Set(courses.map((c) => c.slug)).size).toBe(16);
    for (const c of courses) {
      expect(c.demo).toBe(true);
      expect(c.outcomes.length).toBeGreaterThan(0);
      expect(c.objectives).toBeTruthy();
      expect(c.audience.length).toBeGreaterThan(0);
    }
  });
  it("no mezcla reseñas ficticias con datos públicos", () => {
    for (const c of courses) {
      expect(c.demo).toBe(true);
      if (c.rating) expect(c.rating.demo).toBe(true);
      expect(c.institution).not.toHaveProperty("scores");
    }
  });
});
describe("búsqueda", () => {
  it("busca sin acentos y en habilidades, resultados y proyectos", () => {
    expect(searchCourses(courses, { q: "INGLES" })[0].id).toBe(
      "ingles-puentes",
    );
    expect(
      searchCourses(courses, { q: "tabla dinamica" }).map((c) => c.id),
    ).toContain("excel-horizonte");
    expect(
      searchCourses(courses, { q: "informatica" }).every(
        (c) => c.category === "tecnologia",
      ),
    ).toBe(true);
  });
  it("combina términos y todos los filtros", () => {
    expect(
      searchCourses(courses, {
        q: "excel",
        mode: "ONLINE",
        province: "CABA",
        duration: "short",
        level: "REFERENCE",
        category: "tecnologia",
      }).map((c) => c.id),
    ).toEqual(["excel-horizonte"]);
    expect(searchCourses(courses, { q: "astronautica" })).toEqual([]);
  });
  it("el nivel institucional no modifica la relevancia", () => {
    const changed = courses.map((c) => ({
      ...c,
      institution: {
        ...c.institution,
        assessment: { ...c.institution.assessment!, level: "PENDING" as const },
      },
    }));
    expect(searchCourses(changed, { q: "excel" }).map((c) => c.id)).toEqual(
      searchCourses(courses, { q: "excel" }).map((c) => c.id),
    );
  });
  it("ordena precios y pagina sin perder ni repetir cursos", async () => {
    const ordered = searchCourses(courses, { sort: "price" });
    expect(ordered.map((c) => c.price)).toEqual(
      ordered.map((c) => c.price).sort((a, b) => a! - b!),
    );
    const first = await demoRepository.catalog(),
      second = await demoRepository.catalog({ page: 2 });
    expect(first.total).toBe(16);
    expect(first.items).toHaveLength(9);
    expect(second.items).toHaveLength(7);
    expect(
      new Set([...first.items, ...second.items].map((c) => c.id)).size,
    ).toBe(16);
  });
  it("limita entradas y normaliza páginas inválidas", () => {
    expect(parseFilters({ page: "-3", q: ["a", "b"] })).toMatchObject({
      page: 1,
      q: "",
    });
    expect(
      parseFilters({ page: "Infinity", q: "a".repeat(500) }).q,
    ).toHaveLength(160);
  });
});
describe("relacionados y publicación", () => {
  it("prioriza afinidad temática y excluye actual, duplicados e inactivos", () => {
    const current = courses.find((c) => c.id === "excel-horizonte")!;
    const matches = relatedCourses(current, [...courses, ...courses]);
    expect(matches[0].id).toBe("excel-aula");
    expect(matches.length).toBeLessThanOrEqual(3);
    expect(matches.some((c) => c.id === current.id)).toBe(false);
    expect(new Set(matches.map((c) => c.id)).size).toBe(matches.length);
    const inactive = courses.map((c) => ({
      ...c,
      status: "UNAVAILABLE" as const,
    }));
    expect(searchCourses(inactive)).toEqual([]);
    expect(relatedCourses(current, inactive)).toEqual([]);
  });
  it("no inventa coincidencias y limita a tres recomendaciones", () => {
    const current = {
      ...courses[0],
      title: "Astronomía",
      skills: ["Astrofísica"],
      category: "astronomia",
      categoryLabel: "Astronomía",
    };
    expect(relatedCourses(current, courses)).toEqual([]);
    expect(relatedCourses(courses[0], courses, 100).length).toBeLessThanOrEqual(
      3,
    );
    expect(relatedCourses(courses[0], courses, 0)).toEqual([]);
  });
  it("una desactivación afecta listado, conteos, perfil, relacionados y sitemap; conserva URL", async () => {
    const course = courses[0];
    course.status = "UNAVAILABLE";
    try {
      expect((await demoRepository.catalog()).total).toBe(15);
      expect(
        (await demoRepository.institutionCourses(course.institution.id)).some(
          (c) => c.id === course.id,
        ),
      ).toBe(false);
      expect((await demoRepository.publishedSlugs()).courses).not.toContain(
        course.slug,
      );
      expect(
        (await demoRepository.related(courses[1])).some(
          (c) => c.id === course.id,
        ),
      ).toBe(false);
      expect((await demoRepository.course(course.slug))?.status).toBe(
        "UNAVAILABLE",
      );
    } finally {
      course.status = "PUBLISHED";
    }
    expect((await demoRepository.course(course.slug))?.id).toBe(course.id);
  });
});
