const { ImportMapWebpackPlugin } = require("@hackney/webpack-import-map-plugin");
const dotenv = require("dotenv").config();
const webpack = require("webpack");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const { merge } = require("webpack-merge");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "mtfh",
    projectName: "processes",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    entry: {
      processes: defaultConfig.entry,
    },
    output: {
      filename: "[name].[contenthash].js",
      uniqueName: "tenure",
    },
    module: {
      rules: [
        {
          test: /\.scss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    externals: ["react-router-dom", "formik", "yup"],
    plugins: [
      new webpack.EnvironmentPlugin({
        DES_URL: dotenv.DES_URL || "",
      }),
      new ImportMapWebpackPlugin({
        namespace: "@mtfh",
        basePath: process.env.APP_CDN || "http://localhost:8990",
      }),
    ],
  });
};
