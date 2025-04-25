# description

包含了 3 个端的实现：

- backend server，负责与数据库、frontend server交互
- frontend server，负责与 backend server、client 交互
- client，负责与用户交互

# directory

- **tests** // 测试用例
- dist // 三个端的打包结果
  - backend
  - server // frontend server
  - client
- public // 三个端共用的方法、类型
  - types // 共用类型
  - utils // 共用方法
  - constants // 共用常量
  - index.html // client 打包使用的页面模板
- scripts // client 打包引用的 cdn url
- backend // backend server code
- server // frontend server code
- src // client code

# node client deploy part

1. git pull
2. npm install
3. npm run test
4. npm run server
   1. build
   2. node index

# backend server dev part

## nodemon

支持检测文件内容变更，重启服务

## 启动

`npm run backend-be`
包含了打包文件&启动服务

## 更多

见 backend/README.md

# frontend server dev part

## 启动

`npm run server-fe`

# client dev part

## 启动

1. `npm install`
2. `npm run symLink // 将公共部分软链到三个端 `
3. `npm run server-be // 启动 backend server `
4. `npm run start // 使用 webpack-dev-server 启动前端服务`

## 目录结构

- api // 接口调用
- assets // 静态资源（图片）
- components // 公共组件
- constants // 公共常量
- public // 从根目录软链的内容
- types // 公共类型
- utils // 公共方法
- pages // 页面实现
  - error // 异常页面
    - 404
    - ...
  - line、group、main、...
    - route.ts // 路由文件
    - Page.tsx // 页面级组件
- Router // 收集 pages 目录下的 route.ts
- App // 添加所有子节点的公共父级节点，比如 context
- index // 组装 App & Router

## 添加路由

- src/pages 添加页面子目录
- 在新增目录下添加 route.ts 添加子路由
- route.ts 导出 CustomRouteObject[]
- src/Router 会读取 pages/\*/route.ts 文件（无需手动操作），并提供给 RouterProvider

## 测试

1. 在项目根目录下 `/__tests__` 中添加测试用例&mockdata
2. npm run test
3. webpack.dev.js 增加 plugin 支持每次编译完毕后重新执行测试用例
4. 更多见 `__tests__/README.md`

# webpack 拆包思路

1. entry point 只有 1 个
2. 每条路由都被动态引入
3. 使用 default minChunks cacheGroup
4. 将 `/src[\\/](utils|public|constants|components)/` 目录下的文件合并到 `public-tools` chunk
5. 将 `/(@mui|@emotion|react-transition-group)/` 目录下的文件合并到 `mui` chunk
6. 将 `/(react-router|@remix)/` 目录下的文件合并到 `react-router` chunk
7. 将 `/@mui[\\/]material/` 目录下的文件合并到 `mui_material` chunk
8. 使用 default node_modules cacheGroup
9. 上述所有 chunk 体积超出 100kb 时会被 webpack 自动切割

## css 文件的处理

1. 被 MiniCssExtractPlugin 抽离到单独 css 文件
2. cacheGroup 将所有的 css 文件合并到 1 个 chunk
