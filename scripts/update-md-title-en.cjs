// 脚本：为 MD 文档添加英文标题
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../docs/notification-messages.md');
let content = fs.readFileSync(filePath, 'utf8');

// 定义中文标题到英文标题的映射
const titleMap = {
  // 预算与费用类
  '预算使用达 80%': 'Budget Usage at 80%',
  '预算使用达 90% - 即将达到上限': 'Budget Usage at 90% - Approaching Limit',
  '预算使用达 95% - 即将达到上限': 'Budget Usage at 95% - Approaching Limit',
  '预算使用达 100% - 服务已暂停': 'Budget Usage at 100% - Service Paused',
  '项目已暂停 - 预算耗尽': 'Project Paused - Budget Exhausted',
  'API Key 已暂停 - 预算耗尽': 'API Key Paused - Budget Exhausted',
  '预算已重置 - 服务已恢复': 'Budget Reset - Service Resumed',
  '预算已调整': 'Budget Adjusted',
  '账户余额低于 $100': 'Balance Below $100',
  '账户余额低于 $50': 'Balance Below $50',
  '账户余额即将耗尽': 'Balance Nearly Exhausted',
  '账户余额已耗尽 - 服务已暂停': 'Balance Exhausted - Service Paused',
  '充值成功': 'Recharge Successful',
  '充值失败': 'Recharge Failed',
  '账单已生成': 'Invoice Ready',
  '付款成功': 'Payment Successful',
  '付款失败 - 服务即将暂停': 'Payment Failed - Service Will Pause',
  '付款逾期 - 服务已暂停': 'Payment Overdue - Service Paused',
  
  // 用量与配额类
  '每日用量报告': 'Daily Usage Report',
  '用量异常激增': 'Usage Spike Detected',
  '用量异常检测': 'Usage Anomaly Detected',
  '接近速率限制': 'Approaching Rate Limit',
  '速率限制已触发': 'Rate Limit Triggered',
  
  // 成本优化类
  '月度成本节省报告': 'Monthly Cost Savings Report',
  '智能路由已启用': 'Smart Routing Enabled',
  '模型自动降级通知': 'Model Auto-Downgrade Notice',
  '缓存命中率偏低': 'Low Cache Hit Rate',
  '成本异常检测': 'Cost Anomaly Detected',
  
  // API Key 管理类
  'API Key 已创建': 'API Key Created',
  'API Key 已禁用': 'API Key Disabled',
  'API Key 已撤销': 'API Key Revoked',
  'API Key 7天后过期': 'API Key Expires in 7 Days',
  'API Key 1天后过期': 'API Key Expires in 1 Day',
  'API Key 已过期 - 请求被拒绝': 'API Key Expired - Requests Rejected',
  '异地访问检测': 'New Location Login Detected',
  'API Key 调用量突增': 'API Key Usage Spike',
  '疑似 API Key 泄露': 'Potential API Key Leak',
  
  // 项目管理类
  '项目创建成功': 'Project Created Successfully',
  '项目已归档': 'Project Archived',
  '项目已删除': 'Project Deleted',
  '项目数量达 80%': 'Project Count at 80%',
  '项目数量已达上限': 'Project Count Limit Reached',
  '项目设置已更新': 'Project Settings Updated',
  
  // 成员与权限类
  '成员邀请已发送': 'Member Invitation Sent',
  '新成员已加入': 'New Member Joined',
  '成员已离开': 'Member Left',
  '成员已被移除': 'Member Removed',
  '角色已变更': 'Role Changed',
  '权限已降低': 'Permissions Downgraded',
  '管理员权限已授予': 'Admin Permissions Granted',
  '管理员权限已收回': 'Admin Permissions Revoked',
  
  // 安全与审计类
  '新设备登录': 'New Device Login',
  '新位置登录': 'New Location Login',
  '登录失败多次': 'Multiple Login Failures',
  '密码已修改': 'Password Changed',
  '邮箱已修改': 'Email Changed',
  '敏感操作已执行': 'Sensitive Operation Executed',
  
  // 系统与服务类
  '供应商服务中断': 'Provider Service Down',
  '供应商响应延迟': 'Provider Response Delay',
  '供应商服务已恢复': 'Provider Service Recovered',
  '计划维护提醒': 'Scheduled Maintenance Reminder',
  '紧急维护通知': 'Emergency Maintenance Notice',
  '新版本可用': 'New Version Available',
  'API 版本即将弃用': 'API Version Deprecation',
  
  // 产品更新类
  '新功能上线': 'New Feature Launched',
  '功能改进': 'Feature Improved',
  '定价调整通知': 'Pricing Update Notice',
  '服务条款更新': 'Terms of Service Updated',
  
  // 营销与运营类
  '优惠活动开始': 'Promotion Started',
  '优惠活动即将结束': 'Promotion Ending Soon',
  '优惠券已发放': 'Coupon Received',
  '里程碑达成': 'Milestone Reached',
  '欢迎使用 AnyTokn': 'Welcome to AnyTokn',
};

let addedCount = 0;

// 处理每一条消息
Object.entries(titleMap).forEach(([cnTitle, enTitle]) => {
  // 转义正则特殊字符
  const escapedTitle = cnTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // 查找 "- **中文标题**: xxx" 并在其后添加英文标题
  const pattern = new RegExp(
    `(- \\*\\*中文标题\\*\\*: ${escapedTitle})\\n(- \\*\\*中文内容\\*\\*:)`,
    'g'
  );
  
  if (content.match(pattern)) {
    content = content.replace(
      pattern,
      `$1\n- **英文标题**: ${enTitle}\n$2`
    );
    addedCount++;
    console.log(`✓ 已添加: ${cnTitle}`);
  } else {
    // 检查是否已经有英文标题
    const hasEnTitle = content.includes(`- **英文标题**: ${enTitle}`);
    if (hasEnTitle) {
      console.log(`○ 已存在: ${cnTitle}`);
    } else {
      console.log(`✗ 未找到: ${cnTitle}`);
    }
  }
});

fs.writeFileSync(filePath, content);
console.log(`\n========== 完成 ==========`);
console.log(`已添加: ${addedCount} 条`);
console.log(`总计: ${Object.keys(titleMap).length} 条`);
