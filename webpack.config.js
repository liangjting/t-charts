const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
const output = {
    // library: ['myLibrary', '[name]'],
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
}
if (process.env.NODE_ENV === 'production') {
    output['libraryTarget'] = 'umd'
}
module.exports = {
    // entry: './src/index.js',
    mode: 'development',
    entry: {
        index: './src/index.js',
        'my-charts': './src/app.js'
    },
    output,
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                    
                }
            }
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV" : (JSON.stringify(process.env.NODE_ENV))
         })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
}