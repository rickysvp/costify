# 消息提示文案规范 (Message Notification Guidelines)

## 1. 操作成功类 (Success Messages)

### 1.1 通用成功
| 场景 | 中文 | English |
|------|------|---------|
| 通用成功 | 操作成功 | Operation successful |
| 保存成功 | 保存成功 | Saved successfully |
| 提交成功 | 提交成功 | Submitted successfully |
| 创建成功 | 创建成功 | Created successfully |
| 更新成功 | 更新成功 | Updated successfully |
| 删除成功 | 删除成功 | Deleted successfully |
| 发送成功 | 发送成功 | Sent successfully |
| 上传成功 | 上传成功 | Upload successful |
| 导入成功 | 导入成功 | Import successful |
| 导出成功 | 导出成功 | Export successful |

### 1.2 认证相关
| 场景 | 中文 | English |
|------|------|---------|
| 登录成功 | 登录成功，欢迎回来 | Login successful, welcome back |
| 注册成功 | 注册成功，请登录 | Registration successful, please sign in |
| 密码修改 | 密码修改成功 | Password changed successfully |
| 密码重置 | 密码重置邮件已发送 | Password reset email sent |
| 退出登录 | 已安全退出登录 | Logged out securely |
| 验证成功 | 验证成功 | Verification successful |
| 绑定成功 | 绑定成功 | Binding successful |
| 解绑成功 | 解绑成功 | Unbound successfully |

### 1.3 数据操作
| 场景 | 中文 | English |
|------|------|---------|
| 复制成功 | 已复制到剪贴板 | Copied to clipboard |
| 移动成功 | 移动成功 | Moved successfully |
| 重命名成功 | 重命名成功 | Renamed successfully |
| 归档成功 | 归档成功 | Archived successfully |
| 恢复成功 | 恢复成功 | Restored successfully |
| 同步成功 | 同步成功 | Synchronized successfully |
| 发布成功 | 发布成功 | Published successfully |
| 取消发布 | 已取消发布 | Unpublished successfully |

---

## 2. 操作失败类 (Error Messages)

### 2.1 通用失败
| 场景 | 中文 | English |
|------|------|---------|
| 通用失败 | 操作失败，请重试 | Operation failed, please try again |
| 保存失败 | 保存失败 | Failed to save |
| 提交失败 | 提交失败 | Failed to submit |
| 创建失败 | 创建失败 | Failed to create |
| 更新失败 | 更新失败 | Failed to update |
| 删除失败 | 删除失败 | Failed to delete |
| 发送失败 | 发送失败 | Failed to send |
| 上传失败 | 上传失败 | Upload failed |
| 导入失败 | 导入失败 | Import failed |
| 导出失败 | 导出失败 | Export failed |

### 2.2 网络错误
| 场景 | 中文 | English |
|------|------|---------|
| 网络错误 | 网络连接失败，请检查网络 | Network connection failed, please check your connection |
| 请求超时 | 请求超时，请重试 | Request timeout, please try again |
| 服务器错误 | 服务器内部错误 | Internal server error |
| 服务不可用 | 服务暂时不可用 | Service temporarily unavailable |
| 请求过于频繁 | 请求过于频繁，请稍后再试 | Too many requests, please try again later |
| 连接断开 | 连接已断开 | Connection lost |

### 2.3 认证错误
| 场景 | 中文 | English |
|------|------|---------|
| 登录失败 | 登录失败，用户名或密码错误 | Login failed, invalid username or password |
| 未登录 | 请先登录 | Please sign in first |
| 会话过期 | 登录会话已过期，请重新登录 | Session expired, please sign in again |
| 无权限 | 您没有权限执行此操作 | You don't have permission to perform this action |
| 访问被拒绝 | 访问被拒绝 | Access denied |
| 账号锁定 | 账号已被锁定，请联系管理员 | Account locked, please contact administrator |
| 密码错误 | 密码错误 | Incorrect password |
| 验证码错误 | 验证码错误或已过期 | Invalid or expired verification code |
| Token无效 | 认证令牌无效 | Invalid authentication token |

