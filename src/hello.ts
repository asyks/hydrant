import * as http from "http"
import * as constants from "./constants"

export function getPort() {
  let port: number = constants.defaultPort;

  let firstArg: Array<string> = []
  try {
    firstArg = process.argv.slice(2)[0].split("=");
  }
  catch (TypeError) {
    console.warn("Failed to parse args...");
  }

  if (firstArg.length === 2 && firstArg[0] === "port") {
    port = Number(firstArg[1]);
  }
  else {
    console.warn(`Port specified improperly, using default ${port}`);
  }

  return port
}

export function handle(req: http.IncomingMessage, res: http.ServerResponse) {
  let validMethods: Array<string> = ["GET"]

  if (validMethods.indexOf(req.method.toUpperCase()) >= 0) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");

    res.end(constants.successMessage);
  }
  else {
    res.statusCode = 405;
    res.setHeader("Content-Type", "text/plain");

    res.end(constants.error405Message);
  }
}
