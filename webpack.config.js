// Work with all paths in a cross platform manner
const path = require('path');

// Plugins covered below
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Project Configuration
const configProject = {
    entryJs: {
        app: './src/app.js',
        post: './src/post.js'
    },
    publicPath: 'dist',
    portServer: 9000,
    cssName: 'app.css',
    htmlTemplate: {
        homePage: './src/index.html',
        internalPage: './src/post.html'
    }
};

// Merge the common configuration with the environment specific configuration
module.exports = {
    entry: {
        app: configProject.entryJs.app,
        post: configProject.entryJs.post,
    },
    output: {
        path: path.resolve(__dirname, configProject.publicPath),
        filename: '[name].bundle.js' // Then [name] is reference to the object entry app or post
    },
    devServer: {
        contentBase: path.join(__dirname, configProject.publicPath),
        compress: true,
        port: configProject.portServer,
        stats: "errors-only", // Display only erros in the terminal
        open: true //Open browser
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [ 'css-loader', 'sass-loader' ]
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true
            },
            excludeChunks: ['post'],
            hash: true, // Add a number after the file .js ex: app.bundle.js?327687638
            template: configProject.htmlTemplate.homePage
        }),
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            chunks: ['post'], //Only load the .js file
            filename: 'post.html',
            template: configProject.htmlTemplate.internalPage
        }),
        new ExtractTextPlugin(configProject.cssName)
    ]
}