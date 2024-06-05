#!/bin/sh


pnpx prisma migrate dev --name init
node dist/main.js