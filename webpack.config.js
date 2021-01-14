const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'my-charts.js',
        path: path.resolve(__dirname, 'dist')
    },
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
    plugins: [
        new CleanWebpackPlugin(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
}