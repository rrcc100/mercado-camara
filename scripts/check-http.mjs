import assert from "node:assert/strict";
import fixtures from "../src/data/demo/fixtures.json" with { type: "json" };
const origin = process.env.CHECK_ORIGIN ?? "http://127.0.0.1:3000";
const paths = [
  "/",
  "/cursos",
  "/cursos?q=excel",
  "/cursos?page=2",
  "/cursos?q=sincoincidenciaxyz",
  "/instituciones",
  "/el-sello",
  ...[
    "tecnologia",
    "administracion",
    "comunicacion",
    "oficios",
    "idiomas",
    "gastronomia",
  ].map((s) => `/categorias/${s}`),
  ...fixtures.courses.map((c) => `/cursos/${c.slug}`),
  ...fixtures.institutions.map((i) => `/instituciones/${i.slug}`),
];
let checked = 0;
for (const path of paths) {
  const response = await fetch(`${origin}${path}`),
    html = await response.text();
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/, path);
  assert.match(html, /name="robots" content="noindex, follow"/, path);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical, `Falta canonical: ${path}`);
  assert.equal(
    new URL(canonical).origin,
    process.env.CHECK_CANONICAL_ORIGIN ?? "http://localhost:3000",
    path,
  );
  assert.equal(new URL(canonical).pathname, path.split("?")[0], path);
  assert.equal(new URL(canonical).search, "", path);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, path);
  assert.ok(
    !html.includes('type="application/ld+json"'),
    `Demo JSON-LD: ${path}`,
  );
  assert.ok(!html.includes("<iframe"), `Carga anticipada de video: ${path}`);
  assert.ok(!html.includes('href="#/'), `Ruta antigua: ${path}`);
  assert.ok(
    !html.includes("No pudimos cargar la información"),
    `Error UI: ${path}`,
  );
  if (path === "/cursos?q=excel")
    assert.equal((html.match(/class="course-card"/g) ?? []).length, 2);
  if (path === "/cursos?page=2")
    assert.equal((html.match(/class="course-card"/g) ?? []).length, 7);
  if (path === "/cursos?q=sincoincidenciaxyz")
    assert.match(html, /Todavía no encontramos ese curso/);
  checked++;
}
for (const path of [
  "/cursos/no-existe",
  "/instituciones/no-existe",
  "/categorias/no-existe",
  "/no-existe",
]) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 404, path);
  assert.match(await response.text(), /Ese camino no está disponible/);
  checked++;
}
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
assert.ok(!sitemap.includes("<loc>"), "La demo no publica URLs en sitemap");
const robots = await (await fetch(`${origin}/robots.txt`)).text();
assert.match(robots, /Allow: \//);
assert.ok(!robots.includes("Sitemap:"));
const asset = await fetch(
  `${origin}/_next/image?url=%2Fassets%2Fdigital-learning.webp&w=640&q=75`,
);
assert.equal(asset.status, 200);
assert.match(asset.headers.get("content-type") ?? "", /^image\//);
console.log(
  `OK: ${checked} rutas HTTP, noindex, canonical, SSR, 404, paginación, vacíos, robots, sitemap e imagen optimizada.`,
);
