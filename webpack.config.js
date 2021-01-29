const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const output = {
    // library: ['myLibrary', '[name]'],
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
}
if (process.env.NODE_ENV === 'production') {
    output['libraryTarget'] = 'umd'
}

const banner = 
`@author: ljt
@date: ${new Date()}`
module.exports = {
    // entry: './src/index.js',
    mode: 'development',
    entry: {
        index: './src/index.js',
        't-charts': './src/app.js'
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
        }),
        new webpack.BannerPlugin(banner)
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        drop_console: true
                    }
                },
            })
        ],
    },
}