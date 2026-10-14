import type { CourseRating } from "@/domain/ratings";

// Entirely fictional samples. No audited database rows or student identities.
const comments = [
  "Los ejercicios me ayudaron a llevar los conceptos a la práctica.",
  "La explicación fue clara. Me habría gustado dedicar más tiempo al proyecto final.",
  "El recorrido me resultó ordenado y pude seguir cada actividad.",
  "Una buena introducción; sumaría más ejemplos para practicar por mi cuenta.",
  "Me sirvió para organizar lo aprendido y aplicarlo en un primer proyecto.",
];
const scores = [
  [5, 4, 5, 4, 5],
  [4, 4, 5, 3, 5],
  [5, 5, 4, 4, 5],
  [4, 3, 4, 4, 5],
];

export function demoRating(
  courseId: string,
  index: number,
): CourseRating | null {
  // Keep one visible example of the unrated state in the demo catalog.
  if (index === 15) return null;
  const values = scores[index % scores.length];
  return {
    average: values.reduce((sum, score) => sum + score, 0) / values.length,
    count: values.length,
    distribution: [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: values.filter((score) => score === stars).length,
    })),
    reviews: values.map((score, i) => ({
      id: `demo-${courseId}-${i + 1}`,
      score,
      authorLabel: `Participante de ejemplo ${i + 1}`,
      comment: comments[i],
    })),
    demo: true,
  };
}