### 2.4 数据验证
| 场景 | 中文 | English |
|------|------|---------|
| 必填字段 | 请填写必填字段 | Please fill in required fields |
| 格式错误 | 格式不正确 | Invalid format |
| 邮箱格式 | 请输入有效的邮箱地址 | Please enter a valid email address |
| 手机号格式 | 请输入有效的手机号 | Please enter a valid phone number |
| 密码强度 | 密码强度不足，请至少包含8位字符 | Password too weak, minimum 8 characters required |
| 密码不匹配 | 两次输入的密码不一致 | Passwords do not match |
| 内容过长 | 内容超出最大长度限制 | Content exceeds maximum length |
| 内容过短 | 内容过短 | Content too short |
| 非法字符 | 包含非法字符 | Contains invalid characters |
| 重复数据 | 数据已存在 | Data already exists |

### 2.5 资源错误
| 场景 | 中文 | English |
|------|------|---------|
| 资源不存在 | 请求的资源不存在 | Requested resource not found |
| 资源已删除 | 资源已被删除 | Resource has been deleted |
| 资源不可用 | 资源暂时不可用 | Resource temporarily unavailable |
| 资源被占用 | 资源正被其他用户使用 | Resource is being used by another user |
| 存储空间不足 | 存储空间不足 | Insufficient storage space |
| 文件过大 | 文件大小超过限制 | File size exceeds limit |
| 文件类型不支持 | 不支持的文件类型 | Unsupported file type |
| 文件损坏 | 文件已损坏 | File is corrupted |

---

## 3. 警告提示类 (Warning Messages)

### 3.1 操作警告
| 场景 | 中文 | English |
|------|------|---------|
| 确认操作 | 确定要执行此操作吗？ | Are you sure you want to proceed? |
| 确认删除 | 确定要删除吗？此操作不可恢复 | Are you sure you want to delete? This action cannot be undone |
| 确认离开 | 您有未保存的更改，确定要离开吗？ | You have unsaved changes, are you sure you want to leave? |
| 批量操作 | 确定要对选中的 {count} 项执行此操作吗？ | Are you sure you want to perform this action on {count} selected items? |
| 覆盖确认 | 文件已存在，是否覆盖？ | File already exists, do you want to overwrite? |
| 替换确认 | 是否替换现有内容？ | Do you want to replace existing content? |
| 取消确认 | 确定要取消吗？已输入的数据将丢失 | Are you sure you want to cancel? Entered data will be lost |

### 3.2 状态警告
| 场景 | 中文 | English |
|------|------|---------|
| 预算警告 | 预算使用已超过 {percent}% | Budget usage has exceeded {percent}% |
| 余额不足 | 账户余额不足，请及时充值 | Insufficient account balance, please recharge |
| 即将过期 | 您的订阅将在 {days} 天后过期 | Your subscription will expire in {days} days |
| 已过期 | 您的订阅已过期 | Your subscription has expired |
| 用量警告 | 本月用量已接近上限 | Monthly usage is approaching the limit |
| 存储警告 | 存储空间使用已超过 {percent}% | Storage usage has exceeded {percent}% |
| 安全警告 | 检测到异常登录行为 | Abnormal login activity detected |

### 3.3 功能限制
| 场景 | 中文 | English |
|------|------|---------|
| 功能受限 | 当前版本不支持此功能 | This feature is not available in your current plan |
| 需要升级 | 请升级以使用此功能 | Please upgrade to use this feature |
| 达到上限 | 已达到最大数量限制 | Maximum limit reached |
| 试用到期 | 试用期已结束，请订阅 | Trial period has ended, please subscribe |
| 功能已禁用 | 此功能已被管理员禁用 | This feature has been disabled by administrator |

---

## 4. 信息提示类 (Info Messages)

