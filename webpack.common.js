const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { NODE_ENV } = require('./env.js')

// 先这样临时删除 dist 目录
const rimraf = require('rimraf')
rimraf('./dist', () => {})

module.exports = (mode) => {
  const devMode = mode === NODE_ENV.DEV
  return {
    entry: {
      index: { import: './src/index.tsx' }
    },
    output: {
      filename: '[name].[contenthash].js', // 动态生成 bundle 名称
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    resolve: {
      extensions: ['.tsx', '.ts', '...'],
      alias: {
        components: path.resolve(__dirname, 'src/components/'),
        pages: path.resolve(__dirname, 'src/pages/'),
        assets: path.resolve(__dirname, 'src/assets/'),
        utils: path.resolve(__dirname, 'src/utils/'),
        types: path.resolve(__dirname, 'src/types/')
      }
    },
    externals: {
      react: 'React', // key 对应引入包的名称 value 原包向window中注入的变量名称
      'react-dom': 'ReactDOM',
      'react-dom/client': 'ReactDOM'
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          // 'test-vendor': {
          //   test: /[\\/]node_modules[\\/]/,
          //   name: 'test-vendor',
          //   chunks(chunk){
          //     return chunk.name === 'test'
          //   }
          // },
          'index-vendor': {
            test: /[\\/]node_modules[\\/]/,
            name: 'index-vendor',
            chunks(chunk) {
              return chunk.name === 'index'
            }
          }
        }
      }
    },
    devServer: {
      devMiddleware: {
        // 这里还能开启服务端渲染呢
        // wroteToDisk: true
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'test of webpack 学习',
        filename: 'test.html',
        chunks: ['test']
      }),
      // new webpack.DefinePlugin({
      //   TWO: "1+1",
      // }),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css'
      })
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          use: ['ts-loader']
        },
        {
          test: /\.jsx$/i,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                [
                  ('@babel/preset-react',
                  { runtime: 'automatic', importSource: '@emotion/react' })
                ]
              ]
            }
          }
        },
        {
          test: /\.css$/i, // 处理 css 文件，先安装依赖，再配置
          use: [
            {
              loader: MiniCssExtractPlugin.loader, // 将 css 抽离到文件中，通过 link 标签将文件引入 html 中
              options: {}
            },
            'css-loader'
          ]
        },
        {
          test: /\.(|jpg|gif)$/i, // 处理图片，先安装依赖，再配置
          type: 'asset/resource',
          generator: {
            // emit: false
          }
        },
        {
          test: /\.png$/i,
          type: 'asset/inline'
        },
        {
          test: /\.(jpeg|svg)/,
          type: 'asset/source'
        }
      ]
    }
  }
}
