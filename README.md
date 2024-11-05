# node client deploy part

1. git pull
2. npm install
3. npm run test
4. npm run server
   1. build
   2. node index

# client dev part

## 启动

1. npm install
2. npm run start

## 添加路由

- src/pages 添加页面子目录
- 在新增目录下添加 Route.tsx 添加子路由
- src/Routes.tsx 会读取 pages/\*/Routes.tsx 文件（无需手动操作）

## 测试

1. 在项目根目录下 /**tests** 中添加测试用例&mockdata
2. npm run test