### 4.1 状态信息
| 场景 | 中文 | English |
|------|------|---------|
| 加载中 | 加载中，请稍候... | Loading, please wait... |
| 处理中 | 正在处理... | Processing... |
| 保存中 | 正在保存... | Saving... |
| 提交中 | 正在提交... | Submitting... |
| 上传中 | 正在上传 {percent}%... | Uploading {percent}%... |
| 下载中 | 正在下载... | Downloading... |
| 同步中 | 正在同步... | Synchronizing... |
| 搜索中 | 正在搜索... | Searching... |
| 发送中 | 正在发送... | Sending... |

### 4.2 引导信息
| 场景 | 中文 | English |
|------|------|---------|
| 首次使用 | 欢迎使用！让我们开始吧 | Welcome! Let's get started |
| 新功能 | 新功能：{feature}，点击了解详情 | New feature: {feature}, click to learn more |
| 操作提示 | 提示：{tip} | Tip: {tip} |
| 快捷键 | 快捷键：{shortcut} | Keyboard shortcut: {shortcut} |
| 更新提示 | 有新版本可用，点击更新 | New version available, click to update |
| 功能介绍 | 此功能可以帮助您... | This feature helps you... |

### 4.3 空状态
| 场景 | 中文 | English |
|------|------|---------|
| 无数据 | 暂无数据 | No data available |
| 无搜索结果 | 未找到匹配的结果 | No matching results found |
| 无通知 | 暂无新通知 | No new notifications |
| 无消息 | 暂无消息 | No messages |
| 空列表 | 列表为空 | List is empty |
| 无项目 | 还没有创建任何项目 | No projects created yet |
| 无文件 | 文件夹为空 | Folder is empty |
| 无记录 | 暂无记录 | No records |

### 4.4 其他信息
| 场景 | 中文 | English |
|------|------|---------|
| 已复制 | 已复制 | Copied |
| 已添加 | 已添加 | Added |
| 已移除 | 已移除 | Removed |
| 已收藏 | 已收藏 | Favorited |
| 已取消收藏 | 已取消收藏 | Unfavorited |
| 已关注 | 已关注 | Following |
| 已取消关注 | 已取消关注 | Unfollowed |
| 已启用 | 已启用 | Enabled |
| 已禁用 | 已禁用 | Disabled |
| 已隐藏 | 已隐藏 | Hidden |
| 已显示 | 已显示 | Shown |
| 已固定 | 已固定 | Pinned |
| 已取消固定 | 已取消固定 | Unpinned |

---

## 5. 系统通知类 (System Notifications)

### 5.1 安全通知
| 场景 | 中文 | English |
|------|------|---------|
| 登录通知 | 您的账号在新设备上登录 | Your account was signed in on a new device |
| 密码修改 | 您的密码已被修改 | Your password has been changed |
| 邮箱修改 | 您的邮箱已被修改 | Your email has been changed |
| 绑定通知 | 新设备/应用已绑定到您的账号 | New device/app bound to your account |
| 解绑通知 | 设备/应用已从您的账号解绑 | Device/app unbound from your account |
| 异常登录 | 检测到异常登录尝试 | Abnormal login attempt detected |
| 安全扫描 | 系统安全扫描完成，未发现异常 | Security scan completed, no issues found |

### 5.2 业务通知
| 场景 | 中文 | English |
|------|------|---------|
| 预算告警 | 项目 "{project}" 预算使用已达 {percent}% | Project "{project}" budget usage has reached {percent}% |
| 用量告警 | 本月 API 调用量较上月增长 {percent}% | Monthly API calls increased by {percent}% compared to last month |
| 费用通知 | 本月费用已出账单，请查看 | Monthly bill is ready, please check |
| 充值成功 | 充值成功，金额：{amount} | Recharge successful, amount: {amount} |
| 退款通知 | 退款已处理，金额：{amount} | Refund processed, amount: {amount} |
| 订阅到期 | 您的订阅将在 {days} 天后到期 | Your subscription expires in {days} days |
| 服务维护 | 系统将于 {time} 进行维护 | System maintenance scheduled at {time} |
| 维护完成 | 系统维护已完成 | System maintenance completed |

