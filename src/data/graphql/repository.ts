import { z } from "zod";
import {
  catalogResultSchema,
  categorySchema,
  courseSchema,
  institutionSchema,
  searchSuggestionSchema,
  type CatalogRepository,
} from "@/domain/catalog";
import { graphqlRequest } from "./client";
const institutionFields = `id slug name description specialty city province foundedYear memberSince logo demo website socials { network url } assessment { level stage rationale reviewedAt methodologyVersion }`;
const courseFields = `id versionId versionNumber slug title category categoryLabel status mode location hours weeks price currency difficulty description modules { id title content order } objectives audience outcomes skills project evaluation prerequisites certificate { label issuerName chamberIssued } cover coverAlt updatedAt demo rating { average count demo distribution { stars count } reviews { id score authorLabel comment } } video { youtubeId title author demo } institution { ${institutionFields} }`;
export function graphqlRepository(endpoint: string): CatalogRepository {
  const request = <T>(
    query: string,
    variables: Record<string, unknown>,
    schema: z.ZodType<T>,
  ) => graphqlRequest(endpoint, query, variables, schema);
  return {
    async searchSuggestions() {
      return (
        await request(
          `query SearchSuggestions { searchSuggestions(limit: 60) { label kind } }`,
          {},
          z.object({
            searchSuggestions: searchSuggestionSchema.array().max(60),
          }),
        )
      ).searchSuggestions;
    },
    async categories() {
      return (
        await request(
          `query Categories { categories { id slug name description } }`,
          {},
          z.object({ categories: categorySchema.array() }),
        )
      ).categories;
    },
    async catalog(filters = {}) {
      return (
        await request(
          `query Catalog($filter: CatalogFilterInput!) { catalog(filter: $filter) { items { ${courseFields} } total page pageSize provinces categories { id slug name description } } }`,
          { filter: filters },
          z.object({ catalog: catalogResultSchema }),
        )
      ).catalog;
    },
    async course(slug) {
      return (
        await request(
          `query Course($slug: String!) { course(slug: $slug) { ${courseFields} } }`,
          { slug },
          z.object({ course: courseSchema.nullable() }),
        )
      ).course;
    },
    async institutions() {
      return (
        await request(
          `query Institutions { institutions { ${institutionFields} } }`,
          {},
          z.object({ institutions: institutionSchema.array() }),
        )
      ).institutions;
    },
    async institution(slug) {
      return (
        await request(
          `query Institution($slug: String!) { institution(slug: $slug) { ${institutionFields} } }`,
          { slug },
          z.object({ institution: institutionSchema.nullable() }),
        )
      ).institution;
    },
    async institutionCourses(id) {
      return (
        await request(
          `query InstitutionCourses($id: ID!) { institutionCourses(id: $id) { ${courseFields} } }`,
          { id },
          z.object({ institutionCourses: courseSchema.array() }),
        )
      ).institutionCourses.filter((c) => c.status === "PUBLISHED");
    },
    async related(course) {
      return (
        await request(
          `query RelatedCourses($id: ID!) { relatedCourses(id: $id, limit: 3) { ${courseFields} } }`,
          { id: course.id },
          z.object({ relatedCourses: courseSchema.array() }),
        )
      ).relatedCourses
        .filter(
          (c, index, all) =>
            c.status === "PUBLISHED" &&
            c.id !== course.id &&
            all.findIndex((item) => item.id === c.id) === index,
        )
        .slice(0, 3);
    },
    async publishedSlugs() {
      return (
        await request(
          `query PublishedSlugs { publishedSlugs { courses institutions } }`,
          {},
          z.object({
            publishedSlugs: z.object({
              courses: z.string().array(),
              institutions: z.string().array(),
            }),
          }),
        )
      ).publishedSlugs;
    },
  };
}
