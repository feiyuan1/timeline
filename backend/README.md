# typscript

## 扩展类型

在 BackenType.d.ts 中为三方模块扩展类型定义，比如 Koa.Context

# nodemon 使用

## 更改 nodemon 执行的命令

```
// 无论启动的文件扩展或文件名称，nodemon 执行的命令固定
// "exec": "npx tsc -p ./backend && node ./dist/backend/index.js"
// 针对指定的文件扩展名，自定义命令
 "execMap": {
    "js": "npx tsc -p ./backend && node"
  }

```

# mongodb

## cloud cluster overview url

https://cloud.mongodb.com/v2/6756bc6c542d94396b2e3f72#/overview

## user and psd

user: balabala
psd: qazwsx123\*

## cloud mongodb connection string

进入云集群 overview 页面，点击 get connection string

## 遇到的问题以及解法

1. Error: queryTxt ETIMEOUT timeline-db.yadvr.mongodb.net
   Windows control panel >> Network and Sharing

   Adapter settings

   Right-click on LAN or Wifi >> Properties

   Click IPv4 >> Properties

   Use the following DNS: 8.8.8.8, 8.8.4.4

2. cloud cluster config ip address list
   ip address 后面默认会跟 /32，如 192.168.5.3/32，/32 代表二进制子网掩码（二进制 32 位，10 进制 12 位）中 1 的个数

# 路由

路由集中在 backend/routes 目录下

## 添加路由文件

1. 在 backend/routes 下添加文件 xxx.ts
2. 导出函数
3. 在 backend/routes/index.ts 中执行 xxx.ts 导出的函数

## 路由通用中间件

1. 处理响应
   - 使用 backend/routes/struct.ts 文件导出 dataStruct 方法，整理响应结构
   - 可以指定 Koa.Context.error 为错误信息，为前端开发人员指明异常
2. 处理数据库 collectionMiddleware
   - 向 Koa.Context.db.collection 赋值为当前路由文件操作的 collection

## 路由数据结构

类似 line、line-group 这样的数据，抽象出数据结构，集中到 backend/routes/struct.ts
