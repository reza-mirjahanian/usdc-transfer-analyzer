
## USDC Transfer Analyzer
Develop a TypeScript NodeJs backend service that interacts with the Avalanche blockchain to fetch, aggregate, and analyze USDC (a stablecoin) real-time transfer data. The service should specifically extract information about USDC transactions and provide insights or summaries based on this data


## Are there reorgs on Avalanche®?
https://support.avax.network/en/articles/7329750-are-there-reorgs-on-avalanche

![alt text](help/screenshot.png)


## Running the app with Docker

```bash
# development
# http://localhost:3008/docs
$ docker compose -f docker-compose.dev.yml up

# or run with 
pnpm run docker:dev

```



## Running the app locally(Node.js)

#### Setup

```bash
$ pnpm install
```
###### Database

```bash
# MySQL URL example in .env file
$ DATABASE_URL=mysql://root:12345678@localhost:3306/usdc-transfer-dev

# Prisma init
$ pnpx prisma generate

# Migrate the database
$ pnpx prisma migrate dev --name init
```

#### Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

#### Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Info:
- 📌 nestjs.com
- 📌 PostgreSQL

#### Swagger UI (for Docker, port is 3008)
http://localhost:3001/docs

#### Done:
- ✅ Docker
- ✅ Husky for git commits.


#### Todo:
- 💡 Document the project, including setup instructions, API usage, and a brief overview of the architecture and technologies used.
- 💡 Write unit tests for the data aggregation and API functionalities.
- 💡 Add Swagger UI.
- 💡 Caching with Redis.
- 💡 Include API versioning.
- 💡 rate-limiting. 
- 💡 Use Kafka for queue. 
