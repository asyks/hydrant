import * as constants from "./constants";

interface BaseRespBody {
  status: constants.RespStatus;
  message?: string;
}

interface KeyValuePair {
  key: string;
  value: any;
}

export interface SetRespBody extends BaseRespBody {
  payload?: any;
  stored?: KeyValuePair;
}

export interface GetRespBody extends BaseRespBody {
  key?: string;
  found?: KeyValuePair;
}
