import { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  Shield,
  DollarSign,
  CheckCheck,
  Check,
  Filter,
  RefreshCw,
  Search,
  X,
  TrendingUp,
  CreditCard,
  Users,
  FileText,
  Clock,
  Zap,
  BarChart3,
  AlertOctagon,
  Wallet,
  PieChart,
  Server,
  Lock,
  Globe,
  Smartphone,
  Mail,
  Settings,
  Package,
  Gift,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// ---------- 消息类型定义 ----------
type MessageCategory = 
  | 'budget'       // 预算与费用
  | 'usage'        // 用量与配额
  | 'cost'         // 成本优化
  | 'apikey'       // API Key管理
  | 'project'      // 项目管理
  | 'member'       // 成员与权限
  | 'security'     // 安全与审计
  | 'system'       // 系统与服务
  | 'product'      // 产品更新
  | 'marketing';   // 营销与运营

type MessageSeverity = 'info' | 'warning' | 'critical';
type NotificationChannel = 'inApp' | 'email' | 'sms' | 'webhook' | 'slack';

interface MessageItem {
  id: number;
  category: MessageCategory;
  severity: MessageSeverity;
  type: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn: string;
  channels: NotificationChannel[];
  project?: string;
  created_at: string;
  read: boolean;
}

// ---------- 所有通知文案（100+种） ----------
const ALL_MESSAGES: Omit<MessageItem, 'id' | 'created_at' | 'read'>[] = [
  // ==================== 一、预算与费用类 (Budget & Billing) ====================
  // 1.1 预算上限控制
  {
    category: 'budget',
    severity: 'warning',
    type: 'budget_80',
    title: '预算使用达 80%',
    titleEn: 'Budget Usage at 80%',
    content: '项目 "ChatBot Pro" 本月预算使用已达 80% ($400.00/$500.00)，请关注用量',
    contentEn: 'Project "ChatBot Pro" budget usage reached 80% ($400.00/$500.00)',
    channels: ['inApp', 'email'],
    project: 'ChatBot Pro',
  },
  {
    category: 'budget',
    severity: 'warning',
    type: 'budget_90',
    title: '预算使用达 90% - 即将达到上限',
    titleEn: 'Budget Usage at 90% - Approaching Limit',
    content: '项目 "AI Assistant" 本月预算使用已达 90% ($450.00/$500.00)，建议调整预算或降低用量',
    contentEn: 'Project "AI Assistant" budget at 90% ($450.00/$500.00), consider adjustment',
    channels: ['inApp', 'email', 'sms'],
    project: 'AI Assistant',
  },
  {
    category: 'budget',
    severity: 'warning',
    type: 'budget_95',
    title: '预算使用达 95% - 即将达到上限',
    titleEn: 'Budget Usage at 95% - Approaching Limit',
    content: '项目 "API Gateway" 预算使用已达 95% ($950.00/$1000.00)，达到 100% 后 API 将立即暂停，建议立即调整预算或降低用量',
    contentEn: 'Project "API Gateway" budget at 95% ($950.00/$1000.00), API will pause at 100%, adjust budget or reduce usage',
    channels: ['inApp', 'email', 'sms'],
    project: 'API Gateway',
  },
  {
    category: 'budget',
    severity: 'critical',
    type: 'budget_100',
    title: '预算使用达 100% - 服务已暂停',
    titleEn: 'Budget Usage at 100% - Service Paused',
    content: '项目 "Demo Project" 已达到月度预算上限 $500.00，API 调用已立即暂停。如需恢复，请调整预算或等待下月重置。',
    contentEn: 'Project "Demo Project" reached budget limit $500.00, API calls paused immediately. Adjust budget or wait for reset.',
    channels: ['inApp', 'email', 'sms'],
    project: 'Demo Project',
  },
  {
    category: 'budget',
    severity: 'critical',
    type: 'budget_paused',
    title: '项目已暂停 - 预算耗尽',
    titleEn: 'Project Paused - Budget Exhausted',
    content: '项目 "ChatBot Pro" 因达到月度预算上限，API 调用已暂停。如需恢复，请调整预算或等待下月重置。',
    contentEn: 'Project "ChatBot Pro" API calls paused due to budget limit. Adjust budget or wait for reset.',
    channels: ['inApp', 'email', 'sms'],
    project: 'ChatBot Pro',
  },
  {
    category: 'budget',
    severity: 'critical',
    type: 'apikey_paused',
    title: 'API Key 已暂停 - 预算耗尽',
    titleEn: 'API Key Paused - Budget Exhausted',
    content: 'API Key "sk-prod-xxx123" 因达到预算上限已暂停使用，相关请求返回 429 错误',
    contentEn: 'API Key "sk-prod-xxx123" paused due to budget limit, returning 429 errors',
    channels: ['inApp', 'email'],
    project: 'AI Assistant',
  },
  {
    category: 'budget',
    severity: 'info',
    type: 'budget_reset',
    title: '预算已重置 - 服务已恢复',
    titleEn: 'Budget Reset - Service Resumed',
    content: '项目 "ChatBot Pro" 月度预算已重置为 $500.00，API 调用已恢复正常',
    contentEn: 'Project "ChatBot Pro" budget reset to $500.00, API calls resumed',
    channels: ['inApp', 'email'],
    project: 'ChatBot Pro',
  },
  {
    category: 'budget',
    severity: 'info',
    type: 'budget_adjusted',
    title: '预算已调整',
    titleEn: 'Budget Adjusted',
    content: '管理员 张三 已将项目 "AI Assistant" 的月度预算从 $500.00 调整为 $800.00，时间：2026-04-23 14:30',
    contentEn: 'Admin John adjusted project "AI Assistant" budget from $500.00 to $800.00, at: 2026-04-23 14:30',
    channels: ['inApp', 'email'],
    project: 'AI Assistant',
  },

  // 1.2 账户余额
  {
    category: 'budget',
    severity: 'warning',
    type: 'balance_100',
    title: '账户余额低于 $100',
    titleEn: 'Balance Below $100',
    content: '您的账户余额为 $85.50，低于 $100 阈值，建议及时充值',
    contentEn: 'Your balance is $85.50, below $100 threshold, consider recharging',
    channels: ['inApp', 'email'],
  },
  {
    category: 'budget',
    severity: 'warning',
    type: 'balance_50',
    title: '账户余额低于 $50',
    titleEn: 'Balance Below $50',
    content: '您的账户余额为 $45.00，低于 $50 阈值，请及时充值以避免服务中断',
    contentEn: 'Your balance is $45.00, below $50 threshold, recharge to avoid interruption',
    channels: ['inApp', 'email', 'sms'],
  },
  {
    category: 'budget',
    severity: 'critical',
    type: 'balance_20',
    title: '账户余额即将耗尽',
    titleEn: 'Balance Nearly Exhausted',
    content: '您的账户余额仅剩 $18.00，预计还可使用 1 天，请立即充值',
    contentEn: 'Your balance is $18.00, estimated 1 day remaining, recharge immediately',
    channels: ['inApp', 'email', 'sms'],
  },
  {
    category: 'budget',
    severity: 'critical',
    type: 'balance_exhausted',
    title: '账户余额已耗尽 - 服务已暂停',
    titleEn: 'Balance Exhausted - Service Paused',
    content: '您的账户余额为 $0.00，所有 API 调用已暂停，请立即充值恢复服务',
    contentEn: 'Your balance is $0.00, all API calls paused, recharge to resume',
    channels: ['inApp', 'email', 'sms'],
  },
  {
    category: 'budget',
    severity: 'info',
    type: 'recharge_success',
    title: '充值成功',
    titleEn: 'Recharge Successful',
    content: '充值成功，金额：$500.00，当前余额：$545.00，感谢使用 AnyTokn',
    contentEn: 'Recharge successful: $500.00, current balance: $545.00, thank you for using AnyTokn',  channels: ['inApp', 'email'],
  },
  {
    category: 'budget',
    severity: 'warning',
    type: 'recharge_failed',
    title: '充值失败',
    titleEn: 'Recharge Failed',
    content: '充值支付失败，信用卡扣款被拒绝，请检查支付方式或联系银行',
    contentEn: 'Recharge failed, card declined, check payment method or contact bank',
    channels: ['inApp', 'email'],
  },

  // 1.3 账单与付款
  {
    category: 'budget',
    severity: 'info',
    type: 'invoice_ready',
    title: '账单已生成',
    titleEn: 'Invoice Ready',
    content: '您的 6 月账单已生成，总金额：$1,250.00，用量：2.5M tokens，明细请查看账单页面',
    contentEn: 'Your June invoice is ready: $1,250.00, usage: 2.5M tokens, see billing page',
    channels: ['inApp', 'email'],
  },
  {
    category: 'budget',
    severity: 'info',
    type: 'payment_success',
    title: '付款成功',
    titleEn: 'Payment Successful',
    content: '自动扣款成功，金额：$1,250.00，发票已发送至您的邮箱',
    contentEn: 'Auto-payment successful: $1,250.00, invoice sent to your email',
    channels: ['inApp', 'email'],
  },
  {
    category: 'budget',
    severity: 'critical',
    type: 'payment_failed',
    title: '付款失败 - 服务即将暂停',
    titleEn: 'Payment Failed - Service Will Pause',
    content: '信用卡扣款失败，请在 24 小时内更新支付方式，否则 API 服务将暂停',
    contentEn: 'Card payment failed, update payment method within 24h or API will be paused',
    channels: ['inApp', 'email', 'sms'],
  },
  {
    category: 'budget',
    severity: 'critical',
    type: 'payment_overdue',
    title: '付款逾期 - 服务已暂停',
    titleEn: 'Payment Overdue - Service Paused',
    content: '账单已逾期 3 天，所有 API 调用已暂停，请立即付款恢复服务',
    contentEn: 'Invoice overdue 3 days, all API calls paused, pay immediately to resume',
    channels: ['inApp', 'email', 'sms'],
  },

  // ==================== 二、用量与配额类 (Usage & Quota) ====================
  {
    category: 'usage',
    severity: 'info',
    type: 'daily_report',
    title: '每日用量报告',
    titleEn: 'Daily Usage Report',
    content: '昨日总调用量：125,000 次，费用：$2.50，Top 项目：AI Assistant (45,000 次)，GPT-4 占比 65%',
    contentEn: 'Yesterday: 125,000 calls, $2.50 cost, Top: AI Assistant (45,000), GPT-4: 65%',
    channels: ['inApp', 'email'],
  },
  {
    category: 'usage',
    severity: 'warning',
    type: 'usage_spike',
    title: '用量异常激增',
    titleEn: 'Usage Spike Detected',
    content: '项目 "AI Assistant" 过去 1 小时 API 调用量达 50,000 次，较平时增长 500%，请检查是否存在异常',
    contentEn: 'Project "AI Assistant" 50,000 calls in past hour, 500% increase, check for anomalies',
    channels: ['inApp', 'email'],
    project: 'AI Assistant',
  },
  {
    category: 'usage',
    severity: 'warning',
    type: 'usage_anomaly',
    title: '用量异常检测',
    titleEn: 'Usage Anomaly Detected',
    content: '检测到异常调用模式：凌晨 3-5 点调用量突增，可能存在自动化脚本或安全问题',
    contentEn: 'Anomaly detected: spike at 3-5 AM, possible automation or security issue',
    channels: ['inApp', 'email'],
  },
  {
    category: 'usage',
    severity: 'warning',
    type: 'rate_limit_approaching',
    title: '接近速率限制',
    titleEn: 'Approaching Rate Limit',
    content: '项目 "High Traffic" 当前 980 RPM，接近 1000 RPM 限制，建议降低请求频率',
    contentEn: 'Project "High Traffic" at 980 RPM, approaching 1000 RPM limit, reduce frequency',
    channels: ['inApp'],
    project: 'High Traffic',
  },
  {
    category: 'usage',
    severity: 'critical',
    type: 'rate_limit_hit',
    title: '速率限制已触发',
    titleEn: 'Rate Limit Triggered',
    content: '项目 "Test Project" 超过 1000 RPM 限制，请求被拒绝，请 1 分钟后重试',
    contentEn: 'Project "Test Project" exceeded 1000 RPM, requests rejected, retry in 1 min',
    channels: ['inApp', 'email'],
    project: 'Test Project',
  },

  // ==================== 三、成本优化类 (Cost Optimization) ====================
  {
    category: 'cost',
    severity: 'info',
    type: 'cost_saved_monthly',
    title: '月度成本节省报告',
    titleEn: 'Monthly Cost Savings Report',
    content: '本月智能路由为您节省 $156.80，缓存命中 12,500 次，模型降级节省 $32.50',
    contentEn: 'This month saved $156.80 via smart routing, 12,500 cache hits, downgrade saved $32.50',
    channels: ['inApp', 'email'],
  },
  {
    category: 'cost',
    severity: 'info',
    type: 'routing_enabled',
    title: '智能路由已启用',
    titleEn: 'Smart Routing Enabled',
    content: '项目 "Demo Project" 已启用智能路由，预计可节省 20-30% 成本，缓存策略：动态',
    contentEn: 'Smart routing enabled for "Demo Project", estimated 20-30% savings, cache: dynamic',
    channels: ['inApp'],
    project: 'Demo Project',
  },
  {
    category: 'cost',
    severity: 'info',
    type: 'model_fallback',
    title: '模型自动降级通知',
    titleEn: 'Model Auto-Downgrade Notice',
    content: 'GPT-4 限流期间，3,250 次请求已自动降级到 GPT-3.5，为您节省 $32.50，服务质量未受影响',
    contentEn: '3,250 requests auto-downgraded to GPT-3.5 during GPT-4 limit, saved $32.50',
    channels: ['inApp'],
  },
  {
    category: 'cost',
    severity: 'warning',
    type: 'cache_low',
    title: '缓存命中率偏低',
    titleEn: 'Low Cache Hit Rate',
    content: '项目 "API Gateway" 缓存命中率仅 15%，建议调整缓存策略或增加缓存时间',
    contentEn: 'Project "API Gateway" cache hit rate 15%, consider adjusting strategy or TTL',
    channels: ['inApp', 'email'],
    project: 'API Gateway',
  },
  {
    category: 'cost',
    severity: 'warning',
    type: 'cost_anomaly',
    title: '成本异常检测',
    titleEn: 'Cost Anomaly Detected',
    content: '项目 "ChatBot Pro" 昨日成本 $85.00，较日均 $15.00 增长 467%，请检查用量',
    contentEn: 'Project "ChatBot Pro" yesterday cost $85.00, 467% above daily avg $15.00',
    channels: ['inApp', 'email'],
    project: 'ChatBot Pro',
  },

  // ==================== 四、API Key 管理类 (API Key Management) ====================
  {
    category: 'apikey',
    severity: 'info',
    type: 'apikey_created',
    title: 'API Key 已创建',
    titleEn: 'API Key Created',
    content: '您本人 (ID: user_12345) 已创建 API Key "sk-live-xxx456"，请立即复制保存，此信息仅显示一次。项目：AI Assistant，时间：2026-04-23 10:30',
    contentEn: 'You (ID: user_12345) created API Key "sk-live-xxx456", copy immediately, shown only once. Project: AI Assistant, at: 2026-04-23 10:30',
    channels: ['inApp'],
    project: 'AI Assistant',
  },
  {
    category: 'apikey',
    severity: 'info',
    type: 'apikey_disabled',
    title: 'API Key 已禁用',
    titleEn: 'API Key Disabled',
    content: '管理员 李四 已手动禁用 API Key "sk-test-xxx789"，相关请求将返回 401 错误，时间：2026-04-23 10:15',
    contentEn: 'Admin Jane manually disabled API Key "sk-test-xxx789", requests will return 401, at: 2026-04-23 10:15',
    channels: ['inApp', 'email'],
  },
  {
    category: 'apikey',
    severity: 'warning',
    type: 'apikey_revoked',
    title: 'API Key 已撤销',
    titleEn: 'API Key Revoked',
    content: '管理员 王五 已永久撤销 API Key "sk-prod-xxx111"，时间：2026-04-23 09:45',
    contentEn: 'Admin Bob permanently revoked API Key "sk-prod-xxx111", at: 2026-04-23 09:45',
    channels: ['inApp', 'email'],
  },
  {
    category: 'apikey',
    severity: 'warning',
    type: 'apikey_expiring_7d',
    title: 'API Key 7天后过期',
    titleEn: 'API Key Expires in 7 Days',
    content: 'API Key "sk-test-xxx222" 将在 7 天后过期（2026-04-30），请及时更新',
    contentEn: 'API Key "sk-test-xxx222" expires in 7 days (2026-04-30), please update',
    channels: ['inApp', 'email'],
  },
  {
    category: 'apikey',
    severity: 'warning',
    type: 'apikey_expiring_1d',
    title: 'API Key 1天后过期',
    titleEn: 'API Key Expires in 1 Day',
    content: 'API Key "sk-dev-xxx333" 将在 1 天后过期，请立即更新以避免服务中断',
    contentEn: 'API Key "sk-dev-xxx333" expires in 1 day, update immediately to avoid interruption',
    channels: ['inApp', 'email', 'sms'],
  },
  {
    category: 'apikey',
    severity: 'critical',
    type: 'apikey_expired',
    title: 'API Key 已过期 - 请求被拒绝',
    titleEn: 'API Key Expired - Requests Rejected',
    content: 'API Key "sk-old-xxx444" 已过期，相关请求返回 401 错误，请使用新 Key',
    contentEn: 'API Key "sk-old-xxx444" expired, requests returning 401, use new key',
    channels: ['inApp', 'email'],
  },
  {
    category: 'apikey',
    severity: 'warning',
    type: 'apikey_geo_anomaly',
    title: '异地访问检测',
    titleEn: 'New Location Login Detected',
    content: 'API Key "sk-prod-xxx555" 检测到来自新 IP 的调用：203.0.113.45（美国），如非本人操作请立即轮换 Key',
    contentEn: 'API Key "sk-prod-xxx555" detected calls from new IP: 203.0.113.45 (US), rotate if not you',
    channels: ['inApp', 'email'],
  },
  {
    category: 'apikey',
    severity: 'warning',
    type: 'apikey_usage_spike',
    title: 'API Key 调用量突增',
    titleEn: 'API Key Usage Spike',
    content: 'API Key "sk-live-xxx666" 过去 1 小时调用量较平时增长 800%，请检查是否异常',
    contentEn: 'API Key "sk-live-xxx666" calls up 800% in past hour, check for anomalies',
    channels: ['inApp', 'email'],
  },
  {
    category: 'apikey',
    severity: 'critical',
    type: 'apikey_suspicious',
    title: '疑似 API Key 泄露',
    titleEn: 'Potential API Key Leak',
    content: 'API Key "sk-prod-xxx777" 检测到异常调用模式，可能已泄露，已自动暂停，请立即轮换',
    contentEn: 'API Key "sk-prod-xxx777" suspicious pattern detected, possibly leaked, auto-paused, rotate now',
    channels: ['inApp', 'email', 'sms'],
  },

  // ==================== 五、项目管理类 (Project Management) ====================
  {
    category: 'project',
    severity: 'info',
    type: 'project_created',
    title: '项目创建成功',
    titleEn: 'Project Created Successfully',
    content: '您本人 (ID: user_12345) 已创建项目 "New ChatBot"，API Key：sk-new-xxx789，月度预算：$100.00，路由策略：成本优先，时间：2026-04-23 09:30',
    contentEn: 'You (ID: user_12345) created project "New ChatBot", API Key: sk-new-xxx789, budget: $100.00, strategy: cost priority, at: 2026-04-23 09:30',
    channels: ['inApp'],
    project: 'New ChatBot',
  },
  {
    category: 'project',
    severity: 'info',
    type: 'project_archived',
    title: '项目已归档',
    titleEn: 'Project Archived',
    content: '您本人 (ID: user_12345) 已将项目 "Legacy Bot" 归档，历史数据保留 90 天，API Key 已自动禁用，时间：2026-04-23 14:00',
    contentEn: 'You (ID: user_12345) archived project "Legacy Bot", data retained 90 days, API Key auto-disabled, at: 2026-04-23 14:00',
    channels: ['inApp'],
    project: 'Legacy Bot',
  },
  {
    category: 'project',
    severity: 'warning',
    type: 'project_deleted',
    title: '项目已删除',
    titleEn: 'Project Deleted',
    content: '管理员 张三 已删除项目 "Test Project"，所有数据将在 30 天后永久清除，时间：2026-04-23 11:20',
    contentEn: 'Admin John deleted project "Test Project", data will be cleared in 30 days, at: 2026-04-23 11:20',
    channels: ['inApp', 'email'],
    project: 'Test Project',
  },
  {
    category: 'project',
    severity: 'warning',
    type: 'project_limit_80',
    title: '项目数量达 80%',
    titleEn: 'Project Count at 80%',
    content: '您已创建 8/10 个项目，达到 80% 上限，如需更多请联系管理员升级',
    contentEn: 'You have created 8/10 projects (80%), contact admin to upgrade for more',
    channels: ['inApp'],
  },
  {
    category: 'project',
    severity: 'warning',
    type: 'project_limit_100',
    title: '项目数量已达上限',
    titleEn: 'Project Count Limit Reached',
    content: '您已创建 10/10 个项目，达到上限，无法创建新项目，请联系管理员',
    contentEn: 'You have created 10/10 projects, limit reached, contact admin for more',
    channels: ['inApp', 'email'],
  },
  {
    category: 'project',
    severity: 'info',
    type: 'project_settings_updated',
    title: '项目设置已更新',
    titleEn: 'Project Settings Updated',
    content: '管理员 李四 已更新项目 "AI Assistant" 设置：预算 $500→$800，缓存 TTL 300s→600s，路由策略：质量优先，时间：2026-04-23 15:45',
    contentEn: 'Admin Jane updated project "AI Assistant" settings: budget $500→$800, cache TTL 300s→600s, strategy: quality, at: 2026-04-23 15:45',
    channels: ['inApp'],
    project: 'AI Assistant',
  },

  // ==================== 六、成员与权限类 (Member & Permission) ====================
  {
    category: 'member',
    severity: 'info',
    type: 'member_invited',
    title: '成员邀请已发送',
    titleEn: 'Member Invitation Sent',
    content: '管理员 王五 已邀请张三 (zhangsan@example.com) 加入组织，角色：成员，邀请有效期 7 天，时间：2026-04-23 10:00',
    contentEn: 'Admin Bob invited John (john@example.com) to join, role: Member, expires in 7 days, at: 2026-04-23 10:00',
    channels: ['inApp'],
  },
  {
    category: 'member',
    severity: 'info',
    type: 'member_joined',
    title: '新成员已加入',
    titleEn: 'New Member Joined',
    content: '李四已接受邀请加入组织，角色：成员，已分配项目：Demo Project',
    contentEn: 'Jane joined the organization, role: Member, assigned to: Demo Project',
    channels: ['inApp', 'email'],
  },
  {
    category: 'member',
    severity: 'info',
    type: 'member_left',
    title: '成员已离开',
    titleEn: 'Member Left',
    content: '王五已主动退出组织，其 API Key 已自动撤销，项目权限已移除',
    contentEn: 'Bob left the organization, their API Keys revoked, project access removed',
    channels: ['inApp', 'email'],
  },
  {
    category: 'member',
    severity: 'warning',
    type: 'member_removed',
    title: '成员已被移除',
    titleEn: 'Member Removed',
    content: '管理员 张三 已将赵六移出组织，其 API Key 已自动撤销，时间：2026-04-23 14:20',
    contentEn: 'Admin John removed Alice from organization, their API Keys auto-revoked, at: 2026-04-23 14:20',
    channels: ['inApp', 'email'],
  },
  {
    category: 'member',
    severity: 'warning',
    type: 'role_changed',
    title: '角色已变更',
    titleEn: 'Role Changed',
    content: '管理员 李四 已将您的角色从 "成员" 变更为 "管理员"，获得组织管理权限，时间：2026-04-23 16:00',
    contentEn: 'Admin Jane changed your role from "Member" to "Admin", granted management permissions, at: 2026-04-23 16:00',
    channels: ['inApp', 'email'],
  },
  {
    category: 'member',
    severity: 'warning',
    type: 'role_downgraded',
    title: '权限已降低',
    titleEn: 'Permissions Downgraded',
    content: '管理员 王五 已将您的角色从 "管理员" 变更为 "成员"，部分管理权限已收回，时间：2026-04-23 11:30',
    contentEn: 'Admin Bob changed your role from "Admin" to "Member", some permissions revoked, at: 2026-04-23 11:30',
    channels: ['inApp', 'email'],
  },
  {
    category: 'member',
    severity: 'critical',
    type: 'admin_granted',
    title: '管理员权限已授予',
    titleEn: 'Admin Permissions Granted',
    content: '组织所有者 张三 已授予您管理员权限，可对成员、项目、账单进行管理，时间：2026-04-23 09:00',
    contentEn: 'Owner John granted you admin permissions, can manage members, projects, billing, at: 2026-04-23 09:00',
    channels: ['inApp', 'email', 'sms'],
  },
  {
    category: 'member',
    severity: 'critical',
    type: 'admin_revoked',
    title: '管理员权限已收回',
    titleEn: 'Admin Permissions Revoked',
    content: '组织所有者 张三 已收回您的管理员权限，当前角色：成员，时间：2026-04-23 13:45',
    contentEn: 'Owner John revoked your admin permissions, current role: Member, at: 2026-04-23 13:45',
    channels: ['inApp', 'email'],
  },

  // ==================== 七、安全与审计类 (Security & Audit) ====================
  {
    category: 'security',
    severity: 'critical',
    type: 'login_new_device',
    title: '新设备登录',
    titleEn: 'New Device Login',
    content: '检测到从新设备登录：Chrome on macOS (IP: 192.168.1.100)，如非本人操作请立即修改密码',
    contentEn: 'New device login detected: Chrome on macOS (IP: 192.168.1.100), change password if not you',
    channels: ['inApp', 'email', 'sms'],
  },
  {
    category: 'security',
    severity: 'warning',
    type: 'login_new_location',
    title: '新位置登录',
    titleEn: 'New Location Login',
    content: '检测到从新的地理位置登录：上海市 (IP: 203.0.113.45)，如非本人操作请检查账号安全',
    contentEn: 'Login from new location: Shanghai (IP: 203.0.113.45), check account security if not you',
    channels: ['inApp', 'email'],
  },
  {
    category: 'security',
    severity: 'warning',
    type: 'login_failed_multiple',
    title: '登录失败多次',
    titleEn: 'Multiple Login Failures',
    content: '5 分钟内登录失败 5 次，IP：198.51.100.22，如非本人操作请检查账号安全',
    contentEn: '5 login failures in 5 min, IP: 198.51.100.22, check security if not you',
    channels: ['inApp', 'email'],
  },
  {
    category: 'security',
    severity: 'critical',
    type: 'password_changed',
    title: '密码已修改',
    titleEn: 'Password Changed',
    content: '您本人 (ID: user_12345) 已修改登录密码，IP：192.168.1.100，设备：Chrome on macOS，时间：2026-04-23 14:30。如非本人操作请立即找回账号',
    contentEn: 'You (ID: user_12345) changed password, IP: 192.168.1.100, Device: Chrome on macOS, at: 2026-04-23 14:30. Recover if not you',
    channels: ['inApp', 'email', 'sms'],
  },
  {
    category: 'security',
    severity: 'critical',
    type: 'email_changed',
    title: '邮箱已修改',
    titleEn: 'Email Changed',
    content: '您本人 (ID: user_12345) 已将登录邮箱从 old@example.com 修改为 new@example.com，时间：2026-04-23 15:00。如非本人操作请立即联系客服',
    contentEn: 'You (ID: user_12345) changed email from old@example.com to new@example.com, at: 2026-04-23 15:00. Contact support if not you',
    channels: ['inApp', 'email', 'sms'],
  },

  {
    category: 'security',
    severity: 'warning',
    type: 'sensitive_operation',
    title: '敏感操作已执行',
    titleEn: 'Sensitive Operation Executed',
    content: '管理员执行了敏感操作：批量导出项目数据，操作人：张三，时间：2026-04-23 14:30',
    contentEn: 'Admin performed sensitive operation: bulk export project data, by: John, at: 2026-04-23 14:30',
    channels: ['inApp', 'email'],
  },

  // ==================== 八、系统与服务类 (System & Service) ====================
  {
    category: 'system',
    severity: 'critical',
    type: 'provider_down',
    title: '供应商服务中断',
    titleEn: 'Provider Service Down',
    content: 'OpenAI GPT-4 API 返回 503 错误，已自动切换到 Azure OpenAI，服务质量可能略有下降',
    contentEn: 'OpenAI GPT-4 API returning 503, auto-switched to Azure OpenAI, quality may be slightly reduced',
    channels: ['inApp', 'email'],
  },
  {
    category: 'system',
    severity: 'warning',
    type: 'provider_slow',
    title: '供应商响应延迟',
    titleEn: 'Provider Response Delay',
    content: 'Anthropic API 平均响应时间 8.5s（正常 <2s），部分请求可能超时，建议启用超时重试',
    contentEn: 'Anthropic API avg latency 8.5s (normal <2s), some requests may timeout, enable retry',
    channels: ['inApp'],
  },
  {
    category: 'system',
    severity: 'info',
    type: 'provider_recovered',
    title: '供应商服务已恢复',
    titleEn: 'Provider Service Recovered',
    content: 'OpenAI GPT-4 API 服务已恢复正常，响应时间：1.2s，已切换回主供应商',
    contentEn: 'OpenAI GPT-4 API recovered, latency: 1.2s, switched back to primary provider',
    channels: ['inApp'],
  },
  {
    category: 'system',
    severity: 'info',
    type: 'maintenance_scheduled',
    title: '计划维护提醒',
    titleEn: 'Scheduled Maintenance Reminder',
    content: '系统维护：本周六 02:00-04:00 (UTC+8)，期间可能有 30 秒服务中断，请提前做好准备',
    contentEn: 'Maintenance: Sat 02:00-04:00 (UTC+8), possible 30s interruption, prepare accordingly',
    channels: ['inApp', 'email'],
  },
  {
    category: 'system',
    severity: 'critical',
    type: 'maintenance_emergency',
    title: '紧急维护通知',
    titleEn: 'Emergency Maintenance Notice',
    content: '紧急维护进行中：数据库升级，预计 30 分钟，期间 API 服务可能不稳定',
    contentEn: 'Emergency maintenance in progress: database upgrade, ~30 min, API may be unstable',
    channels: ['inApp', 'email', 'sms'],
  },
  {
    category: 'system',
    severity: 'info',
    type: 'new_version',
    title: '新版本可用',
    titleEn: 'New Version Available',
    content: 'AnyTokn v1.8.0 已发布，新功能：智能缓存预热、多区域部署、增强分析报表',
    contentEn: 'AnyTokn v1.8.0 available, new: smart cache warmup, multi-region, enhanced analytics',
    channels: ['inApp', 'email'],
  },
  {
    category: 'system',
    severity: 'warning',
    type: 'api_deprecated',
    title: 'API 版本即将弃用',
    titleEn: 'API Version Deprecation',
    content: 'API v1 将于 2026-06-01 弃用，请迁移到 v2，文档：https://docs.costify.io/api/v2',
    contentEn: 'API v1 deprecated on 2026-06-01, migrate to v2, docs: https://docs.costify.io/api/v2',
    channels: ['inApp', 'email'],
  },

  // ==================== 九、产品更新类 (Product Updates) ====================
  {
    category: 'product',
    severity: 'info',
    type: 'feature_launched',
    title: '新功能上线',
    titleEn: 'New Feature Launched',
    content: '智能路由 v2 已上线，支持多模型并行请求、自动故障转移、成本预测',
    contentEn: 'Smart Routing v2 launched: multi-model parallel, auto-failover, cost prediction',
    channels: ['inApp', 'email'],
  },
  {
    category: 'product',
    severity: 'info',
    type: 'feature_improved',
    title: '功能改进',
    titleEn: 'Feature Improved',
    content: '用量分析报表已升级，新增：模型维度分析、时间趋势对比、异常检测',
    contentEn: 'Usage analytics upgraded: model breakdown, trend comparison, anomaly detection',
    channels: ['inApp'],
  },
  {
    category: 'product',
    severity: 'warning',
    type: 'pricing_updated',
    title: '定价调整通知',
    titleEn: 'Pricing Update Notice',
    content: 'GPT-4 价格将于 2026-05-01 调整：输入 $0.03→$0.02/1K tokens，输出 $0.06→$0.05/1K tokens',
    contentEn: 'GPT-4 pricing change on 2026-05-01: input $0.03→$0.02/1K, output $0.06→$0.05/1K',
    channels: ['inApp', 'email'],
  },
  {
    category: 'product',
    severity: 'warning',
    type: 'policy_updated',
    title: '服务条款更新',
    titleEn: 'Terms of Service Updated',
    content: '服务条款和隐私政策已更新，主要变更：数据保留期、第三方共享范围，请查看详情',
    contentEn: 'Terms and privacy policy updated, changes: data retention, third-party sharing, see details',
    channels: ['inApp', 'email'],
  },

  // ==================== 十、营销与运营类 (Marketing & Operations) ====================
  {
    category: 'marketing',
    severity: 'info',
    type: 'promotion_started',
    title: '优惠活动开始',
    titleEn: 'Promotion Started',
    content: '夏季促销活动已开始：充值满 $500 送 $100，有效期至 2026-05-31，立即参与',
    contentEn: 'Summer promotion started: $100 bonus on $500+ recharge, until 2026-05-31, join now',
    channels: ['inApp', 'email'],
  },
  {
    category: 'marketing',
    severity: 'warning',
    type: 'promotion_ending',
    title: '优惠活动即将结束',
    titleEn: 'Promotion Ending Soon',
    content: '夏季促销活动将于 3 天后结束（2026-05-31），充值满 $500 送 $100，不要错过',
    contentEn: 'Summer promotion ends in 3 days (2026-05-31), $100 bonus on $500+ recharge',
    channels: ['inApp', 'email'],
  },
  {
    category: 'marketing',
    severity: 'info',
    type: 'coupon_received',
    title: '优惠券已发放',
    titleEn: 'Coupon Received',
    content: '您获得一张 $50 优惠券，有效期 30 天，满 $200 可用，代码：SAVE50',
    contentEn: 'You received a $50 coupon, valid 30 days, min $200, code: SAVE50',
    channels: ['inApp', 'email'],
  },
  {
    category: 'marketing',
    severity: 'info',
    type: 'milestone_reached',
    title: '里程碑达成',
    titleEn: 'Milestone Reached',
    content: '恭喜！您的累计节省金额突破 $1,000，相当于免费使用了 200K GPT-4 tokens',
    contentEn: 'Congrats! Total savings exceeded $1,000, equivalent to 200K free GPT-4 tokens',
    channels: ['inApp', 'email'],
  },
  {
    category: 'marketing',
    severity: 'info',
    type: 'welcome',
    title: '欢迎使用 AnyTokn',
    titleEn: 'Welcome to AnyTokn',
    content: '欢迎加入 AnyTokn！建议完成：创建项目、获取 API Key、配置预算告警、启用智能路由',
    contentEn: 'Welcome to AnyTokn! Recommended: create project, get API Key, set budget alerts, enable routing',
    channels: ['email'],
  },
];

// ---------- 辅助函数 ----------
// ---------- 组件 ----------
export default function Alerts() {
  const { t, lang: language } = useLanguage();

  // 格式化时间
  const formatTime = (iso: string): string => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (language === 'en') {
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin} min ago`;
      const diffH = Math.floor(diffMin / 60);
      if (diffH < 24) return `${diffH} hours ago`;
      const diffD = Math.floor(diffH / 24);
      if (diffD < 30) return `${diffD} days ago`;
      return d.toLocaleDateString('en-US');
    }
    if (diffMin < 1) return '刚刚';
    if (diffMin < 60) return `${diffMin} 分钟前`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} 小时前`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 30) return `${diffD} 天前`;
    return d.toLocaleDateString('zh-CN');
  };
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<MessageCategory | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<MessageSeverity | 'all'>('all');
  const [channelFilter, setChannelFilter] = useState<NotificationChannel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 生成消息列表
  const generateMessages = useCallback(() => {
    const now = new Date();
    const msgs: MessageItem[] = ALL_MESSAGES.map((msg, index) => ({
      ...msg,
      id: Date.now() + index,
      created_at: new Date(now.getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      read: Math.random() > 0.4,
    }));
    return msgs;
  }, []);

  // 获取消息列表
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const msgs = generateMessages();
      setMessages(msgs);
    } catch (err: any) {
      setError(err.message || '获取消息失败');
    } finally {
      setIsLoading(false);
    }
  }, [generateMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // 标记单个已读
  const markRead = (id: number) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, read: true } : m)));
  };

  // 标记全部已读
  const markAllRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  // 筛选
  const filtered = messages.filter(m => {
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && m.severity !== severityFilter) return false;
    if (channelFilter !== 'all' && !m.channels.includes(channelFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q) ||
        m.contentEn.toLowerCase().includes(q) ||
        m.project?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  // 分类统计
  const categoryStats = {
    budget: messages.filter(m => m.category === 'budget').length,
    usage: messages.filter(m => m.category === 'usage').length,
    cost: messages.filter(m => m.category === 'cost').length,
    apikey: messages.filter(m => m.category === 'apikey').length,
    project: messages.filter(m => m.category === 'project').length,
    member: messages.filter(m => m.category === 'member').length,
    security: messages.filter(m => m.category === 'security').length,
    system: messages.filter(m => m.category === 'system').length,
    product: messages.filter(m => m.category === 'product').length,
    marketing: messages.filter(m => m.category === 'marketing').length,
  };

  // 获取分类标签
  const getCategoryLabel = (cat: MessageCategory) => {
    if (language === 'en') {
      const labels: Record<MessageCategory, string> = {
        budget: 'Budget',
        usage: 'Usage',
        cost: 'Cost',
        apikey: 'API Key',
        project: 'Project',
        member: 'Member',
        security: 'Security',
        system: 'System',
        product: 'Product',
        marketing: 'Marketing',
      };
      return labels[cat] || cat;
    }
    const labels: Record<MessageCategory, string> = {
      budget: '预算费用',
      usage: '用量配额',
      cost: '成本优化',
      apikey: 'API Key',
      project: '项目管理',
      member: '成员权限',
      security: '安全审计',
      system: '系统服务',
      product: '产品更新',
      marketing: '营销运营',
    };
    return labels[cat] || cat;
  };

  // 获取分类图标
  const getCategoryIcon = (cat: MessageCategory) => {
    const icons: Record<MessageCategory, any> = {
      budget: Wallet,
      usage: BarChart3,
      cost: DollarSign,
      apikey: Lock,
      project: FileText,
      member: Users,
      security: Shield,
      system: Server,
      product: Package,
      marketing: Gift,
    };
    return icons[cat] || Bell;
  };

  // 获取严重程度样式
  const getSeverityStyle = (severity: MessageSeverity) => {
    switch (severity) {
      case 'info': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-surface-100 text-surface-600';
    }
  };

  // 获取严重程度边框
  const getSeverityBorder = (severity: MessageSeverity) => {
    switch (severity) {
      case 'info': return 'border-l-blue-500';
      case 'warning': return 'border-l-amber-500';
      case 'critical': return 'border-l-red-500';
      default: return 'border-l-surface-300';
    }
  };

  // 获取严重程度标签
  const getSeverityLabel = (severity: MessageSeverity) => {
    if (language === 'en') {
      const labels: Record<MessageSeverity, string> = {
        info: 'Info',
        warning: 'Warning',
        critical: 'Critical',
      };
      return labels[severity] || severity;
    }
    const labels: Record<MessageSeverity, string> = {
      info: '信息',
      warning: '警告',
      critical: '严重',
    };
    return labels[severity] || severity;
  };

  // 获取通知渠道标签
  const getChannelLabel = (channel: NotificationChannel) => {
    if (language === 'en') {
      const labels: Record<NotificationChannel, string> = {
        inApp: 'In-App',
        email: 'Email',
        sms: 'SMS',
        webhook: 'Webhook',
        slack: 'Slack',
      };
      return labels[channel] || channel;
    }
    const labels: Record<NotificationChannel, string> = {
      inApp: '应用内',
      email: '邮件',
      sms: '短信',
      webhook: 'Webhook',
      slack: 'Slack',
    };
    return labels[channel] || channel;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900">{t.alerts?.title || '消息通知'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-secondary text-xs flex items-center gap-1.5"
            onClick={markAllRead}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            {t.alerts?.markAllRead || '全部已读'}
          </button>
          <button
            className="btn-secondary text-xs flex items-center gap-1.5"
            onClick={fetchMessages}
            disabled={isLoading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {t.common?.refresh || '刷新'}
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <Filter className="w-3.5 h-3.5" />
            <span>{t.alerts?.filter || '筛选'}</span>
          </div>

          {/* 严重程度筛选 */}
          <div className="flex items-center gap-1">
            <button
              className={`px-2 py-1 rounded text-xs ${severityFilter === 'all' ? 'bg-brand-100 text-brand-700' : 'bg-surface-50'}`}
              onClick={() => setSeverityFilter('all')}
            >
              {t.common?.all || '全部'}
            </button>
            {(['info', 'warning', 'critical'] as const).map(s => (
              <button
                key={s}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${severityFilter === s ? getSeverityStyle(s) : 'bg-surface-50'}`}
                onClick={() => setSeverityFilter(s)}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${s === 'info' ? 'bg-blue-500' : s === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                {getSeverityLabel(s)}
              </button>
            ))}
          </div>

          {/* 分类筛选 */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-surface-400">{t.common?.category || '分类'}:</span>
            <select
              className="text-xs border rounded px-2 py-1 bg-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as MessageCategory | 'all')}
            >
              <option value="all">{t.common?.all || '全部'}</option>
              <option value="budget">{t.alerts?.typeBudget || '预算费用'}</option>
              <option value="usage">{t.alerts?.typeUsage || '用量配额'}</option>
              <option value="cost">{t.alerts?.typeCost || '成本优化'}</option>
              <option value="apikey">API Key</option>
              <option value="project">{t.projects?.title || '项目管理'}</option>
              <option value="member">{t.members?.title || '成员权限'}</option>
              <option value="security">{t.alerts?.typeSecurity || '安全审计'}</option>
              <option value="system">{t.alerts?.typeSystem || '系统服务'}</option>
              <option value="product">{t.alerts?.typeProduct || '产品更新'}</option>
              <option value="marketing">{t.alerts?.typeMarketing || '营销运营'}</option>
            </select>
          </div>

          {/* 搜索 */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-surface-400" />
            <input
              type="text"
              placeholder="搜索消息内容..."
              className="w-full text-xs border border-surface-200 rounded-lg pl-8 pr-8 py-1.5"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="absolute right-2 top-2" onClick={() => setSearchQuery('')}>
                <X className="w-3.5 h-3.5 text-surface-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
          <span className="ml-3 text-sm text-surface-600">{t.common?.loading || '加载中...'}</span>
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Search className="w-8 h-8 text-surface-400 mb-4" />
          <p className="text-base font-medium text-surface-800">{t.alerts?.noAlertsFiltered || '没有找到匹配的消息'}</p>
          <p className="text-sm text-surface-400 mt-1">{t.alerts?.tryAdjustFilters || '尝试调整筛选条件'}</p>
        </div>
      )}

      {/* 消息列表 */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(msg => {
            const Icon = getCategoryIcon(msg.category);
            return (
              <div
                key={msg.id}
                className={`card border-l-4 ${getSeverityBorder(msg.severity)} ${msg.read ? 'opacity-70' : ''}`}
              >
                <div className="px-5 py-4 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityStyle(msg.severity)}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`badge text-[10px] ${getSeverityStyle(msg.severity)}`}>
                        {getSeverityLabel(msg.severity)}
                      </span>
                      <span className="badge-gray text-[10px]">{getCategoryLabel(msg.category)}</span>
                      {msg.project && <span className="text-[10px] text-surface-500">{t.projects?.projectLabel || '项目'}: {msg.project}</span>}
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                    </div>
                    <p className="text-sm font-semibold text-surface-800">{language === 'en' ? (msg.titleEn || msg.title) : msg.title}</p>
                    <p className="text-sm text-surface-600 mt-1">{language === 'en' ? msg.contentEn : msg.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-surface-400">{formatTime(msg.created_at)}</span>
                      <span className="text-xs text-surface-300">|</span>
                      <span className="text-xs text-surface-400">{t.alerts?.channels || '通知'}: {msg.channels.map(getChannelLabel).join(', ')}</span>
                    </div>
                  </div>

                  {!msg.read && (
                    <button className="flex-shrink-0 p-2 rounded-lg hover:bg-surface-50" onClick={() => markRead(msg.id)}>
                      <Check className="w-4 h-4 text-surface-400 hover:text-brand-600" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 底部统计 */}
      {!isLoading && !error && messages.length > 0 && (
        <div className="flex items-center justify-between text-xs text-surface-400">
          <span>{t.alerts?.showingAlerts?.replace('{filtered}', String(filtered.length)).replace('{total}', String(messages.length)) || `显示 ${filtered.length} 条，共 ${messages.length} 条`}</span>
          <span>
            {messages.filter(m => m.severity === 'critical').length} {t.alerts?.statsCritical || '严重'} /{' '}
            {messages.filter(m => m.severity === 'warning').length} {t.alerts?.statsWarning || '警告'} /{' '}
            {messages.filter(m => m.severity === 'info').length} {t.alerts?.statsInfo || '信息'}
          </span>
        </div>
      )}
    </div>
  );
}
