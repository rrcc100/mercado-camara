# Base de la Cámara: auditoría e integración

Relevamiento real del **7 de octubre de 2026**, desde Mercado Cámara. La última corrida completa de agregados comenzó a las **18:15:36 UTC / 15:15:36 de Argentina** y terminó a las **18:15:56 UTC / 15:15:56 de Argentina**, sin errores. La evidencia contiene fechas por conexión. No son cifras copiadas de auditorías anteriores.

- [Resultados, relaciones y estados](RESULTADOS.md).
- [Inventario de fuentes](FUENTES.md).
- [Diccionario de columnas y claves](DICCIONARIO.md).
- [Matriz de integración y autogestión](MAPEO-PORTAL.md).
- [Cómo repetir la auditoría](OPERACION.md).
- [Evidencia agregada fechada](evidencia-2026-10-07.json).
- [Contrato GraphQL v0.2](../contrato.graphql) y [arquitectura de integración](../BACKEND-GRAPHQL.md).

El acceso MySQL es una herramienta local de desarrollo. **No conecta el frontend a MySQL, no es un backend productivo y no publica registros.** La aplicación sigue mostrando exclusivamente los 16 cursos y 6 instituciones ficticias. El backend futuro sigue siendo propio de Mercado Cámara: C# .NET 9, GraphQL y MySQL.

Los documentos son archivos del proyecto preparados para control de versiones; no se creó un commit. `.secrets/` y `reports/camara-audit/` están excluidos de Git. La evidencia versionable contiene solamente metadatos seleccionados y agregados, sin credenciales, nombres de instituciones, personas, documentos, contactos concretos o identificadores de alumnos.
