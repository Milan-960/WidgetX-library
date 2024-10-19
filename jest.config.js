/** @type {import('ts-jest').JestConfigWithTsJest} **/

module.exports = {
  testEnvironment: "jsdom",
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.js?$",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!src/index.ts"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
