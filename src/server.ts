import * as http from "http"
import * as express from "express"
import * as redis from "redis";

import * as routes from "./routes"
import * as constants from "./constants"


const app = express();
const port: number = Number(process.env.PORT)

app.get("/", routes.index);

app.get("/create", () => {
})

app.listen(port, () => {
  console.log(`Server running at http://${constants.hostname}:${port}/`);
});
