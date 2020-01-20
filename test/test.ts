import * as assert from "assert"
import * as hello from "../src/hello"
import * as constants from "../src/constants"

function noop () {}

describe("hello", function() {
  describe(".getPort()", function() {
    before( function() {
      console.warn = noop
    })
    it(`should return ${constants.defaultPort} when args are not specified`, function() {
      assert.equal(hello.getPort(), constants.defaultPort);
    })
    it(`should return port from arg when specified`, function() {
      var testPort: number = 3001
      process.argv = ["","",`port=${testPort}`]
      assert.equal(hello.getPort(), testPort);
    })
    it(`should return port from arg when specified`, function() {
      var testPort: number = 3001
      process.argv = ["","",`${testPort}`]
      assert.equal(hello.getPort(), constants.defaultPort);
    })
  })
})
