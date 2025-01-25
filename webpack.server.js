const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
  entry: { server: './src/server/index.tsx' },
  target: 'node',
  mode: process.env.NODE_ENV || 'production',
  output: {
    filename: 'serverRender.js',
    path: path.resolve(__dirname, 'dist/server'),
    clean: true,
    library: {
      name: 'ssr',
      type: 'commonjs'
    }
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
  // TODO 方便调试，可以仅在 dev 环境下开启
  // optimization: {
  //   minimize: false
  // },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        // use: ['ts-loader']
        // TODO ts compile fail 不阻塞 webpack 编译完毕
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ] // WILL DISABLE TYPESCRIPT ERRORS
      },
      {
        test: /\.css$/i, // 处理 css 文件，先安装依赖，再配置
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // 将 css 抽离到文件中，通过 link 标签将文件引入 html 中
            options: {
              emit: false
            }
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    })
  ]
}
