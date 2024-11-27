FROM imbios/bun-node:1.1.37-22.11.0-debian
WORKDIR /usr/local

ENV NODE_ENV=production
COPY package.json .
COPY turbo.json .
COPY ./apps/backend ./apps/backend
COPY ./packages ./packages

RUN bun i
RUN cd apps/backend && bun run prisma:generate
RUN bun run build

CMD ["bun", "run", "start"]