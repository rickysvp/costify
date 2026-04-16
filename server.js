import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize, Op } from 'sequelize';
import fetch from 'node-fetch';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'costify-secret-key-2024';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './costify.db',
  logging: false,
});

// ==================== 模型定义 ====================

const Org = sequelize.define('Org', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING, allowNull: false },
  balance: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
  balance_threshold: { type: Sequelize.DECIMAL(12, 2), defaultValue: 10 },
  status: { type: Sequelize.STRING, defaultValue: 'active' },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'org', timestamps: false });

const User = sequelize.define('User', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  org_id: { type: Sequelize.INTEGER, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.STRING, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  role: { type: Sequelize.STRING, defaultValue: 'member' },
  status: { type: Sequelize.STRING, defaultValue: 'active' },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'user', timestamps: false });

const Project = sequelize.define('Project', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  org_id: { type: Sequelize.INTEGER, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  monthly_budget: { type: Sequelize.DECIMAL(10, 2) },
  routing_profile: { type: Sequelize.STRING, defaultValue: 'balanced' },
  max_tokens_per_request: { type: Sequelize.INTEGER, defaultValue: 4096 },
  default_model: { type: Sequelize.STRING, defaultValue: 'gpt-4o-mini' },
  models: { type: Sequelize.TEXT, defaultValue: 'gpt-4o-mini' },
  status: { type: Sequelize.STRING, defaultValue: 'active' },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'project', timestamps: false });

const ApiKey = sequelize.define('ApiKey', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  org_id: { type: Sequelize.INTEGER, allowNull: false },
  project_id: { type: Sequelize.INTEGER, allowNull: false },
  user_id: { type: Sequelize.INTEGER },
  name: { type: Sequelize.STRING },
  key: { type: Sequelize.STRING, allowNull: false, unique: true },
  key_type: { type: Sequelize.STRING, defaultValue: 'project' },
  status: { type: Sequelize.STRING, defaultValue: 'active' },
  expires_at: { type: Sequelize.DATE },
  monthly_budget: { type: Sequelize.DECIMAL(10, 2) },
  monthly_spend: { type: Sequelize.DECIMAL(10, 4), defaultValue: 0 },
  total_requests: { type: Sequelize.INTEGER, defaultValue: 0 },
  total_tokens: { type: Sequelize.INTEGER, defaultValue: 0 },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'api_key', timestamps: false });

const Usage = sequelize.define('Usage', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  org_id: { type: Sequelize.INTEGER, allowNull: false },
  project_id: { type: Sequelize.INTEGER, allowNull: false },
  user_id: { type: Sequelize.INTEGER },
  api_key_id: { type: Sequelize.INTEGER },
  model: { type: Sequelize.STRING, allowNull: false },
  routed_model: { type: Sequelize.STRING },
  original_model: { type: Sequelize.STRING },
  prompt_tokens: { type: Sequelize.INTEGER, allowNull: false },
  completion_tokens: { type: Sequelize.INTEGER, allowNull: false },
  total_tokens: { type: Sequelize.INTEGER, allowNull: false },
  cost: { type: Sequelize.DECIMAL(10, 6), allowNull: false },
  original_cost: { type: Sequelize.DECIMAL(10, 6) },
  savings: { type: Sequelize.DECIMAL(10, 6), defaultValue: 0 },
  cache_hit: { type: Sequelize.BOOLEAN, defaultValue: false },
  latency: { type: Sequelize.INTEGER }, // 请求延迟（毫秒）
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'usage', timestamps: false });

const Recharge = sequelize.define('Recharge', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  org_id: { type: Sequelize.INTEGER, allowNull: false },
  user_id: { type: Sequelize.INTEGER, allowNull: false },
  amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
  payment_method: { type: Sequelize.STRING, allowNull: false },
  status: { type: Sequelize.STRING, defaultValue: 'success' },
  transaction_id: { type: Sequelize.STRING },
  note: { type: Sequelize.STRING },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'recharge', timestamps: false });

const Membership = sequelize.define('Membership', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: Sequelize.INTEGER, allowNull: false },
  project_id: { type: Sequelize.INTEGER, allowNull: false },
  role: { type: Sequelize.STRING, defaultValue: 'member' },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'membership', timestamps: false });

const Alert = sequelize.define('Alert', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  org_id: { type: Sequelize.INTEGER, allowNull: false },
  project_id: { type: Sequelize.INTEGER },
  user_id: { type: Sequelize.INTEGER },
  type: { type: Sequelize.STRING, allowNull: false },
  severity: { type: Sequelize.STRING, defaultValue: 'warning' },
  message: { type: Sequelize.TEXT, allowNull: false },
  status: { type: Sequelize.STRING, defaultValue: 'unread' },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'alert', timestamps: false });

const Savings = sequelize.define('Savings', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  org_id: { type: Sequelize.INTEGER, allowNull: false },
  project_id: { type: Sequelize.INTEGER, allowNull: false },
  usage_id: { type: Sequelize.INTEGER },
  type: { type: Sequelize.STRING, allowNull: false },
  saved_tokens: { type: Sequelize.INTEGER, allowNull: false },
  saved_cost: { type: Sequelize.DECIMAL(10, 6), allowNull: false },
  detail: { type: Sequelize.TEXT },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'savings', timestamps: false });

// ==================== AI 报告模块模型 ====================

// 报告定义
const Report = sequelize.define('Report', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  org_id: { type: Sequelize.INTEGER, allowNull: false },
  created_by: { type: Sequelize.INTEGER, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  type: { type: Sequelize.STRING, allowNull: false, defaultValue: 'custom' }, // custom, weekly, monthly, quarterly, roi
  status: { type: Sequelize.STRING, defaultValue: 'draft' }, // draft, generating, ready, error
  date_range_start: { type: Sequelize.DATE },
  date_range_end: { type: Sequelize.DATE },
  // 报告配置
  config: { type: Sequelize.TEXT }, // JSON: { metrics: [], charts: [], insights: [] }
  // AI 生成的洞察
  ai_insights: { type: Sequelize.TEXT }, // JSON
  // 报告内容（HTML 或 Markdown）
  content: { type: Sequelize.TEXT },
  // 报告数据快照
  data_snapshot: { type: Sequelize.TEXT }, // JSON
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'report', timestamps: false });

// 报告权限 - 细粒度控制
const ReportPermission = sequelize.define('ReportPermission', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  report_id: { type: Sequelize.INTEGER, allowNull: false },
  // 权限类型: user, project, api_key
  permission_type: { type: Sequelize.STRING, allowNull: false },
  // 对应的 ID
  permission_id: { type: Sequelize.INTEGER },
  // 权限级别: view, edit, admin
  access_level: { type: Sequelize.STRING, defaultValue: 'view' },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'report_permission', timestamps: false });

// 报告模板
const ReportTemplate = sequelize.define('ReportTemplate', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  org_id: { type: Sequelize.INTEGER, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  type: { type: Sequelize.STRING, allowNull: false }, // roi, usage, cost, efficiency
  // 模板配置
  config: { type: Sequelize.TEXT }, // JSON: 预定义的指标、图表、AI 提示词
  is_default: { type: Sequelize.BOOLEAN, defaultValue: false },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'report_template', timestamps: false });

// 报告调度（定时生成）
const ReportSchedule = sequelize.define('ReportSchedule', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  report_id: { type: Sequelize.INTEGER, allowNull: false },
  // 调度类型: daily, weekly, monthly
  schedule_type: { type: Sequelize.STRING, allowNull: false },
  // 调度配置
  schedule_config: { type: Sequelize.TEXT }, // JSON: { dayOfWeek, dayOfMonth, time }
  is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
  last_run_at: { type: Sequelize.DATE },
  next_run_at: { type: Sequelize.DATE },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'report_schedule', timestamps: false });

// ==================== 关联关系 ====================

User.belongsTo(Org, { foreignKey: 'org_id' });
Org.hasMany(User, { foreignKey: 'org_id' });
Project.belongsTo(Org, { foreignKey: 'org_id' });
Org.hasMany(Project, { foreignKey: 'org_id' });
ApiKey.belongsTo(Org, { foreignKey: 'org_id' });
ApiKey.belongsTo(Project, { foreignKey: 'project_id' });
ApiKey.belongsTo(User, { foreignKey: 'user_id' });
Usage.belongsTo(Org, { foreignKey: 'org_id' });
Usage.belongsTo(Project, { foreignKey: 'project_id' });
Usage.belongsTo(User, { foreignKey: 'user_id' });
Usage.belongsTo(ApiKey, { foreignKey: 'api_key_id' });
Recharge.belongsTo(Org, { foreignKey: 'org_id' });
Recharge.belongsTo(User, { foreignKey: 'user_id' });
Membership.belongsTo(User, { foreignKey: 'user_id' });
Membership.belongsTo(Project, { foreignKey: 'project_id' });
Alert.belongsTo(Org, { foreignKey: 'org_id' });
Alert.belongsTo(Project, { foreignKey: 'project_id' });
Savings.belongsTo(Org, { foreignKey: 'org_id' });
Savings.belongsTo(Project, { foreignKey: 'project_id' });

// 报告模块关联
Report.belongsTo(Org, { foreignKey: 'org_id' });
Report.belongsTo(User, { foreignKey: 'created_by' });
Report.hasMany(ReportPermission, { foreignKey: 'report_id' });
Report.hasOne(ReportSchedule, { foreignKey: 'report_id' });
ReportPermission.belongsTo(Report, { foreignKey: 'report_id' });
ReportTemplate.belongsTo(Org, { foreignKey: 'org_id' });
ReportSchedule.belongsTo(Report, { foreignKey: 'report_id' });

// ==================== 工具函数 ====================

