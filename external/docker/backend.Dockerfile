FROM oven/bun:1.1.29
WORKDIR /usr/local

COPY package.json .
COPY turbo.json .
COPY ./apps/backend ./apps/backend
COPY ./packages ./packages

RUN bun i
RUN cd apps/backend && bun run prisma:generate
RUN bun run build

CMD ["bun", "run", "start"]