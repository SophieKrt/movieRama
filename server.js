var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer();
var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, "src")

app.use(express.static(publicPath));


//
// var config = require("./webpack.config.js");
// // config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
// var compiler = webpack(config);
// var server = new WebpackDevServer(compiler, {
//     hot: true,
//     contentBase: "http://localhost/",
//     historyApiFallback: true,
//     quiet: true,
//     open: true,
//     noInfo: true,
//     setup: function(app) {
//         console.log("path is "+path.join(__dirname, 'src'));
//         app.use(express.static(path.join(__dirname, 'public')));
//         app.get('*', (req, res, next) => {
//             res.sendFile(path.join(__dirname, 'public', 'index.html'))
//         });
//     },
// });
//
// server.listen(port, '0.0.0.0', (err) => {
//     if (err) {
//         alert(err);
//     }
//     console.log('Listening at localhost:' + port);
// });
// console.log('production or debug? : '+process.env.NODE_ENV);
// console.log('Server started');



// We only want to run the workflow when not in production
if (!isProduction) {

    // We require the bundler inside the if block because
    // it is only needed in a development environment. Later
    // you will see why this is a good idea
    var bundle = require('./server/bundle.js');
    bundle();

    // Any requests to localhost:3000/build is proxied
    // to webpack-dev-server
    app.all('/*', function (req, res) {
        proxy.web(req, res, {
            target: 'http://localhost:8080'
        });
    });

}

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
    console.log('Could not connect to proxy, please try again...');
});

app.listen(port, function () {
    console.log('Server running on port ' + port);
});