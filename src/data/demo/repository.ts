import {
  courseSchema,
  demoCategories,
  institutionSchema,
  type CatalogRepository,
} from "@/domain/catalog";
import { relatedCourses, searchCourses } from "@/domain/search";
import fixtures from "./fixtures.json";
import { demoRating } from "./ratings";
export const institutions = institutionSchema
  .array()
  .parse(fixtures.institutions);
export const courses = courseSchema.array().parse(
  fixtures.courses.map((course, index) => ({
    ...course,
    rating: demoRating(course.id, index),
  })),
);
const categories = demoCategories.map((c) => ({ ...c, id: `demo-${c.slug}` }));
export const demoRepository: CatalogRepository = {
  async searchSuggestions() {
    return [
      ...categories.map((c) => ({ label: c.name, kind: "CATEGORY" as const })),
      ...courses
        .filter((c) => c.status === "PUBLISHED")
        .map((c) => ({ label: c.title, kind: "COURSE" as const })),
      ...institutions
        .filter((i) =>
          courses.some(
            (c) => c.status === "PUBLISHED" && c.institution.id === i.id,
          ),
        )
        .map((i) => ({ label: i.name, kind: "INSTITUTION" as const })),
    ].slice(0, 60);
  },
  async categories() {
    return categories;
  },
  async catalog(filters = {}) {
    const result = searchCourses(courses, filters),
      page = filters.page ?? 1,
      pageSize = 9;
    const provinces = [
      ...new Set(
        courses
          .filter((c) => c.status === "PUBLISHED")
          .map((c) => c.institution.province)
          .filter((p): p is string => !!p),
      ),
    ].sort((a, b) => a.localeCompare(b, "es"));
    return {
      items: result.slice((page - 1) * pageSize, page * pageSize),
      total: result.length,
      page,
      pageSize,
      provinces,
      categories,
    };
  },
  async course(slug) {
    return courses.find((c) => c.slug === slug) ?? null;
  },
  async institutions() {
    return institutions;
  },
  async institution(slug) {
    return institutions.find((i) => i.slug === slug) ?? null;
  },
  async institutionCourses(id) {
    return searchCourses(courses).filter((c) => c.institution.id === id);
  },
  async related(course) {
    return relatedCourses(course, courses);
  },
  async publishedSlugs() {
    return {
      courses: courses
        .filter((c) => c.status === "PUBLISHED")
        .map((c) => c.slug),
      institutions: institutions.map((i) => i.slug),
    };
  },
};
