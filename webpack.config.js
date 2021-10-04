const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackInjector = require('html-webpack-injector');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const env = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
const ImageminWebpack = require('imagemin-webpack-plugin').default;

const cssnano = require('cssnano');
const imagemin = require('imagemin');
const imageminSvgo = require('imagemin-svgo');
const {extendDefaultPlugins} = require('svgo');

(async () => {
	await imagemin(['images/*.svg'], {
		destination: 'build/images',
		plugins: [
			imageminSvgo({
				plugins: extendDefaultPlugins([
					{name: 'removeViewBox', active: false}
				])
			})
		]
	});


})();
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
// const imageminSvgo = require('imagemin-svgo');


const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  return {
    entry: ['./src/index.js'],
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'js/bundle.js',
    },
    mode: 'development',
    //change for prod
    // devtool: 'eval-cheap-module-source-map',
    // devServer: {
    //   contentBase: path.join(__dirname, '/'),
    //   compress: false,

    //   hot: true,
    //   port: 9000,
    // },
    // resolve: {
    //   fallback: {
    //     os: false,
    //     // path: false,
    //     // fs: false,
    //   },
    // },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../',
              },
            },

            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                esModule: true,
                modules: {
                  namedExport: true,
                  localIdentName: '[local]',
                },
                //change for prod
                sourceMap: false,
              },
            },

            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    env({
                      stage: 0,
                    }),
                    autoprefixer({}),
                    cssnano({
                      preset: 'default',
                    }),
                  ],
                  minify: true,
                  sourceMap: true,
                },
              },
            },

            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpg|gif|svg|jpeg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `img/[name].[ext]`,
                esModule: false,
              },
            },
          ],
          // type: 'asset/resource',
        },

        {
          test: /\.woff2$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/template.html',
        title: 'PE skills',
      }),
      new HtmlWebpackInjector(),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].css',
      }),
      new ImageminWebpack({
        plugins: [
          imageminMozjpeg({
            progressive: true,
            quality: 60,
          }),
          imageminPngquant({
            quiality: 60,
          }),
          imageminSvgo({}),
        ],
      }),
    ],
  };
};
