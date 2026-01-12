const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    mode: "production",
    entry: {
      "questions/test/question": "./src/questions/test/TestQuestion.js",
      "questions/test/scorer": "./src/questions/test/TestQuestionScorer.js",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: "questions/**/*.html",
            to: path.resolve(__dirname, "dist"),
            context: "src",
          },
        ],
      }),
    ],
    resolve: {
      extensions: [".js"],
      modules: ["node_modules"],
      fallback: {
        os: false,
        crypto: false,
      },
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                url: false,
                modules: {
                  namedExport: false,
                  exportLocalsConvention: "as-is",
                },
              },
            },
            {
              loader: "sass-loader",
              options: {
                sassOptions: { silenceDeprecations: ["import"] },
              },
            },
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: "defaults" }]],
            },
          },
        },
      ],
    },
  },
  {
    mode: "development",
    entry: {
      index: "./src/index.js",
    },
    devtool: "inline-source-map",
    devServer: {
      static: "./dist",
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Development",
      }),
    ],
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      runtimeChunk: "single",
    },
  },
];
