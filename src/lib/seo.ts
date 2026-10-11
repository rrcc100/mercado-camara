import type { Metadata } from "next";
import { config } from "./config";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  noindex = false,
): Metadata {
  const { origin, indexable } = config();
  return {
    title: { absolute: `${title} | Forma` },
    description,
    alternates: { canonical: `${origin}${path}` },
    robots: { index: indexable && !noindex, follow: true },
    openGraph: {
      title: `${title} | Forma`,
      description,
      url: `${origin}${path}`,
      siteName: "Forma · Cursos de la Cámara",
      locale: "es_AR",
      type: "website",
      images: [
        {
          url: `${origin}/assets/digital-learning.webp`,
          width: 1400,
          height: 933,
          alt: "Forma · Formación para tu próximo paso",
        },
      ],
    },
  };
}
export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${config().origin}${item.href}`,
    })),
  };
}
