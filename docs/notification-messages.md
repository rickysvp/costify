# AnyTokn 消息通知类型文档

> 本文档包含所有消息通知类型的文案定义，供开发人员参考使用。
> 
> 最后更新：2026-04-23
> 版本：v2.0.1

---

## 目录

1. [预算与费用类 (Budget & Billing)](#一预算与费用类-budget--billing)
2. [用量与配额类 (Usage & Quota)](#二用量与配额类-usage--quota)
3. [成本优化类 (Cost Optimization)](#三成本优化类-cost-optimization)
4. [API Key 管理类 (API Key Management)](#四api-key-管理类-api-key-management)
5. [项目管理类 (Project Management)](#五项目管理类-project-management)
6. [成员与权限类 (Member & Permission)](#六成员与权限类-member--permission)
7. [安全与审计类 (Security & Audit)](#七安全与审计类-security--audit)
8. [系统与服务类 (System & Service)](#八系统与服务类-system--service)
9. [产品更新类 (Product Updates)](#九产品更新类-product-updates)
10. [营销与运营类 (Marketing & Operations)](#十营销与运营类-marketing--operations)

---

## 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | string | 消息类型标识符，唯一 |
| `category` | string | 消息分类 |
| `severity` | string | 严重程度: `info` / `warning` / `critical` |
| `title` | string | 消息标题（中文） |
| `titleEn` | string | 消息标题（英文） |
| `content` | string | 消息内容（中文） |
| `contentEn` | string | 消息内容（英文） |
| `channels` | array | 通知渠道: `inApp` / `email` / `sms` / `webhook` / `slack` |
| `project` | string | 关联项目名称（可选） |

---

## 一、预算与费用类 (Budget & Billing)

### 1.1 预算上限控制

#### `budget_80` - 预算使用达 80%
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 预算使用达 80%
- **英文标题**: Budget Usage at 80%
- **中文内容**: 项目 "ChatBot Pro" 本月预算使用已达 80% ($400.00/$500.00)，请关注用量
- **英文内容**: Project "ChatBot Pro" budget usage reached 80% ($400.00/$500.00)

#### `budget_90` - 预算使用达 90%
- **严重程度**: warning
- **通知渠道**: inApp, email, sms
- **中文标题**: 预算使用达 90% - 即将达到上限
- **英文标题**: Budget Usage at 90% - Approaching Limit
- **中文内容**: 项目 "AI Assistant" 本月预算使用已达 90% ($450.00/$500.00)，建议调整预算或降低用量
- **英文内容**: Project "AI Assistant" budget at 90% ($450.00/$500.00), consider adjustment

#### `budget_95` - 预算使用达 95%
- **严重程度**: warning
- **通知渠道**: inApp, email, sms
- **中文标题**: 预算使用达 95% - 即将达到上限
- **英文标题**: Budget Usage at 95% - Approaching Limit
- **中文内容**: 项目 "API Gateway" 预算使用已达 95% ($950.00/$1000.00)，达到 100% 后 API 将立即暂停，建议立即调整预算或降低用量
- **英文内容**: Project "API Gateway" budget at 95% ($950.00/$1000.00), API will pause at 100%, adjust budget or reduce usage

#### `budget_100` - 预算使用达 100%
- **严重程度**: critical
- **通知渠道**: inApp, email, sms
- **中文标题**: 预算使用达 100% - 服务已暂停
- **英文标题**: Budget Usage at 100% - Service Paused
- **中文内容**: 项目 "Demo Project" 已达到月度预算上限 $500.00，API 调用已立即暂停。如需恢复，请调整预算或等待下月重置。
- **英文内容**: Project "Demo Project" reached budget limit $500.00, API calls paused immediately. Adjust budget or wait for reset.

#### `budget_paused` - 项目已暂停
- **严重程度**: critical
- **通知渠道**: inApp, email, sms
- **中文标题**: 项目已暂停 - 预算耗尽
- **英文标题**: Project Paused - Budget Exhausted
- **中文内容**: 项目 "ChatBot Pro" 因达到月度预算上限，API 调用已暂停。如需恢复，请调整预算或等待下月重置。
- **英文内容**: Project "ChatBot Pro" API calls paused due to budget limit. Adjust budget or wait for reset.

#### `apikey_paused` - API Key 已暂停
- **严重程度**: critical
- **通知渠道**: inApp, email
- **中文标题**: API Key 已暂停 - 预算耗尽
- **英文标题**: API Key Paused - Budget Exhausted
- **中文内容**: API Key "sk-prod-xxx123" 因达到预算上限已暂停使用，相关请求返回 429 错误
- **英文内容**: API Key "sk-prod-xxx123" paused due to budget limit, returning 429 errors

#### `budget_reset` - 预算已重置
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 预算已重置 - 服务已恢复
- **英文标题**: Budget Reset - Service Resumed
- **中文内容**: 项目 "ChatBot Pro" 月度预算已重置为 $500.00，API 调用已恢复正常
- **英文内容**: Project "ChatBot Pro" budget reset to $500.00, API calls resumed

#### `budget_adjusted` - 预算已调整
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 预算已调整
- **英文标题**: Budget Adjusted
- **中文内容**: 管理员 张三 已将项目 "AI Assistant" 的月度预算从 $500.00 调整为 $800.00，时间：2026-04-23 14:30
- **英文内容**: Admin John adjusted project "AI Assistant" budget from $500.00 to $800.00, at: 2026-04-23 14:30

### 1.2 账户余额

#### `balance_100` - 账户余额低于 $100
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 账户余额低于 $100
- **英文标题**: Balance Below - **中文标题**: 账户余额低于 $10000
- **中文内容**: 您的账户余额为 $85.50，低于 $100 阈值，建议及时充值
- **英文内容**: Your balance is $85.50, below $100 threshold, consider recharging

#### `balance_50` - 账户余额低于 $50
- **严重程度**: warning
- **通知渠道**: inApp, email, sms
- **中文标题**: 账户余额低于 $50
- **英文标题**: Balance Below $50
- **中文内容**: 您的账户余额为 $45.00，低于 $50 阈值，请及时充值以避免服务中断
- **英文内容**: Your balance is $45.00, below $50 threshold, recharge to avoid interruption

#### `balance_20` - 账户余额即将耗尽
- **严重程度**: critical
- **通知渠道**: inApp, email, sms
- **中文标题**: 账户余额即将耗尽
- **英文标题**: Balance Nearly Exhausted
- **中文内容**: 您的账户余额仅剩 $18.00，预计还可使用 1 天，请立即充值
- **英文内容**: Your balance is $18.00, estimated 1 day remaining, recharge immediately

#### `balance_exhausted` - 账户余额已耗尽
- **严重程度**: critical
- **通知渠道**: inApp, email, sms
- **中文标题**: 账户余额已耗尽 - 服务已暂停
- **英文标题**: Balance Exhausted - Service Paused
- **中文内容**: 您的账户余额为 $0.00，所有 API 调用已暂停，请立即充值恢复服务
- **英文内容**: Your balance is $0.00, all API calls paused, recharge to resume

#### `recharge_success` - 充值成功
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 充值成功
- **英文标题**: Recharge Successful
- **中文内容**: 充值成功，金额：$500.00，当前余额：$545.00，感谢使用 AnyTokn
- **英文内容**: Recharge successful: $500.00, current balance: $545.00, thank you for using AnyTokn

#### `recharge_failed` - 充值失败
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 充值失败
- **英文标题**: Recharge Failed
- **中文内容**: 充值支付失败，信用卡扣款被拒绝，请检查支付方式或联系银行
- **英文内容**: Recharge failed, card declined, check payment method or contact bank

### 1.3 账单与付款

#### `invoice_ready` - 账单已生成
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 账单已生成
- **英文标题**: Invoice Ready
- **中文内容**: 您的 6 月账单已生成，总金额：$1,250.00，用量：2.5M tokens，明细请查看账单页面
- **英文内容**: Your June invoice is ready: $1,250.00, usage: 2.5M tokens, see billing page

#### `payment_success` - 付款成功
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 付款成功
- **英文标题**: Payment Successful
- **中文内容**: 自动扣款成功，金额：$1,250.00，发票已发送至您的邮箱
- **英文内容**: Auto-payment successful: $1,250.00, invoice sent to your email

#### `payment_failed` - 付款失败
- **严重程度**: critical
- **通知渠道**: inApp, email, sms
- **中文标题**: 付款失败 - 服务即将暂停
- **英文标题**: Payment Failed - Service Will Pause
- **中文内容**: 信用卡扣款失败，请在 24 小时内更新支付方式，否则 API 服务将暂停
- **英文内容**: Card payment failed, update payment method within 24h or API will be paused

#### `payment_overdue` - 付款逾期
- **严重程度**: critical
- **通知渠道**: inApp, email, sms
- **中文标题**: 付款逾期 - 服务已暂停
- **英文标题**: Payment Overdue - Service Paused
- **中文内容**: 账单已逾期 3 天，所有 API 调用已暂停，请立即付款恢复服务
- **英文内容**: Invoice overdue 3 days, all API calls paused, pay immediately to resume

---

## 二、用量与配额类 (Usage & Quota)

#### `daily_report` - 每日用量报告
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 每日用量报告
- **英文标题**: Daily Usage Report
- **中文内容**: 昨日总调用量：125,000 次，费用：$2.50，Top 项目：AI Assistant (45,000 次)，GPT-4 占比 65%
- **英文内容**: Yesterday: 125,000 calls, $2.50 cost, Top: AI Assistant (45,000), GPT-4: 65%

#### `usage_spike` - 用量异常激增
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 用量异常激增
- **英文标题**: Usage Spike Detected
- **中文内容**: 项目 "AI Assistant" 过去 1 小时 API 调用量达 50,000 次，较平时增长 500%，请检查是否存在异常
- **英文内容**: Project "AI Assistant" 50,000 calls in past hour, 500% increase, check for anomalies

#### `usage_anomaly` - 用量异常检测
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 用量异常检测
- **英文标题**: Usage Anomaly Detected
- **中文内容**: 检测到异常调用模式：凌晨 3-5 点调用量突增，可能存在自动化脚本或安全问题
- **英文内容**: Anomaly detected: spike at 3-5 AM, possible automation or security issue

#### `rate_limit_approaching` - 接近速率限制
- **严重程度**: warning
- **通知渠道**: inApp
- **中文标题**: 接近速率限制
- **英文标题**: Approaching Rate Limit
- **中文内容**: 项目 "High Traffic" 当前 980 RPM，接近 1000 RPM 限制，建议降低请求频率
- **英文内容**: Project "High Traffic" at 980 RPM, approaching 1000 RPM limit, reduce frequency

#### `rate_limit_hit` - 速率限制已触发
- **严重程度**: critical
- **通知渠道**: inApp, email
- **中文标题**: 速率限制已触发
- **英文标题**: Rate Limit Triggered
- **中文内容**: 项目 "Test Project" 超过 1000 RPM 限制，请求被拒绝，请 1 分钟后重试
- **英文内容**: Project "Test Project" exceeded 1000 RPM, requests rejected, retry in 1 min

---

## 三、成本优化类 (Cost Optimization)

#### `cost_saved_monthly` - 月度成本节省报告
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 月度成本节省报告
- **英文标题**: Monthly Cost Savings Report
- **中文内容**: 本月智能路由为您节省 $156.80，缓存命中 12,500 次，模型降级节省 $32.50
- **英文内容**: This month saved $156.80 via smart routing, 12,500 cache hits, downgrade saved $32.50

#### `routing_enabled` - 智能路由已启用
- **严重程度**: info
- **通知渠道**: inApp
- **中文标题**: 智能路由已启用
- **英文标题**: Smart Routing Enabled
- **中文内容**: 项目 "Demo Project" 已启用智能路由，预计可节省 20-30% 成本，缓存策略：动态
- **英文内容**: Smart routing enabled for "Demo Project", estimated 20-30% savings, cache: dynamic

#### `model_fallback` - 模型自动降级通知
- **严重程度**: info
- **通知渠道**: inApp
- **中文标题**: 模型自动降级通知
- **英文标题**: Model Auto-Downgrade Notice
- **中文内容**: GPT-4 限流期间，3,250 次请求已自动降级到 GPT-3.5，为您节省 $32.50，服务质量未受影响
- **英文内容**: 3,250 requests auto-downgraded to GPT-3.5 during GPT-4 limit, saved $32.50

#### `cache_low` - 缓存命中率偏低
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 缓存命中率偏低
- **英文标题**: Low Cache Hit Rate
- **中文内容**: 项目 "API Gateway" 缓存命中率仅 15%，建议调整缓存策略或增加缓存时间
- **英文内容**: Project "API Gateway" cache hit rate 15%, consider adjusting strategy or TTL

#### `cost_anomaly` - 成本异常检测
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 成本异常检测
- **英文标题**: Cost Anomaly Detected
- **中文内容**: 项目 "ChatBot Pro" 昨日成本 $85.00，较日均 $15.00 增长 467%，请检查用量
- **英文内容**: Project "ChatBot Pro" yesterday cost $85.00, 467% above daily avg $15.00

---

## 四、API Key 管理类 (API Key Management)

#### `apikey_created` - API Key 已创建
- **严重程度**: info
- **通知渠道**: inApp
- **中文标题**: API Key 已创建
- **英文标题**: API Key Created
- **中文内容**: 您本人 (ID: user_12345) 已创建 API Key "sk-live-xxx456"，请立即复制保存，此信息仅显示一次。项目：AI Assistant，时间：2026-04-23 10:30
- **英文内容**: You (ID: user_12345) created API Key "sk-live-xxx456", copy immediately, shown only once. Project: AI Assistant, at: 2026-04-23 10:30

#### `apikey_disabled` - API Key 已禁用
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: API Key 已禁用
- **英文标题**: API Key Disabled
- **中文内容**: 管理员 李四 已手动禁用 API Key "sk-test-xxx789"，相关请求将返回 401 错误，时间：2026-04-23 10:15
- **英文内容**: Admin Jane manually disabled API Key "sk-test-xxx789", requests will return 401, at: 2026-04-23 10:15

#### `apikey_revoked` - API Key 已撤销
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: API Key 已撤销
- **英文标题**: API Key Revoked
- **中文内容**: 管理员 王五 已永久撤销 API Key "sk-prod-xxx111"，时间：2026-04-23 09:45
- **英文内容**: Admin Bob permanently revoked API Key "sk-prod-xxx111", at: 2026-04-23 09:45

#### `apikey_expiring_7d` - API Key 7天后过期
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: API Key 7天后过期
- **英文标题**: API Key Expires in 7 Days
- **中文内容**: API Key "sk-test-xxx222" 将在 7 天后过期（2026-04-30），请及时更新
- **英文内容**: API Key "sk-test-xxx222" expires in 7 days (2026-04-30), please update

#### `apikey_expiring_1d` - API Key 1天后过期
- **严重程度**: warning
- **通知渠道**: inApp, email, sms
- **中文标题**: API Key 1天后过期
- **英文标题**: API Key Expires in 1 Day
- **中文内容**: API Key "sk-dev-xxx333" 将在 1 天后过期，请立即更新以避免服务中断
- **英文内容**: API Key "sk-dev-xxx333" expires in 1 day, update immediately to avoid interruption

#### `apikey_expired` - API Key 已过期
- **严重程度**: critical
- **通知渠道**: inApp, email
- **中文标题**: API Key 已过期 - 请求被拒绝
- **英文标题**: API Key Expired - Requests Rejected
- **中文内容**: API Key "sk-old-xxx444" 已过期，相关请求返回 401 错误，请使用新 Key
- **英文内容**: API Key "sk-old-xxx444" expired, requests returning 401, use new key

#### `apikey_geo_anomaly` - 异地访问检测
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 异地访问检测
- **英文标题**: New Location Login Detected
- **中文内容**: API Key "sk-prod-xxx555" 检测到来自新 IP 的调用：203.0.113.45（美国），如非本人操作请立即轮换 Key
- **英文内容**: API Key "sk-prod-xxx555" detected calls from new IP: 203.0.113.45 (US), rotate if not you

#### `apikey_usage_spike` - API Key 调用量突增
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: API Key 调用量突增
- **英文标题**: API Key Usage Spike
- **中文内容**: API Key "sk-live-xxx666" 过去 1 小时调用量较平时增长 800%，请检查是否异常
- **英文内容**: API Key "sk-live-xxx666" calls up 800% in past hour, check for anomalies

#### `apikey_suspicious` - 疑似 API Key 泄露
- **严重程度**: critical
- **通知渠道**: inApp, email, sms
- **中文标题**: 疑似 API Key 泄露
- **英文标题**: Potential API Key Leak
- **中文内容**: API Key "sk-prod-xxx777" 检测到异常调用模式，可能已泄露，已自动暂停，请立即轮换
- **英文内容**: API Key "sk-prod-xxx777" suspicious pattern detected, possibly leaked, auto-paused, rotate now

---

## 五、项目管理类 (Project Management)

#### `project_created` - 项目创建成功
- **严重程度**: info
- **通知渠道**: inApp
- **中文标题**: 项目创建成功
- **英文标题**: Project Created Successfully
- **中文内容**: 您本人 (ID: user_12345) 已创建项目 "New ChatBot"，API Key：sk-new-xxx789，月度预算：$100.00，路由策略：成本优先，时间：2026-04-23 09:30
- **英文内容**: You (ID: user_12345) created project "New ChatBot", API Key: sk-new-xxx789, budget: $100.00, strategy: cost priority, at: 2026-04-23 09:30

#### `project_archived` - 项目已归档
- **严重程度**: info
- **通知渠道**: inApp
- **中文标题**: 项目已归档
- **英文标题**: Project Archived
- **中文内容**: 您本人 (ID: user_12345) 已将项目 "Legacy Bot" 归档，历史数据保留 90 天，API Key 已自动禁用，时间：2026-04-23 14:00
- **英文内容**: You (ID: user_12345) archived project "Legacy Bot", data retained 90 days, API Key auto-disabled, at: 2026-04-23 14:00

#### `project_deleted` - 项目已删除
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 项目已删除
- **英文标题**: Project Deleted
- **中文内容**: 管理员 张三 已删除项目 "Test Project"，所有数据将在 30 天后永久清除，时间：2026-04-23 11:20
- **英文内容**: Admin John deleted project "Test Project", data will be cleared in 30 days, at: 2026-04-23 11:20

#### `project_limit_80` - 项目数量达 80%
- **严重程度**: warning
- **通知渠道**: inApp
- **中文标题**: 项目数量达 80%
- **英文标题**: Project Count at 80%
- **中文内容**: 您已创建 8/10 个项目，达到 80% 上限，如需更多请联系管理员升级
- **英文内容**: You have created 8/10 projects (80%), contact admin to upgrade for more

#### `project_limit_100` - 项目数量已达上限
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 项目数量已达上限
- **英文标题**: Project Count Limit Reached
- **中文内容**: 您已创建 10/10 个项目，达到上限，无法创建新项目，请联系管理员
- **英文内容**: You have created 10/10 projects, limit reached, contact admin for more

#### `project_settings_updated` - 项目设置已更新
- **严重程度**: info
- **通知渠道**: inApp
- **中文标题**: 项目设置已更新
- **英文标题**: Project Settings Updated
- **中文内容**: 管理员 李四 已更新项目 "AI Assistant" 设置：预算 $500→$800，缓存 TTL 300s→600s，路由策略：质量优先，时间：2026-04-23 15:45
- **英文内容**: Admin Jane updated project "AI Assistant" settings: budget $500→$800, cache TTL 300s→600s, strategy: quality, at: 2026-04-23 15:45

---

## 六、成员与权限类 (Member & Permission)

#### `member_invited` - 成员邀请已发送
- **严重程度**: info
- **通知渠道**: inApp
- **中文标题**: 成员邀请已发送
- **英文标题**: Member Invitation Sent
- **中文内容**: 管理员 王五 已邀请张三 (zhangsan@example.com) 加入组织，角色：成员，邀请有效期 7 天，时间：2026-04-23 10:00
- **英文内容**: Admin Bob invited John (john@example.com) to join, role: Member, expires in 7 days, at: 2026-04-23 10:00

#### `member_joined` - 新成员已加入
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 新成员已加入
- **英文标题**: New Member Joined
- **中文内容**: 李四已接受邀请加入组织，角色：成员，已分配项目：Demo Project
- **英文内容**: Jane joined the organization, role: Member, assigned to: Demo Project

#### `member_left` - 成员已离开
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 成员已离开
- **英文标题**: Member Left
- **中文内容**: 王五已主动退出组织，其 API Key 已自动撤销，项目权限已移除
- **英文内容**: Bob left the organization, their API Keys revoked, project access removed

#### `member_removed` - 成员已被移除
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 成员已被移除
- **英文标题**: Member Removed
- **中文内容**: 管理员 张三 已将赵六移出组织，其 API Key 已自动撤销，时间：2026-04-23 14:20
- **英文内容**: Admin John removed Alice from organization, their API Keys auto-revoked, at: 2026-04-23 14:20

#### `role_changed` - 角色已变更
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 角色已变更
- **英文标题**: Role Changed
- **中文内容**: 管理员 李四 已将您的角色从 "成员" 变更为 "管理员"，获得组织管理权限，时间：2026-04-23 16:00
- **英文内容**: Admin Jane changed your role from "Member" to "Admin", granted management permissions, at: 2026-04-23 16:00

#### `role_downgraded` - 权限已降低
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 权限已降低
- **英文标题**: Permissions Downgraded
- **中文内容**: 管理员 王五 已将您的角色从 "管理员" 变更为 "成员"，部分管理权限已收回，时间：2026-04-23 11:30
- **英文内容**: Admin Bob changed your role from "Admin" to "Member", some permissions revoked, at: 2026-04-23 11:30

#### `admin_granted` - 管理员权限已授予
- **严重程度**: critical
- **通知渠道**: inApp, email, sms
- **中文标题**: 管理员权限已授予
- **英文标题**: Admin Permissions Granted
- **中文内容**: 组织所有者 张三 已授予您管理员权限，可对成员、项目、账单进行管理，时间：2026-04-23 09:00
- **英文内容**: Owner John granted you admin permissions, can manage members, projects, billing, at: 2026-04-23 09:00

#### `admin_revoked` - 管理员权限已收回
- **严重程度**: critical
- **通知渠道**: inApp, email
- **中文标题**: 管理员权限已收回
- **英文标题**: Admin Permissions Revoked
- **中文内容**: 组织所有者 张三 已收回您的管理员权限，当前角色：成员，时间：2026-04-23 13:45
- **英文内容**: Owner John revoked your admin permissions, current role: Member, at: 2026-04-23 13:45

---

## 七、安全与审计类 (Security & Audit)

#### `login_new_device` - 新设备登录
- **严重程度**: critical
- **通知渠道**: inApp, email, sms
- **中文标题**: 新设备登录
- **英文标题**: New Device Login
- **中文内容**: 检测到从新设备登录：Chrome on macOS (IP: 192.168.1.100)，如非本人操作请立即修改密码
- **英文内容**: New device login detected: Chrome on macOS (IP: 192.168.1.100), change password if not you

#### `login_new_location` - 新位置登录
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 新位置登录
- **英文标题**: New Location Login
- **中文内容**: 检测到从新的地理位置登录：上海市 (IP: 203.0.113.45)，如非本人操作请检查账号安全
- **英文内容**: Login from new location: Shanghai (IP: 203.0.113.45), check account security if not you

#### `login_failed_multiple` - 登录失败多次
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 登录失败多次
- **英文标题**: Multiple Login Failures
- **中文内容**: 5 分钟内登录失败 5 次，IP：198.51.100.22，如非本人操作请检查账号安全
- **英文内容**: 5 login failures in 5 min, IP: 198.51.100.22, check security if not you

#### `password_changed` - 密码已修改
- **严重程度**: critical
- **通知渠道**: inApp, email, sms
- **中文标题**: 密码已修改
- **英文标题**: Password Changed
- **中文内容**: 您本人 (ID: user_12345) 已修改登录密码，IP：192.168.1.100，设备：Chrome on macOS，时间：2026-04-23 14:30。如非本人操作请立即找回账号
- **英文内容**: You (ID: user_12345) changed password, IP: 192.168.1.100, Device: Chrome on macOS, at: 2026-04-23 14:30. Recover if not you

#### `email_changed` - 邮箱已修改
- **严重程度**: critical
- **通知渠道**: inApp, email, sms
- **中文标题**: 邮箱已修改
- **英文标题**: Email Changed
- **中文内容**: 您本人 (ID: user_12345) 已将登录邮箱从 old@example.com 修改为 new@example.com，时间：2026-04-23 15:00。如非本人操作请立即联系客服
- **英文内容**: You (ID: user_12345) changed email from old@example.com to new@example.com, at: 2026-04-23 15:00. Contact support if not you

#### `sensitive_operation` - 敏感操作已执行
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 敏感操作已执行
- **英文标题**: Sensitive Operation Executed
- **中文内容**: 管理员执行了敏感操作：批量导出项目数据，操作人：张三，时间：2026-04-23 14:30
- **英文内容**: Admin performed sensitive operation: bulk export project data, by: John, at: 2026-04-23 14:30

---

## 八、系统与服务类 (System & Service)

#### `provider_down` - 供应商服务中断
- **严重程度**: critical
- **通知渠道**: inApp, email
- **中文标题**: 供应商服务中断
- **英文标题**: Provider Service Down
- **中文内容**: OpenAI GPT-4 API 返回 503 错误，已自动切换到 Azure OpenAI，服务质量可能略有下降
- **英文内容**: OpenAI GPT-4 API returning 503, auto-switched to Azure OpenAI, quality may be slightly reduced

#### `provider_slow` - 供应商响应延迟
- **严重程度**: warning
- **通知渠道**: inApp
- **中文标题**: 供应商响应延迟
- **英文标题**: Provider Response Delay
- **中文内容**: Anthropic API 平均响应时间 8.5s（正常 <2s），部分请求可能超时，建议启用超时重试
- **英文内容**: Anthropic API avg latency 8.5s (normal <2s), some requests may timeout, enable retry

#### `provider_recovered` - 供应商服务已恢复
- **严重程度**: info
- **通知渠道**: inApp
- **中文标题**: 供应商服务已恢复
- **英文标题**: Provider Service Recovered
- **中文内容**: OpenAI GPT-4 API 服务已恢复正常，响应时间：1.2s，已切换回主供应商
- **英文内容**: OpenAI GPT-4 API recovered, latency: 1.2s, switched back to primary provider

#### `maintenance_scheduled` - 计划维护提醒
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 计划维护提醒
- **英文标题**: Scheduled Maintenance Reminder
- **中文内容**: 系统维护：本周六 02:00-04:00 (UTC+8)，期间可能有 30 秒服务中断，请提前做好准备
- **英文内容**: Maintenance: Sat 02:00-04:00 (UTC+8), possible 30s interruption, prepare accordingly

#### `maintenance_emergency` - 紧急维护通知
- **严重程度**: critical
- **通知渠道**: inApp, email, sms
- **中文标题**: 紧急维护通知
- **英文标题**: Emergency Maintenance Notice
- **中文内容**: 紧急维护进行中：数据库升级，预计 30 分钟，期间 API 服务可能不稳定
- **英文内容**: Emergency maintenance in progress: database upgrade, ~30 min, API may be unstable

#### `new_version` - 新版本可用
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 新版本可用
- **英文标题**: New Version Available
- **中文内容**: AnyTokn v1.8.0 已发布，新功能：智能缓存预热、多区域部署、增强分析报表
- **英文内容**: AnyTokn v1.8.0 available, new: smart cache warmup, multi-region, enhanced analytics

#### `api_deprecated` - API 版本即将弃用
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: API 版本即将弃用
- **英文标题**: API Version Deprecation
- **中文内容**: API v1 将于 2026-06-01 弃用，请迁移到 v2，文档：https://docs.costify.io/api/v2
- **英文内容**: API v1 deprecated on 2026-06-01, migrate to v2, docs: https://docs.costify.io/api/v2

---

## 九、产品更新类 (Product Updates)

#### `feature_launched` - 新功能上线
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 新功能上线
- **英文标题**: New Feature Launched
- **中文内容**: 智能路由 v2 已上线，支持多模型并行请求、自动故障转移、成本预测
- **英文内容**: Smart Routing v2 launched: multi-model parallel, auto-failover, cost prediction

#### `feature_improved` - 功能改进
- **严重程度**: info
- **通知渠道**: inApp
- **中文标题**: 功能改进
- **英文标题**: Feature Improved
- **中文内容**: 用量分析报表已升级，新增：模型维度分析、时间趋势对比、异常检测
- **英文内容**: Usage analytics upgraded: model breakdown, trend comparison, anomaly detection

#### `pricing_updated` - 定价调整通知
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 定价调整通知
- **英文标题**: Pricing Update Notice
- **中文内容**: GPT-4 价格将于 2026-05-01 调整：输入 $0.03→$0.02/1K tokens，输出 $0.06→$0.05/1K tokens
- **英文内容**: GPT-4 pricing change on 2026-05-01: input $0.03→$0.02/1K, output $0.06→$0.05/1K

#### `policy_updated` - 服务条款更新
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 服务条款更新
- **英文标题**: Terms of Service Updated
- **中文内容**: 服务条款和隐私政策已更新，主要变更：数据保留期、第三方共享范围，请查看详情
- **英文内容**: Terms and privacy policy updated, changes: data retention, third-party sharing, see details

---

## 十、营销与运营类 (Marketing & Operations)

#### `promotion_started` - 优惠活动开始
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 优惠活动开始
- **英文标题**: Promotion Started
- **中文内容**: 夏季促销活动已开始：充值满 $500 送 $100，有效期至 2026-05-31，立即参与
- **英文内容**: Summer promotion started: $100 bonus on $500+ recharge, until 2026-05-31, join now

#### `promotion_ending` - 优惠活动即将结束
- **严重程度**: warning
- **通知渠道**: inApp, email
- **中文标题**: 优惠活动即将结束
- **英文标题**: Promotion Ending Soon
- **中文内容**: 夏季促销活动将于 3 天后结束（2026-05-31），充值满 $500 送 $100，不要错过
- **英文内容**: Summer promotion ends in 3 days (2026-05-31), $100 bonus on $500+ recharge

#### `coupon_received` - 优惠券已发放
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 优惠券已发放
- **英文标题**: Coupon Received
- **中文内容**: 您获得一张 $50 优惠券，有效期 30 天，满 $200 可用，代码：SAVE50
- **英文内容**: You received a $50 coupon, valid 30 days, min $200, code: SAVE50

#### `milestone_reached` - 里程碑达成
- **严重程度**: info
- **通知渠道**: inApp, email
- **中文标题**: 里程碑达成
- **英文标题**: Milestone Reached
- **中文内容**: 恭喜！您的累计节省金额突破 $1,000，相当于免费使用了 200K GPT-4 tokens
- **英文内容**: Congrats! Total savings exceeded $1,000, equivalent to 200K free GPT-4 tokens

#### `welcome` - 欢迎使用
- **严重程度**: info
- **通知渠道**: email
- **中文标题**: 欢迎使用 AnyTokn
- **英文标题**: Welcome to AnyTokn
- **中文内容**: 欢迎加入 AnyTokn！建议完成：创建项目、获取 API Key、配置预算告警、启用智能路由
- **英文内容**: Welcome to AnyTokn! Recommended: create project, get API Key, set budget alerts, enable routing

---

## 统计信息

| 分类 | 数量 |
|------|------|
| 预算与费用 | 18 |
| 用量与配额 | 5 |
| 成本优化 | 5 |
| API Key 管理 | 9 |
| 项目管理 | 6 |
| 成员与权限 | 8 |
| 安全与审计 | 6 |
| 系统与服务 | 7 |
| 产品更新 | 4 |
| 营销与运营 | 5 |
| **总计** | **73** |

---

## 更新记录

### v2.0.1 (2026-04-23)
- 移除双因素认证相关通知类型 (2fa_enabled, 2fa_disabled)
- 优化消息通知页面布局
- 创建本文档

### v2.0.0 (2026-04-20)
- 初始版本，包含 73 种通知类型
- 支持 10 大分类
- 支持中英文双语
