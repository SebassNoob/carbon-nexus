FROM oven/bun:1.1.29
WORKDIR /usr/local

COPY . .
RUN bun i

RUN cd apps/backend && bun run prisma:generate
RUN bun run build

CMD ["bun", "run", "start"]