### 5.3 协作通知
| 场景 | 中文 | English |
|------|------|---------|
| 邀请通知 | {user} 邀请您加入 {project} | {user} invited you to join {project} |
| 成员加入 | {user} 已加入项目 | {user} joined the project |
| 成员离开 | {user} 已离开项目 | {user} left the project |
| 权限变更 | 您的权限已被更新为 {role} | Your permissions have been updated to {role} |
| 任务分配 | 您有一个新任务：{task} | You have a new task: {task} |
| 任务完成 | 任务 "{task}" 已完成 | Task "{task}" completed |
| 评论通知 | {user} 评论了 {content} | {user} commented on {content} |
| 提及通知 | {user} 在 {content} 中提到了您 | {user} mentioned you in {content} |

---

## 6. 表单验证类 (Form Validation)

### 6.1 必填验证
| 场景 | 中文 | English |
|------|------|---------|
| 必填 | 此字段为必填项 | This field is required |
| 必选 | 请选择一个选项 | Please select an option |
| 至少选一个 | 请至少选择一项 | Please select at least one item |
| 至少填一个 | 请至少填写一项 | Please fill in at least one item |

### 6.2 格式验证
| 场景 | 中文 | English |
|------|------|---------|
| 邮箱 | 请输入有效的邮箱地址 | Please enter a valid email |
| 手机号 | 请输入有效的手机号码 | Please enter a valid phone number |
| 网址 | 请输入有效的网址 | Please enter a valid URL |
| 数字 | 请输入有效的数字 | Please enter a valid number |
| 整数 | 请输入整数 | Please enter an integer |
| 正数 | 请输入大于0的数字 | Please enter a number greater than 0 |
| 日期 | 请输入有效的日期 | Please enter a valid date |
| 时间 | 请输入有效的时间 | Please enter a valid time |

### 6.3 长度验证
| 场景 | 中文 | English |
|------|------|---------|
| 最小长度 | 至少需要 {min} 个字符 | Minimum {min} characters required |
| 最大长度 | 最多 {max} 个字符 | Maximum {max} characters allowed |
| 长度范围 | 长度应在 {min}-{max} 个字符之间 | Length should be between {min} and {max} characters |
| 固定长度 | 长度必须为 {length} 个字符 | Length must be exactly {length} characters |

### 6.4 范围验证
| 场景 | 中文 | English |
|------|------|---------|
| 最小值 | 最小值为 {min} | Minimum value is {min} |
| 最大值 | 最大值为 {max} | Maximum value is {max} |
| 值范围 | 值应在 {min} 到 {max} 之间 | Value should be between {min} and {max} |
| 日期范围 | 日期应在 {start} 到 {end} 之间 | Date should be between {start} and {end} |

---

## 7. 按钮文案类 (Button Labels)

### 7.1 通用按钮
| 场景 | 中文 | English |
|------|------|---------|
| 确定 | 确定 | OK / Confirm |
| 取消 | 取消 | Cancel |
| 保存 | 保存 | Save |
| 提交 | 提交 | Submit |
| 创建 | 创建 | Create |
| 添加 | 添加 | Add |
| 编辑 | 编辑 | Edit |
| 删除 | 删除 | Delete |
| 修改 | 修改 | Modify |
| 更新 | 更新 | Update |
| 刷新 | 刷新 | Refresh |
| 重置 | 重置 | Reset |
| 清空 | 清空 | Clear |
| 搜索 | 搜索 | Search |
| 查询 | 查询 | Query |
| 筛选 | 筛选 | Filter |
| 排序 | 排序 | Sort |
| 导入 | 导入 | Import |
| 导出 | 导出 | Export |
| 下载 | 下载 | Download |
| 上传 | 上传 | Upload |
| 打印 | 打印 | Print |
| 分享 | 分享 | Share |
| 复制 | 复制 | Copy |
| 粘贴 | 粘贴 | Paste |
| 剪切 | 剪切 | Cut |
| 全选 | 全选 | Select All |
| 取消全选 | 取消全选 | Deselect All |
| 展开 | 展开 | Expand |
| 收起 | 收起 | Collapse |
| 更多 | 更多 | More |
| 收起更多 | 收起更多 | Show Less |
| 查看详情 | 查看详情 | View Details |
| 返回 | 返回 | Back |
| 上一步 | 上一步 | Previous |
| 下一步 | 下一步 | Next |
| 完成 | 完成 | Finish / Done |
| 关闭 | 关闭 | Close |
| 退出 | 退出 | Exit |
| 登出 | 退出登录 | Sign Out / Logout |
| 登录 | 登录 | Sign In / Login |
| 注册 | 注册 | Sign Up / Register |

