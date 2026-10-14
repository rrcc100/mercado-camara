import type { Metadata } from "next";
import "@fontsource/open-sans/latin-400.css";
import "@fontsource/open-sans/latin-600.css";
import "@fontsource/open-sans/latin-700.css";
import "@fontsource/open-sans/latin-800.css";
import "./globals.css";
import "./marketplace.css";
import { Footer, Header } from "@/components/ui";
import { config } from "@/lib/config";
import { getRepository } from "@/data/repository";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(config().origin),
    title: { default: "Forma · Cursos de la Cámara", template: "%s | Forma" },
    description: "Encontrá formación para tu próximo paso.",
    robots: { index: config().indexable, follow: true },
  };
}
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Suggestions are optional. Keep the normal search and route error boundary
  // usable if this auxiliary query fails; never substitute demo content.
  const suggestions = await (
    await getRepository()
  )
    .searchSuggestions()
    .catch(() => []);
  return (
    <html lang="es-AR" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <Header suggestions={suggestions} />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
