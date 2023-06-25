const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const isDevelopment = process.env.NODE_ENV !== 'production';

// https://webpack.js.org/configuration/
module.exports = {
  entry: path.join(__dirname, "src", "index.tsx"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"] // enables the imports of those files without their extension being provided
  },
  module: {
    rules:[
      {
        test: /\.(ts|js)x?$/, // matches .ts and .tsx files
        loader: 'ts-loader',
        options: {
          getCustomTransformers: () => ({
            before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
          })
        }, // applies ts-loader to the matched files
        exclude: /node_modules/, // excludes files in the node_modules directory
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html")
    }),
    isDevelopment && new ReactRefreshWebpackPlugin()
  ].filter(Boolean),
  devServer: {
    port: 3000,
    open: true,
    /**
     * Enables the fallback to index.html
     * https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback
     */
    historyApiFallback: true,
  }
};