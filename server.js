
const express = require('express');
const path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");
const port = process.env.PORT || 8080;



var config = require("./webpack.config.js");
// config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    hot: true,
    contentBase: "http://localhost/",
    historyApiFallback: true,
    quiet: true,
    open: true,
    noInfo: true,
    setup: function(app) {
        // Here you can access the Express app object and add your own custom middleware to it.
        // For example, to define custom handlers for some paths:
        // app.get('/some/path', function(req, res) {
        //   res.json({ custom: 'response' });
        // });

        // app.use(express.static(__dirname));
        console.log("path is "+path.join(__dirname, 'src'));
        app.use(express.static(path.join(__dirname, 'public')));
        app.get('*', (req, res, next) => {
            // match({ routes: routes(), location: req.url }, (err, redirectLocation, renderProps) => {
            //     res.sendFile(path.resolve(__dirname, 'index.html'));
           
            res.sendFile(path.join(__dirname, 'public', 'index.html'))
            // })
        });
    },
});

server.listen(port, '0.0.0.0', (err) => {
    if (err) {
        alert(err);
    }
    console.log('Listening at localhost:' + port);
});
//
// app.use(express.static(__dirname));
// app.get('*', (req,res) =>{
//     res.sendFile(path.resolve(__dirname, index.html));
// });
//
// app.listen(port);
console.log('production or debug? : '+process.env.NODE_ENV);
console.log('Server started');