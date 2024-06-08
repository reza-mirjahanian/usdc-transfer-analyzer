export const SERVER_PORT = Number(process.env.SERVER_PORT) || 3001;

// GET_LAST_LOGS_DISTANCE is the distance in blocks from the latest finalized block to get the logs.
export const GET_LAST_LOGS_DISTANCE =
  Number(process.env.GET_LAST_LOGS_DISTANCE) || 10;

// RUN_LATEST_LOGS_WORKER_INTERVAL is the interval in milliseconds at which the indexer will run the get latest logs worker.
export const RUN_LATEST_LOGS_WORKER_INTERVAL =
  Number(process.env.RUN_LATEST_LOGS_WORKER_INTERVAL) || 3 * 1000;

// RUN_REPAIR_OLD_LOGS_WORKER_INTERVAL is the interval in milliseconds at which the indexer will run the repair old logs worker.
export const RUN_REPAIR_OLD_LOGS_WORKER_INTERVAL =
  Number(process.env.RUN_REPAIR_OLD_LOGS_WORKER_INTERVAL) || 10 * 1000;

// STARTING_BLOCK_NUMBER is the block number from which the indexer will start indexing the logs.
export const STARTING_BLOCK_NUMBER =
  Number(process.env.STARTING_BLOCK_NUMBER) || 46461979;

export const REPAIR_OLD_LOGS_STEP =
  Number(process.env.REPAIR_OLD_LOGS_STEP) || 10;

export const START_BLOCK_KEY = 'startedBlock';
