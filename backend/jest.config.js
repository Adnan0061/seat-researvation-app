module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/tests/fixtures/",
    "/tests/utils/",
  ],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["./tests/setup.js"],
  testTimeout: 5000,
};
