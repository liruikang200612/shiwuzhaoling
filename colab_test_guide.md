# 使用Colab测试后端API的指南

## 步骤1：本地运行后端

```bash
cd backend
npm install
npm run dev
```

此时后端应该在本地的5000端口运行。

## 步骤2：使用ngrok暴露本地服务

1. 下载并安装ngrok：https://ngrok.com/download
2. 运行以下命令：

```bash
ngrok http 5000
```

3. ngrok会提供一个公网URL，例如：`https://abcd1234.ngrok.io`

## 步骤3：在Colab中设置BASE_URL

在Colab测试脚本中，将BASE_URL设置为ngrok提供的URL加上/api：

```python
BASE_URL = "https://abcd1234.ngrok.io/api"  # 替换为您的ngrok URL
```

## 步骤4：运行Colab测试脚本

运行Colab中的测试脚本，现在它应该能够连接到您的本地后端了。

## 注意事项

- ngrok免费版每次启动会生成不同的URL
- 如果重启ngrok，需要在Colab中更新BASE_URL
- 确保后端在运行ngrok之前已经启动 