import * as assert from "assert"
import * as util from "../src/util"
import * as constants from "../src/constants"

function noop () {}

describe("util", function() {
  describe(".getPort()", function() {
    before( function() {
      console.warn = noop
    })
    it(`should return ${constants.defaultPort} when args are not specified`, function() {
      assert.equal(util.getPort(), constants.defaultPort);
    })
    it(`should return port from arg when specified`, function() {
      var testPort: number = 3001
      process.argv = ["","",`port=${testPort}`]
      assert.equal(util.getPort(), testPort);
    })
    it(`should return port from arg when specified`, function() {
      var testPort: number = 3001
      process.argv = ["","",`${testPort}`]
      assert.equal(util.getPort(), constants.defaultPort);
    })
  })
})
