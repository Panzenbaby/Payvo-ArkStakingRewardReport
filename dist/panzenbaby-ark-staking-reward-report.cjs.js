'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./panzenbaby-ark-staking-reward-report.cjs.prod.js");
} else {
  module.exports = require("./panzenbaby-ark-staking-reward-report.cjs.dev.js");
}
