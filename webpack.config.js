const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  devtool: "inline-source-map", // requires `sourceMap: true` in tsconfig
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"), // requires `outDir: ./public` in tsconfig
  },
  devServer: {
    contentBase: path.join(__dirname, "public"), // without contentBase, theres no automatic reloading
  },
};
