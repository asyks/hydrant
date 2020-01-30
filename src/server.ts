import * as express from "express"
import * as redis from "redis";

import * as routes from "./routes"
import * as constants from "./constants"


const app = express();

app.get("/", routes.index)

app.get("/set", routes.cache_set)

app.get("/get", routes.cache_get)

app.listen(constants.port, () => {
  console.log(`Server running at http://${constants.hostname}:${constants.port}/`);
})
