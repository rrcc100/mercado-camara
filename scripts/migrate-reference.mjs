// One-time, reproducible import. Runtime code never imports the prototype.
import { mkdir, writeFile, copyFile } from "node:fs/promises";
import sharp from "sharp";
import {
  institutions as sourceInstitutions,
  courses as sourceCourses,
} from "../reference/forma-v10/dist/model.js";
await mkdir("public/assets", { recursive: true });
await mkdir("src/data/demo", { recursive: true });
await copyFile(
  "reference/forma-v10/dist/assets/camara-argentina-logo.png",
  "public/assets/camara-argentina-logo.png",
);
for (const name of [
  "digital-learning",
  "technical-workshop",
  "course-category-atlas",
]) {
  await sharp(`reference/forma-v10/dist/assets/${name}.png`)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(`public/assets/${name}.webp`);
}
const atlas = "reference/forma-v10/dist/assets/institute-logo-atlas.png";
const { width, height } = await sharp(atlas).metadata();
for (const [index, institution] of sourceInstitutions.entries()) {
  await sharp(atlas)
    .extract({
      left: (index % 3) * (width / 3),
      top: Math.floor(index / 3) * (height / 2),
      width: width / 3,
      height: height / 2,
    })
    .resize(192, 192)
    .webp({ quality: 88 })
    .toFile(`public/assets/institute-${institution.id}.webp`);
}
// Explicit illustrative assignments. Do not migrate the prototype's scoring formula.
const levels = [
  "REFERENCE",
  "DISTINCTION",
  "DISTINCTION",
  "SOLIDITY",
  "PENDING",
  "BASE",
];
const stages = [
  "ESTABLISHED",
  "EARLY",
  "EARLY",
  "ESTABLISHED",
  "PENDING",
  "EARLY",
];
const institutions = sourceInstitutions.map((i, index) => ({
  id: i.id,
  slug: i.id,
  name: i.name,
  description: i.description,
  specialty: i.specialty,
  city: i.city,
  province: i.province,
  foundedYear: i.since,
  memberSince: null,
  logo: `/assets/institute-${i.id}.webp`,
  socials: [],
  website: null,
  demo: true,
  assessment: {
    level: levels[index],
    stage: stages[index],
    reviewedAt: null,
    methodologyVersion: "demo-progresiva-borrador",
    rationale:
      index === 4
        ? "La evidencia aún está en revisión. No implica una valoración negativa."
        : "Asignación ilustrativa para mostrar la escala. No representa una evaluación real ni una política aprobada por la Cámara.",
  },
}));
const categories = {
  Tecnología: "tecnologia",
  Administración: "administracion",
  Comunicación: "comunicacion",
  Oficios: "oficios",
  Idiomas: "idiomas",
  Gastronomía: "gastronomia",
};
const modes = { Online: "ONLINE", Híbrida: "HYBRID", Presencial: "ONSITE" };
const courses = sourceCourses.map((c) => ({
  id: c.id,
  versionId: null,
  versionNumber: null,
  slug: c.id,
  title: c.title,
  category: categories[c.category],
  categoryLabel: c.category,
  institution: institutions.find((i) => i.id === c.institution),
  status: "PUBLISHED",
  mode: modes[c.mode],
  location: null,
  hours: c.hours,
  weeks: c.weeks,
  price: c.price,
  currency: "ARS",
  difficulty: c.difficulty,
  description: c.description,
  modules: c.modules.map((title, index) => ({
    id: `demo-${c.id}-${index}`,
    title,
    content: null,
    order: index + 1,
  })),
  objectives: c.objectives,
  audience: c.audience,
  outcomes: c.outcomes,
  skills: c.skills,
  project: c.project,
  evaluation: c.evaluation,
  prerequisites: c.prerequisites,
  certificate: {
    label: c.certificate,
    issuerName: "Cámara Argentina",
    chamberIssued: true,
  },
  cover: c.cover.replace("./assets/", "/assets/").replace(".png", ".webp"),
  coverAlt: c.coverAlt,
  video: c.video
    ? {
        youtubeId: c.video.id,
        title: c.video.title,
        author: c.video.author,
        demo: true,
      }
    : null,
  updatedAt: "2026-09-01",
  demo: true,
}));
await writeFile(
  "src/data/demo/fixtures.json",
  JSON.stringify({ institutions, courses }, null, 2) + "\n",
);
console.log(
  `Imported ${courses.length} courses, ${institutions.length} institutions. No reviews or legacy scores imported.`,
);
