const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

const commonConfig = require('./webpack.config.common');
const parts = require('./webpack.parts');

const source = (file) => path.join('js/timetable-export', file);

const productionConfig = merge([
  parts.setFreeVariable('process.env.NODE_ENV', process.env.NODE_ENV || 'production'),
  commonConfig,
  {
    // Override common's entry point
    entry: source('main.jsx'),
    // Don't attempt to continue if there are any errors.
    bail: true,
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    devtool: 'source-map',
    output: {
      // The build folder.
      path: parts.PATHS.buildTimetable,
      filename: '[name].[chunkhash].js',
      // This is used for require.ensure. The setup
      // will work without but this is useful to set.
      chunkFilename: '[chunkhash].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(parts.PATHS.app, source('index.html')),
        inlineSource: '\\.(js|css)$',
      }),
      new HtmlWebpackInlineSourcePlugin(),
    ],
  },
  parts.loadCSS({ localIdentName: '[hash:base64:8]' }),
  parts.minifyJavascript(),
  parts.loadImages({
    include: parts.PATHS.images,
    options: {
      name: 'img/[name].[hash].[ext]',
    },
  }),
  parts.clean(parts.PATHS.buildTimetable),
]);

module.exports = productionConfig;