### 7.2 确认按钮
| 场景 | 中文 | English |
|------|------|---------|
| 确认删除 | 确认删除 | Confirm Delete |
| 确认提交 | 确认提交 | Confirm Submit |
| 确认保存 | 确认保存 | Confirm Save |
| 确认退出 | 确认退出 | Confirm Exit |
| 是的 | 是的 | Yes |
| 否 | 否 | No |
| 我确定 | 我确定 | I'm Sure |
| 再想想 | 再想想 | Let Me Think |

### 7.3 状态按钮
| 场景 | 中文 | English |
|------|------|---------|
| 启用 | 启用 | Enable |
| 禁用 | 禁用 | Disable |
| 激活 | 激活 | Activate |
| 停用 | 停用 | Deactivate |
| 发布 | 发布 | Publish |
| 取消发布 | 取消发布 | Unpublish |
| 归档 | 归档 | Archive |
| 恢复 | 恢复 | Restore |
| 锁定 | 锁定 | Lock |
| 解锁 | 解锁 | Unlock |
| 置顶 | 置顶 | Pin to Top |
| 取消置顶 | 取消置顶 | Unpin |
| 收藏 | 收藏 | Favorite |
| 取消收藏 | 取消收藏 | Unfavorite |
| 关注 | 关注 | Follow |
| 取消关注 | 取消关注 | Unfollow |
| 隐藏 | 隐藏 | Hide |
| 显示 | 显示 | Show |

---

## 8. 时间相关类 (Time-related)

### 8.1 相对时间
| 场景 | 中文 | English |
|------|------|---------|
| 刚刚 | 刚刚 | Just now |
| 几分钟前 | {count} 分钟前 | {count} minutes ago |
| 几小时前 | {count} 小时前 | {count} hours ago |
| 几天前 | {count} 天前 | {count} days ago |
| 几周前 | {count} 周前 | {count} weeks ago |
| 几个月前 | {count} 个月前 | {count} months ago |
| 几年前 | {count} 年前 | {count} years ago |
| 昨天 | 昨天 | Yesterday |
| 今天 | 今天 | Today |
| 明天 | 明天 | Tomorrow |
| 前天 | 前天 | The day before yesterday |
| 后天 | 后天 | The day after tomorrow |

### 8.2 时间范围
| 场景 | 中文 | English |
|------|------|---------|
| 最近7天 | 最近7天 | Last 7 days |
| 最近30天 | 最近30天 | Last 30 days |
| 本月 | 本月 | This month |
| 上月 | 上月 | Last month |
| 本季度 | 本季度 | This quarter |
| 上季度 | 上季度 | Last quarter |
| 本年 | 本年 | This year |
| 去年 | 去年 | Last year |
| 自定义范围 | 自定义范围 | Custom range |

---

## 9. 数量单位类 (Quantity Units)

### 9.1 数字单位
| 场景 | 中文 | English |
|------|------|---------|
| 千 | {n}K | {n}K |
| 万 | {n}万 | {n}0K |
| 百万 | {n}M | {n}M |
| 亿 | {n}亿 | {n}00M |
| 十亿 | {n}B | {n}B |

