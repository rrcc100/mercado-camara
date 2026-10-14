import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { courseSchema } from "../src/domain/catalog";
import { ratingSchema } from "../src/domain/ratings";
import { courses, demoRepository } from "../src/data/demo/repository";
import {
  CourseRatingSummary,
  CourseReviews,
} from "../src/components/course-rating";
import { searchCourses } from "../src/domain/search";

const rating = courses[0].rating!;
describe("valoraciones públicas", () => {
  it("mantiene consistente el promedio con las opiniones ficticias y la distribución", () => {
    for (const course of courses) {
      if (!course.rating) continue;
      expect(course.rating.demo).toBe(true);
      expect(course.rating.count).toBe(course.rating.reviews.length);
      expect(course.rating.average).toBe(
        course.rating.reviews.reduce((sum, review) => sum + review.score, 0) /
          course.rating.count,
      );
    }
    expect(courses.some((course) => course.rating === null)).toBe(true);
  });
  it("rechaza puntuaciones fuera de rango y agregados inconsistentes", () => {
    for (const invalid of [
      { ...rating, average: 5.1 },
      { ...rating, count: 0 },
      { ...rating, average: 1 },
      { ...rating, count: 99 },
      { ...rating, distribution: Array(5).fill({ stars: 5, count: 1 }) },
      { ...rating, reviews: [{ ...rating.reviews[0], score: 0 }] },
    ])
      expect(ratingSchema.safeParse(invalid).success).toBe(false);
  });
  it("no permite adjuntar opiniones de demostración a un curso real", () => {
    expect(courseSchema.safeParse({ ...courses[0], demo: false }).success).toBe(
      false,
    );
    expect(
      courseSchema.safeParse({ ...courses[0], demo: false, rating: null })
        .success,
    ).toBe(true);
    const { rating: omitted, ...legacy } = courses[0];
    expect(omitted).toBeTruthy();
    expect(courseSchema.parse(legacy).rating).toBeNull();
  });
  it("identifica los ejemplos y no representa la ausencia como un cero", () => {
    const html = renderToStaticMarkup(<CourseReviews rating={rating} />);
    expect(html).toContain("Datos de ejemplo");
    expect(html).toContain("No corresponden a estudiantes reales");
    expect(html).not.toContain("Alumno verificado");
    expect(
      renderToStaticMarkup(<CourseRatingSummary rating={null} />),
    ).toContain("Sin valoraciones todavía");
    expect(
      renderToStaticMarkup(<CourseRatingSummary rating={null} />),
    ).not.toContain("rating-stars");
    expect(
      renderToStaticMarkup(<CourseRatingSummary rating={rating} />),
    ).toContain("valoraciones de ejemplo");
  });
  it("las sugerencias apuntan a búsquedas con cursos publicados", async () => {
    const suggestions = await demoRepository.searchSuggestions();
    expect(new Set(suggestions.map((item) => item.kind)).size).toBe(3);
    expect(suggestions.length).toBeLessThanOrEqual(60);
    for (const item of suggestions)
      expect(searchCourses(courses, { q: item.label }).length).toBeGreaterThan(
        0,
      );
  });
});
