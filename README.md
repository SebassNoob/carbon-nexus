# carbon-nexus

testing. this is a test

fullstack boilerplate with turborepo integration

- nextjs
- nestjs (+ prisma)
- devtools and stuff (biome, turborepo)
- login/logout

## Setup
1. clone this repo, install bun and turborepo (`bun i -g turbo`)
2. `bun i`
3. `cd apps/backend && bun run prisma:generate`
4. in root directory, start with `bun run start`

## Known Issues
'Failed to find server action' workaround: https://github.com/vercel/next.js/discussions/58431#issuecomment-2339327871
