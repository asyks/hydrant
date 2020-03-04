import * as express from "express";

import * as constants from "./constants";
import * as types from "./types";


function sendJsonResponse(
  res: express.Response, code: number, body: types.SetRespBody | types.GetRespBody
): void {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.json(body);
}

export function index(
  req: express.Request, res: express.Response
): void {
  sendJsonResponse(
    res,
    200,
    { status: constants.RespStatus.ok, message: "Hydrant is running." }
  );
}

export function cacheSet(
  req: express.Request, res: express.Response
): void {
  const key: string = req.params.key;
  const val: string = req.body.value;

  if (!val) {
    sendJsonResponse(
      res,
      400,
      {
        status: constants.RespStatus.error,
        message: "malformed request",
        payload: req.body
      }
    )
    return
  }

  const rclient = req.app.locals.rclient;
  rclient.set(key, val, function (err, reply) {
    if (err) {
      console.error(`ERROR during 'set': ${err}`);
      sendJsonResponse(
        res,
        400,
        {
          status: constants.RespStatus.error,
          message: "cache failure",
          payload: req.body
        }
      );
    } else {
      console.info(`set -> ${key}: ${val} | ${reply}`);
      sendJsonResponse(
        res,
        200,
        {
          status: constants.RespStatus.ok,
          stored: { key: key, value: val }
        }
      );
    }
  });
}

export function cacheGet(
  req: express.Request, res: express.Response
): void {
  const key: string = req.params.key;

  const rclient = req.app.locals.rclient;
  rclient.get(key, function (err, reply) {
    if (err) {
      console.error(`ERROR during 'get': ${err}`);
      sendJsonResponse(
        res,
        400,
        {
          status: constants.RespStatus.error,
          message: "cache failure",
          key: key
        }
      );
    } else {
      console.info(`get <- ${key}: ${reply}`);
      if (reply === null) {
        sendJsonResponse(
          res,
          404,
          {
            status: constants.RespStatus.error,
            message: "notfound",
            key: key
          }
        );
      } else {
        sendJsonResponse(
          res,
          200,
          {
            status: constants.RespStatus.ok,
            found: { key: key, value: reply }
          }
        );
      }
    }
  });
}
