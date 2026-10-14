import { z } from "zod";
import { ratingSchema } from "./ratings";

// Taxonomy of the fictitious catalog only. Real categories come from GraphQL.
export const demoCategories = [
  {
    slug: "tecnologia",
    name: "Tecnología",
    description:
      "Herramientas digitales para resolver desafíos de todos los días.",
  },
  {
    slug: "administracion",
    name: "Administración",
    description:
      "Habilidades para organizar, gestionar y hacer crecer tu trabajo.",
  },
  {
    slug: "comunicacion",
    name: "Comunicación",
    description: "Ideas y herramientas para conectar con tus audiencias.",
  },
  {
    slug: "oficios",
    name: "Oficios",
    description:
      "Aprendé haciendo, con conocimientos que se llevan a la práctica.",
  },
  {
    slug: "idiomas",
    name: "Idiomas",
    description: "Nuevas formas de comunicarte en tu entorno laboral.",
  },
  {
    slug: "gastronomia",
    name: "Gastronomía",
    description:
      "Técnicas y práctica para desarrollar tu talento en la cocina.",
  },
] as const;
export const levelNames = {
  BASE: "Base formativa",
  SOLIDITY: "Solidez formativa",
  DISTINCTION: "Distinción formativa",
  REFERENCE: "Referente formativo",
  PENDING: "En evaluación",
} as const;
export const modeNames = {
  ONLINE: "Online",
  HYBRID: "Híbrida",
  ONSITE: "Presencial",
} as const;
export const stageNames = {
  INITIAL: "Evaluación inicial",
  EARLY: "Primeras experiencias",
  ESTABLISHED: "Evidencia suficiente",
  PENDING: "Revisión pendiente",
} as const;
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const publicUrl = z
  .string()
  .url()
  .refine(
    (value) => new URL(value).protocol === "https:",
    "La URL pública debe ser HTTPS",
  );
const asset = z.string().regex(/^\/assets\/[a-z0-9-]+\.(png|webp|jpg)$/);
export const categorySchema = z.object({
  id: z.string(),
  slug,
  name: z.string(),
  description: z.string().nullable(),
});
export type Category = z.infer<typeof categorySchema>;
export const moduleSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  order: z.number().int(),
});
const socialHosts = {
  Instagram: "instagram.com",
  Facebook: "facebook.com",
  LinkedIn: "linkedin.com",
  YouTube: "youtube.com",
};
const socialSchema = z
  .object({
    network: z.enum(["Instagram", "Facebook", "LinkedIn", "YouTube"]),
    url: publicUrl,
  })
  .refine(({ network, url }) => {
    const host = new URL(url).hostname,
      allowed = socialHosts[network];
    return host === allowed || host.endsWith(`.${allowed}`);
  }, "La URL no corresponde al dominio de la red social");
