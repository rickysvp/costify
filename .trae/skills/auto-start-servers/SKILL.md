---
name: "auto-start-servers"
description: "自动启动项目所需的所有服务器（前端和后端）。当用户要求启动服务器、运行项目、开始开发或类似请求时，必须立即调用此技能同时启动所有服务。"
---

# Auto Start Servers

## 触发条件

当用户说以下任何内容时，必须立即调用此技能：
- "启动服务器"
- "启动项目"
- "运行项目"
- "开始开发"
- "打开服务器"
- "npm run dev"
- "node server"
- 任何涉及启动服务的请求

## 操作步骤

对于 AnyTokn/Costify 项目，需要同时启动两个服务：

### 1. 后端 API 服务器
```bash
node server.cjs
```
- 端口: 3001
- 地址: http://localhost:3001

### 2. 前端开发服务器
```bash
npm run dev
```
- 端口: 5173
- 地址: http://localhost:5173

## 执行规则

1. **必须同时启动两个服务**，使用两个独立的终端
2. **先启动后端**，等待 2-3 秒确认启动成功
3. **再启动前端**，等待 5 秒确认启动成功
4. **向用户报告两个服务的地址**

## 演示账号

启动后告知用户：
- 管理员: admin@anytokn.io / admin123
- 成员: alice@anytokn.io / member123

## 访问地址

用户应该访问前端地址：http://localhost:5173
