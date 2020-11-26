module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // moduleNameMapper: {
  //   "(.*\/.*)(.js)": "$1",
  // },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  setupFiles: ["dotenv/config"],
};
