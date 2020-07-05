const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
          use: 'file-loader?name=fonts/[name].[ext]!static'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html"
    }),
    new HtmlWebpackPlugin({
      template: "./src/script/view/home.html",
      filename: "home.html"
    }),
    new HtmlWebpackPlugin({
      template: "./src/script/view/match.html",
      filename: "match.html"
    }),
    new HtmlWebpackPlugin({
      template: "./src/script/view/clubs.html",
      filename: "clubs.html"
    }),
    new HtmlWebpackPlugin({
      template: "./src/script/view/club-detail.html",
      filename: "club-detail.html"
    }),
    new HtmlWebpackPlugin({
      template: "./src/script/view/favorite-clubs.html",
      filename: "favorite-clubs.html"
    }),
    new HtmlWebpackPlugin({
      template: "./src/script/view/saved-match.html",
      filename: "saved-match.html"
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/service-worker.js',
          to: './',
          context: './'
        }
      ]
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/manifest.json',
          to: './',
          context: './'
        }
      ]
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/images/',
          to: './images',
          toType: 'dir'
        }
      ]
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/icons/',
          to: './icons',
          toType: 'dir'
        }
      ]
    })
  ]
}
