FROM oven/bun:1.1.37
WORKDIR /usr/local

ENV NODE_ENV=production
COPY package.json .
COPY turbo.json .
COPY ./apps/frontend ./apps/frontend
COPY ./packages ./packages

RUN bun i
RUN bun run build

CMD ["bun", "run", "start"]