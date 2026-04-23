const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('./database.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

const JWT_SECRET = process.env.JWT_SECRET || 'anytokn-secret-key-2024';

app.use(cors());
app.use(express.json());

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.findUserByEmail(email);
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role, org_id: user.org_id },
          JWT_SECRET
        );
        return res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            org_id: user.org_id
          }
        });
      }
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取当前用户
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.findUserById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      org_id: user.org_id
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard 数据
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const stats = await db.getDashboardStats(req.user.org_id);
    const projects = await db.getAllProjects(req.user.org_id);
    const apiKeys = await db.getAllApiKeys();

    // 生成30天的趋势数据
    const trend = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      trend.push({
        date: date.toISOString().split('T')[0],
        tokens: Math.floor(Math.random() * 50000) + 10000,
        cost: parseFloat((Math.random() * 50 + 10).toFixed(2))
      });
    }

    // 模型分布数据
    const modelDistribution = [
      { name: 'GPT-4o Mini', value: 45, cost: 125.5 },
      { name: 'GPT-4o', value: 30, cost: 280.3 },
      { name: 'Claude 3', value: 15, cost: 95.2 },
      { name: 'DeepSeek', value: 10, cost: 45.8 }
    ];

    res.json({
      ...stats,
      projects,
      api_keys: apiKeys.slice(0, 5),
      trend,
      model_distribution: modelDistribution,
      alerts: [
        { type: 'warning', message: 'Production App 项目接近预算上限 (85%)' },
        { type: 'info', message: '本月已节省 $251.00' }
      ]
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// 项目列表
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await db.getAllProjects(req.user.org_id);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// 创建项目
app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { name, description, monthly_budget, routing_profile, max_tokens_per_request, default_model, models } = req.body;
    const newProject = await db.createProject({
      name,
      description: description || '',
      monthly_budget: monthly_budget || null,
      routing_profile: routing_profile || 'balanced',
      max_tokens_per_request: max_tokens_per_request || 4096,
      default_model: default_model || 'gpt-4o-mini',
      models: models ? models.join(',') : 'gpt-4o-mini',
      status: 'active',
      org_id: req.user.org_id
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// 获取单个项目
app.get('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await db.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const apiKeys = await db.getAllApiKeys(project.id);
    const members = await db.getProjectMembers(project.id);
    res.json({ ...project, api_keys: apiKeys, members });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// 更新项目
app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, monthly_budget, routing_profile, max_tokens_per_request, default_model, models } = req.body;
    const updated = await db.updateProject(req.params.id, {
      name,
      description: description || '',
      monthly_budget: monthly_budget || null,
      routing_profile: routing_profile || 'balanced',
      max_tokens_per_request: max_tokens_per_request || 4096,
      default_model: default_model || 'gpt-4o-mini',
      models: models ? models.join(',') : 'gpt-4o-mini'
    });
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// 删除项目
app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await db.deleteProject(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// API Keys 列表
app.get('/api/api-keys', authenticateToken, async (req, res) => {
  try {
    const { project_id } = req.query;
    const keys = await db.getAllApiKeys(project_id ? parseInt(project_id) : undefined);
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

// 创建 API Key
app.post('/api/api-keys', authenticateToken, async (req, res) => {
  try {
    const { name, key_type, project_id, user_id, monthly_budget, description } = req.body;
    const keyPrefix = 'csk_' + Math.random().toString(36).substring(2, 6);
    const keyValue = keyPrefix + '_' + Math.random().toString(36).substring(2, 18);

    const newKey = await db.createApiKey({
      name,
      key_value: keyValue,
      key_prefix: keyPrefix,
      type: key_type || 'project',
      project_id: project_id || null,
      user_id: user_id || null,
      monthly_budget: monthly_budget || null,
      description: description || '',
      status: 'active'
    });

    res.status(201).json({ ...newKey, key: keyValue });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

// 获取单个 API Key
app.get('/api/api-keys/:id', authenticateToken, async (req, res) => {
  try {
    const key = await db.findApiKeyById(req.params.id);
    if (!key) return res.status(404).json({ error: 'API key not found' });
    res.json(key);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API key' });
  }
});

// 更新 API Key
app.put('/api/api-keys/:id', authenticateToken, async (req, res) => {
  try {
    const { name, monthly_budget, description, status } = req.body;
    const updated = await db.updateApiKey(req.params.id, {
      name,
      monthly_budget,
      description,
      status
    });
    if (!updated) return res.status(404).json({ error: 'API key not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update API key' });
  }
});

// 删除 API Key
app.delete('/api/api-keys/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await db.deleteApiKey(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'API key not found' });
    res.json({ message: 'API key deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete API key' });
  }
});

// 成员列表
app.get('/api/members', authenticateToken, async (req, res) => {
  try {
    const members = await db.getAllMembers(req.user.org_id);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// 创建成员
app.post('/api/members', authenticateToken, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const existing = await db.findMemberByEmail(email);
    if (existing) return res.status(400).json({ error: 'Member already exists' });

    const newMember = await db.createMember({
      name,
      email,
      role: role || 'member',
      org_id: req.user.org_id
    });
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// 项目成员
app.get('/api/projects/:id/members', authenticateToken, async (req, res) => {
  try {
    const members = await db.getProjectMembers(req.params.id);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project members' });
  }
});

// 添加项目成员
app.post('/api/projects/:id/members', authenticateToken, async (req, res) => {
  try {
    const { user_id, role } = req.body;
    const relation = await db.addProjectMember(req.params.id, user_id, role);
    res.status(201).json(relation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add project member' });
  }
});

// 移除项目成员
app.delete('/api/projects/:id/members/:userId', authenticateToken, async (req, res) => {
  try {
    const removed = await db.removeProjectMember(req.params.id, req.params.userId);
    if (!removed) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// 组织设置
app.get('/api/organization', authenticateToken, async (req, res) => {
  try {
    const org = await db.getOrganization(req.user.org_id);
    if (!org) return res.status(404).json({ error: 'Organization not found' });
    res.json(org);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// 更新组织设置
app.put('/api/organization', authenticateToken, async (req, res) => {
  try {
    const { name, balance_threshold } = req.body;
    const updated = await db.updateOrganization(req.user.org_id, { name, balance_threshold });
    if (!updated) return res.status(404).json({ error: 'Organization not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update organization' });
  }
});

// 报告列表
app.get('/api/reports', authenticateToken, async (req, res) => {
  try {
    const reports = await db.getAllReports(req.user.userId);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// 创建报告
app.post('/api/reports', authenticateToken, async (req, res) => {
  try {
    const { name, description, type, subtype } = req.body;
    const newReport = await db.createReport({
      name,
      description,
      type,
      subtype,
      user_id: req.user.userId
    });
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// 获取单个报告
app.get('/api/reports/:id', authenticateToken, async (req, res) => {
  try {
    const report = await db.findReportById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// 删除报告
app.delete('/api/reports/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await db.deleteReport(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

// 预算管理
app.get('/api/budget', authenticateToken, async (req, res) => {
  try {
    const projects = await db.getAllProjects(req.user.org_id);
    const org = await db.getOrganization(req.user.org_id);
    
    // 计算组织预算
    const totalBudget = projects.reduce((sum, p) => sum + (p.monthly_budget || 0), 0);
    const totalUsed = projects.reduce((sum, p) => sum + (p.month_spend || 0), 0);
    
    const budgetData = {
      org_budget: {
        monthly_budget: totalBudget,
        used_amount: totalUsed,
        remaining: totalBudget - totalUsed,
        used_percentage: totalBudget > 0 ? (totalUsed / totalBudget * 100) : 0,
        alert_threshold: org?.balance_threshold || 80,
        alert_enabled: true
      },
      project_budgets: projects.map(p => ({
        id: p.id,
        name: p.name,
        monthly_budget: p.monthly_budget || 0,
        used_amount: p.month_spend || 0,
        remaining: (p.monthly_budget || 0) - (p.month_spend || 0),
        used_percentage: p.monthly_budget > 0 ? (p.month_spend / p.monthly_budget * 100) : 0,
        alert_threshold: 80
      })),
      budget_history: [],
      budget_alerts: [],
      savings_stats: {
        total_savings: projects.reduce((sum, p) => sum + (p.month_savings || 0), 0),
        routing_savings: projects.reduce((sum, p) => sum + (p.month_savings || 0) * 0.6, 0),
        cache_savings: projects.reduce((sum, p) => sum + (p.month_savings || 0) * 0.4, 0),
        avg_cost_per_1k_tokens: 0.002
      }
    };
    
    res.json(budgetData);
  } catch (error) {
    console.error('Budget error:', error);
    res.status(500).json({ error: 'Failed to fetch budget data' });
  }
});

// 更新组织预算设置
app.put('/api/organization/budget', authenticateToken, async (req, res) => {
  try {
    const { alert_threshold, alert_enabled } = req.body;
    const updated = await db.updateOrganization(req.user.org_id, {
      balance_threshold: alert_threshold,
      alert_enabled
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update budget settings' });
  }
});

// 路由优化 - 节省统计
app.get('/api/savings', authenticateToken, async (req, res) => {
  try {
    const projects = await db.getAllProjects(req.user.org_id);
    
    // 计算节省数据
    const totalSavings = projects.reduce((sum, p) => sum + (p.month_savings || 0), 0);
    const routingSavings = totalSavings * 0.6;
    const cacheSavings = totalSavings * 0.4;
    const totalTokens = projects.reduce((sum, p) => sum + (p.total_tokens || 0), 0);
    
    // 生成每日节省趋势数据（最近30天）
    const daily = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // 模拟每日数据（基于项目数量）
      const baseSavings = totalSavings / 30;
      const randomFactor = 0.8 + Math.random() * 0.4;
      const dayRouting = (baseSavings * 0.6 * randomFactor);
      const dayCache = (baseSavings * 0.4 * randomFactor);
      
      daily.push({
        date: dateStr,
        routing_savings: Math.max(0, dayRouting),
        cache_savings: Math.max(0, dayCache),
        total_savings: Math.max(0, dayRouting + dayCache)
      });
    }
    
    // 计算缓存命中率（模拟数据）
    const cacheHitCount = Math.floor(totalTokens * 0.25);
    const cacheMissCount = Math.floor(totalTokens * 0.75);
    const cacheHitRate = totalTokens > 0 ? cacheHitCount / (cacheHitCount + cacheMissCount) : 0;
    
    const savingsData = {
      total_savings_amount: totalSavings,
      total_savings_tokens: Math.floor(totalTokens * 0.15),
      routing_savings: routingSavings,
      cache_savings: cacheSavings,
      cache_hit_rate: cacheHitRate,
      cache_hit_count: cacheHitCount,
      cache_miss_count: cacheMissCount,
      daily: daily,
      daily_savings: daily
    };
    
    res.json(savingsData);
  } catch (error) {
    console.error('Savings error:', error);
    res.status(500).json({ error: 'Failed to fetch savings data' });
  }
});

// 代理请求到上游 LLM API
app.post('/v1/chat/completions', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const apiKey = authHeader && authHeader.replace('Bearer ', '');

  if (!apiKey) {
    return res.status(401).json({ error: { message: 'Missing API key', type: 'authentication_error' } });
  }

  const keyRecord = await db.findApiKeyByValue(apiKey);
  if (!keyRecord || keyRecord.status !== 'active') {
    return res.status(401).json({ error: { message: 'Invalid API key', type: 'authentication_error' } });
  }

  // 检查预算
  if (keyRecord.monthly_budget && keyRecord.monthly_spend >= keyRecord.monthly_budget) {
    return res.status(429).json({ error: { message: 'Monthly budget exceeded', type: 'budget_exceeded' } });
  }

  // 模拟响应
  const { model, messages, stream } = req.body;
  const requestTokens = JSON.stringify(messages).length / 4;
  const responseTokens = 150;
  const cost = (requestTokens + responseTokens) * 0.000002;

  // 更新 key 统计
  await db.updateApiKey(keyRecord.id, {
    monthly_spend: (keyRecord.monthly_spend || 0) + cost,
    total_cost: (keyRecord.total_cost || 0) + cost,
    total_tokens: (keyRecord.total_tokens || 0) + requestTokens + responseTokens,
    total_requests: (keyRecord.total_requests || 0) + 1,
    last_used: new Date().toISOString()
  });

  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const responseId = 'chatcmpl-' + Math.random().toString(36).substring(2);
    res.write(`data: ${JSON.stringify({ id: responseId, object: 'chat.completion.chunk', created: Math.floor(Date.now() / 1000), model, choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }] })}\n\n`);

    const words = ['This', 'is', 'a', 'simulated', 'response', 'from', 'AnyTokn', 'API', 'proxy.', 'The', 'actual', 'implementation', 'would', 'forward', 'requests', 'to', 'upstream', 'LLM', 'providers.'];
    let i = 0;
    const interval = setInterval(() => {
      if (i >= words.length) {
        res.write(`data: ${JSON.stringify({ id: responseId, object: 'chat.completion.chunk', created: Math.floor(Date.now() / 1000), model, choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] })}\n\n`);
        res.write('data: [DONE]\n\n');
        clearInterval(interval);
        res.end();
        return;
      }
      res.write(`data: ${JSON.stringify({ id: responseId, object: 'chat.completion.chunk', created: Math.floor(Date.now() / 1000), model, choices: [{ index: 0, delta: { content: words[i] + ' ' }, finish_reason: null }] })}\n\n`);
      i++;
    }, 100);
  } else {
    res.json({
      id: 'chatcmpl-' + Math.random().toString(36).substring(2),
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [{ index: 0, message: { role: 'assistant', content: 'This is a simulated response from AnyTokn API proxy. The actual implementation would forward requests to upstream LLM providers like OpenAI, Anthropic, etc.' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: Math.floor(requestTokens), completion_tokens: responseTokens, total_tokens: Math.floor(requestTokens) + responseTokens }
    });
  }
});

// 模型列表
app.get('/v1/models', async (req, res) => {
  res.json({
    object: 'list',
    data: [
      { id: 'gpt-4o', object: 'model', created: 1715367049, owned_by: 'openai' },
      { id: 'gpt-4o-mini', object: 'model', created: 1721172741, owned_by: 'openai' },
      { id: 'claude-3-opus', object: 'model', created: 1710288000, owned_by: 'anthropic' },
      { id: 'claude-3-sonnet', object: 'model', created: 1710288000, owned_by: 'anthropic' },
      { id: 'deepseek-chat', object: 'model', created: 1704067200, owned_by: 'deepseek' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AnyTokn Server running on port ${PORT}`);
  console.log(`📍 Demo mode enabled - Use:`);
  console.log(`   Admin: admin@anytokn.io / admin123`);
  console.log(`   Member: alice@anytokn.io / member123`);
});

module.exports = app;
