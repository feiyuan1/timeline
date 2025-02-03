const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { NODE_ENV } = require('./env.js')

module.exports = (mode) => {
  const devMode = mode === NODE_ENV.DEV
  return {
    entry: {
      // index: { import: [devMode ? './src/devIndex.tsx' : './src/index.tsx'] }
      index: './src/index.tsx'
    },
    mode,
    output: {
      filename: '[name].[contenthash].js', // 动态生成 bundle 名称
      path: path.resolve(__dirname, 'dist/client'),
      clean: true,
      publicPath: '/'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '...'],
      alias: {
        components: path.resolve(__dirname, 'src/components/'),
        pages: path.resolve(__dirname, 'src/pages/'),
        assets: path.resolve(__dirname, 'src/assets/'),
        utils: path.resolve(__dirname, 'src/utils/'),
        types: path.resolve(__dirname, 'src/types/'),
        _constants: path.resolve(__dirname, 'src/constants'),
        api: path.resolve(__dirname, 'src/api/'),
        public: path.resolve(__dirname, 'src/public/')
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
        chunks: 'all',
        maxSize: 100000, //100kb
        cacheGroups: {
          default: {
            minChunks: 2,
            name: 'default'
          },
          index_style: {
            type: 'css/mini-extract',
            name: 'index_style',
            enforce: true
          },
          public_tool: {
            test: /src[\\/](utils|public|constants|components)/,
            name: 'public_tool',
            priority: 1
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor'
          },
          mui: {
            test: /(@mui|@emotion|react-transition-group)/,
            priority: 1,
            name: 'mui'
          },
          react_router: {
            test: /(react-router|@remix)/,
            priority: 1,
            name: 'react-router'
          },
          mui_material: {
            test: /@mui[\\/]material/,
            priority: 2,
            name: 'mui_material'
          }
        }
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css'
      })
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          // use: ['ts-loader']
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ]
        },
        // {
        //   test: /\.jsx$/i,
        //   use: {
        //     loader: 'babel-loader',
        //     options: {
        //       presets: [
        //         '@babel/preset-env',
        //         [
        //           ('@babel/preset-react',
        //           { runtime: 'automatic', importSource: '@emotion/react' })
        //         ]
        //       ]
        //     }
        //   }
        // },
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
