const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const ESLintPlugin = require('eslint-webpack-plugin');

// https://webpack.js.org/configuration/
module.exports = (_, argv) => {
  const isDevelopment = argv === 'development';

  return {
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
        },
        {
          // For .css files
          test: /\.css$/i,
          use: [
            'style-loader', // injects the CSS into the DOM 
            'css-loader', // load and resolve CSS dependencies, turn CSS into JavaScript modules.,
          ],
        },
        {
          // for .module.scss and .module.sass files
          test: /\.module\.s[ac]ss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: { // https://webpack.js.org/loaders/css-loader/#modules
                  localIdentName: '[path][name]__[local]--[hash:base64:5]', // https://webpack.js.org/loaders/css-loader/#localidentname
                },
                importLoaders: 1, // https://webpack.js.org/loaders/css-loader/#importloaders
                sourceMap: true,
              },
            },
            'sass-loader', // transpile the SCSS into CSS
          ],
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "public", "index.html")
      }),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        context: 'src', // the folder where your source files are located
      }),
    ].filter(Boolean),
    devServer: {
      port: 3000,
      open: true,
      /**
       * Enables the fallback to index.html
       * https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback
       */
      historyApiFallback: true,
      client: {
        overlay: {
          warnings: false, // Disable the overlay for warnings
        },
      },
    }
  }
};