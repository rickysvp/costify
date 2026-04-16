# Changelog

所有项目的显著变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.1.8] - 2026-04-16

### Changed
- 重构首页落地页，参考 Helicone 专业风格
- 突出企业级 AI 成本控制与优化系统定位
- 添加企业级安全合规展示（SOC2、GDPR、ISO27001）
- 添加客户成功案例模块
- 全站支持中英文切换
- 移除价格方案模块

## [1.1.7] - 2026-04-16

### Added
- 创建 seed.js 数据库初始化脚本
- 添加演示用户和组织数据
- 添加演示项目和 API Keys
- 添加 30 天演示 API 使用数据
- 添加 `npm run seed` 命令

## [1.1.6] - 2026-04-16

### Changed
- 全局品牌名称替换为 AnyTokn
- 更新 index.html 页面标题
- 更新 Dashboard 欢迎语
- 更新 Docs 接入指南文档
- 更新 Projects 项目说明
- 更新 LandingPage 首页全部品牌引用
- 更新 server.js 启动日志

## [1.1.5] - 2026-04-16

### Changed
- 品牌重定义为 AnyTokn
- 全新黑白色系设计 - 极简专业风格
- 主色调改为纯黑 (#000000) 和纯白 (#FFFFFF)
- 使用 neutral 灰色系构建层次
- 更新 Logo 为 Hexagon 几何图形
- 更新标语为 "AI Token Management"

## [1.1.4] - 2026-04-14

### Fixed
- 修复 CSS 语法错误（index.css 不完整导致的 At-rule 错误）

## [1.1.3] - 2026-04-14

### Changed
- 重新设计配色风格 - 深邃青 (Teal) 主题
- 更新主色调为 #0D9488 (深邃青)
- 使用 slate 灰色系替代 gray，更加中性专业
- 更新功能色：success (emerald)、warning (amber)、danger (rose)
- 优化整体视觉层次和可读性

## [1.1.2] - 2026-04-14

### Changed
- 使用 Dashboard Layout 仪表盘布局设计系统重构 UI
- 更新主色调为 Indigo (#6366f1)
- 更新卡片样式：bg-white rounded-xl shadow-sm border border-gray-100
- 更新按钮样式：rounded-lg font-medium transition-colors
- 更新输入框样式：focus:ring-primary-500/20 focus:border-primary-500
- 统一使用 gray 色系替代 surface 色系

## [1.1.1] - 2026-04-14

### Changed
- 充值管理从成本中心移到 API 管理分类
- API 管理分类顺序调整为：API Keys、API 市场、充值管理

## [1.1.0] - 2026-04-14

### Added
- API 市场模块 - 展示所有支持的 AI 模型及 I/O 价格
- 预算管理模块 - 详细的预算统计监控和管理措施
- API Key 详情页面 - 支持查看 Key 的使用详情和归属信息
- 成员详情页面 - 支持查看成员的 API 使用记录
- 总览页面本月预算显示
- 30 天花费趋势增加节省趋势

### Changed
- 重新设计导航栏分组结构：
  - API 管理：API 市场、API Keys
  - 成本中心：项目管理、成员管理、预算管理、路由优化、充值管理
  - 数据分析：使用统计、分析报告、消息通知
- 页面标题统一：分析报告（原 AI 报告）、消息通知（原告警中心）、充值管理（原充值账单）

### Fixed
- 修复 BudgetManagement.tsx 重复导入错误
- 修复 Dashboard API thirtyDaysAgo 未定义错误
- 修复 API Key 详情页归属信息展示

## [1.0.0] - 2026-04-14

### Added
- 初始版本发布
- AI 成本管理核心功能
- 项目管理系统
- API Key 管理
- 成员管理
- 实时成本监控
- 预算告警系统
- 智能路由优化
- 多模型支持（GPT-4o、Claude、DeepSeek 等）
- 充值账单管理
- 使用统计报表
- 响应式 Web 界面

### Features
- 统一采购与结算
- 多模型智能路由
- Token 成本优化
- 预算与告警闭环
- 语义缓存机制
- 企业级权限管理
