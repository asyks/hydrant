import * as express from "express";
import * as redis from "redis";

import * as routes from "./routes";
import * as constants from "./constants";


const app = express();

const rclient: redis.RedisClient = redis.createClient({url: constants.redis_url});

rclient.on("connect", function (): void {
  console.info("Connected to Redis");
})

rclient.on("error", function (err): void {
  console.error(`ERROR ${err}`);
})

app.locals.rclient = rclient

app.use(express.json());

app.get("/", routes.index)

app.put("/set/:key", routes.cache_set)

app.get("/get/:key", routes.cache_get)

app.listen(constants.port, () => {
  console.log(`Server running at http://${constants.hostname}:${constants.port}/`);
})
