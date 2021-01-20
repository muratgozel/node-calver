// fixed current time stamp in test environment.
// 1611069856248: 19 Jan 2021
Date.now = function now() {
  return 1611069856248;
}

global.calver = require('../../src')
