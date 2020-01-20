import * as http from "http"
import * as hello from "./hello"
import * as constants from "./constants"

const server: http.Server = http.createServer(hello.handle);
const port: number = hello.getPort()

server.listen(port, constants.hostname, () => {
  console.log(`Server running at http://${constants.hostname}:${port}/`);
});
