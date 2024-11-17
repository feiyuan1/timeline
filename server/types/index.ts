import Koa = require('koa')
import webpack = require('webpack')

/**
 * 扩充 webpack、koa 类型字段
 */
declare module 'webpack' {
  export interface CustomWebpackState {
    stats?: webpack.StatsCompilation
  }
}

declare module 'koa' {
  export interface CustomContext extends Koa.Context {
    webpackState: webpack.CustomWebpackState
  }
}