### 9.2 存储单位
| 场景 | 中文 | English |
|------|------|---------|
| 字节 | {n} B | {n} B |
| KB | {n} KB | {n} KB |
| MB | {n} MB | {n} MB |
| GB | {n} GB | {n} GB |
| TB | {n} TB | {n} TB |

### 9.3 时间单位
| 场景 | 中文 | English |
|------|------|---------|
| 毫秒 | {n} 毫秒 | {n} ms |
| 秒 | {n} 秒 | {n} s |
| 分钟 | {n} 分钟 | {n} min |
| 小时 | {n} 小时 | {n} h |
| 天 | {n} 天 | {n} d |

---

## 10. 使用示例 (Usage Examples)

### React/TypeScript 示例

```typescript
// 消息提示 Hook 示例
const useMessage = () => {
  const { t, language } = useLanguage();
  
  return {
    // 成功提示
    success: (key: string, params?: Record<string, string>) => {
      const message = language === 'zh' 
        ? getChineseMessage(key, params)
        : getEnglishMessage(key, params);
      toast.success(message);
    },
    
    // 错误提示
    error: (key: string, params?: Record<string, string>) => {
      const message = language === 'zh'
        ? getChineseMessage(key, params)
        : getEnglishMessage(key, params);
      toast.error(message);
    },
    
    // 警告提示
    warning: (key: string, params?: Record<string, string>) => {
      const message = language === 'zh'
        ? getChineseMessage(key, params)
        : getEnglishMessage(key, params);
      toast.warning(message);
    },
    
    // 信息提示
    info: (key: string, params?: Record<string, string>) => {
      const message = language === 'zh'
        ? getChineseMessage(key, params)
        : getEnglishMessage(key, params);
      toast.info(message);
    }
  };
};

// 使用示例
const MyComponent = () => {
  const message = useMessage();
  
  const handleSave = async () => {
    try {
      await saveData();
      message.success('saveSuccess'); // "保存成功" / "Saved successfully"
    } catch (error) {
      message.error('saveFailed'); // "保存失败" / "Failed to save"
    }
  };
  
  const handleDelete = async (id: string) => {
    if (confirm(t('confirmDelete'))) {
      try {
        await deleteItem(id);
        message.success('deleteSuccess');
      } catch (error) {
        message.error('deleteFailed');
      }
    }
  };
  
  return (
    <div>
      <button onClick={handleSave}>{t('save')}</button>
      <button onClick={() => handleDelete('123')}>{t('delete')}</button>
    </div>
  );
};
```

### 消息类型定义

```typescript
// 消息类型
export type MessageType = 'success' | 'error' | 'warning' | 'info';

// 消息配置
export interface MessageConfig {
  duration?: number;        // 显示时长(ms)
  closable?: boolean;       // 是否可关闭
  showIcon?: boolean;       // 是否显示图标
  action?: React.ReactNode; // 操作按钮
}

// 消息项
export interface MessageItem {
  id: string;
  type: MessageType;
  content: string;
  config?: MessageConfig;
  timestamp: number;
}
```

---

## 11. 设计原则 (Design Principles)

### 11.1 清晰性 (Clarity)
- 使用简洁明了的语言
- 避免技术术语和缩写
- 明确指出问题所在
- 提供具体的解决方案

### 11.2 友好性 (Friendliness)
- 使用礼貌和积极的语气
- 避免指责用户
- 提供帮助和引导
- 适当使用表情符号（可选）

### 11.3 一致性 (Consistency)
- 保持术语统一
- 保持句式结构一致
- 保持语气风格一致
- 保持标点符号使用一致

### 11.4 可操作性 (Actionability)
- 提供明确的操作指引
- 说明操作后果
- 提供快捷操作入口
- 提供相关帮助链接

### 11.5 本地化 (Localization)
- 考虑文化差异
- 考虑语言习惯
- 考虑阅读顺序
- 考虑日期/数字格式

---

*文档版本: 1.0*  
*最后更新: 2026-04-23*
