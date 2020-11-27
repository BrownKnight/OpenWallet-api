module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@api/(.*)$": "<rootDir>/src/api/$1",
    "^@db/(.*)$": "<rootDir>/src/db/$1",
    "^@test/(.*)$": "<rootDir>/test/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  //setupFiles: ["<rootDir>/test/db/testSetup.ts"],
  //globalSetup: "./test/db/testSetup.ts",
  //setupFilesAfterEnv: ["./test/db/setupDBHooks.ts"],
};