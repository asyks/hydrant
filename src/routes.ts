import * as http from "http"
import * as redis from "redis";

import * as constants from "./constants"


const rclient = redis.createClient({url: constants.redis_url});

rclient.on("connect", function (): void {
  console.log("Connected to Redis");
})

rclient.on("error", function (err): void {
  console.log("ERROR " + err);
})

function send_ok_response(res: http.ServerResponse, msg: string): void {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(msg);
}

export function index(req: http.IncomingMessage, res: http.ServerResponse): void {
  send_ok_response(res, "Hydrant is running...");
}

export function cache_set(req: http.IncomingMessage, res: http.ServerResponse): void {
  rclient.set("foo", "bar", function (err, ret) {
    if (err) {
      console.log("ERROR during `set` " + err);
    } else {
      let msg: string = "set: " + ret;
      console.log(msg);
      send_ok_response(res, msg)
    }
  })
}

export function cache_get(req: http.IncomingMessage, res: http.ServerResponse): void {
  rclient.get("foo", function (err, ret) {
    if (err) {
      console.log("ERROR during `get` " + err);
    } else {
      let msg: string = "get: " + ret;
      console.log(msg);
      send_ok_response(res, msg)
    }
  })
}
