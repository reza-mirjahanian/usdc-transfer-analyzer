export const SERVER_PORT = Number(process.env.SERVER_PORT) || 3001;

export const GET_LAST_LOGS_DISTANCE =
  Number(process.env.GET_LAST_LOGS_DISTANCE) || 10;

export const RUN_LATEST_LOGS_WORKER_INTERVAL =
  Number(process.env.RUN_LATEST_LOGS_WORKER_INTERVAL) || 3 * 1000;
