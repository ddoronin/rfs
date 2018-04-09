const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const package = require('./package.json');
const HOST_NAME = 'localhost';
const PORT_NUMBER = 3000;
const formidable = require('formidable');
const fs = require('fs');

module.exports = {
	mode: 'development',

	entry: [
		'react-hot-loader/patch',

		`webpack-dev-server/client?http://${HOST_NAME}:${PORT_NUMBER}`,
		// bundle the client for webpack-dev-server
		// and connect to the provided endpoint

		'webpack/hot/only-dev-server',
		// bundle the client for hot reloading
		// only- means to only hot reload for successful updates

		'./src/index.tsx'
	],

	devtool: 'source-map',

	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"]
	},

	output: {
		path: path.resolve(__dirname, 'public'),

		filename: `${package.name}.js`,

		publicPath: '/'
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
		new webpack.HotModuleReplacementPlugin(),
		// enable HMR globally

		new webpack.NamedModulesPlugin(),
		// prints more readable module names in the browser console on HMR updates

		new webpack.NoEmitOnErrorsPlugin(),
		// do not emit compiled assets that include errors

		new webpack.LoaderOptionsPlugin({
			options: {
				context: '/'
			}
		}),

		new HtmlWebpackPlugin({
			title: package.title,
			hash: true,
			template: path.resolve(__dirname, './src/index.html')
		}),

		new CopyWebpackPlugin([
			{from: 'styles/assets', to: 'assets'},
		])
	],
	devServer: {
		contentBase: '/',

		host: HOST_NAME,

		port: PORT_NUMBER,

		historyApiFallback: true,
		// respond to 404s with index.html

		hot: true,
		// enable HMR on the server

		before(app) {
			app.get('/api/files', (req, res) => {
				setTimeout(() => {
                	res.send(JSON.stringify([
						{name: 'a'},
						{name: 'b'}
					]));
				}, 2000);
			});



			app.post('/api/files', (req, res) => {
                // create an incoming form object
                var form = new formidable.IncomingForm();

                // specify that we want to allow the user to upload multiple files in a single request
                form.multiples = true;

                // store all uploads in the /uploads directory
                form.uploadDir = path.join(__dirname, '/uploads');

                // every time a file has been uploaded successfully,
                // rename it to it's orignal name
                form.on('file', function(field, file) {
                    fs.rename(file.path, path.join(form.uploadDir, file.name));
                });

                // log any errors that occur
                form.on('error', function(err) {
                    console.log('An error has occured: \n' + err);
                });

                // once all the files have been uploaded, send a response to the client
                form.on('end', function() {
                    res.end('success');
                });

                // parse the incoming request containing the form data
                form.parse(req);


				res.send();
			});
		}
	}
};
