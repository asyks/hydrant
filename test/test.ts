import * as assert from "assert"
import * as express from "express"
import * as simple from "simple-mock"

import * as routes from "../src/routes"
import * as constants from "../src/constants"


function noop () {}

before("Disable console logging", function() {
  console.info = noop;
  console.warn = noop;
})

describe("routes", function() {
  describe("index", function() {
    beforeEach("Setup index tests", function() {
      this.mockRequest = {};
      this.mockResponse = {};
      simple.mock(this.mockResponse, "setHeader");
      simple.mock(this.mockResponse, "end");
    })
    it(`should `, function() {
      routes.index(this.mockRequest, this.mockResponse);
      assert.equal(this.mockResponse.end.callCount, 1);
      assert.equal(this.mockResponse.setHeader.lastCall.args[1], "text/plain");
      assert.equal(this.mockResponse.end.lastCall.args[0], "Hydrant is running...");
    })
  })
  describe("cache_set", function() {
    beforeEach("Setup cache_set tests", function() {
      this.mockRequest = {"body": {"key": "foo", "value": "bar"}};
      this.mockResponse = {};
      simple.mock(this.mockResponse, "json");
      simple.mock(routes.rclient, "set").callbackWith(null, "OK");
    })
    it(`should `, function() {
      routes.cache_set(this.mockRequest, this.mockResponse);
      assert.equal(this.mockResponse.json.callCount, 1);
      assert.deepEqual(this.mockResponse.json.lastCall.arg, {status: 'OK', stored: {key: 'foo', value: 'bar'}});
    })
  })
})
