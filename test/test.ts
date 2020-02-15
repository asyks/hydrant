import * as assert from "assert"
import * as simple from "simple-mock"

import * as routes from "../src/routes"


function noop () {}

before("Disable console logging", function() {
  console.info = noop;
  console.warn = noop;
})

describe("routes", function() {
  describe("index", function() {
    beforeEach("setup index tests", function() {
      this.mockRequest = {};
      this.mockResponse = {};
      simple.mock(this.mockResponse, "setHeader");
      simple.mock(this.mockResponse, "end");
    })
    it("GET of index should send 200 response", function() {
      routes.index(this.mockRequest, this.mockResponse);

      assert.equal(this.mockResponse.end.callCount, 1);
      assert.equal(this.mockResponse.setHeader.lastCall.args[1], "text/plain");
      assert.equal(this.mockResponse.end.lastCall.args[0], "Hydrant is running...");
    })
  })
  describe("cache_set", function() {
    beforeEach("setup cache_set tests", function() {
      this.mockRequest = {body: {key: "foo", value: "bar"}};
      this.mockResponse = {};
      simple.mock(this.mockResponse, "json");
    })
    it("PUT - should send 200 response on successful", function() {
      simple.mock(routes.rclient, "set").callbackWith(null, "OK");
      routes.cache_set(this.mockRequest, this.mockResponse);

      assert.equal(this.mockResponse.statusCode, 200);
      assert.equal(this.mockResponse.json.callCount, 1);
      assert.deepEqual(this.mockResponse.json.lastCall.arg, {status: 'OK', stored: {key: 'foo', value: 'bar'}});
    })
    it("PUT - should send 400 response on error", function() {
      simple.mock(routes.rclient, "set").callbackWith(Error("cache set error"), null);
      routes.cache_set(this.mockRequest, this.mockResponse);

      assert.equal(this.mockResponse.statusCode, 400);
      assert.equal(this.mockResponse.json.callCount, 1);
      assert.deepEqual(this.mockResponse.json.lastCall.arg, {status: 'ERROR', payload: this.mockRequest.body});
    })
  })
  describe("cache_get", function() {
    beforeEach("setup cache_get tests", function() {
      this.mockRequest = {params: {key: "foo"}};
      this.mockResponse = {};
      simple.mock(this.mockResponse, "json");
    })
    it("GET - should send 200 response on success", function() {
      simple.mock(routes.rclient, "get").callbackWith(null, "bar");
      routes.cache_get(this.mockRequest, this.mockResponse);

      assert.equal(this.mockResponse.statusCode, 200);
      assert.equal(this.mockResponse.json.callCount, 1);
      assert.deepEqual(this.mockResponse.json.lastCall.arg, {status: 'OK', found: {key: 'foo', value: 'bar'}});
    })
    it("GET - should send 400 response on success", function() {
      simple.mock(routes.rclient, "get").callbackWith(Error("cache get error"), null);
      routes.cache_get(this.mockRequest, this.mockResponse);

      assert.equal(this.mockResponse.statusCode, 400);
      assert.equal(this.mockResponse.json.callCount, 1);
      assert.deepEqual(this.mockResponse.json.lastCall.arg, {status: 'ERROR', key: this.mockRequest.params.key});
    })
  })
})