function generateApiKey() {
  return 'csk_' + Array.from({ length: 40 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
}

const MODEL_PRICES = {
  'gpt-4o': { prompt: 0.005, completion: 0.015 },
  'gpt-4o-mini': { prompt: 0.00015, completion: 0.0006 },
  'gpt-3.5-turbo': { prompt: 0.001, completion: 0.002 },
  'claude-3-opus': { prompt: 0.015, completion: 0.075 },
  'claude-3-sonnet': { prompt: 0.003, completion: 0.015 },
  'claude-3-haiku': { prompt: 0.00025, completion: 0.00125 },
};

function calculateCost(model, promptTokens, completionTokens) {
  const price = MODEL_PRICES[model] || MODEL_PRICES['gpt-3.5-turbo'];
  return (promptTokens * price.prompt + completionTokens * price.completion) / 1000;
}

const ROUTING_PROFILES = {
  cost_saver: {
    name: '成本优先',
    description: '优先使用最经济的模型，仅在必要时升级',
    rules: [
      { condition: 'simple', model: 'gpt-4o-mini' },
      { condition: 'moderate', model: 'gpt-4o-mini' },
      { condition: 'complex', model: 'gpt-4o' },
    ]
  },
  balanced: {
    name: '平衡模式',
    description: '根据请求复杂度智能选择模型',
    rules: [
      { condition: 'simple', model: 'gpt-4o-mini' },
      { condition: 'moderate', model: 'gpt-4o' },
      { condition: 'complex', model: 'gpt-4o' },
    ]
  },
  quality: {
    name: '质量优先',
    description: '始终使用最强大的模型，确保最佳输出',
    rules: [
      { condition: 'simple', model: 'gpt-4o' },
      { condition: 'moderate', model: 'gpt-4o' },
      { condition: 'complex', model: 'gpt-4o' },
    ]
  }
};

function analyzeComplexity(messages) {
  let score = 0;
  const totalLength = messages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0);
  score += Math.min(totalLength / 2000, 1) * 0.4;
  const hasCode = messages.some(msg => /```|function |class |import |def |return /.test(msg.content || ''));
  if (hasCode) score += 0.25;
  const hasMultiLang = messages.some(msg => {
    const c = (msg.content || '').match(/[\u4e00-\u9fa5]/g)?.length || 0;
    const e = (msg.content || '').match(/\b[a-zA-Z]+\b/g)?.length || 0;
    return c > 20 && e > 20;
  });
  if (hasMultiLang) score += 0.15;
  const hasReasoning = messages.some(msg => /分析|推理|解释|为什么|比较|evaluate|reason|explain|compare/.test(msg.content || ''));
  if (hasReasoning) score += 0.2;
  if (score < 0.35) return 'simple';
  if (score < 0.65) return 'moderate';
  return 'complex';
}

function routeModel(messages, profile, requestedModel, enabledModels) {
  const models = enabledModels || [];
  if (requestedModel && profile === 'quality' && models.includes(requestedModel)) return requestedModel;
  const complexity = analyzeComplexity(messages);
  const routingProfile = ROUTING_PROFILES[profile] || ROUTING_PROFILES.balanced;
  const rule = routingProfile.rules.find(r => r.condition === complexity);
  const routed = rule?.model || requestedModel || 'gpt-4o-mini';
  if (models.length > 0 && !models.includes(routed)) {
    const fallbackOrder = ['gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4o', 'claude-3-sonnet', 'claude-3-haiku'];
    const fallback = fallbackOrder.find(m => models.includes(m));
    return fallback || models[0] || routed;
  }
  return routed;
}

const promptCache = new Map();

function getCacheKey(messages, model) {
  const content = messages.map(m => `${m.role}:${m.content}`).join('|');
  return `${model}:${content}`;
}

function checkCache(key) {
  const cached = promptCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.ts > 24 * 60 * 60 * 1000) {
    promptCache.delete(key);
    return null;
  }
  return cached.data;
}

function setCache(key, data) {
  if (promptCache.size > 10000) {
    const oldest = [...promptCache.entries()].sort((a, b) => a[1].ts - b[1].ts).slice(0, 2000);
    oldest.forEach(([k]) => promptCache.delete(k));
  }
  promptCache.set(key, { data, ts: Date.now() });
}

// ==================== 认证中间件 ====================

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未提供认证令牌' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: '无效的认证令牌' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: '未认证' });
    if (!roles.includes(req.user.role) && req.user.role !== 'platform_admin') {
      return res.status(403).json({ error: '权限不足' });
    }
    next();
  };
}

function requireOrgAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: '未认证' });
  if (req.user.role === 'platform_admin' || req.user.role === 'org_admin') return next();
  return res.status(403).json({ error: '需要管理员权限' });
}

// ==================== 告警函数 ====================

async function createAlert(orgId, projectId, type, severity, message) {
  try {
    await Alert.create({ org_id: orgId, project_id: projectId, type, severity, message });
  } catch (err) {
    console.error('创建告警失败:', err);
  }
}

async function checkBudgetAndBalance(orgId, projectId, cost) {
  try {
    const org = await Org.findByPk(orgId);
    if (org && parseFloat(org.balance) < parseFloat(org.balance_threshold)) {
      await createAlert(orgId, null, 'balance', 'critical',
        `组织余额不足！当前余额: $${parseFloat(org.balance).toFixed(2)}，阈值: $${parseFloat(org.balance_threshold).toFixed(2)}`);
    }
    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (project && project.monthly_budget) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthUsage = await Usage.findAll({
          where: { project_id: projectId, created_at: { [Op.gte]: startOfMonth } }
        });
        const totalSpend = monthUsage.reduce((sum, u) => sum + parseFloat(u.cost), 0);
        const pct = (totalSpend / parseFloat(project.monthly_budget)) * 100;
        if (pct >= 100 && pct - (cost / parseFloat(project.monthly_budget)) * 100 < 100) {
          await createAlert(orgId, projectId, 'budget', 'critical',
            `项目 "${project.name}" 已超出月度预算！花费: $${totalSpend.toFixed(2)}，预算: $${parseFloat(project.monthly_budget).toFixed(2)}`);
        } else if (pct >= 80 && pct - (cost / parseFloat(project.monthly_budget)) * 100 < 80) {
          await createAlert(orgId, projectId, 'budget', 'warning',
            `项目 "${project.name}" 预算使用已达 ${pct.toFixed(1)}%`);
        }
      }
    }
  } catch (err) {
    console.error('检查预算失败:', err);
  }
}

// ==================== 认证 API ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, org_id } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: '缺少必要信息' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: '邮箱已被注册' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashedPassword, name,
      org_id: org_id || 1,
      role: 'member'
    });
    const token = jwt.sign(
      { id: user.id, email: user.email, org_id: user.org_id, role: user.role, name: user.name },
      JWT_SECRET, { expiresIn: '7d' }
    );
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, org_id: user.org_id, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: '缺少邮箱或密码' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: '邮箱或密码错误' });
    if (user.status === 'disabled') return res.status(403).json({ error: '账号已被禁用' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: '邮箱或密码错误' });
    const token = jwt.sign(
      { id: user.id, email: user.email, org_id: user.org_id, role: user.role, name: user.name },
      JWT_SECRET, { expiresIn: '7d' }
    );
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, org_id: user.org_id, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'name', 'org_id', 'role', 'status']
    });
    if (!user) return res.status(404).json({ error: '用户不存在' });
    const org = await Org.findByPk(user.org_id);
    const memberships = await Membership.findAll({ where: { user_id: user.id } });
    res.json({ ...user.toJSON(), org_name: org?.name, memberships });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 组织 API ====================

app.get('/api/org', authMiddleware, async (req, res) => {
  try {
    const org = await Org.findByPk(req.user.org_id);
    if (!org) return res.status(404).json({ error: '组织不存在' });
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthUsage = await Usage.findAll({
      where: { org_id: org.id, created_at: { [Op.gte]: startOfMonth } }
    });
    const monthSpend = monthUsage.reduce((sum, u) => sum + parseFloat(u.cost), 0);
    const monthSavings = monthUsage.reduce((sum, u) => sum + parseFloat(u.savings || 0), 0);
    const projectCount = await Project.count({ where: { org_id: org.id, status: 'active' } });
    const memberCount = await User.count({ where: { org_id: org.id, status: 'active' } });
    const activeKeys = await ApiKey.count({ where: { org_id: org.id, status: 'active' } });
    res.json({
      ...org.toJSON(),
      month_spend: monthSpend,
      month_savings: monthSavings,
      project_count: projectCount,
      member_count: memberCount,
      active_keys: activeKeys
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/org', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const org = await Org.findByPk(req.user.org_id);
    if (!org) return res.status(404).json({ error: '组织不存在' });
    const { name, balance_threshold } = req.body;
    if (name) org.name = name;
    if (balance_threshold !== undefined) org.balance_threshold = balance_threshold;
    await org.save();
    res.json(org);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/org/balance', authMiddleware, async (req, res) => {
  try {
    const org = await Org.findByPk(req.user.org_id);
    if (!org) return res.status(404).json({ error: '组织不存在' });
    res.json({ balance: parseFloat(org.balance), threshold: parseFloat(org.balance_threshold) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 充值 API ====================

app.get('/api/recharge/history', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const history = await Recharge.findAll({
      where: { org_id: req.user.org_id },
      order: [['created_at', 'DESC']],
      limit: 50
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/recharge', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const { amount, payment_method, note } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: '充值金额必须大于0' });
    if (!payment_method) return res.status(400).json({ error: '请选择支付方式' });
    const org = await Org.findByPk(req.user.org_id);
    if (!org) return res.status(404).json({ error: '组织不存在' });
    const recharge = await Recharge.create({
      org_id: req.user.org_id,
      user_id: req.user.id,
      amount,
      payment_method,
      status: 'success',
      transaction_id: 'TXN_' + Date.now(),
      note: note || '管理员充值'
    });
    org.balance = parseFloat(org.balance) + parseFloat(amount);
    await org.save();
    res.status(201).json(recharge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 项目 API ====================

app.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    let where = { org_id: req.user.org_id };
    if (req.user.role === 'member') {
      const memberships = await Membership.findAll({ where: { user_id: req.user.id } });
      const projectIds = memberships.map(m => m.project_id);
      where = { ...where, id: { [Op.in]: projectIds } };
    }
    const projects = await Project.findAll({ where, order: [['created_at', 'DESC']] });
    const result = await Promise.all(projects.map(async (p) => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const usage = await Usage.findAll({
        where: { project_id: p.id, created_at: { [Op.gte]: startOfMonth } }
      });
      const monthSpend = usage.reduce((sum, u) => sum + parseFloat(u.cost), 0);
      const monthSavings = usage.reduce((sum, u) => sum + parseFloat(u.savings || 0), 0);
      const budgetPct = p.monthly_budget ? (monthSpend / parseFloat(p.monthly_budget)) * 100 : 0;
      const keyCount = await ApiKey.count({ where: { project_id: p.id, status: 'active' } });
      const memberCount = await Membership.count({ where: { project_id: p.id } });
      return {
        ...p.toJSON(),
        month_spend: monthSpend,
        month_savings: monthSavings,
        budget_percentage: budgetPct,
        key_count: keyCount,
        member_count: memberCount
      };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const { name, description, monthly_budget, routing_profile, max_tokens_per_request, default_model, models } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: '项目名称不能为空' });
    if (monthly_budget !== undefined && monthly_budget < 0) return res.status(400).json({ error: '预算不能为负' });
    if (max_tokens_per_request !== undefined && (max_tokens_per_request < 1 || max_tokens_per_request > 128000)) {
      return res.status(400).json({ error: 'max_tokens 范围: 1-128000' });
    }
    const modelList = (models && models.length > 0) ? models : [default_model || 'gpt-4o-mini'];
    const project = await Project.create({
      org_id: req.user.org_id,
      name: name.trim(),
      description: description?.trim() || '',
      monthly_budget: monthly_budget || null,
      routing_profile: routing_profile || 'balanced',
      max_tokens_per_request: max_tokens_per_request || 4096,
      default_model: default_model || modelList[0] || 'gpt-4o-mini',
      models: modelList.join(',')
    });
    await Membership.create({
      user_id: req.user.id,
      project_id: project.id,
      role: 'admin'
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, org_id: req.user.org_id }
    });
    if (!project) return res.status(404).json({ error: '项目不存在' });
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const usage = await Usage.findAll({
      where: { project_id: project.id, created_at: { [Op.gte]: startOfMonth } }
    });
    const monthSpend = usage.reduce((sum, u) => sum + parseFloat(u.cost), 0);
    const monthSavings = usage.reduce((sum, u) => sum + parseFloat(u.savings || 0), 0);
    const budgetPct = project.monthly_budget ? (monthSpend / parseFloat(project.monthly_budget)) * 100 : 0;
    const apiKeys = await ApiKey.findAll({ where: { project_id: project.id } });
    const memberships = await Membership.findAll({
      where: { project_id: project.id },
      include: [{ model: User, attributes: ['id', 'name', 'email', 'role'] }]
    });
    res.json({
      ...project.toJSON(),
      month_spend: monthSpend,
      month_savings: monthSavings,
      budget_percentage: budgetPct,
      api_keys: apiKeys,
      members: memberships
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, org_id: req.user.org_id }
    });
    if (!project) return res.status(404).json({ error: '项目不存在' });
    const { name, description, monthly_budget, routing_profile, max_tokens_per_request, default_model, models, status } = req.body;
    if (name !== undefined) project.name = name.trim();
    if (description !== undefined) project.description = description;
    if (monthly_budget !== undefined) project.monthly_budget = monthly_budget;
    if (routing_profile !== undefined) project.routing_profile = routing_profile;
    if (max_tokens_per_request !== undefined) project.max_tokens_per_request = max_tokens_per_request;
    if (default_model !== undefined) project.default_model = default_model;
    if (models !== undefined) project.models = Array.isArray(models) ? models.join(',') : models;
    if (status !== undefined) project.status = status;
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, org_id: req.user.org_id }
    });
    if (!project) return res.status(404).json({ error: '项目不存在' });
    await ApiKey.destroy({ where: { project_id: project.id } });
    await Usage.destroy({ where: { project_id: project.id } });
    await Membership.destroy({ where: { project_id: project.id } });
    await Savings.destroy({ where: { project_id: project.id } });
    await Alert.destroy({ where: { project_id: project.id } });
    await project.destroy();
    res.json({ message: '项目已删除' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 成员 API ====================

app.get('/api/members', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      where: { org_id: req.user.org_id, status: 'active' },
      attributes: ['id', 'email', 'name', 'role', 'status', 'created_at']
    });
    const result = await Promise.all(users.map(async (u) => {
      const memberships = await Membership.findAll({
        where: { user_id: u.id },
        include: [{ model: Project, attributes: ['id', 'name'] }]
      });
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const usage = await Usage.findAll({
        where: { user_id: u.id, created_at: { [Op.gte]: startOfMonth } }
      });
      const monthSpend = usage.reduce((sum, u2) => sum + parseFloat(u2.cost), 0);
      return { ...u.toJSON(), projects: memberships, month_spend: monthSpend };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/members/invite', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const { email, name, role, project_ids } = req.body;
    if (!email) return res.status(400).json({ error: '请输入邮箱' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: '该邮箱已注册' });
    const tempPassword = 'Costify' + Math.floor(Math.random() * 10000);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const user = await User.create({
      org_id: req.user.org_id,
      email, name: name || email.split('@')[0],
      password: hashedPassword,
      role: role || 'member'
    });
    if (project_ids && project_ids.length > 0) {
      for (const pid of project_ids) {
        const proj = await Project.findOne({ where: { id: pid, org_id: req.user.org_id } });
        if (proj) {
          await Membership.create({ user_id: user.id, project_id: pid, role: role === 'org_admin' ? 'admin' : 'member' });
        }
      }
    }
    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      temp_password: tempPassword
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/members/:id/role', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!user) return res.status(404).json({ error: '用户不存在' });
    user.role = req.body.role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/members/:id', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!user) return res.status(404).json({ error: '用户不存在' });
    user.status = 'disabled';
    await user.save();
    await Membership.destroy({ where: { user_id: user.id } });
    await ApiKey.update({ status: 'revoked' }, { where: { user_id: user.id } });
    res.json({ message: '成员已移除' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 项目成员管理 ====================

app.get('/api/projects/:id/members', authMiddleware, async (req, res) => {
  try {
    const memberships = await Membership.findAll({
      where: { project_id: req.params.id },
      include: [{ model: User, attributes: ['id', 'name', 'email', 'role'] }]
    });
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects/:id/members', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const { user_id, role } = req.body;
    if (!user_id) return res.status(400).json({ error: '请指定用户' });
    const existing = await Membership.findOne({ where: { user_id, project_id: req.params.id } });
    if (existing) return res.status(400).json({ error: '该用户已是项目成员' });
    const membership = await Membership.create({
      user_id, project_id: parseInt(req.params.id), role: role || 'member'
    });
    res.status(201).json(membership);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id/members/:userId', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    await Membership.destroy({
      where: { user_id: req.params.userId, project_id: req.params.id }
    });
    res.json({ message: '成员已移除' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== API Key 管理 ====================

app.get('/api/api-keys', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    let where = { org_id: req.user.org_id };
    if (req.query.project_id) where.project_id = req.query.project_id;
    const keys = await ApiKey.findAll({
      where,
      include: [
        { model: Project, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(keys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/api-keys', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const { project_id, user_id, name, key_type, expires_at } = req.body;
    if (!project_id) return res.status(400).json({ error: '请指定项目' });
    const project = await Project.findOne({ where: { id: project_id, org_id: req.user.org_id } });
    if (!project) return res.status(404).json({ error: '项目不存在' });
    const key = generateApiKey();
    const apiKey = await ApiKey.create({
      org_id: req.user.org_id,
      project_id,
      user_id: user_id || null,
      name: name || (key_type === 'user' ? '用户密钥' : '项目密钥'),
      key,
      key_type: key_type || 'project',
      expires_at: expires_at || null
    });
    res.status(201).json({ ...apiKey.toJSON(), key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/api-keys/:id', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!apiKey) return res.status(404).json({ error: 'API Key 不存在' });
    if (req.body.name) apiKey.name = req.body.name;
    await apiKey.save();
    res.json(apiKey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/api-keys/:id/revoke', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!apiKey) return res.status(404).json({ error: 'API Key 不存在' });
    if (apiKey.status === 'revoked') return res.status(400).json({ error: 'API Key 已被吊销' });
    apiKey.status = 'revoked';
    await apiKey.save();
    res.json(apiKey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 暂停 API Key
app.put('/api/api-keys/:id/pause', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!apiKey) return res.status(404).json({ error: 'API Key 不存在' });
    if (apiKey.status !== 'active') return res.status(400).json({ error: 'API Key 当前状态无法暂停' });
    apiKey.status = 'paused';
    await apiKey.save();
    res.json(apiKey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 启用 API Key
app.put('/api/api-keys/:id/activate', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!apiKey) return res.status(404).json({ error: 'API Key 不存在' });
    if (apiKey.status === 'revoked') return res.status(400).json({ error: '已吊销的 Key 无法重新启用' });
    apiKey.status = 'active';
    await apiKey.save();
    res.json(apiKey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 重置 API Key（生成新 key）
app.post('/api/api-keys/:id/reset', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!apiKey) return res.status(404).json({ error: 'API Key 不存在' });
    const newKey = generateApiKey();
    apiKey.key = newKey;
    apiKey.status = 'active';
    await apiKey.save();
    res.json({ ...apiKey.toJSON(), key: newKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 修改 API Key 预算
app.put('/api/api-keys/:id/budget', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const { monthly_budget } = req.body;
    const apiKey = await ApiKey.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!apiKey) return res.status(404).json({ error: 'API Key 不存在' });
    apiKey.monthly_budget = monthly_budget !== undefined ? monthly_budget : null;
    await apiKey.save();
    res.json(apiKey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取 API Key 使用统计
app.get('/api/api-keys/:id/stats', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!apiKey) return res.status(404).json({ error: 'API Key 不存在' });
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // 本月使用统计
    const monthUsage = await Usage.findAll({
      where: { api_key_id: apiKey.id, created_at: { [Op.gte]: startOfMonth } }
    });
    const monthSpend = monthUsage.reduce((sum, u) => sum + parseFloat(u.cost), 0);
    const monthTokens = monthUsage.reduce((sum, u) => sum + u.total_tokens, 0);
    const monthRequests = monthUsage.length;
    
    // 每日使用趋势
    const dailyUsage = await Usage.findAll({
      where: { api_key_id: apiKey.id, created_at: { [Op.gte]: startOfMonth } },
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'tokens'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'requests']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']],
      raw: true
    });
    
    // 按模型统计
    const byModel = await Usage.findAll({
      where: { api_key_id: apiKey.id, created_at: { [Op.gte]: startOfMonth } },
      attributes: [
        'model',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'tokens'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'requests']
      ],
      group: ['model'],
      raw: true
    });
    
    res.json({
      api_key: {
        id: apiKey.id,
        name: apiKey.name,
        status: apiKey.status,
        monthly_budget: parseFloat(apiKey.monthly_budget || 0),
        monthly_spend: monthSpend,
        total_requests: apiKey.total_requests,
        total_tokens: apiKey.total_tokens
      },
      month_stats: {
        spend: monthSpend,
        tokens: monthTokens,
        requests: monthRequests,
        budget_percentage: apiKey.monthly_budget ? (monthSpend / parseFloat(apiKey.monthly_budget)) * 100 : 0
      },
      daily_usage: dailyUsage,
      by_model: byModel
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取 API Key 详细统计（支持自定义时间范围）
app.get('/api/api-keys/:id/analytics', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const { start_date, end_date, group_by } = req.query;
    const apiKey = await ApiKey.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!apiKey) return res.status(404).json({ error: 'API Key 不存在' });
    
    let where = { api_key_id: apiKey.id };
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) where.created_at[Op.gte] = new Date(start_date);
      if (end_date) where.created_at[Op.lte] = new Date(end_date);
    }
    
    // 汇总统计
    const summary = await Usage.findAll({
      where,
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens'],
        [Sequelize.fn('SUM', Sequelize.col('savings')), 'total_savings'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count'],
        [Sequelize.fn('AVG', Sequelize.col('latency')), 'avg_latency'],
        [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN cache_hit = 1 THEN 1 ELSE 0 END')), 'cache_hits']
      ],
      raw: true
    });
    
    // 时间趋势
    const timeFormat = group_by === 'hour' ? '%Y-%m-%d %H:00' : 
                       group_by === 'week' ? '%Y-%W' : 
                       '%Y-%m-%d';
    const trend = await Usage.findAll({
      where,
      attributes: [
        [Sequelize.fn('STRFTIME', timeFormat, Sequelize.col('created_at')), 'period'],
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'tokens'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'requests'],
        [Sequelize.fn('AVG', Sequelize.col('latency')), 'avg_latency']
      ],
      group: [Sequelize.fn('STRFTIME', timeFormat, Sequelize.col('created_at'))],
      order: [[Sequelize.fn('STRFTIME', timeFormat, Sequelize.col('created_at')), 'ASC']],
      raw: true
    });
    
    // 按模型统计
    const byModel = await Usage.findAll({
      where,
      attributes: [
        'model',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'tokens'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'requests'],
        [Sequelize.fn('AVG', Sequelize.col('latency')), 'avg_latency']
      ],
      group: ['model'],
      order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
      raw: true
    });
    
    // 按项目统计
    const byProject = await Usage.findAll({
      where,
      attributes: [
        'project_id',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'requests']
      ],
      group: ['project_id'],
      raw: true
    });
    
    // 获取项目名称
    const projectIds = byProject.map(p => p.project_id).filter(Boolean);
    const projects = await Project.findAll({
      where: { id: { [Op.in]: projectIds } },
      attributes: ['id', 'name']
    });
    const projectMap = {};
    projects.forEach(p => projectMap[p.id] = p.name);
    
    // 最近使用记录
    const recentUsage = await Usage.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: 50,
      include: [
        { model: Project, attributes: ['name'] }
      ]
    });
    
    // 异常检测（高延迟、高成本请求）
    const anomalies = await Usage.findAll({
      where: {
        ...where,
        [Op.or]: [
          { latency: { [Op.gt]: 10000 } }, // 超过10秒
          { cost: { [Op.gt]: 0.5 } } // 超过$0.5
        ]
      },
      order: [['created_at', 'DESC']],
      limit: 20,
      include: [{ model: Project, attributes: ['name'] }]
    });
    
    res.json({
      summary: {
        total_cost: parseFloat(summary[0]?.total_cost || 0),
        total_tokens: parseInt(summary[0]?.total_tokens || 0),
        total_savings: parseFloat(summary[0]?.total_savings || 0),
        request_count: parseInt(summary[0]?.request_count || 0),
        avg_latency: parseFloat(summary[0]?.avg_latency || 0),
        cache_hit_rate: summary[0]?.request_count > 0 ? 
          (parseInt(summary[0]?.cache_hits || 0) / parseInt(summary[0]?.request_count)) * 100 : 0
      },
      trend: trend.map(t => ({
        period: t.period,
        cost: parseFloat(t.cost || 0),
        tokens: parseInt(t.tokens || 0),
        requests: parseInt(t.requests || 0),
        avg_latency: parseFloat(t.avg_latency || 0)
      })),
      by_model: byModel.map(m => ({
        model: m.model,
        cost: parseFloat(m.cost || 0),
        tokens: parseInt(m.tokens || 0),
        requests: parseInt(m.requests || 0),
        avg_latency: parseFloat(m.avg_latency || 0)
      })),
      by_project: byProject.map(p => ({
        project_id: p.project_id,
        project_name: projectMap[p.project_id] || '未知项目',
        cost: parseFloat(p.cost || 0),
        requests: parseInt(p.requests || 0)
      })),
      recent_usage: recentUsage.map(u => ({
        id: u.id,
        timestamp: u.created_at,
        project: u.Project?.name || '-',
        model: u.model,
        prompt_tokens: u.prompt_tokens,
        completion_tokens: u.completion_tokens,
        cost: parseFloat(u.cost || 0),
        latency: u.latency,
        cache_hit: u.cache_hit
      })),
      anomalies: anomalies.map(u => ({
        id: u.id,
        timestamp: u.created_at,
        project: u.Project?.name || '-',
        model: u.model,
        cost: parseFloat(u.cost || 0),
        latency: u.latency,
        reason: u.latency > 10000 ? 'high_latency' : 'high_cost'
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 批量操作 API Keys
app.post('/api/api-keys/batch', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const { action, key_ids, settings } = req.body;
    
    if (!Array.isArray(key_ids) || key_ids.length === 0) {
      return res.status(400).json({ error: '请提供 API Key ID 列表' });
    }
    
    const keys = await ApiKey.findAll({
      where: { id: { [Op.in]: key_ids }, org_id: req.user.org_id }
    });
    
    if (keys.length !== key_ids.length) {
      return res.status(404).json({ error: '部分 API Key 不存在' });
    }
    
    const results = { success: [], failed: [] };
    
    for (const key of keys) {
      try {
        switch (action) {
          case 'pause':
            await key.update({ status: 'paused' });
            results.success.push({ id: key.id, name: key.name, action: 'paused' });
            break;
          case 'activate':
            await key.update({ status: 'active' });
            results.success.push({ id: key.id, name: key.name, action: 'activated' });
            break;
          case 'revoke':
            await key.update({ status: 'revoked' });
            results.success.push({ id: key.id, name: key.name, action: 'revoked' });
            break;
          case 'update_budget':
            await key.update({ monthly_budget: settings.budget });
            results.success.push({ id: key.id, name: key.name, action: 'budget_updated' });
            break;
          case 'update_limits':
            await key.update({
              rate_limit: settings.rate_limit,
              daily_limit: settings.daily_limit
            });
            results.success.push({ id: key.id, name: key.name, action: 'limits_updated' });
            break;
          default:
            results.failed.push({ id: key.id, name: key.name, error: '未知操作' });
        }
      } catch (err) {
        results.failed.push({ id: key.id, name: key.name, error: err.message });
      }
    }
    
    res.json({ message: `批量操作完成：${results.success.length} 成功，${results.failed.length} 失败`, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取所有 API Keys 的汇总统计
app.get('/api/api-keys/analytics/summary', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let where = { org_id: req.user.org_id };
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) where.created_at[Op.gte] = new Date(start_date);
      if (end_date) where.created_at[Op.lte] = new Date(end_date);
    }
    
    // 所有 Key 的汇总
    const keys = await ApiKey.findAll({
      where: { org_id: req.user.org_id, status: { [Op.ne]: 'revoked' } },
      include: [
        { model: Project, attributes: ['name'] },
        { model: User, attributes: ['name'] }
      ]
    });
    
    // 获取每个 Key 的统计
    const keyStats = await Promise.all(keys.map(async (key) => {
      const usageWhere = { api_key_id: key.id };
      if (start_date || end_date) {
        usageWhere.created_at = {};
        if (start_date) usageWhere.created_at[Op.gte] = new Date(start_date);
        if (end_date) usageWhere.created_at[Op.lte] = new Date(end_date);
      }
      
      const stats = await Usage.findAll({
        where: usageWhere,
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
          [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count'],
          [Sequelize.fn('MAX', Sequelize.col('created_at')), 'last_used']
        ],
        raw: true
      });
      
      return {
        id: key.id,
        name: key.name,
        status: key.status,
        project: key.Project?.name || '-',
        owner: key.User?.name || '-',
        total_cost: parseFloat(stats[0]?.total_cost || 0),
        total_tokens: parseInt(stats[0]?.total_tokens || 0),
        request_count: parseInt(stats[0]?.request_count || 0),
        last_used: stats[0]?.last_used,
        monthly_budget: parseFloat(key.monthly_budget || 0),
        budget_usage: key.monthly_budget ? 
          (parseFloat(stats[0]?.total_cost || 0) / parseFloat(key.monthly_budget)) * 100 : 0
      };
    }));
    
    // 总体统计
    const totalStats = await Usage.findAll({
      where: { org_id: req.user.org_id },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count'],
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('api_key_id'))), 'active_keys']
      ],
      raw: true
    });
    
    res.json({
      summary: {
        total_keys: keys.length,
        active_keys: keys.filter(k => k.status === 'active').length,
        paused_keys: keys.filter(k => k.status === 'paused').length,
        total_cost: parseFloat(totalStats[0]?.total_cost || 0),
        total_requests: parseInt(totalStats[0]?.request_count || 0)
      },
      keys: keyStats.sort((a, b) => b.total_cost - a.total_cost)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 使用统计 API ====================

app.get('/api/usage', authMiddleware, async (req, res) => {
  try {
    const { project_id, user_id, model, start_date, end_date, group_by, limit, period } = req.query;
    let where = { org_id: req.user.org_id };
    if (project_id) where.project_id = project_id;
    if (user_id) where.user_id = user_id;
    if (model) where.model = model;
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) where.created_at[Op.gte] = new Date(start_date);
      if (end_date) where.created_at[Op.lte] = new Date(end_date);
    }

    // 按模型统计
    if (group_by === 'model') {
      const results = await Usage.findAll({
        where,
        attributes: [
          'model',
          [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens'],
          [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
          [Sequelize.fn('SUM', Sequelize.col('savings')), 'total_savings'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count']
        ],
        group: ['model'],
        order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
        raw: true
      });
      const totalCost = results.reduce((sum, r) => sum + parseFloat(r.total_cost || 0), 0);
      const formatted = results.map(r => ({
        name: r.model,
        cost: parseFloat(r.total_cost || 0),
        tokens: parseInt(r.total_tokens || 0),
        requests: parseInt(r.request_count || 0),
        savings: parseFloat(r.total_savings || 0),
        percentage: totalCost > 0 ? (parseFloat(r.total_cost || 0) / totalCost) * 100 : 0
      }));
      return res.json(formatted);
    }

    // 按项目统计
    if (group_by === 'project') {
      const results = await Usage.findAll({
        where,
        attributes: [
          'project_id',
          [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens'],
          [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
          [Sequelize.fn('SUM', Sequelize.col('savings')), 'total_savings'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count']
        ],
        group: ['project_id'],
        order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
        raw: true
      });
      const projectIds = results.map(r => r.project_id);
      const projects = await Project.findAll({
        where: { id: { [Op.in]: projectIds } },
        attributes: ['id', 'name']
      });
      const projectMap = {};
      projects.forEach(p => projectMap[p.id] = p.name);
      const totalCost = results.reduce((sum, r) => sum + parseFloat(r.total_cost || 0), 0);
      const formatted = results.map(r => ({
        name: projectMap[r.project_id] || `项目 #${r.project_id}`,
        cost: parseFloat(r.total_cost || 0),
        tokens: parseInt(r.total_tokens || 0),
        requests: parseInt(r.request_count || 0),
        savings: parseFloat(r.total_savings || 0),
        percentage: totalCost > 0 ? (parseFloat(r.total_cost || 0) / totalCost) * 100 : 0
      }));
      return res.json(formatted);
    }

    // 按人员统计
    if (group_by === 'user') {
      const results = await Usage.findAll({
        where,
        attributes: [
          'user_id',
          [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens'],
          [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
          [Sequelize.fn('SUM', Sequelize.col('savings')), 'total_savings'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count']
        ],
        group: ['user_id'],
        order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
        raw: true
      });
      const userIds = results.map(r => r.user_id).filter(Boolean);
      const users = await User.findAll({
        where: { id: { [Op.in]: userIds } },
        attributes: ['id', 'name', 'email']
      });
      const userMap = {};
      users.forEach(u => userMap[u.id] = { name: u.name, email: u.email });
      const totalCost = results.reduce((sum, r) => sum + parseFloat(r.total_cost || 0), 0);
      const formatted = results.map(r => ({
        name: userMap[r.user_id]?.name || '系统/未分配',
        email: userMap[r.user_id]?.email || '',
        cost: parseFloat(r.total_cost || 0),
        tokens: parseInt(r.total_tokens || 0),
        requests: parseInt(r.request_count || 0),
        savings: parseFloat(r.total_savings || 0),
        percentage: totalCost > 0 ? (parseFloat(r.total_cost || 0) / totalCost) * 100 : 0
      }));
      return res.json(formatted);
    }

    // 按 API Key 统计
    if (group_by === 'api_key') {
      const results = await Usage.findAll({
        where,
        attributes: [
          'api_key_id',
          [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens'],
          [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
          [Sequelize.fn('SUM', Sequelize.col('savings')), 'total_savings'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count']
        ],
        group: ['api_key_id'],
        order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
        raw: true
      });
      const keyIds = results.map(r => r.api_key_id).filter(Boolean);
      const keys = await ApiKey.findAll({
        where: { id: { [Op.in]: keyIds } },
        attributes: ['id', 'name', 'key']
      });
      const keyMap = {};
      keys.forEach(k => keyMap[k.id] = { name: k.name, key: k.key });
      const totalCost = results.reduce((sum, r) => sum + parseFloat(r.total_cost || 0), 0);
      const formatted = results.map(r => ({
        name: keyMap[r.api_key_id]?.name || '未命名 Key',
        key_preview: keyMap[r.api_key_id]?.key ? keyMap[r.api_key_id].key.substring(0, 12) + '...' : '---',
        cost: parseFloat(r.total_cost || 0),
        tokens: parseInt(r.total_tokens || 0),
        requests: parseInt(r.request_count || 0),
        savings: parseFloat(r.total_savings || 0),
        percentage: totalCost > 0 ? (parseFloat(r.total_cost || 0) / totalCost) * 100 : 0
      }));
      return res.json(formatted);
    }

    // 按日期统计（支持按日、周、月聚合）
    if (group_by === 'date' || group_by === 'time') {
      const timeFormat = period === 'month' 
        ? '%Y-%m'
        : period === 'week'
        ? '%Y-%W'
        : '%Y-%m-%d';
      
      const results = await Usage.findAll({
        where,
        attributes: [
          [Sequelize.fn('STRFTIME', timeFormat, Sequelize.col('created_at')), 'period'],
          [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens'],
          [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
          [Sequelize.fn('SUM', Sequelize.col('savings')), 'total_savings'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count']
        ],
        group: [Sequelize.fn('STRFTIME', timeFormat, Sequelize.col('created_at'))],
        order: [[Sequelize.fn('STRFTIME', timeFormat, Sequelize.col('created_at')), 'ASC']],
        raw: true
      });
      const formatted = results.map(r => ({
        date: r.period,
        cost: parseFloat(r.total_cost || 0),
        tokens: parseInt(r.total_tokens || 0),
        savings: parseFloat(r.total_savings || 0),
        count: parseInt(r.request_count || 0)
      }));
      return res.json(formatted);
    }

    // 默认查询（最近记录）
    const usage = await Usage.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit) || 100,
      include: [
        { model: Project, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });
    const formatted = usage.map(u => ({
      id: u.id,
      timestamp: u.created_at,
      project: u.Project?.name || '-',
      user: u.User?.name || '-',
      user_email: u.User?.email || '',
      model: u.model,
      prompt_tokens: u.prompt_tokens,
      completion_tokens: u.completion_tokens,
      cost: parseFloat(u.cost || 0),
      cached: u.cache_hit
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/usage/summary', authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const where = { org_id: req.user.org_id, created_at: { [Op.gte]: startOfMonth } };
    const totalCost = await Usage.sum('cost', { where }) || 0;
    const totalSavings = await Usage.sum('savings', { where }) || 0;
    const totalTokens = await Usage.sum('total_tokens', { where }) || 0;
    const requestCount = await Usage.count({ where });
    const cacheHits = await Usage.count({ where: { ...where, cache_hit: true } });
    const byModel = await Usage.findAll({
      where,
      attributes: [
        'model',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'tokens'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['model'],
      raw: true
    });
    const dailySpend = await Usage.findAll({
      where,
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('SUM', Sequelize.col('savings')), 'savings'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']],
      raw: true
    });
    res.json({
      total_cost: parseFloat(totalCost),
      total_savings: parseFloat(totalSavings),
      total_tokens: totalTokens,
      request_count: requestCount,
      cache_hit_rate: requestCount > 0 ? (cacheHits / requestCount * 100).toFixed(1) : 0,
      by_model: byModel,
      daily_spend: dailySpend
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 告警 API ====================

app.get('/api/alerts', authMiddleware, async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      where: { org_id: req.user.org_id },
      order: [['created_at', 'DESC']],
      limit: 50,
      include: [{ model: Project, attributes: ['id', 'name'] }]
    });
    const unreadCount = await Alert.count({ where: { org_id: req.user.org_id, status: 'unread' } });
    res.json({ alerts, unread_count: unreadCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/alerts/:id/read', authMiddleware, async (req, res) => {
  try {
    const alert = await Alert.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!alert) return res.status(404).json({ error: '告警不存在' });
    alert.status = 'read';
    await alert.save();
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/alerts/read-all', authMiddleware, async (req, res) => {
  try {
    await Alert.update({ status: 'read' }, { where: { org_id: req.user.org_id, status: 'unread' } });
    res.json({ message: '已全部标记为已读' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 节省统计 API ====================

app.get('/api/savings', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const where = { org_id: req.user.org_id, created_at: { [Op.gte]: startOfMonth } };
    const byType = await Savings.findAll({
      where,
      attributes: [
        'type',
        [Sequelize.fn('SUM', Sequelize.col('saved_tokens')), 'saved_tokens'],
        [Sequelize.fn('SUM', Sequelize.col('saved_cost')), 'saved_cost'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['type'],
      raw: true
    });
    const totalSavedCost = await Savings.sum('saved_cost', { where }) || 0;
    const totalSavedTokens = await Savings.sum('saved_tokens', { where }) || 0;
    const dailySavings = await Savings.findAll({
      where,
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('saved_cost')), 'saved_cost'],
        [Sequelize.fn('SUM', Sequelize.col('saved_tokens')), 'saved_tokens']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']],
      raw: true
    });
    res.json({
      total_saved_cost: parseFloat(totalSavedCost),
      total_saved_tokens: totalSavedTokens,
      by_type: byType,
      daily_savings: dailySavings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== AI 报告模块 API ====================

// 检查报告权限的辅助函数
async function checkReportPermission(reportId, userId, orgId, requiredLevel = 'view') {
  const report = await Report.findOne({
    where: { id: reportId, org_id: orgId },
    include: [ReportPermission]
  });
  if (!report) return { allowed: false, error: '报告不存在' };
  
  // 报告创建者拥有全部权限
  if (report.created_by === userId) return { allowed: true, report };
  
  // 检查特定权限
  const permissions = report.ReportPermissions || [];
  const userPermission = permissions.find(p => 
    p.permission_type === 'user' && p.permission_id === userId
  );
  
  if (userPermission) {
    const levels = { view: 1, edit: 2, admin: 3 };
    if (levels[userPermission.access_level] >= levels[requiredLevel]) {
      return { allowed: true, report };
    }
  }
  
  return { allowed: false, error: '权限不足' };
}

// 获取报告列表
app.get('/api/reports', authMiddleware, async (req, res) => {
  try {
    const { type, status } = req.query;
    let where = { org_id: req.user.org_id };
    if (type) where.type = type;
    if (status) where.status = status;
    
    const reports = await Report.findAll({
      where,
      order: [['updated_at', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: ReportPermission }
      ]
    });
    
    // 过滤用户有权限查看的报告
    const accessibleReports = reports.filter(r => {
      if (r.created_by === req.user.id) return true;
      return r.ReportPermissions.some(p => 
        p.permission_type === 'user' && p.permission_id === req.user.id
      );
    });
    
    res.json(accessibleReports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 创建报告
app.post('/api/reports', authMiddleware, async (req, res) => {
  try {
    const { name, description, type, date_range_start, date_range_end, config, permissions } = req.body;
    
    const report = await Report.create({
      org_id: req.user.org_id,
      created_by: req.user.id,
      name,
      description,
      type: type || 'custom',
      date_range_start: date_range_start ? new Date(date_range_start) : null,
      date_range_end: date_range_end ? new Date(date_range_end) : null,
      config: JSON.stringify(config || {}),
      status: 'draft'
    });
    
    // 创建权限记录
    if (permissions && permissions.length > 0) {
      await ReportPermission.bulkCreate(
        permissions.map(p => ({
          report_id: report.id,
          permission_type: p.type,
          permission_id: p.id,
          access_level: p.level || 'view'
        }))
      );
    }
    
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取单个报告
app.get('/api/reports/:id', authMiddleware, async (req, res) => {
  try {
    const { allowed, error, report } = await checkReportPermission(
      req.params.id, req.user.id, req.user.org_id, 'view'
    );
    if (!allowed) return res.status(403).json({ error });
    
    const fullReport = await Report.findOne({
      where: { id: req.params.id },
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: ReportPermission },
        { model: ReportSchedule }
      ]
    });
    
    res.json(fullReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新报告
app.put('/api/reports/:id', authMiddleware, async (req, res) => {
  try {
    const { allowed, error, report } = await checkReportPermission(
      req.params.id, req.user.id, req.user.org_id, 'edit'
    );
    if (!allowed) return res.status(403).json({ error });
    
    const { name, description, config, permissions } = req.body;
    
    await report.update({
      name: name || report.name,
      description: description || report.description,
      config: config ? JSON.stringify(config) : report.config,
      updated_at: new Date()
    });
    
    // 更新权限
    if (permissions) {
      await ReportPermission.destroy({ where: { report_id: report.id } });
      await ReportPermission.bulkCreate(
        permissions.map(p => ({
          report_id: report.id,
          permission_type: p.type,
          permission_id: p.id,
          access_level: p.level || 'view'
        }))
      );
    }
    
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 删除报告
app.delete('/api/reports/:id', authMiddleware, async (req, res) => {
  try {
    const { allowed, error, report } = await checkReportPermission(
      req.params.id, req.user.id, req.user.org_id, 'admin'
    );
    if (!allowed) return res.status(403).json({ error });
    
    await ReportPermission.destroy({ where: { report_id: report.id } });
    await ReportSchedule.destroy({ where: { report_id: report.id } });
    await report.destroy();
    
    res.json({ message: '报告已删除' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 生成 AI 报告
app.post('/api/reports/:id/generate', authMiddleware, async (req, res) => {
  try {
    const { allowed, error, report } = await checkReportPermission(
      req.params.id, req.user.id, req.user.org_id, 'edit'
    );
    if (!allowed) return res.status(403).json({ error });
    
    await report.update({ status: 'generating' });
    
    // 获取报告配置
    const config = JSON.parse(report.config || '{}');
    const permissions = await ReportPermission.findAll({ where: { report_id: report.id } });
    
    // 构建数据查询条件
    let where = { org_id: req.user.org_id };
    if (report.date_range_start) where.created_at = { [Op.gte]: report.date_range_start };
    if (report.date_range_end) where.created_at = { ...where.created_at, [Op.lte]: report.date_range_end };
    
    // 根据权限过滤数据
    const projectIds = permissions
      .filter(p => p.permission_type === 'project')
      .map(p => p.permission_id);
    const keyIds = permissions
      .filter(p => p.permission_type === 'api_key')
      .map(p => p.permission_id);
    
    if (projectIds.length > 0) where.project_id = { [Op.in]: projectIds };
    if (keyIds.length > 0) where.api_key_id = { [Op.in]: keyIds };
    
    // 获取统计数据
    const usageStats = await Usage.findAll({
      where,
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens'],
        [Sequelize.fn('SUM', Sequelize.col('savings')), 'total_savings'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count']
      ],
      raw: true
    });
    
    // 按模型统计
    const modelStats = await Usage.findAll({
      where,
      attributes: [
        'model',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count']
      ],
      group: ['model'],
      order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
      raw: true
    });
    
    // 按项目统计
    const projectStats = await Usage.findAll({
      where,
      attributes: [
        'project_id',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count']
      ],
      group: ['project_id'],
      order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
      raw: true
    });
    
    // 获取项目名称
    const reportProjectIds = projectStats.map(p => p.project_id);
    const reportProjects = await Project.findAll({
      where: { id: { [Op.in]: reportProjectIds } },
      attributes: ['id', 'name']
    });
    const projectMap = {};
    reportProjects.forEach(p => projectMap[p.id] = p.name);
    
    // 按成员统计
    const memberStats = await Usage.findAll({
      where,
      attributes: [
        'user_id',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count']
      ],
      group: ['user_id'],
      order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
      raw: true
    });
    
    // 获取成员名称
    const memberIds = memberStats.map(m => m.user_id);
    const members = await User.findAll({
      where: { id: { [Op.in]: memberIds } },
      attributes: ['id', 'name']
    });
    const memberMap = {};
    members.forEach(m => memberMap[m.id] = m.name);
    
    // 按天统计
    const dayStats = await Usage.findAll({
      where,
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']],
      raw: true
    });
    
    // 构建数据快照 - 完整数据结构匹配前端
    const summary = usageStats[0] || {};
    const totalCost = parseFloat(summary.total_cost || 0);
    const totalTokens = parseInt(summary.total_tokens || 0);
    const totalRequests = parseInt(summary.request_count || 0);
    const totalSavings = parseFloat(summary.total_savings || 0);
    
    const dataSnapshot = {
      summary: {
        total_cost: totalCost,
        total_tokens: totalTokens,
        request_count: totalRequests,
        total_savings: totalSavings,
        avg_response_time: 245, // 模拟数据
        cache_hit_rate: 23.5 // 模拟数据
      },
      by_project: projectStats.map(p => ({
        id: p.project_id,
        name: projectMap[p.project_id] || `项目 #${p.project_id}`,
        cost: parseFloat(p.total_cost || 0),
        tokens: parseInt(p.total_tokens || 0),
        requests: parseInt(p.request_count || 0),
        members: Math.floor(Math.random() * 5) + 1, // 模拟数据
        trend: (Math.random() - 0.5) * 20 // 模拟趋势 -10% 到 +10%
      })),
      by_member: memberStats.map(m => ({
        id: m.user_id,
        name: memberMap[m.user_id] || `用户 #${m.user_id}`,
        cost: parseFloat(m.total_cost || 0),
        tokens: parseInt(m.total_tokens || 0),
        requests: parseInt(m.request_count || 0),
        efficiency: Math.floor(Math.random() * 40) + 60, // 模拟效率 60-100
        projects: Math.floor(Math.random() * 3) + 1 // 模拟项目数
      })),
      by_model: modelStats.map(m => ({
        name: m.model,
        cost: parseFloat(m.total_cost || 0),
        tokens: Math.floor(parseFloat(m.total_cost || 0) * 1000), // 模拟
        requests: parseInt(m.request_count || 0),
        avg_cost_per_1k: parseFloat(m.total_cost || 0) / (parseInt(m.request_count || 1)) * 1000
      })),
      by_day: dayStats.map(d => ({
        date: d.date,
        cost: parseFloat(d.total_cost || 0),
        tokens: parseInt(d.total_tokens || 0),
        requests: parseInt(d.request_count || 0)
      })),
      anomalies: totalCost > 10 ? [ // 模拟异常数据
        {
          type: 'cost_spike',
          severity: 'medium',
          description: '检测到成本突增，较预期高出 15%',
          value: totalCost * 0.3,
          expected: totalCost * 0.25,
          date: new Date().toISOString()
        }
      ] : []
    };
    
    // 生成 AI 洞察（模拟）
    const savingsRate = totalCost > 0 ? (totalSavings / totalCost * 100).toFixed(1) : 0;
    
    const aiInsights = {
      summary: `本报告期内总花费 $${totalCost.toFixed(4)}，通过优化策略节省 $${totalSavings.toFixed(4)}（${savingsRate}%）`,
      top_models: modelStats.slice(0, 3).map(m => m.model),
      top_projects: dataSnapshot.by_project.slice(0, 3).map(p => p.name),
      recommendations: [
        totalSavings > 0 ? '当前缓存策略效果良好，建议继续保持' : '建议启用缓存策略以降低成本',
        modelStats.length > 1 ? '多模型使用有助于成本优化' : '建议评估不同模型的成本效益',
        '定期审查高消耗项目的使用情况'
      ]
    };
    
    // 生成报告内容（Markdown 格式）
    const content = `# ${report.name}

## 执行摘要

${aiInsights.summary}

## 关键指标

- **总花费**: $${totalCost.toFixed(4)}
- **总 Token**: ${parseInt(usageStats[0]?.total_tokens || 0).toLocaleString()}
- **请求数**: ${parseInt(usageStats[0]?.request_count || 0).toLocaleString()}
- **节省金额**: $${totalSavings.toFixed(4)} (${savingsRate}%)

## 模型使用情况

${modelStats.map(m => `- **${m.model}**: $${parseFloat(m.total_cost).toFixed(4)} (${m.request_count} 次请求)`).join('\n')}

## 项目消耗排行

${dataSnapshot.by_project.slice(0, 5).map((p, i) => `${i + 1}. **${p.name}**: $${p.cost.toFixed(4)}`).join('\n')}

## AI 建议

${aiInsights.recommendations.map(r => `- ${r}`).join('\n')}

---
*报告生成时间: ${new Date().toLocaleString()}*
`;
    
    // 更新报告
    await report.update({
      status: 'ready',
      content,
      data_snapshot: JSON.stringify(dataSnapshot),
      ai_insights: JSON.stringify(aiInsights),
      updated_at: new Date()
    });
    
    res.json({ message: '报告生成成功', report });
  } catch (err) {
    await report.update({ status: 'error' });
    res.status(500).json({ error: err.message });
  }
});

// 获取报告模板列表
app.get('/api/report-templates', authMiddleware, async (req, res) => {
  try {
    const templates = await ReportTemplate.findAll({
      where: { org_id: req.user.org_id },
      order: [['is_default', 'DESC'], ['created_at', 'DESC']]
    });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 创建报告模板
app.post('/api/report-templates', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const { name, description, type, config } = req.body;
    const template = await ReportTemplate.create({
      org_id: req.user.org_id,
      name,
      description,
      type,
      config: JSON.stringify(config || {})
    });
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== Dashboard API ====================

app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    const org = await Org.findByPk(req.user.org_id);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const where = { org_id: req.user.org_id, created_at: { [Op.gte]: startOfMonth } };
    const lastMonthWhere = { org_id: req.user.org_id, created_at: { [Op.gte]: lastMonth, [Op.lt]: startOfMonth } };
    const monthCost = await Usage.sum('cost', { where }) || 0;
    const lastMonthCost = await Usage.sum('cost', { where: lastMonthWhere }) || 0;
    const monthSavings = await Usage.sum('savings', { where }) || 0;
    const monthTokens = await Usage.sum('total_tokens', { where }) || 0;
    const requestCount = await Usage.count({ where });
    const cacheHits = await Usage.count({ where: { ...where, cache_hit: true } });
    const projectCount = await Project.count({ where: { org_id: req.user.org_id, status: 'active' } });
    const memberCount = await User.count({ where: { org_id: req.user.org_id, status: 'active' } });
    const activeKeys = await ApiKey.count({ where: { org_id: req.user.org_id, status: 'active' } });
    const unreadAlerts = await Alert.count({ where: { org_id: req.user.org_id, status: 'unread' } });
    // Top 10 项目排行
    const topProjects = await Usage.findAll({
      where,
      attributes: [
        'project_id',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens']
      ],
      group: ['project_id'],
      order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
      limit: 10,
      raw: true
    });
    const topProjectsWithInfo = await Promise.all(topProjects.map(async (tp) => {
      const proj = await Project.findByPk(tp.project_id);
      return {
        id: tp.project_id,
        name: proj?.name || '未知项目',
        spend: parseFloat(tp.total_cost),
        budget: proj?.monthly_budget ? parseFloat(proj.monthly_budget) : 0,
        tokens: parseInt(tp.total_tokens)
      };
    }));

    // Top 10 API Key 排行
    const topApiKeys = await Usage.findAll({
      where,
      attributes: [
        'api_key_id',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count']
      ],
      group: ['api_key_id'],
      order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
      limit: 10,
      raw: true
    });
    const topApiKeysWithInfo = await Promise.all(topApiKeys.map(async (tk) => {
      const key = await ApiKey.findByPk(tk.api_key_id);
      return {
        id: tk.api_key_id,
        name: key?.name || '未命名 Key',
        key_preview: key?.key ? key.key.substring(0, 12) + '...' : '---',
        spend: parseFloat(tk.total_cost),
        tokens: parseInt(tk.total_tokens),
        requests: parseInt(tk.request_count)
      };
    }));

    // Top 10 人员排行
    const topUsers = await Usage.findAll({
      where,
      attributes: [
        'user_id',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'total_tokens'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'request_count']
      ],
      group: ['user_id'],
      order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
      limit: 10,
      raw: true
    });
    const topUsersWithInfo = await Promise.all(topUsers.map(async (tu) => {
      const user = await User.findByPk(tu.user_id);
      return {
        id: tu.user_id,
        name: user?.name || '未知用户',
        email: user?.email || '',
        spend: parseFloat(tu.total_cost),
        tokens: parseInt(tu.total_tokens),
        requests: parseInt(tu.request_count)
      };
    }));

    const dailySpend = await Usage.findAll({
      where,
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('SUM', Sequelize.col('savings')), 'savings']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']],
      raw: true
    });
    const modelDistribution = await Usage.findAll({
      where,
      attributes: [
        'model',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['model'],
      raw: true
    });
    // 计算预算信息
    const monthBudget = org.monthly_budget || 5000;
    const budgetUsedPct = monthBudget > 0 ? (monthCost / monthBudget) * 100 : 0;

    // 30天每日节省数据
    const dailySavings = await Savings.findAll({
      where: {
        org_id: req.user.org_id,
        created_at: { [Op.gte]: thirtyDaysAgo }
      },
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('saved_cost')), 'savings'],
        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN type = 'routing' THEN saved_cost ELSE 0 END")), 'routing_savings'],
        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN type = 'cache' THEN saved_cost ELSE 0 END")), 'cache_savings'],
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // 合并花费和节省数据
    const dailySpendWithSavings = dailySpend.map(d => {
      const savingsRecord = dailySavings.find(s => s.date === d.date);
      return {
        ...d,
        savings: parseFloat(savingsRecord?.savings || 0)
      };
    });

    res.json({
      balance: parseFloat(org.balance),
      balance_threshold: parseFloat(org.balance_threshold),
      month_cost: parseFloat(monthCost),
      last_month_cost: parseFloat(lastMonthCost),
      cost_change_pct: lastMonthCost > 0 ? ((monthCost - lastMonthCost) / lastMonthCost * 100).toFixed(1) : 0,
      month_savings: parseFloat(monthSavings),
      month_budget: parseFloat(monthBudget),
      month_budget_used_pct: budgetUsedPct,
      month_tokens: monthTokens,
      request_count: requestCount,
      cache_hit_rate: requestCount > 0 ? (cacheHits / requestCount * 100).toFixed(1) : 0,
      project_count: projectCount,
      member_count: memberCount,
      active_keys: activeKeys,
      unread_alerts: unreadAlerts,
      top_projects: topProjectsWithInfo,
      top_api_keys: topApiKeysWithInfo,
      top_users: topUsersWithInfo,
      daily_spend: dailySpendWithSavings,
      daily_savings: dailySavings.map(d => ({
        date: d.date,
        savings: parseFloat(d.savings || 0),
        routing_savings: parseFloat(d.routing_savings || 0),
        cache_savings: parseFloat(d.cache_savings || 0),
      })),
      model_distribution: modelDistribution
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== API Key 详情 API ====================

app.get('/api/api-keys/:id/detail', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({
      where: { id: req.params.id, org_id: req.user.org_id },
      include: [
        { model: Project, as: 'Project', attributes: ['id', 'name'] },
        { model: User, as: 'User', attributes: ['id', 'name'] }
      ]
    });
    if (!apiKey) return res.status(404).json({ error: 'API Key 不存在' });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const where = { org_id: req.user.org_id, api_key_id: apiKey.id };

    // 统计数据
    const totalSpend = await Usage.sum('cost', { where }) || 0;
    const totalTokens = await Usage.sum('total_tokens', { where }) || 0;
    const totalRequests = await Usage.count({ where });

    // 最后使用时间
    const lastUsage = await Usage.findOne({
      where,
      order: [['created_at', 'DESC']]
    });

    // 30 天每日使用数据
    const dailyWhere = {
      ...where,
      created_at: { [Op.gte]: thirtyDaysAgo }
    };
    const dailyUsage = await Usage.findAll({
      where: dailyWhere,
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'tokens'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'requests']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // 模型分布
    const modelDistribution = await Usage.findAll({
      where,
      attributes: [
        'model',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['model'],
      order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
      raw: true
    });

    res.json({
      id: apiKey.id,
      name: apiKey.name,
      key_preview: apiKey.key ? apiKey.key.substring(0, 12) + '...' : '---',
      project_id: apiKey.project_id,
      project_name: apiKey.Project?.name || '未知项目',
      user_id: apiKey.user_id,
      user_name: apiKey.User?.name || null,
      spend: parseFloat(totalSpend),
      tokens: parseInt(totalTokens),
      requests: parseInt(totalRequests),
      created_at: apiKey.created_at,
      last_used_at: lastUsage?.created_at || null,
      status: apiKey.status,
      daily_usage: dailyUsage.map(d => ({
        date: d.date,
        cost: parseFloat(d.cost),
        tokens: parseInt(d.tokens),
        requests: parseInt(d.requests)
      })),
      model_distribution: modelDistribution.map(m => ({
        model: m.model,
        cost: parseFloat(m.cost),
        count: parseInt(m.count)
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 成员详情 API ====================

app.get('/api/users/:id/detail', authMiddleware, async (req, res) => {
  try {
    // 检查权限：管理员可以查看所有成员，成员只能查看自己
    const isAdmin = req.user.role === 'org_admin' || req.user.role === 'platform_admin';
    if (!isAdmin && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: '权限不足' });
    }

    const user = await User.findOne({
      where: { id: req.params.id, org_id: req.user.org_id }
    });
    if (!user) return res.status(404).json({ error: '成员不存在' });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const where = { org_id: req.user.org_id, user_id: user.id };

    // 统计数据
    const totalSpend = await Usage.sum('cost', { where }) || 0;
    const totalTokens = await Usage.sum('total_tokens', { where }) || 0;
    const totalRequests = await Usage.count({ where });

    // 最后活跃时间
    const lastUsage = await Usage.findOne({
      where,
      order: [['created_at', 'DESC']]
    });

    // 参与的项目
    const projectMemberships = await Membership.findAll({
      where: { user_id: user.id },
      include: [{ model: Project, as: 'Project', attributes: ['id', 'name'] }]
    });

    const projectsWithSpend = await Promise.all(
      projectMemberships.map(async (pm) => {
        const spend = await Usage.sum('cost', {
          where: { org_id: req.user.org_id, user_id: user.id, project_id: pm.project_id }
        }) || 0;
        return {
          id: pm.Project.id,
          name: pm.Project.name,
          spend: parseFloat(spend),
          role: pm.role
        };
      })
    );

    // 用户的 API Keys
    const apiKeys = await ApiKey.findAll({
      where: { user_id: user.id, org_id: req.user.org_id }
    });

    const apiKeysWithSpend = await Promise.all(
      apiKeys.map(async (key) => {
        const spend = await Usage.sum('cost', {
          where: { org_id: req.user.org_id, api_key_id: key.id }
        }) || 0;
        return {
          id: key.id,
          name: key.name,
          key_preview: key.key ? key.key.substring(0, 12) + '...' : '---',
          spend: parseFloat(spend)
        };
      })
    );

    // 30 天每日使用数据
    const dailyWhere = {
      ...where,
      created_at: { [Op.gte]: thirtyDaysAgo }
    };
    const dailyUsage = await Usage.findAll({
      where: dailyWhere,
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('SUM', Sequelize.col('total_tokens')), 'tokens'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'requests']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // 模型分布
    const modelDistribution = await Usage.findAll({
      where,
      attributes: [
        'model',
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'cost'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['model'],
      order: [[Sequelize.fn('SUM', Sequelize.col('cost')), 'DESC']],
      raw: true
    });

    // 最近使用记录（最近50条）
    const recentUsage = await Usage.findAll({
      where,
      include: [
        { model: Project, as: 'Project', attributes: ['name'] },
        { model: ApiKey, as: 'ApiKey', attributes: ['name'] }
      ],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      spend: parseFloat(totalSpend),
      tokens: parseInt(totalTokens),
      requests: parseInt(totalRequests),
      created_at: user.created_at,
      last_active_at: lastUsage?.created_at || null,
      projects: projectsWithSpend,
      api_keys: apiKeysWithSpend,
      daily_usage: dailyUsage.map(d => ({
        date: d.date,
        cost: parseFloat(d.cost),
        tokens: parseInt(d.tokens),
        requests: parseInt(d.requests)
      })),
      model_distribution: modelDistribution.map(m => ({
        model: m.model,
        cost: parseFloat(m.cost),
        count: parseInt(m.count)
      })),
      recent_usage: recentUsage.map(u => ({
        id: u.id,
        created_at: u.created_at,
        model: u.model,
        cost: parseFloat(u.cost),
        total_tokens: u.total_tokens,
        project_name: u.Project?.name || '未知项目',
        api_key_name: u.ApiKey?.name || '未知 Key'
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 预算管理 API ====================

app.get('/api/budget', authMiddleware, requireOrgAdmin, async (req, res) => {
  try {
    const org = await Org.findByPk(req.user.org_id);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const where = { org_id: req.user.org_id, created_at: { [Op.gte]: startOfMonth } };

    // 企业预算信息
    const monthCost = await Usage.sum('cost', { where }) || 0;
    const monthBudget = org.monthly_budget || 5000; // 默认预算 $5000
    const usedPercentage = monthBudget > 0 ? (monthCost / monthBudget) * 100 : 0;

    const orgBudget = {
      monthly_budget: parseFloat(monthBudget),
      used_amount: parseFloat(monthCost),
      remaining: Math.max(0, parseFloat(monthBudget) - parseFloat(monthCost)),
      used_percentage: usedPercentage,
      alert_threshold: org.budget_alert_threshold || 80,
      alert_enabled: org.budget_alert_enabled !== false,
    };

    // 项目预算列表
    const projects = await Project.findAll({
      where: { org_id: req.user.org_id, status: 'active' },
    });

    const projectBudgets = await Promise.all(
      projects.map(async (proj) => {
        const projectCost = await Usage.sum('cost', {
          where: { ...where, project_id: proj.id },
        }) || 0;
        const projectBudget = proj.monthly_budget || 1000;
        const projectUsedPct = projectBudget > 0 ? (projectCost / projectBudget) * 100 : 0;

        let status = 'normal';
        if (projectUsedPct >= 100) status = 'exceeded';
        else if (projectUsedPct >= (proj.budget_alert_threshold || 80)) status = 'warning';

        return {
          id: proj.id,
          name: proj.name,
          monthly_budget: parseFloat(projectBudget),
          used_amount: parseFloat(projectCost),
          remaining: Math.max(0, parseFloat(projectBudget) - parseFloat(projectCost)),
          used_percentage: projectUsedPct,
          alert_threshold: proj.budget_alert_threshold || 80,
          status,
        };
      })
    );

    // 预算历史（最近6个月）
    const budgetHistory = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthWhere = {
        org_id: req.user.org_id,
        created_at: { [Op.gte]: month, [Op.lt]: monthEnd },
      };

      const actual = await Usage.sum('cost', { where: monthWhere }) || 0;
      const savings = await Usage.sum('savings', { where: monthWhere }) || 0;

      budgetHistory.push({
        month: month.toLocaleString('zh-CN', { month: 'short' }),
        budget: parseFloat(monthBudget),
        actual: parseFloat(actual),
        savings: parseFloat(savings),
      });
    }

    // 预算告警
    const budgetAlerts = await Alert.findAll({
      where: {
        org_id: req.user.org_id,
        type: { [Op.in]: ['budget', 'project_budget'] },
      },
      order: [['created_at', 'DESC']],
      limit: 20,
    });

    const formattedAlerts = budgetAlerts.map((alert) => ({
      id: alert.id,
      type: alert.severity === 'critical' ? 'budget_exceeded' : 'budget_threshold',
      message: alert.message,
      project_name: alert.project_id ? projects.find((p) => p.id === alert.project_id)?.name : undefined,
      threshold: alert.severity === 'critical' ? 100 : 80,
      actual: usedPercentage,
      created_at: alert.created_at,
      status: alert.status,
    }));

    // 节省统计
    const totalSavings = await Usage.sum('savings', { where }) || 0;
    const routingSavings = await Savings.sum('saved_cost', {
      where: { ...where, type: 'routing' },
    }) || 0;
    const cacheSavings = await Savings.sum('saved_cost', {
      where: { ...where, type: 'cache' },
    }) || 0;
    const downgradeSavings = await Savings.sum('saved_cost', {
      where: { ...where, type: 'model_downgrade' },
    }) || 0;

    const savingsStats = {
      total_savings: parseFloat(totalSavings),
      routing_savings: parseFloat(routingSavings),
      cache_savings: parseFloat(cacheSavings),
      model_downgrade_savings: parseFloat(downgradeSavings),
      savings_rate: monthCost > 0 ? (totalSavings / (monthCost + totalSavings)) * 100 : 0,
    };

    res.json({
      org_budget: orgBudget,
      project_budgets: projectBudgets,
      budget_history: budgetHistory,
      budget_alerts: formattedAlerts,
      savings_stats: savingsStats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== LLM Proxy 网关 ====================

app.post('/api/v1/chat/completions', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: { message: '未提供 API Key', type: 'auth_error' } });
    const apiKeyStr = authHeader.replace('Bearer ', '');
    if (!apiKeyStr) return res.status(401).json({ error: { message: '无效的 API Key', type: 'auth_error' } });

    const apiKey = await ApiKey.findOne({ where: { key: apiKeyStr, status: 'active' } });
    if (!apiKey) return res.status(401).json({ error: { message: 'API Key 无效或已吊销', type: 'auth_error' } });

    const org = await Org.findByPk(apiKey.org_id);
    if (!org || org.status !== 'active') {
      return res.status(403).json({ error: { message: '组织已被禁用', type: 'org_error' } });
    }

    if (parseFloat(org.balance) <= 0) {
      await createAlert(apiKey.org_id, apiKey.project_id, 'balance', 'critical',
        `调用被拦截：组织余额不足，当前余额: $${parseFloat(org.balance).toFixed(2)}`);
      return res.status(402).json({ error: { message: '余额不足，请充值后继续使用', type: 'balance_error', balance: parseFloat(org.balance) } });
    }

    const project = await Project.findByPk(apiKey.project_id);
    if (!project || project.status !== 'active') {
      return res.status(403).json({ error: { message: '项目已被禁用', type: 'project_error' } });
    }

    let { model, messages, temperature, max_tokens, stream } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: { message: 'messages 不能为空', type: 'invalid_request' } });
    }

    const originalModel = model || project.default_model || 'gpt-4o-mini';
    const enabledModels = project.models ? project.models.split(',').filter(Boolean) : [];
    const routedModel = routeModel(messages, project.routing_profile, originalModel, enabledModels);
    const effectiveMaxTokens = Math.min(
      max_tokens || project.max_tokens_per_request,
      project.max_tokens_per_request
    );

    const cacheKey = getCacheKey(messages, routedModel);
    const cachedResponse = checkCache(cacheKey);
    if (cachedResponse) {
      const cost = calculateCost(routedModel, cachedResponse.usage.prompt_tokens, cachedResponse.usage.completion_tokens);
      const originalCost = calculateCost(originalModel, cachedResponse.usage.prompt_tokens, cachedResponse.usage.completion_tokens);
      const savingsAmt = Math.max(0, originalCost - cost);

      org.balance = parseFloat(org.balance) - cost;
      await org.save();

      await Usage.create({
        org_id: apiKey.org_id,
        project_id: apiKey.project_id,
        user_id: apiKey.user_id,
        api_key_id: apiKey.id,
        model: routedModel,
        routed_model: routedModel,
        original_model: originalModel,
        prompt_tokens: cachedResponse.usage.prompt_tokens,
        completion_tokens: cachedResponse.usage.completion_tokens,
        total_tokens: cachedResponse.usage.total_tokens,
        cost, original_cost: originalCost, savings: savingsAmt,
        cache_hit: true
      });

      // 更新 API Key 统计
      apiKey.total_requests += 1;
      apiKey.total_tokens += cachedResponse.usage.total_tokens;
      apiKey.monthly_spend = parseFloat(apiKey.monthly_spend) + cost;
      await apiKey.save();

      if (savingsAmt > 0) {
        await Savings.create({
          org_id: apiKey.org_id, project_id: apiKey.project_id,
          type: 'caching', saved_tokens: cachedResponse.usage.total_tokens, saved_cost: savingsAmt,
          detail: JSON.stringify({ cache_hit: true, model: routedModel })
        });
      }

      await checkBudgetAndBalance(apiKey.org_id, apiKey.project_id, cost);

      const response = {
        ...cachedResponse,
        costify: { routed_model: routedModel, cache_hit: true, estimated_cost: cost.toFixed(6), remaining_balance: parseFloat(org.balance).toFixed(2) }
      };
      return res.json(response);
    }

    const providerBaseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    const providerApiKey = process.env.OPENROUTER_API_KEY || '';

    try {
      const upstreamResponse = await fetch(`${providerBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${providerApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://costify.ai',
          'X-Title': 'Costify'
        },
        body: JSON.stringify({
          model: routedModel,
          messages,
          temperature: temperature || 0.7,
          max_tokens: effectiveMaxTokens,
          stream: false
        })
      });

      if (!upstreamResponse.ok) {
        const errData = await upstreamResponse.json().catch(() => ({}));
        throw new Error(errData.error?.message || `上游 API 返回 ${upstreamResponse.status}`);
      }

      const response = await upstreamResponse.json();
      const usageData = response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
      const cost = calculateCost(routedModel, usageData.prompt_tokens, usageData.completion_tokens);
      const originalCost = calculateCost(originalModel, usageData.prompt_tokens, usageData.completion_tokens);
      const routingSavings = Math.max(0, originalCost - cost);

      org.balance = parseFloat(org.balance) - cost;
      await org.save();

      await Usage.create({
        org_id: apiKey.org_id,
        project_id: apiKey.project_id,
        user_id: apiKey.user_id,
        api_key_id: apiKey.id,
        model: routedModel,
        routed_model: routedModel,
        original_model: originalModel,
        prompt_tokens: usageData.prompt_tokens,
        completion_tokens: usageData.completion_tokens,
        total_tokens: usageData.total_tokens,
        cost, original_cost: originalCost, savings: routingSavings,
        cache_hit: false
      });

      // 更新 API Key 统计
      apiKey.total_requests += 1;
      apiKey.total_tokens += usageData.total_tokens;
      apiKey.monthly_spend = parseFloat(apiKey.monthly_spend) + cost;
      await apiKey.save();

      if (routingSavings > 0) {
        await Savings.create({
          org_id: apiKey.org_id, project_id: apiKey.project_id,
          type: 'routing', saved_tokens: 0, saved_cost: routingSavings,
          detail: JSON.stringify({ from: originalModel, to: routedModel })
        });
      }

      setCache(cacheKey, response);
      await checkBudgetAndBalance(apiKey.org_id, apiKey.project_id, cost);

      res.json({
        ...response,
        costify: { routed_model: routedModel, cache_hit: false, estimated_cost: cost.toFixed(6), remaining_balance: parseFloat(org.balance).toFixed(2) }
      });

    } catch (upstreamErr) {
      console.error('上游调用失败:', upstreamErr.message);
      const mockPromptTokens = messages.reduce((s, m) => s + Math.ceil((m.content?.length || 0) / 4), 0);
      const mockCompletionTokens = Math.min(effectiveMaxTokens, Math.floor(mockPromptTokens * 0.5));
      const mockTotalTokens = mockPromptTokens + mockCompletionTokens;
      const cost = calculateCost(routedModel, mockPromptTokens, mockCompletionTokens);

      if (parseFloat(org.balance) > cost) {
        org.balance = parseFloat(org.balance) - cost;
        await org.save();
      }

      await Usage.create({
        org_id: apiKey.org_id, project_id: apiKey.project_id,
        user_id: apiKey.user_id, api_key_id: apiKey.id,
        model: routedModel, routed_model: routedModel, original_model: originalModel,
        prompt_tokens: mockPromptTokens, completion_tokens: mockCompletionTokens,
        total_tokens: mockTotalTokens, cost, original_cost: cost, savings: 0, cache_hit: false
      });

      // 更新 API Key 统计
      apiKey.total_requests += 1;
      apiKey.total_tokens += mockTotalTokens;
      apiKey.monthly_spend = parseFloat(apiKey.monthly_spend) + cost;
      await apiKey.save();

      const fallbackResponse = {
        id: 'chatcmpl-fallback-' + Date.now(),
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: routedModel,
        choices: [{
          index: 0,
          message: { role: 'assistant', content: `[Costify 降级响应] 上游服务暂时不可用: ${upstreamErr.message}` },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: mockPromptTokens, completion_tokens: mockCompletionTokens, total_tokens: mockTotalTokens }
      };

      res.json({
        ...fallbackResponse,
        costify: { routed_model: routedModel, cache_hit: false, estimated_cost: cost.toFixed(6), remaining_balance: parseFloat(org.balance).toFixed(2), fallback: true }
      });
    }
  } catch (err) {
    console.error('代理网关错误:', err);
    res.status(500).json({ error: { message: err.message, type: 'server_error' } });
  }
});

app.get('/api/v1/models', async (req, res) => {
  res.json({
    object: 'list',
    data: Object.keys(MODEL_PRICES).map(id => ({
      id, object: 'model', owned_by: id.startsWith('gpt') ? 'openai' : 'anthropic'
    }))
  });
});

// ==================== 数据库初始化 ====================

sequelize.sync({ force: true })
  .then(async () => {
    console.log('数据库同步成功');

    const org = await Org.create({ name: 'Costify 演示企业', balance: 1000, balance_threshold: 50 });
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      org_id: org.id, email: 'admin@costify.io', password: hashedPassword,
      name: '系统管理员', role: 'org_admin'
    });
    const member1 = await User.create({
      org_id: org.id, email: 'alice@costify.io', password: await bcrypt.hash('member123', 10),
      name: '张小明', role: 'member'
    });
    const member2 = await User.create({
      org_id: org.id, email: 'bob@costify.io', password: await bcrypt.hash('member123', 10),
      name: '李开发', role: 'member'
    });

    const proj1 = await Project.create({
      org_id: org.id, name: '智能客服系统', description: '基于 AI 的客户服务自动化平台',
      monthly_budget: 200, routing_profile: 'balanced', max_tokens_per_request: 4096, default_model: 'gpt-4o-mini',
      models: 'gpt-4o,gpt-4o-mini,gpt-3.5-turbo'
    });
    const proj2 = await Project.create({
      org_id: org.id, name: '内容生成平台', description: '营销文案和内容自动生成',
      monthly_budget: 150, routing_profile: 'cost_saver', max_tokens_per_request: 2048, default_model: 'gpt-4o-mini',
      models: 'gpt-4o-mini,gpt-3.5-turbo'
    });
    const proj3 = await Project.create({
      org_id: org.id, name: '代码助手', description: '开发团队 AI 编程辅助工具',
      monthly_budget: 300, routing_profile: 'quality', max_tokens_per_request: 8192, default_model: 'gpt-4o',
      models: 'gpt-4o,claude-3-sonnet,claude-3-opus'
    });

    await Membership.bulkCreate([
      { user_id: admin.id, project_id: proj1.id, role: 'admin' },
      { user_id: admin.id, project_id: proj2.id, role: 'admin' },
      { user_id: admin.id, project_id: proj3.id, role: 'admin' },
      { user_id: member1.id, project_id: proj1.id, role: 'member' },
      { user_id: member1.id, project_id: proj2.id, role: 'member' },
      { user_id: member2.id, project_id: proj3.id, role: 'member' },
    ]);

    const key1 = await ApiKey.create({ org_id: org.id, project_id: proj1.id, user_id: null, name: 'prod-server', key: generateApiKey(), key_type: 'project' });
    const key2 = await ApiKey.create({ org_id: org.id, project_id: proj1.id, user_id: member1.id, name: 'alice-dev', key: generateApiKey(), key_type: 'user' });
    const key3 = await ApiKey.create({ org_id: org.id, project_id: proj2.id, user_id: null, name: 'content-api', key: generateApiKey(), key_type: 'project' });
    const key4 = await ApiKey.create({ org_id: org.id, project_id: proj3.id, user_id: null, name: 'code-agent', key: generateApiKey(), key_type: 'project' });

    // 模拟历史使用数据
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const count = Math.floor(Math.random() * 8) + 2;
      for (let j = 0; j < count; j++) {
        const models = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'];
        const projects = [proj1, proj2, proj3];
        const keys = [key1, key2, key3, key4];
        const p = projects[Math.floor(Math.random() * projects.length)];
        const k = keys[Math.floor(Math.random() * keys.length)];
        const m = models[Math.floor(Math.random() * models.length)];
        const pt = Math.floor(Math.random() * 2000) + 200;
        const ct = Math.floor(Math.random() * 800) + 100;
        const cost = calculateCost(m, pt, ct);
        const origModel = m === 'gpt-4o-mini' ? 'gpt-4o' : m;
        const origCost = calculateCost(origModel, pt, ct);
        const savings = Math.max(0, origCost - cost);
        const createdAt = new Date(date.getTime() + Math.random() * 86400000);

        await Usage.create({
          org_id: org.id, project_id: p.id, user_id: k.user_id || admin.id,
          api_key_id: k.id, model: m, routed_model: m, original_model: origModel,
          prompt_tokens: pt, completion_tokens: ct, total_tokens: pt + ct,
          cost, original_cost: origCost, savings, cache_hit: Math.random() > 0.7,
          created_at: createdAt
        });

        if (savings > 0) {
          await Savings.create({
            org_id: org.id, project_id: p.id,
            type: Math.random() > 0.5 ? 'routing' : 'caching',
            saved_tokens: Math.floor(Math.random() * 500),
            saved_cost: savings,
            created_at: createdAt
          });
        }
      }
    }

    await Recharge.create({
      org_id: org.id, user_id: admin.id, amount: 1000,
      payment_method: 'bank_transfer', status: 'success',
      transaction_id: 'TXN_INIT_001', note: '初始充值'
    });

    await Alert.bulkCreate([
      { org_id: org.id, project_id: proj1.id, type: 'budget', severity: 'warning', message: '项目 "智能客服系统" 预算使用已达 85%' },
      { org_id: org.id, type: 'balance', severity: 'info', message: '组织余额充足，当前余额: $1000.00' },
    ]);

    console.log('种子数据创建完成');
    console.log('管理员账号: admin@costify.io / admin123');
    console.log('成员账号: alice@costify.io / member123');
    console.log('成员账号: bob@costify.io / member123');

    app.listen(port, () => {
      console.log(`Costify 服务器运行在 http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  });
