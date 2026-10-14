import { Star } from "lucide-react";
import { type CourseRating, ratingNumber } from "@/domain/ratings";

export function RatingStars({ value }: { value: number }) {
  return (
    <span className="rating-stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <span className="rating-star" key={star}>
          <Star size={15} />
          <span
            style={{
              width: `${Math.max(0, Math.min(1, value - star + 1)) * 100}%`,
            }}
          >
            <Star size={15} fill="currentColor" />
          </span>
        </span>
      ))}
    </span>
  );
}

export function CourseRatingSummary({
  rating,
  href,
}: {
  rating: CourseRating | null;
  href?: string;
}) {
  if (!rating) return <p className="rating-empty">Sin valoraciones todavía</p>;
  const label = `${ratingNumber(rating.average)} de 5 · ${rating.count} ${rating.count === 1 ? "valoración" : "valoraciones"}${rating.demo ? " de ejemplo" : ""}`;
  const content = (
    <>
      <strong>{ratingNumber(rating.average)}</strong>
      <RatingStars value={rating.average} />
      <span className="rating-count">({rating.count})</span>
      {rating.demo && <span className="demo-rating-label">Ejemplo</span>}
    </>
  );
  return href ? (
    <a className="course-rating" href={href} aria-label={label}>
      {content}
    </a>
  ) : (
    <span className="course-rating" role="img" aria-label={label}>
      {content}
    </span>
  );
}

export function CourseReviews({ rating }: { rating: CourseRating | null }) {
  return (
    <section className="detail-section course-reviews" id="opiniones">
      <div className="section-heading">
        <h2>Valoraciones del curso</h2>
        {rating?.demo && (
          <span className="demo-rating-label">Datos de ejemplo</span>
        )}
      </div>
      {!rating ? (
        <p className="subtle-box">Sin valoraciones todavía.</p>
      ) : (
        <>
          <p className="review-disclaimer">
            {rating.demo
              ? "Puntajes y comentarios ficticios para mostrar cómo funcionará esta sección. No corresponden a estudiantes reales."
              : "Opiniones publicadas sobre la experiencia de cursada."}{" "}
            El sello institucional se presenta por separado.
          </p>
          <div className="rating-overview">
            <div className="rating-total">
              <strong>
                {ratingNumber(rating.average)}
                <small> / 5</small>
              </strong>
              <RatingStars value={rating.average} />
              <span>
                {rating.count}{" "}
                {rating.count === 1 ? "valoración" : "valoraciones"}
                {rating.demo && " de ejemplo"}
              </span>
            </div>
            <ul
              className="rating-distribution"
              aria-label="Distribución de puntuaciones"
            >
              {[...rating.distribution]
                .sort((a, b) => b.stars - a.stars)
                .map((row) => (
                  <li
                    key={row.stars}
                    aria-label={`${row.stars} estrellas: ${row.count} valoraciones`}
                  >
                    <span aria-hidden="true">
                      {row.stars} <Star size={12} />
                    </span>
                    <span className="rating-track" aria-hidden="true">
                      <span
                        style={{
                          width: `${(row.count / rating.count) * 100}%`,
                        }}
                      />
                    </span>
                    <span aria-hidden="true">{row.count}</span>
                  </li>
                ))}
            </ul>
          </div>
          {rating.reviews.length > 0 ? (
            <div className="review-list">
              {rating.reviews.map((review) => (
                <article className="review" key={review.id}>
                  <div className="review-heading">
                    <strong>{review.authorLabel}</strong>
                    <span
                      role="img"
                      aria-label={`${review.score} de 5 estrellas`}
                    >
                      <RatingStars value={review.score} />
                    </span>
                  </div>
                  <p>{review.comment}</p>
                  {rating.demo && (
                    <small>Opinión ficticia · ejemplo de diseño</small>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p>No hay comentarios públicos disponibles.</p>
          )}
          {rating.reviews.length > 0 &&
            rating.reviews.length < rating.count && (
              <p className="muted">
                Se muestran {rating.reviews.length} comentarios de{" "}
                {rating.count} valoraciones.
              </p>
            )}
        </>
      )}
    </section>
  );
}
