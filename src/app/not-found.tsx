import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container page empty-state">
      <span className="eyebrow">404 · PÁGINA NO ENCONTRADA</span>
      <h1>Ese camino no está disponible.</h1>
      <p>
        El enlace no existe. Podés seguir explorando propuestas en el catálogo.
      </p>
      <Link className="button" href="/cursos">
        Explorar cursos
      </Link>
    </div>
  );
}
