import Koa = require('koa')
import webpack = require('webpack')
import fs from 'fs'

/**
 * 扩充 webpack、koa 类型字段
 */
declare module 'webpack' {
  export interface CustomWebpackState {
    stats?: webpack.StatsCompilation
    outputFileSystem: typeof fs
  }
}

declare module 'koa' {
  export interface CustomContext extends Koa.Context {
    webpackState: Required<webpack.CustomWebpackState>
  }
}
