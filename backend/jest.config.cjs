module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  extensionsToTreatAsEsm: [".ts"],
  setupFiles: ["<rootDir>/jest.setup.cjs"],
  moduleNameMapper: {
    "^jwks-rsa$": "<rootDir>/src/__mocks__/jwks-rsa.cjs",
    "^src/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
};
