# Exploración del frontend como marketplace

Rama: `explore/marketplace-frontend`, creada desde `localhost` en `c8bc4ec`. Primera propuesta para revisar, conservando la identidad visual y las decisiones de [contexto](CONTEXTO-PROYECTO.md).

## Dirección visual

Referencia de navegación: [Mercado Libre Argentina](https://www.mercadolibre.com.ar/), portada y resultados revisados en navegador. Se toman la importancia del buscador, los accesos al catálogo, los bloques de descubrimiento, los filtros laterales y la jerarquía de cada propuesta. Se conservan el logo oficial, Open Sans, turquesa y azul petróleo de Cámara.

- Cabecera compacta con búsqueda global; conserva el texto al navegar entre resultados.
- Portada con banner, accesos a online y cursos cortos, categorías dinámicas, propuestas del catálogo e instituciones.
- Tarjetas con imágenes ilustrativas, institución, modalidad, duración, sello y precio claramente marcado como ejemplo cuando corresponde.
- Catálogo con filtros desplegables en móvil, etiquetas para retirar un filtro, orden independiente y alternancia entre tarjetas y lista.
- Ficha con panel lateral en escritorio y resumen de precio/disponibilidad antes del programa en móvil.

Las ilustraciones por categoría reutilizan el atlas que ya existía, mediante recortes de presentación SVG. Sólo se utilizan para cursos `demo`; un registro real conserva su portada o un icono de categoría si no tiene imagen. No se agregaron ofertas, ventas, reseñas, certificados o precios a registros reales.

## Recorridos para evaluar

- `/`: descubrimiento y accesos rápidos.
- `/cursos`: tarjetas; `/cursos?view=list`: lista.
- `/cursos?q=Excel&mode=ONLINE&province=CABA&view=list`: filtros combinados.
- `/cursos?q=Excel&mode=ONLINE&sort=price`: orden por precio.
- `/categorias/tecnologia?view=list`: categoría fija con filtros y vistas.
- `/cursos/excel-horizonte`: ficha de demostración.

Los filtros, el orden y la vista se conservan en la URL. Cambiar filtros u orden reinicia la página; cambiar de vista conserva la página. `view` es una preferencia de presentación local y no se envía a GraphQL. Las páginas parametrizadas mantienen canonical limpio y noindex. El ranking sigue basado en afinidad y los relacionados siguen limitados a tres, sin comparador.

## Ejecución y comparación

Los comandos Docker existentes siguen vigentes:

```powershell
docker compose up -d --build --wait
```

La imagen debe reconstruirse después de cambiar de rama. Para desarrollo con recarga, consultar [DOCKER.md](DOCKER.md). Sin Docker, `pnpm dev --port 3020` permite revisar la propuesta en `http://127.0.0.1:3020`.

Comparar los cambios con `git diff localhost...explore/marketplace-frontend`. El archivo `src/app/marketplace.css` concentra los cambios de estilo de esta exploración y se importa después de los estilos base. Cuando se elija la dirección definitiva, conviene consolidar los estilos que reemplace.

## Límites conservados

Demo explícita, consultas deshabilitadas, sin cobros, login, favoritos persistidos ni publicación real. Sin cambios en MySQL ni en la auditoría. Se mantiene el contrato propuesto para backend propio C# .NET 9, GraphQL y MySQL; no se agregan dependencias ni un backend alternativo.

Pendiente de decisión visual: elegir tarjetas o lista como vista inicial, acordar la selección editorial de portada y definir las imágenes reales que aportará cada institución. Los bloques de inicio usan el orden del catálogo, sin afirmar popularidad, personalización o patrocinio.
