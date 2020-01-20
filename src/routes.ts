import * as http from "http"
import * as constants from "./constants"

export function index(req: http.IncomingMessage, res: http.ServerResponse) {
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
