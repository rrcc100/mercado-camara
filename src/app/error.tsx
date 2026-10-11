"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container page empty-state" role="alert">
      <h1>No pudimos cargar la información.</h1>
      <p>
        Ocurrió un problema al consultar el catálogo. Intentá nuevamente en unos
        instantes.
      </p>
      <button onClick={reset} className="button">
        Volver a intentar
      </button>
    </div>
  );
}
