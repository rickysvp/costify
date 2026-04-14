# Changelog

所有项目的显著变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

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
