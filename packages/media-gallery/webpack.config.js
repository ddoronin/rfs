const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const package = require('./package.json');

module.exports = {
	mode: 'production',

	entry: './src/index.tsx',

	output: {
		path: path.resolve(__dirname, 'public'),
		// the output bundle

		filename: '[name].js'
	},

	// Enable sourcemaps for debugging webpack's output.
	devtool: "source-map",

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".ts", ".tsx", ".js", ".json"]
	},
	module: {
		rules: [
			{
				test: /\.(png|jpg|gif|ttf|woff|svg|woff2|eot)$/,
				exclude: /assets/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192
						}
					}
				]
			},
			{
				// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
				test: /\.tsx?$/,
				loader: "ts-loader"
			},

			{
				// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
				enforce: "pre",
				test: /\.js$/,
				loader: "source-map-loader"
			},
			{
				test: /\.scss$/,
				use: [{
					loader: "style-loader", // creates style nodes from JS strings
					options: {
						sourceMap: true
					}
				}, {
					loader: "css-loader" // translates CSS into CommonJS
				}, {
					loader: "resolve-url-loader",
					options: {
						keepQuery: true
					}
				}, {
					loader: "sass-loader", // compiles Sass to CSS
					options: {
						sourceMap: true
					}
				}]
			}]
	},

	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		// do not emit compiled assets that include errors

		// Define production build to allow React to strip out unnecessary checks
		new webpack.DefinePlugin({
			'process.env':{
				'NODE_ENV': JSON.stringify('production')
			}
		}),

		// Minify the bundle
		new UglifyJSPlugin({
			sourceMap: true,
		}),

		new webpack.LoaderOptionsPlugin({
			options: {
				context: '/'
			}
		}),

		new ExtractTextPlugin(`${package.name}.css`),

		new HtmlWebpackPlugin({
			title: package.title,
			filename: 'index.html',
			hash: true,
			minify: {
				removeComments: true,
				useShortDoctype: true,
				minifyCSS: true,
				minifyJS: true,
				minifyURLs: true
			},
			template: path.resolve(__dirname, 'src/index.html')
		}),

		new CopyWebpackPlugin([
			{from: 'styles/assets', to: 'assets'},
		])
	]
};
