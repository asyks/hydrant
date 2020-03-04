import * as express from "express";
import * as redis from "redis";

import * as handlers from "./handlers";
import * as constants from "./constants";


const app = express();

const rclient: redis.RedisClient = redis.createClient({ url: constants.redisUrl });

rclient.on("connect", function (): void {
  console.info("Connected to Redis");
})

rclient.on("error", function (err): void {
  console.error(`ERROR ${err}`);
})

app.locals.rclient = rclient

app.use(express.json());

app.get("/", handlers.index)

app.put("/set/:key", handlers.cacheSet)

app.get("/get/:key", handlers.cacheGet)

app.listen(constants.port, () => {
  console.log(`Server running at http://127.0.0.1:${constants.port}/`);
})
