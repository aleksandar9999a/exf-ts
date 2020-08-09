const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:  path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].js',
        filename: '[name].bundle.js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'vendor.bundle'
        }
    },
    resolve: {
        extensions: [".ts", ".tsx", "html", ".js"]
    },
    devtool: 'source-map',
    module: {
        rules: [
            { test: /\.ts$/, loader: "ts-loader", exclude: /node_modules/ },
            { test: /\.tsx$/, loader: "ts-loader", exclude: /node_modules/ },
            { test: /\.html$/, loader: 'html-loader' }
        ]
    },
    devServer: {
        historyApiFallback: true,
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html'
        })
    ]
}