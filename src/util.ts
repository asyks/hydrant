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
