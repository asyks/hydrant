export const defaultPort = 3000;
export const port = Number(process.env.PORT);
export const redisUrl = String(process.env.REDIS_URL);

export enum RespStatus {
  ok = "OK",
  error = "ERROR"
}
