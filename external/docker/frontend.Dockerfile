FROM oven/bun:1.1.29
WORKDIR /usr/local

COPY package.json .
COPY turbo.json .
COPY ./apps/frontend ./apps/frontend
COPY ./packages ./packages

RUN bun i
RUN bun run build

CMD ["bun", "run", "start"]