# Forma · Mercado Cámara

Primera implementación del frontend del portal de formación. Next.js 16.3.8, React 19.3 y TypeScript. El backend previsto es propio del portal, en C# / .NET 9, GraphQL y MySQL. **Todavía no existe una API conectada.**

## Auditoría real de la Cámara

Acceso de lectura verificado a tres bases el 07/10/2026. Las herramientas, configuración mínima local ignorada y documentación ya están en este proyecto. No necesitan ejecutar ni leer permanentemente el Observatorio. Empezar por [resultados y fuentes](docs/camara/README.md) y [comandos de auditoría](docs/camara/OPERACION.md). La web sigue en demo; no se publicaron datos auditados.

## Ejecutar

Con Docker Desktop en modo Linux, desde esta carpeta:

```powershell
docker compose up -d --build --wait
```

Abrir [http://localhost:3010](http://localhost:3010). Para detener: `docker compose down`. Ver [Docker: desarrollo con recarga, configuración y auditoría opcional](docs/DOCKER.md).

### Sin Docker

Requiere Node.js 22 o superior (validado con 24.19) y pnpm 11.19.0.

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Abrir http://127.0.0.1:3000. El servidor se limita a la interfaz local. No hace falta crear `.env.local` para explorar la demo; `.env.example` documenta la configuración. En este equipo el runtime ya está disponible en PATH.

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
# Con el servidor de producción iniciado en otra terminal:
pnpm test:http
```

`pnpm start` requiere un build previo. Reiniciar el servidor después de recompilar. Si se bloquean sockets o temporales por un sandbox de Windows, ejecutar los comandos en una terminal local con acceso a loopback; no deshabilitar protecciones del sistema.

## Recorridos

- `/`: portada, buscador, áreas y propuestas.
- `/cursos?q=excel`: búsqueda SSR con filtros combinables y paginación.
- `/categorias/tecnologia`: landing de categoría.
- `/cursos/excel-horizonte`: ficha con resultados, objetivos, destinatarios, requisitos, programa, proyecto, evaluación, certificado y relacionados.
- `/instituciones` y `/instituciones/horizonte`: directorio y perfil.
- `/el-sello`: explicación de la evaluación progresiva, marcada noindex mientras es propuesta.

Las URLs pueden compartirse y recargarse. Los identificadores del prototipo se mantienen como slugs estables. No hay comparador.

## Capas

```text
src/app/                 Rutas App Router, metadata, robots y sitemap
src/components/          Componentes compartidos; video como isla interactiva
src/domain/              Tipos, validación y reglas de búsqueda de la demo
src/data/demo/           Fixtures ficticios y repositorio de demostración
src/data/graphql/        Adaptador de lectura contra el contrato propuesto
src/data/repository.ts   Selección de fuente sólo en servidor
src/lib/                 Configuración y SEO
docs/                    Contrato, decisiones y aceptación
reference/forma-v10/     Copia intacta del prototipo, fuera del runtime
scripts/                 Auditoría local MySQL, migración demo y comprobación HTTP
```

No se importan scripts del prototipo en la aplicación. `scripts/migrate-reference.mjs` es una herramienta puntual; conserva el contenido editorial y optimiza los recursos, pero no migra la fórmula antigua ni las reseñas ficticias. Su ejecución requiere `sharp` (incluido en las dependencias transitivas de Next con el layout hoisted actual). Los archivos ya están generados y no hace falta ejecutarla para instalar o compilar.

## Estado y límites

Los 16 cursos, 6 instituciones, precios, logos de socios y niveles son ejemplos. No hay valoraciones verificadas, login, pagos, matriculación, edición de socios ni envío de leads. Las consultas están deshabilitadas de forma explícita. El video público de LearnFree es un ejemplo ajeno a las instituciones; sólo carga con una acción del visitante.

Los sellos son datos tipados de cada institución, no un cálculo del frontend. Las etapas y niveles ilustrativos no constituyen aprobación de una política de evaluación. La búsqueda no usa niveles como ponderación; se retiró el orden por puntuación institucional porque las etapas no son comparables. Se puede filtrar por nivel, y ordenar por relevancia, precio o duración.

Las fuentes Open Sans se sirven localmente. Se preservó el logo oficial de la Cámara sin alteraciones; no se identificó una licencia abierta, conservar la autorización institucional de uso. Fotos y logos ficticios proceden de la referencia. Ver [recursos y decisiones](docs/ARQUITECTURA.md).

## Continuar el desarrollo

1. [Arquitectura, SEO y operación](docs/ARQUITECTURA.md).
2. [Integración C# / GraphQL / MySQL](docs/BACKEND-GRAPHQL.md) y [SDL propuesto](docs/contrato.graphql).
3. [Evaluación progresiva y autogestión](docs/PRODUCTO-Y-AUTOGESTION.md).
4. [Verificación y pendientes](docs/VALIDACION.md).
5. [Contexto acordado](docs/CONTEXTO-PROYECTO.md).

No hay alojamiento elegido ni publicación de esta implementación. No se modificó el Observatorio ni el Site de referencia.