export const institutionSchema = z.object({
  id: z.string(),
  slug,
  name: z.string(),
  description: z.string().nullable(),
  specialty: z.string().nullable(),
  city: z.string().nullable(),
  province: z.string().nullable(),
  foundedYear: z.number().int().nullable(),
  memberSince: z.string().nullable(),
  logo: asset.nullable(),
  assessment: z
    .object({
      level: z.enum([
        "BASE",
        "SOLIDITY",
        "DISTINCTION",
        "REFERENCE",
        "PENDING",
      ]),
      stage: z.enum(["INITIAL", "EARLY", "ESTABLISHED", "PENDING"]),
      rationale: z.string(),
      reviewedAt: z.string().nullable(),
      methodologyVersion: z.string(),
    })
    .nullable(),
  socials: z.array(socialSchema),
  website: publicUrl.nullable(),
  demo: z.boolean(),
});
export const courseSchema = z
  .object({
    id: z.string(),
    versionId: z.string().nullable(),
    versionNumber: z.number().int().nullable(),
    slug,
    title: z.string(),
    category: slug.nullable(),
    categoryLabel: z.string().nullable(),
    institution: institutionSchema,
    status: z.enum(["PUBLISHED", "UNAVAILABLE"]),
    mode: z.enum(["ONLINE", "HYBRID", "ONSITE"]).nullable(),
    location: z.string().nullable(),
    hours: z.number().positive().nullable(),
    weeks: z.number().positive().nullable(),
    price: z.number().nonnegative().nullable(),
    currency: z
      .string()
      .regex(/^[A-Z]{3}$/)
      .nullable(),
    difficulty: z.string().nullable(),
    description: z.string().nullable(),
    modules: z.array(moduleSchema),
    objectives: z.string().nullable(),
    audience: z.array(z.string()),
    outcomes: z.array(z.string()),
    skills: z.array(z.string()),
    project: z.string().nullable(),
    evaluation: z.string().nullable(),
    prerequisites: z.string().nullable(),
    certificate: z
      .object({
        label: z.string(),
        issuerName: z.string(),
        chamberIssued: z.boolean(),
      })
      .nullable(),
    cover: asset.nullable(),
    coverAlt: z.string().nullable(),
    video: z
      .object({
        youtubeId: z.string().regex(/^[\w-]{11}$/),
        title: z.string(),
        author: z.string(),
        demo: z.boolean(),
      })
      .nullable(),
    updatedAt: z.string().nullable(),
    rating: ratingSchema.nullable().default(null),
    demo: z.boolean(),
  })
  .refine(
    (c) => c.price === null || c.currency !== null,
    "Un precio requiere moneda confirmada",
  )
  .refine(
    (c) => c.rating === null || c.rating.demo === c.demo,
    "Las valoraciones de ejemplo sólo pueden pertenecer a cursos de ejemplo",
  );
export type Institution = z.infer<typeof institutionSchema>;
export type Course = z.infer<typeof courseSchema>;
export type SearchFilters = {
  q?: string;
  category?: string;
  mode?: string;
  province?: string;
  level?: string;
  duration?: string;
  sort?: string;
  page?: number;
};
export const catalogResultSchema = z
  .object({
    items: z.array(courseSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    provinces: z.array(z.string()),
    categories: z.array(categorySchema),
  })
  .refine(
    (result) =>
      result.items.every((c) => c.status === "PUBLISHED") &&
      new Set(result.items.map((c) => c.id)).size === result.items.length,
    "El catálogo sólo debe contener cursos publicados y únicos",
  );
export type CatalogResult = z.infer<typeof catalogResultSchema>;
export interface CatalogRepository {
  searchSuggestions(): Promise<SearchSuggestion[]>;
  categories(): Promise<Category[]>;
  catalog(filters?: SearchFilters): Promise<CatalogResult>;
  course(slug: string): Promise<Course | null>;
  institutions(): Promise<Institution[]>;
  institution(slug: string): Promise<Institution | null>;
  institutionCourses(id: string): Promise<Course[]>;
  related(course: Course): Promise<Course[]>;
  publishedSlugs(): Promise<{ courses: string[]; institutions: string[] }>;
}
export const searchSuggestionSchema = z.object({
  label: z.string().min(1).max(160),
  kind: z.enum(["COURSE", "CATEGORY", "INSTITUTION"]),
});
export type SearchSuggestion = z.infer<typeof searchSuggestionSchema>;
export const categoryName = (course: Pick<Course, "categoryLabel">) =>
  course.categoryLabel ?? "Categoría por confirmar";
export const modeName = (mode: Course["mode"]) =>
  mode ? modeNames[mode] : "Modalidad por confirmar";
export const durationText = (course: Pick<Course, "hours" | "weeks">) =>
  [
    course.hours === null
      ? "Carga horaria por confirmar"
      : `${course.hours} horas`,
    course.weeks === null ? null : `${course.weeks} semanas`,
  ]
    .filter(Boolean)
    .join(" · ");
export const institutionLocation = (institution: Institution) =>
  [institution.city, institution.province].filter(Boolean).join(", ") ||
  "Ubicación por confirmar";
export const money = (price: number | null, currency: string | null = "ARS") =>
  price === null || currency === null
    ? "Consultar precio"
    : new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(price);
