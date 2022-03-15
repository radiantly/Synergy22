const { merge } = require("webpack-merge");
const path = require("path");
const commonConfiguration = require("./webpack.common.js");

module.exports = merge(commonConfiguration, {
  mode: "development",
  devServer: {
    host: "local-ip",
    port: "auto",
    static: {
      directory: path.resolve(__dirname, "../src"),
      watch: true,
    },
    open: true,
    allowedHosts: "all",
  },
});
