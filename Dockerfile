# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install --global pnpm@11.19.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=mercado-camara-pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

# Optional local CLI. Secrets are mounted at runtime, never copied into an image.
FROM dependencies AS audit
COPY --chown=node:node scripts/camara ./scripts/camara
RUN mkdir -p .secrets reports/camara-audit && chown -R node:node .secrets reports
USER node
ENTRYPOINT ["node", "scripts/camara/audit.mjs"]
CMD ["connection"]

# Local development; source mounts are declared explicitly in compose.dev.yaml.
FROM dependencies AS development
COPY --chown=node:node next.config.ts tsconfig.json next-env.d.ts ./
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
RUN mkdir -p .next && chown node:node .next
ENV NODE_ENV=development HOSTNAME=0.0.0.0 PORT=3000
USER node
EXPOSE 3000
# Polling with Webpack is reliable for Windows Docker Desktop bind mounts.
CMD ["pnpm", "exec", "next", "dev", "--webpack", "--hostname", "0.0.0.0"]

FROM dependencies AS builder
COPY next.config.ts tsconfig.json next-env.d.ts ./
COPY src ./src
COPY public ./public
ENV BUILD_STANDALONE=true DATA_SOURCE=demo ALLOW_INDEXING=false CONTENT_APPROVED=false
RUN pnpm build

# Final image: only the traced Next.js runtime, static files and public assets.
FROM node:24-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
