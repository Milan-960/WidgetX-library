// For refferences pelase check out this github issue links below
// https://github.com/inrupt/solid-client-authn-js/issues/1676
// https://github.com/mswjs/msw/issues/1796
// Import the Node.js 'util' module, which includes TextEncoder and TextDecoder

const { TextEncoder, TextDecoder } = require("util");

// Mock global TextEncoder and TextDecoder if not already available
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}
