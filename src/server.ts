import * as http from "http"
import * as express from "express"

import * as routes from "./routes"
import * as constants from "./constants"
import * as util from "./util"

const app = express()
const port: number = util.getPort()

app.get("/", routes.index);

app.listen(port, () => {
  console.log(`Server running at http://${constants.hostname}:${port}/`);
});
