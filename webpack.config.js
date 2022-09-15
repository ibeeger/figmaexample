const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');
const path = require('path');

function getEnvVars() {
  const envVars = dotenv.config().parsed;
  return Object.keys(envVars).reduce((obj, key) => {
    obj[key] = JSON.stringify(envVars[key]);
    return obj;
  }, {});
}

module.exports = (_env, argv) => {
    return {
        mode: argv.mode === 'production' ? 'production' : 'development',

        // This is necessary because Figma's 'eval' works differently than normal eval
        devtool: argv.mode === 'production' ? false : 'inline-source-map',

        entry: {
            ui: './src/ui/index.tsx', // The entry point for your UI code
            controller: './src/controller/index.ts', // The entry point for your plugin code
        },

        module: {
            rules: [
                // Converts TypeScript code to JavaScript
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                // Enables including CSS by doing "import './file.css'" in your TypeScript code
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        'style-loader',
                        // Translates CSS into CommonJS
                        'css-loader',
                        // Compiles Sass to CSS
                        'sass-loader',
                    ],
                },
                // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
                {test: /\.(png|jpg|gif|webp|svg)$/, loader: 'url-loader'},
            ],
        },

        // Webpack tries these extensions for you if you omit the extension like "import './file'"
        resolve: {extensions: ['.tsx', '.ts', '.jsx', '.js']},

        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'), // Compile into a folder called "dist"
        },
        // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
        plugins: [
          new webpack.DefinePlugin(getEnvVars()),
            new HtmlWebpackPlugin({
                template: './src/ui/index.html',
                filename: 'ui.html',
                chunks: ['ui'],
                inject: 'body',
                cache: false
            }),
            new HtmlInlineScriptPlugin()
        ],
    };
};