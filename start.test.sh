#!/bin/sh


pnpx prisma migrate dev --name init
pnpm run test:e2e
pnpm run test