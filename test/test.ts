import * as assert from "assert"
import * as express from "express"
import * as redis from "redis"
import * as simple from "simple-mock"

import * as handlers from "../src/handlers"


function noop () {}

console.error = noop;
console.info = noop;
console.warn = noop;

const rclient: redis.RedisClient = {} as redis.RedisClient;
simple.mock(rclient, "createClient");

let mockRequest: express.Request = {
  app: {locals: {rclient: rclient}}
} as express.Request;

let mockResponse: express.Response = {} as express.Response;

beforeEach("setup mock response object", function() {
  simple.mock(mockResponse, "setHeader");
  simple.mock(mockResponse, "json");
})

afterEach("teardown mock response object", function() {
  simple.restore();
})

describe("handlers", function() {
  describe("index", function() {
    it("GET of index should send 200 response", function() {
      handlers.index(mockRequest, mockResponse);

      assert.equal(mockResponse.json.callCount, 1);
      assert.equal(mockResponse.setHeader.lastCall.args[1], "application/json");
      assert.deepEqual(
        mockResponse.json.lastCall.arg,
        {status: "OK", message: "Hydrant is running."}
      );
    })
  })
  describe("cache_set", function() {
    beforeEach("setup cache_set tests", function() {
      mockRequest.params = {key: "foo"};
      mockRequest.body = {value: "bar"};
    })
    it("PUT - should send 200 response on success", function() {
      simple.mock(rclient, "set").callbackWith(null, "OK");
      handlers.cache_set(mockRequest, mockResponse);

      assert.equal(mockResponse.statusCode, 200);
      assert.equal(mockResponse.json.callCount, 1);
      assert.deepEqual(
        mockResponse.json.lastCall.arg,
        {status: 'OK', stored: {key: 'foo', value: 'bar'}}
      );
    })
    it("PUT - should send 400 response on cache error", function() {
      simple.mock(rclient, "set").callbackWith(Error("cache set error"), null);
      handlers.cache_set(mockRequest, mockResponse);

      assert.equal(mockResponse.statusCode, 400);
      assert.equal(mockResponse.json.callCount, 1);
      assert.deepEqual(
        mockResponse.json.lastCall.arg,
        {status: 'ERROR', message: "cache failure", payload: mockRequest.body}
      );
    })
    it("PUT - should send 400 response on malformed", function() {
      mockRequest.body = {};
      handlers.cache_set(mockRequest, mockResponse);

      assert.equal(mockResponse.json.callCount, 1);
      assert.deepEqual(
        mockResponse.json.lastCall.arg,
        {status: 'ERROR', message: "malformed request", payload: mockRequest.body}
      );
    })
  })
  describe("cache_get", function() {
    beforeEach("setup cache_get tests", function() {
      mockRequest.params = {key: "foo"};
    })
    it("GET - should send 200 response on success", function() {
      simple.mock(rclient, "get").callbackWith(null, "bar");
      handlers.cache_get(mockRequest, mockResponse);

      assert.equal(mockResponse.statusCode, 200);
      assert.equal(mockResponse.json.callCount, 1);
      assert.deepEqual(
        mockResponse.json.lastCall.arg,
        {status: 'OK', found: {key: 'foo', value: 'bar'}}
      );
    })
    it("GET - should send 400 response on cache error", function() {
      simple.mock(rclient, "get").callbackWith(Error("cache get error"), null);
      handlers.cache_get(mockRequest, mockResponse);

      assert.equal(mockResponse.statusCode, 400);
      assert.equal(mockResponse.json.callCount, 1);
      assert.deepEqual(
        mockResponse.json.lastCall.arg,
        {status: 'ERROR', message: "cache failure", key: mockRequest.params.key}
      );
    })
    it("GET - should send 404 response on unset key", function() {
      simple.mock(rclient, "get").callbackWith(null, null);
      handlers.cache_get(mockRequest, mockResponse);

      assert.equal(mockResponse.statusCode, 404);
      assert.equal(mockResponse.json.callCount, 1);
      assert.deepEqual(
        mockResponse.json.lastCall.arg,
        {status: 'ERROR', message: "notfound", key: mockRequest.params.key}
      );
    })
  })
})
