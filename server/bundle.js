var Webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./../webpack.config.js');
var path = require('path');
var fs = require('fs');
var express = require('express');

module.exports = function () {

    // First we fire up Webpack an pass in the configuration we
    // created
    var bundleStart = null;
    var compiler = Webpack(webpackConfig);

    // We give notice in the terminal when it starts bundling and
    // set the time it started
    compiler.plugin('compile', function() {
        console.log('Bundling...');
        bundleStart = Date.now();
    });

    // We also give notice when it is done compiling, including the
    // time it took. Nice to have
    compiler.plugin('done', function() {
        console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
    });

    var bundler = new WebpackDevServer(compiler, {

        // We need to tell Webpack to serve our bundled application
        // from the build path. When proxying:
        // http://localhost:3000/build -> http://localhost:8080/build
        // publicPath: path.resolve(__dirname, '..', 'src'),

        // Configure hot replacement
        hot: true,

        // The rest is terminal configurations
        quiet: false,
        noInfo: true,
        stats: {
            colors: true
        },
        setup: function(app) {
            // Here you can access the Express app object and add your own custom middleware to it.
            // For example, to define custom handlers for some paths:
            // app.get('/some/path', function(req, res) {
            //   res.json({ custom: 'response' });
            // });

            console.log("path is "+path.join(__dirname,'..', 'public'));
            app.use(express.static(path.join(__dirname,'..', 'public')));
            app.get('*', (req, res, next) => {
                res.sendFile(path.join(__dirname,'..', 'public', 'index.html'))
            });
        },
    });

    // We fire up the development server and give notice in the terminal
    // that we are starting the initial bundle
    bundler.listen(8080, 'localhost', function () {
        console.log('Bundling project, please wait...');
    });

};