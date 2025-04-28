# 后端部署常见问题解答

## 1. MongoDB连接问题

**问题：** 部署后无法连接到MongoDB数据库

**解决方案：**
- 确保MongoDB连接字符串格式正确
- 检查MongoDB用户名和密码是否正确
- 确认MongoDB服务器IP是否在允许连接的白名单内
- 如果使用MongoDB Atlas，确保网络访问设置为"允许从任何地方访问"

## 2. 跨域问题(CORS)

**问题：** 前端无法正常请求后端API，出现CORS错误

**解决方案：**
- 检查后端的CORS配置，确保允许前端域名
- 修改`src/index.js`中的CORS配置：
  ```javascript
  app.use(cors({
    origin: '*',  // 开发环境使用，生产环境应该限制为前端域名
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
  ```

## 3. 环境变量问题

**问题：** 部署后环境变量未正确加载

**解决方案：**
- 检查是否正确设置了所有必需的环境变量
- 不同平台设置环境变量的方法：
  - Render: 在Web Service的Environment部分
  - Railway: 在项目的Variables部分
  - 服务器: 在启动命令前设置或使用.env文件
  - Docker: 在docker-compose.yml中设置

## 4. 端口冲突

**问题：** 应用无法启动，提示端口被占用

**解决方案：**
- 更改应用使用的端口：
  ```javascript
  // src/index.js
  const PORT = process.env.PORT || 5001;  // 更改默认端口
  ```
- 或者找到并关闭占用端口的进程

## 5. 部署后数据库为空

**问题：** 部署后数据库中没有初始数据

**解决方案：**
- 部署完成后运行种子数据脚本：
  ```bash
  npm run seed
  ```
- 或者在部署流程中添加自动运行种子脚本的步骤

## 6. 性能问题

**问题：** API响应缓慢

**解决方案：**
- 考虑在MongoDB中创建适当的索引
- 实现API响应缓存
- 使用更高配置的服务器或服务计划
- 优化数据库查询

## 7. 日志和监控

**问题：** 难以追踪API问题

**解决方案：**
- 在生产环境中使用日志服务如sentry.io
- 添加详细的日志记录
- 使用监控工具如Datadog或New Relic
- 设置健康检查接口 