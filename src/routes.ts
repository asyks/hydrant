import * as express from "express";
import * as redis from "redis";

import * as constants from "./constants"


export const rclient: redis.RedisClient = redis.createClient({url: constants.redis_url});

rclient.on("connect", function (): void {
  console.info("Connected to Redis");
})

rclient.on("error", function (err): void {
  console.error(`ERROR ${err}`);
})

function send_json_response(res: express.Response, code: number, data: object): void {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.json(data);
}

export function index(req: express.Request, res: express.Response): void {
  send_json_response(res, 200, {status: "OK", message: "Hydrant is running."});
}

export function cache_set(req: express.Request, res: express.Response): void {
  let key: string = req.body.key;
  let val: string = req.body.value;

  rclient.set(key, val, function (err, reply) {
    if (err) {
      console.error(`ERROR during 'set': ${err}`);
      send_json_response(res, 400, {status: "ERROR", payload: req.body})
    } else {
      console.info(`set -> ${key}: ${val} | ${reply}`);
      send_json_response(res, 200, {status: "OK", stored: {key: key, value: val}})
    }
  })
}

export function cache_get(req: express.Request, res: express.Response): void {
  let key: string = req.params.key;

  rclient.get(key, function (err, reply) {
    if (err) {
      console.error(`ERROR during 'get': ${err}`);
      send_json_response(res, 400, {status: "ERROR", key: key})
    } else {
      console.info(`get <- ${key}: ${reply}`);
      if (reply === null) {
        send_json_response(res, 404, {status: "NOTFOUND", key: key});
      } else {
        send_json_response(res, 200, {status: "OK", found: {key: key, value: reply}});
      }
    }
  })
}
