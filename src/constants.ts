export const hostname: string = "127.0.0.1";
export const defaultPort: number = 3000;
export const port: number = Number(process.env.PORT);
export const redis_url: string = String(process.env.REDIS_URL);

export enum RespStatus {
  ok = "OK",
  error = "ERROR"
}
