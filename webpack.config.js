// Work with all paths in a cross platform manner
const webpack = require('webpack');
const path = require('path');

// Plugins covered below
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Bootstrap
const bootstrapEntryPoints = require('./webpack.bootstrap.config');

// Project Configuration
const configProject = {
    entryJs: {
        app: './src/app.js',
        post: './src/post.js'
    },
    publicPath: 'dist',
    portServer: 9000,
    htmlTemplate: {
        homePage: './src/index.html',
        internalPage: './src/post.html'
    }
};


// Production vs Development
const isProd = process.env.NODE_ENV === 'production'; // true or false
const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'sass-loader'],
    publicPath: configProject.publicPath
});

const cssConfig = isProd ? cssProd : cssDev;

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

// Merge the common configuration with the environment specific configuration
module.exports = {
    entry: {
        app: configProject.entryJs.app,
        post: configProject.entryJs.post,
        bootstrap: bootstrapConfig
    },
    output: {
        path: path.resolve(__dirname, configProject.publicPath),
        filename: 'js/[name].bundle.js' // Then [name] is reference to the object entry app or post
    },
    devServer: {
        contentBase: path.join(__dirname, configProject.publicPath), // Match the output path
        compress: true,
        hot: true, // Enable Hot Module Replacement on the server
        port: configProject.portServer,
        stats: 'errors-only', // Display only erros in the terminal
        open: true //Open browser
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: cssConfig
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    // 'file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/',
                    'file-loader?name=images/[name].[ext]',
                    'image-webpack-loader?bypassOnDebug'
                ]
            },
            {
                test: /\.(woff2?|svg)$/, 
                use: 'url-loader?limit=10000&name=fonts/[name].[ext]'
            },
            {
                test: /\.(ttf|eot)$/, 
                use: 'file-loader?name=fonts/[name].[ext]'
            },
            { 
                test: /bootstrap-sass[/\\]assets[/\\]javascripts[/\\]/, 
                use: 'imports-loader?jQuery=jquery' 
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: false
            },
            excludeChunks: ['post'], // Exclude post from index
            hash: true, // Add a number after the file .js ex: app.bundle.js?327687638
            filename: 'index.html', // Save into the /dist folder with this (index.html) name.
            template: configProject.htmlTemplate.homePage
        }),
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            chunks: ['post'], //Only load or include the .js file
            filename: 'post.html',
            template: configProject.htmlTemplate.internalPage
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            disable: !isProd,
            allChunks: true
        }),
        new webpack.HotModuleReplacementPlugin(), 
        //Enable Hot Module Replacement globally
        
        new webpack.NamedModulesPlugin() 
        // Prints more readable module names in the browser console on HMR updates
    ]
};
