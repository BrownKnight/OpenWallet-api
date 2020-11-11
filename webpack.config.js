/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const exec = require("child_process").exec;

const { NODE_ENV = "production" } = process.env;
module.exports = {
  entry: "./src/api/index.ts",
  mode: NODE_ENV,
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    {
      apply: (compiler) => {
        if (this.mode === "development") {
          compiler.hooks.afterEmit.tap("AfterEmitPlugin", () => {
            exec("npm run:dev", (err, stdout, stderr) => {
              if (stdout) process.stdout.write(stdout);
              if (stderr) process.stderr.write(stderr);
            });
          });
        }
      },
    },
  ],
  watch: NODE_ENV === "development",
};
