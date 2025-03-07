
## USDC Transfer Analyzer

For indexing on-chain data, here are some useful methods:

-   Using third-party APIs like Moralis or The Graph.
-   Connecting through RPC nodes. Paid nodes can offer better performance and stability.
-   Running a blockchain node with software like Geth.

Because the Avalanche blockchain is  fast, I don't listen to real-time events. I'm crawling the latest logs every one or two seconds and inserting them into the database.

We have a separate worker to crawl old logs or fix missing logs and errors. We can create another queue or database table to handle exceptions and missed data, called "retryList." Crawling old blocks would be time-consuming.

## Are there reorgs on Avalanche®?
https://support.avax.network/en/articles/7329750-are-there-reorgs-on-avalanche


## Avalanche Block Time = 2.04s
Block time is the average amount of time it takes for a new block to be added to a blockchain.
This metric is calculated as an average based on different time intervals (hour/day/week/month)
https://chainspect.app/chain/avalanche


------------

![alt text](help/swagger.png)
![alt text](help/logsTable.png)
![alt text](help/totalusdc.png)
![alt text](help/leader-board.png)


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
# Database URL example in .env file
$ DATABASE_URL=DATABASE_URL=postgresql://dev:12345678@localhost:5432/dev

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
- ✅ Add Swagger UI.
- ✅ Write unit tests .


#### Todo:
- 💡 Run parallel worker pools with multiple RPC servers to improve speed.
- 💡 Write e2e tests.
- 💡 Caching with Redis.
- 💡 Use timeout for RPC requests.
- 💡 Include API versioning.
- 💡 rate-limiting. 
- 💡 Use Kafka for queue for data pipeline. 
- 💡 Use a better logging system like Winston.
- 💡 Add a health check endpoint.
- 💡 Test Decimal.js instead of Bigint