import * as express from "express"
import * as redis from "redis";

import * as routes from "./routes"
import * as constants from "./constants"


const app = express();
const port: number = Number(process.env.PORT);

const redis_url: string = String(process.env.REDIS_URL);
const rclient = redis.createClient({url: redis_url});

rclient.on("error", function (err) {
  console.log("Error " + err);
});

app.get("/", routes.index);

app.get("/create", (req, res) => {
  rclient.set("foo", "bar", redis.print);
  res.end("Set key 'foo'");
})

app.get("/retrieve", (req, res) => {
  rclient.get("foo");
  res.end("Got key 'foo'");
})

app.listen(port, () => {
  console.log(`Server running at http://${constants.hostname}:${port}/`);
});
