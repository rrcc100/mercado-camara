import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, expect, vi } from "vitest";
import { courses } from "../src/data/demo/repository";
import {
  courseSchema,
  durationText,
  modeName,
  money,
} from "../src/domain/catalog";
import { searchCourses, relatedCourses } from "../src/domain/search";
import { CourseCard, Credential, InstitutionLogo } from "../src/components/ui";
import CoursePage from "../src/app/cursos/[slug]/page";
import { getCourse, getRepository } from "../src/data/repository";
import { demoRepository } from "../src/data/demo/repository";
vi.mock("../src/data/repository", () => ({
  getCourse: vi.fn(),
  getRepository: vi.fn(),
}));

// Synthetic contract specimen only. No rows from the audited database.
const incomplete = courseSchema.parse({
  ...courses[0],
  id: "synthetic-pending",
  title: "Propuesta pendiente",
  demo: false,
  versionId: "synthetic-version",
  versionNumber: 1,
  category: null,
  categoryLabel: null,
  mode: null,
  hours: null,
  weeks: null,
  price: null,
  currency: null,
  difficulty: null,
  description: null,
  modules: [],
  objectives: null,
  audience: [],
  outcomes: [],
  skills: [],
  project: null,
  evaluation: null,
  prerequisites: null,
  certificate: null,
  cover: null,
  coverAlt: null,
  video: null,
  institution: {
    ...courses[0].institution,
    demo: false,
    assessment: null,
    logo: null,
    description: null,
    specialty: null,
    foundedYear: null,
    city: null,
    province: null,
  },
});
describe("información incompleta", () => {
  it("renders the complete course with missing content and no certificate promise", async () => {
    vi.mocked(getCourse).mockResolvedValue(incomplete);
    vi.mocked(getRepository).mockResolvedValue({
      ...demoRepository,
      related: async () => [],
    });
    const html = renderToStaticMarkup(
      await CoursePage({ params: Promise.resolve({ slug: incomplete.slug }) }),
    );
    for (const message of [
      "Certificación pendiente de confirmar",
      "Objetivos pendientes",
      "Destinatarios pendientes",
      "Programa pendiente",
      "Requisitos pendientes",
      "Lugar de cursada por confirmar",
    ])
      expect(html).toContain(message);
    expect(html).not.toContain("Certificado emitido por la Cámara");
    expect(html).not.toContain("0 módulos");
    expect(html).not.toContain("null semanas");
  });
  it("renders explicit absences without logos, prices or awarded seals", () => {
    const html = renderToStaticMarkup(<CourseCard course={incomplete} />);
    expect(html).toContain("Consultar precio");
    expect(html).toContain("Modalidad por confirmar");
    expect(html).toContain("Carga horaria por confirmar");
    expect(html).toContain("Sin evaluación institucional publicada");
    expect(html).not.toContain("ARS");
    expect(
      renderToStaticMarkup(
        <InstitutionLogo institution={incomplete.institution} />,
      ),
    ).toContain("Logo no disponible");
    expect(
      renderToStaticMarkup(
        <Credential institution={incomplete.institution} full />,
      ),
    ).not.toContain("Base formativa");
  });
  it("does not convert unknown values into zero, modality or similarity", () => {
    expect(searchCourses([incomplete], { duration: "short" })).toEqual([]);
    expect(searchCourses([incomplete], { level: "BASE" })).toEqual([]);
    expect(searchCourses([incomplete], { mode: "ONLINE" })).toEqual([]);
    expect(
      relatedCourses(incomplete, [
        { ...incomplete, id: "other", title: "Astronomía" },
      ]),
    ).toEqual([]);
    expect(durationText(incomplete)).not.toContain("0 horas");
    expect(modeName(null)).toBe("Modalidad por confirmar");
    expect(money(null, null)).toBe("Consultar precio");
  });
  it("rejects invalid hours and prices without currency", () => {
    expect(courseSchema.safeParse({ ...incomplete, hours: -120 }).success).toBe(
      false,
    );
    expect(courseSchema.safeParse({ ...incomplete, price: 10 }).success).toBe(
      false,
    );
  });
});
