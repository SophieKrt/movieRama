var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var styles = "css-loader!sass-loader";

//"browser": "dist/handlebars.js",

module.exports = {
    context: __dirname, //looking here for development files
    entry: {
        app: './src/js/index.js' //this is the entry
    },
    // entry: ["./global.js", "./app.js"] //for multiple entries
    output: {
        path: path.resolve(__dirname, "./public"), //this is the output path
        filename: '[name].min.js', //name is the key of entry
        publicPath: '/', //shows the publicpath of the assets to the index.html
    },
    devServer: {
        contentBase: path.resolve(__dirname, './src'),  // New
    },
    // watch: true,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.handlebars$/, loader: 'handlebars-loader'
            },
            {
                test: /\.scss$/,
                loader: debug ? 'style-loader!' + styles : ExtractTextPlugin.extract(styles)
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: debug ? 'style-loader!css-loader' : ExtractTextPlugin.extract("style-loader!css-loader")
                // loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=1024&name=img/[name].[ext]'
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.(otf|ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader'
            }
        ],
    },
    plugins: debug ?
        [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
                "window.Tether": 'tether',
                Tether: 'tether',
                tether: 'tether',
            })
        ] : [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
                "window.Tether": 'tether',
                Tether: 'tether',
                tether: 'tether',
            }),
            new ExtractTextPlugin("css/app.min.css"),
            // new webpack.optimize.CommonsChunkPlugin('common.js'),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.optimize.ModuleConcatenationPlugin(),
        ]
};