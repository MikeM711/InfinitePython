const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/server.ts",
    // Target: node - https://stackoverflow.com/questions/42579037/node-js-typescript-webpack-module-not-found
    target: "node",
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: "ts-loader",
                // include: [path.resolve(__dirname, "src")],
            },
        ],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    // https://stackoverflow.com/questions/43595555/webpack-cant-resolve-typescript-modules
    resolve: {
        extensions: ['.ts', '.js'],
        // below modules = less lines in bundle.js
        modules: [
            path.join(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules'),
        ],
    }
};
