import * as express from "express";
import * as redis from "redis";

import * as constants from "./constants"


const rclient: redis.RedisClient = redis.createClient({url: constants.redis_url});

rclient.on("connect", function (): void {
  console.log("Connected to Redis");
})

rclient.on("error", function (err): void {
  console.log(`ERROR ${err}`);
})

function send_ok_text_response(res: express.Response, msg: string): void {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(msg);
}

function send_ok_json_response(res: express.Response, data: object): void {
  res.json(data)
}

export function index(req: express.Request, res: express.Response): void {
  send_ok_text_response(res, "Hydrant is running...");
}

export function cache_set(req: express.Request, res: express.Response): void {
  let key: string = req.body.key;
  let val: string = req.body.value;

  rclient.set(key, val, function (err, ret) {
    if (err) {
      console.log(`ERROR during 'set': ${err}`);
    } else {
      console.log(`set -> ${key}: ${val} | ${ret}`);
      send_ok_json_response(res, {status: "OK", stored: {key: key, value: val}})
    }
  })
}

export function cache_get(req: express.Request, res: express.Response): void {
  let key: string = req.params.key;

  rclient.get(key, function (err, ret) {
    if (err) {
      console.log(`ERROR during 'get': ${err}`);
    } else {
      console.log(`get <- ${key}: ${ret}`);
      send_ok_json_response(res, {status: "OK", found: {key: key, value: ret}})
    }
  })
}
