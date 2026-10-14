import { z } from "zod";

export const reviewSchema = z.object({
  id: z.string(),
  score: z.number().int().min(1).max(5),
  // Public display label only; never a student identifier or contact detail.
  authorLabel: z.string(),
  comment: z.string(),
});

export const ratingSchema = z
  .object({
    average: z.number().min(1).max(5),
    count: z.number().int().positive(),
    distribution: z
      .array(
        z.object({
          stars: z.number().int().min(1).max(5),
          count: z.number().int().nonnegative(),
        }),
      )
      .length(5),
    reviews: reviewSchema.array().max(5),
    demo: z.boolean(),
  })
  .refine(({ average, count, distribution, reviews }) => {
    const total = distribution.reduce((sum, row) => sum + row.count, 0);
    const weighted = distribution.reduce(
      (sum, row) => sum + row.stars * row.count,
      0,
    );
    return (
      new Set(distribution.map((row) => row.stars)).size === 5 &&
      total === count &&
      Math.abs(average - Math.round((weighted / count) * 10) / 10) < 0.001 &&
      reviews.length <= count &&
      new Set(reviews.map((review) => review.id)).size === reviews.length &&
      distribution.every(
        (row) =>
          reviews.filter((review) => review.score === row.stars).length <=
          row.count,
      )
    );
  }, "El promedio, la distribución y las opiniones deben ser consistentes");

export type CourseRating = z.infer<typeof ratingSchema>;
export const ratingNumber = (score: number) =>
  score.toLocaleString("es-AR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
