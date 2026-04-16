const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

const JWT_SECRET = process.env.JWT_SECRET || 'anytokn-secret-key-2024';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const DEMO_USERS = [
  { id: 1, email: 'admin@anytokn.io', password: 'admin123', name: '管理员', role: 'org_admin', org_id: 1 },
  { id: 2, email: 'alice@anytokn.io', password: 'member123', name: 'Alice', role: 'member', org_id: 1 }
];

let DEMO_PROJECTS = [
  {
    id: 1, name: '产品开发', description: '核心产品功能开发', monthly_budget: 20000,
    routing_profile: 'balanced', max_tokens_per_request: 4096, default_model: 'gpt-4o-mini',
    models: 'gpt-4o-mini,gpt-4o,claude-3-sonnet', status: 'active', org_id: 1,
    month_spend: 520.30, month_savings: 120.50, budget_percentage: 26, key_count: 2, member_count: 2
  },
  {
    id: 2, name: '市场营销', description: '市场推广活动', monthly_budget: 15000,
    routing_profile: 'cost_saver', max_tokens_per_request: 2048, default_model: 'gpt-4o-mini',
    models: 'gpt-4o-mini,deepseek-chat', status: 'active', org_id: 1,
    month_spend: 380.20, month_savings: 85.30, budget_percentage: 25, key_count: 1, member_count: 1
  },
  {
    id: 3, name: '客户支持', description: '客服自动化系统', monthly_budget: 10000,
    routing_profile: 'quality', max_tokens_per_request: 8192, default_model: 'gpt-4o',
    models: 'gpt-4o,claude-3-opus', status: 'active', org_id: 1,
    month_spend: 250.00, month_savings: 45.20, budget_percentage: 25, key_count: 1, member_count: 2
  }
];

let DEMO_API_KEYS = [
  {
    id: 1, name: 'Production Key', key_prefix: 'ak_prod_xxxx', status: 'active',
    project_id: 1, type: 'project', project: '产品开发', user_id: null, owner: null,
    monthly_budget: 5000, monthly_spend: 680.50, total_cost: 680.50, total_tokens: 8200,
    total_requests: 450, request_count: 450, budget_usage: 13.6, last_used: new Date(Date.now() - 2 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 2, name: 'Test Key', key_prefix: 'ak_test_xxxx', status: 'active',
    project_id: 2, type: 'project', project: '市场营销', user_id: null, owner: null,
    monthly_budget: 2000, monthly_spend: 320.00, total_cost: 320.00, total_tokens: 4100,
    total_requests: 280, request_count: 280, budget_usage: 16.0, last_used: new Date(Date.now() - 5 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];

let DEMO_MEMBERS = [
  { id: 1, name: '管理员', email: 'admin@anytokn.io', role: 'org_admin', org_id: 1, projects: [{ id: 1, name: '产品开发' }, { id: 2, name: '市场营销' }, { id: 3, name: '客户支持' }], monthly_spend: 720.50 },
  { id: 2, name: 'Alice', email: 'alice@anytokn.io', role: 'member', org_id: 1, projects: [{ id: 1, name: '产品开发' }, { id: 3, name: '客户支持' }], monthly_spend: 430.00 }
];

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ==================== Auth ====================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demoUser) {
      const token = jwt.sign({ userId: demoUser.id, email: demoUser.email, role: demoUser.role, orgId: demoUser.org_id }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, user: { id: demoUser.id, email: demoUser.email, name: demoUser.name, role: demoUser.role, orgId: demoUser.org_id } });
    }
    try {
      const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
      if (!error && user) {
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (validPassword) {
          const token = jwt.sign({ userId: user.id, email: user.email, role: user.role, orgId: user.org_id }, JWT_SECRET, { expiresIn: '24h' });
          return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, orgId: user.org_id } });
        }
      }
    } catch (e) { console.log('Supabase login failed, using demo mode'); }
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const demoUser = DEMO_USERS.find(u => u.id === req.user.userId);
    if (demoUser) {
      return res.json({
        user: { id: demoUser.id, email: demoUser.email, name: demoUser.name, role: demoUser.role, orgId: demoUser.org_id },
        organization: { id: 1, name: 'AnyTokn Demo', balance: 10000.00, total_budget: 50000.00 }
      });
    }
    const { data: user, error } = await supabase.from('users').select('*').eq('id', req.user.userId).single();
    if (error || !user) return res.status(404).json({ error: 'User not found' });
    const { data: org } = await supabase.from('organizations').select('*').eq('id', user.org_id).single();
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, orgId: user.org_id }, organization: org });
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

// ==================== Dashboard ====================

app.get('/api/dashboard', authenticateToken, async (req, res) => {
  res.json({
    balance: 10000.00, balance_threshold: 80, month_cost: 1250.50, last_month_cost: 980.20,
    cost_change_pct: 27.5, month_savings: 320.80, month_budget: 50000, month_budget_used_pct: 25,
    month_tokens: 15420, request_count: 850, cache_hit_rate: 35.5, project_count: 3, member_count: 2,
    active_keys: 2, unread_alerts: 0,
    top_projects: [
      { id: 1, name: '产品开发', spend: 520.30, budget: 20000, tokens: 6500 },
      { id: 2, name: '市场营销', spend: 380.20, budget: 15000, tokens: 4200 },
      { id: 3, name: '客户支持', spend: 250.00, budget: 10000, tokens: 2800 }
    ],
    top_api_keys: [
      { id: 1, name: 'Production Key', key_preview: 'ak_prod_xxxx', spend: 680.50, tokens: 8200, requests: 450 },
      { id: 2, name: 'Test Key', key_preview: 'ak_test_xxxx', spend: 320.00, tokens: 4100, requests: 280 }
    ],
    top_users: [
      { id: 1, name: '管理员', email: 'admin@anytokn.io', spend: 720.50, tokens: 9200, requests: 520 },
      { id: 2, name: 'Alice', email: 'alice@anytokn.io', spend: 430.00, tokens: 6220, requests: 330 }
    ],
    daily_spend: Array.from({ length: 30 }, (_, i) => {
      const date = new Date(); date.setDate(date.getDate() - (29 - i));
      return { date: date.toISOString().split('T')[0], cost: Math.random() * 80 + 20, savings: Math.random() * 20 + 5 };
    }),
    daily_savings: Array.from({ length: 30 }, (_, i) => {
      const date = new Date(); date.setDate(date.getDate() - (29 - i));
      return { date: date.toISOString().split('T')[0], savings: Math.random() * 15 + 5, routing_savings: Math.random() * 10 + 3, cache_savings: Math.random() * 8 + 2 };
    }),
    model_distribution: [
      { model: 'gpt-4o', cost: 450.20, count: 1200 },
      { model: 'gpt-4o-mini', cost: 180.50, count: 3500 },
      { model: 'claude-3-sonnet', cost: 320.80, count: 800 },
      { model: 'deepseek-chat', cost: 150.00, count: 2100 }
    ]
  });
});

app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  res.json({ totalCost: 1250.50, totalRequests: 15420, activeProjects: 3, activeMembers: 2 });
});

app.get('/api/dashboard/cost-trend', authenticateToken, async (req, res) => {
  const trend = [];
  for (let i = 29; i >= 0; i--) { const date = new Date(); date.setDate(date.getDate() - i); trend.push({ date: date.toISOString().split('T')[0], cost: Math.random() * 100 + 20 }); }
  res.json(trend);
});

app.get('/api/dashboard/model-usage', authenticateToken, async (req, res) => {
  res.json([
    { model: 'gpt-4o', cost: 450.20, requests: 1200 }, { model: 'gpt-4o-mini', cost: 180.50, requests: 3500 },
    { model: 'claude-3-sonnet', cost: 320.80, requests: 800 }, { model: 'deepseek-chat', cost: 150.00, requests: 2100 }
  ]);
});

app.get('/api/dashboard/project-costs', authenticateToken, async (req, res) => {
  res.json({ 1: 520.30, 2: 380.20, 3: 250.00 });
});

// ==================== Projects ====================

app.get('/api/projects', authenticateToken, async (req, res) => {
  res.json(DEMO_PROJECTS);
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  const { name, description, monthly_budget, routing_profile, max_tokens_per_request, default_model, models } = req.body;
  const newProject = {
    id: Date.now(), name, description: description || '', monthly_budget: monthly_budget || null,
    routing_profile: routing_profile || 'balanced', max_tokens_per_request: max_tokens_per_request || 4096,
    default_model: default_model || 'gpt-4o-mini', models: models ? models.join(',') : 'gpt-4o-mini',
    status: 'active', org_id: 1, month_spend: 0, month_savings: 0, budget_percentage: 0, key_count: 0, member_count: 0
  };
  DEMO_PROJECTS.push(newProject);
  res.status(201).json(newProject);
});

app.get('/api/projects/:id', authenticateToken, async (req, res) => {
  const project = DEMO_PROJECTS.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const projectKeys = DEMO_API_KEYS.filter(k => k.project_id === project.id);
  const projectMembers = [
    { user_id: 1, role: 'admin', User: { name: '管理员', email: 'admin@anytokn.io' } },
    { user_id: 2, role: 'member', User: { name: 'Alice', email: 'alice@anytokn.io' } }
  ];
  res.json({ ...project, api_keys: projectKeys, members: projectMembers });
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  const idx = DEMO_PROJECTS.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  const { name, description, monthly_budget, routing_profile, max_tokens_per_request, default_model, models } = req.body;
  DEMO_PROJECTS[idx] = {
    ...DEMO_PROJECTS[idx], name, description: description || '', monthly_budget: monthly_budget || null,
    routing_profile: routing_profile || 'balanced', max_tokens_per_request: max_tokens_per_request || 4096,
    default_model: default_model || 'gpt-4o-mini', models: models ? models.join(',') : 'gpt-4o-mini',
    updated_at: new Date().toISOString()
  };
  res.json(DEMO_PROJECTS[idx]);
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  const idx = DEMO_PROJECTS.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  DEMO_PROJECTS.splice(idx, 1);
  res.json({ success: true });
});

app.get('/api/projects/:id/members', authenticateToken, async (req, res) => {
  res.json([
    { id: 1, name: '管理员', email: 'admin@anytokn.io', role: 'org_admin', joined_at: '2024-01-15' },
    { id: 2, name: 'Alice', email: 'alice@anytokn.io', role: 'member', joined_at: '2024-02-01' }
  ]);
});

app.post('/api/projects/:id/members', authenticateToken, async (req, res) => {
  res.json({ success: true, project_id: parseInt(req.params.id), user_id: req.body.user_id });
});

app.delete('/api/projects/:id/members/:userId', authenticateToken, async (req, res) => {
  res.json({ success: true });
});

app.get('/api/projects/:id/usage', authenticateToken, async (req, res) => {
  res.json({
    total_cost: 520.30, total_tokens: 6500, total_requests: 420,
    daily_usage: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      cost: Math.random() * 30 + 5, tokens: Math.floor(Math.random() * 500) + 100, requests: Math.floor(Math.random() * 30) + 5
    }))
  });
});

// ==================== API Keys ====================

app.get('/api/api-keys', authenticateToken, async (req, res) => {
  res.json(DEMO_API_KEYS);
});

app.post('/api/api-keys', authenticateToken, async (req, res) => {
  const { name, key_type, project_id, user_id, monthly_budget } = req.body;
  const keyPrefix = 'ak_' + (key_type === 'user' ? 'user' : 'prod') + '_';
  const fullKey = keyPrefix + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  const proj = DEMO_PROJECTS.find(p => p.id === project_id);
  const newKey = {
    id: Date.now(), name: name || 'New API Key', key: fullKey, key_prefix: keyPrefix + 'xxxx',
    type: key_type || 'project', project_id: project_id || 1, project: proj ? proj.name : '未知项目',
    user_id: user_id || null, owner: user_id ? (user_id === 1 ? '管理员' : 'Alice') : null,
    status: 'active', monthly_budget: monthly_budget || null, monthly_spend: 0, total_cost: 0,
    total_tokens: 0, total_requests: 0, request_count: 0, budget_usage: 0,
    last_used: null, created_at: new Date().toISOString()
  };
  DEMO_API_KEYS.push(newKey);
  if (proj) proj.key_count = (proj.key_count || 0) + 1;
  res.status(201).json(newKey);
});

app.get('/api/api-keys/analytics/summary', authenticateToken, async (req, res) => {
  res.json({ total_keys: DEMO_API_KEYS.length, active_keys: DEMO_API_KEYS.filter(k => k.status === 'active').length, total_requests: 850, total_cost: 1250.50, avg_latency: 245 });
});

app.get('/api/api-keys/:id/detail', authenticateToken, async (req, res) => {
  const keyId = parseInt(req.params.id);
  const isProd = keyId === 1;
  res.json({
    id: keyId, name: isProd ? 'Production Key' : 'Test Key',
    key_preview: isProd ? 'ak_prod_xxxx' : 'ak_test_xxxx',
    project_id: isProd ? 1 : 2, project_name: isProd ? '产品开发' : '市场营销',
    user_id: null, user_name: null, type: 'project',
    spend: isProd ? 680.50 : 320.00, tokens: isProd ? 8200 : 4100, requests: isProd ? 450 : 280,
    created_at: new Date(Date.now() - (isProd ? 30 : 15) * 86400000).toISOString(),
    last_used_at: new Date(Date.now() - 2 * 3600000).toISOString(), status: 'active',
    daily_usage: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      cost: Math.random() * 30 + 5, tokens: Math.floor(Math.random() * 5000) + 500, requests: Math.floor(Math.random() * 50) + 10
    })),
    model_distribution: [
      { model: 'gpt-4o', cost: isProd ? 280.50 : 120.00, count: isProd ? 180 : 90 },
      { model: 'gpt-4o-mini', cost: isProd ? 150.20 : 80.00, count: isProd ? 350 : 180 },
      { model: 'claude-3-sonnet', cost: isProd ? 150.00 : 70.00, count: isProd ? 120 : 60 },
      { model: 'deepseek-chat', cost: isProd ? 99.80 : 50.00, count: isProd ? 200 : 100 }
    ]
  });
});

app.get('/api/api-keys/:id/analytics', authenticateToken, async (req, res) => {
  const { group_by } = req.query;
  const trend = [];
  const days = group_by === 'month' ? 12 : group_by === 'week' ? 12 : 30;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    if (group_by === 'month') { date.setMonth(date.getMonth() - i); trend.push({ period: date.toISOString().slice(0, 7), cost: Math.random() * 500 + 100, tokens: Math.floor(Math.random() * 50000) + 10000, requests: Math.floor(Math.random() * 500) + 100, avg_latency: Math.floor(Math.random() * 500) + 200 }); }
    else if (group_by === 'week') { date.setDate(date.getDate() - i * 7); trend.push({ period: `W${Math.ceil(date.getDate() / 7)}`, cost: Math.random() * 150 + 30, tokens: Math.floor(Math.random() * 15000) + 3000, requests: Math.floor(Math.random() * 150) + 30, avg_latency: Math.floor(Math.random() * 500) + 200 }); }
    else { date.setDate(date.getDate() - i); trend.push({ period: date.toISOString().split('T')[0], cost: Math.random() * 30 + 5, tokens: Math.floor(Math.random() * 3000) + 500, requests: Math.floor(Math.random() * 30) + 5, avg_latency: Math.floor(Math.random() * 500) + 200 }); }
  }
  const totalCost = trend.reduce((s, t) => s + t.cost, 0);
  const totalTokens = trend.reduce((s, t) => s + t.tokens, 0);
  const totalRequests = trend.reduce((s, t) => s + t.requests, 0);
  const avgLatency = trend.reduce((s, t) => s + t.avg_latency, 0) / trend.length;
  res.json({
    summary: { total_cost: totalCost, total_tokens: totalTokens, total_savings: totalCost * 0.15, request_count: totalRequests, avg_latency: avgLatency, cache_hit_rate: 35.5 },
    trend,
    by_model: [
      { model: 'gpt-4o', cost: totalCost * 0.4, tokens: totalTokens * 0.35, requests: Math.floor(totalRequests * 0.3), avg_latency: 450 },
      { model: 'gpt-4o-mini', cost: totalCost * 0.25, tokens: totalTokens * 0.3, requests: Math.floor(totalRequests * 0.4), avg_latency: 250 },
      { model: 'claude-3-sonnet', cost: totalCost * 0.2, tokens: totalTokens * 0.2, requests: Math.floor(totalRequests * 0.15), avg_latency: 380 },
      { model: 'deepseek-chat', cost: totalCost * 0.15, tokens: totalTokens * 0.15, requests: Math.floor(totalRequests * 0.15), avg_latency: 180 }
    ],
    by_project: [
      { project_id: 1, project_name: '产品开发', cost: totalCost * 0.5, requests: Math.floor(totalRequests * 0.45) },
      { project_id: 2, project_name: '市场营销', cost: totalCost * 0.3, requests: Math.floor(totalRequests * 0.35) },
      { project_id: 3, project_name: '客户支持', cost: totalCost * 0.2, requests: Math.floor(totalRequests * 0.2) }
    ],
    recent_usage: Array.from({ length: 20 }, (_, i) => ({
      id: `usage_${i}`, timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      project: ['产品开发', '市场营销', '客户支持'][i % 3], model: ['gpt-4o', 'gpt-4o-mini', 'claude-3-sonnet', 'deepseek-chat'][i % 4],
      prompt_tokens: Math.floor(Math.random() * 1000) + 100, completion_tokens: Math.floor(Math.random() * 500) + 50,
      cost: Math.random() * 2 + 0.1, latency: Math.floor(Math.random() * 800) + 200, cache_hit: Math.random() > 0.7
    })),
    anomalies: Math.random() > 0.5 ? [
      { id: 'anomaly_1', timestamp: new Date(Date.now() - 86400000).toISOString(), project: '产品开发', model: 'gpt-4o', cost: 15.5, latency: 2500, reason: 'high_latency' },
      { id: 'anomaly_2', timestamp: new Date(Date.now() - 172800000).toISOString(), project: '市场营销', model: 'claude-3-sonnet', cost: 12.3, latency: 1800, reason: 'high_cost' }
    ] : []
  });
});

app.get('/api/api-keys/:id/stats', authenticateToken, async (req, res) => {
  const keyId = parseInt(req.params.id);
  const isProd = keyId === 1;
  res.json({
    month_stats: { spend: isProd ? 680.50 : 320.00, requests: isProd ? 450 : 280, tokens: isProd ? 8200 : 4100, budget_percentage: isProd ? 13.6 : 16.0 },
    daily_usage: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      cost: Math.random() * 30 + 5, tokens: Math.floor(Math.random() * 5000) + 500, requests: Math.floor(Math.random() * 50) + 10
    })),
    by_model: [
      { model: 'gpt-4o', cost: isProd ? 280.50 : 120.00, count: isProd ? 180 : 90 },
      { model: 'gpt-4o-mini', cost: isProd ? 150.20 : 80.00, count: isProd ? 350 : 180 },
      { model: 'claude-3-sonnet', cost: isProd ? 150.00 : 70.00, count: isProd ? 120 : 60 }
    ]
  });
});

app.put('/api/api-keys/:id/budget', authenticateToken, async (req, res) => {
  const { monthly_budget } = req.body;
  const key = DEMO_API_KEYS.find(k => k.id === parseInt(req.params.id));
  if (key) { key.monthly_budget = monthly_budget; key.budget_usage = monthly_budget ? ((key.monthly_spend || 0) / monthly_budget * 100) : 0; }
  res.json({ id: parseInt(req.params.id), monthly_budget, updated_at: new Date().toISOString() });
});

app.patch('/api/api-keys/:id/budget', authenticateToken, async (req, res) => {
  const { monthly_budget } = req.body;
  const key = DEMO_API_KEYS.find(k => k.id === parseInt(req.params.id));
  if (key) { key.monthly_budget = monthly_budget; key.budget_usage = monthly_budget ? ((key.monthly_spend || 0) / monthly_budget * 100) : 0; }
  res.json({ id: parseInt(req.params.id), monthly_budget, updated_at: new Date().toISOString() });
});

app.put('/api/api-keys/:id/pause', authenticateToken, async (req, res) => {
  const key = DEMO_API_KEYS.find(k => k.id === parseInt(req.params.id));
  if (key) key.status = 'paused';
  res.json({ id: parseInt(req.params.id), status: 'paused' });
});

app.put('/api/api-keys/:id/activate', authenticateToken, async (req, res) => {
  const key = DEMO_API_KEYS.find(k => k.id === parseInt(req.params.id));
  if (key) key.status = 'active';
  res.json({ id: parseInt(req.params.id), status: 'active' });
});

app.put('/api/api-keys/:id/revoke', authenticateToken, async (req, res) => {
  const key = DEMO_API_KEYS.find(k => k.id === parseInt(req.params.id));
  if (key) key.status = 'revoked';
  res.json({ id: parseInt(req.params.id), status: 'revoked' });
});

app.post('/api/api-keys/:id/reset', authenticateToken, async (req, res) => {
  const key = DEMO_API_KEYS.find(k => k.id === parseInt(req.params.id));
  const newKey = 'ak_' + Math.random().toString(36).substring(2, 18);
  if (key) { key.key_prefix = newKey.substring(0, 10) + 'xxxx'; }
  res.json({ id: parseInt(req.params.id), key: newKey });
});

app.post('/api/api-keys/batch', authenticateToken, async (req, res) => {
  const { ids, action, key_ids } = req.body;
  const targetIds = key_ids || ids || [];
  const results = { success: targetIds, failed: [] };
  if (action === 'pause') targetIds.forEach(id => { const k = DEMO_API_KEYS.find(x => x.id === id); if (k) k.status = 'paused'; });
  else if (action === 'activate') targetIds.forEach(id => { const k = DEMO_API_KEYS.find(x => x.id === id); if (k) k.status = 'active'; });
  else if (action === 'revoke') targetIds.forEach(id => { const k = DEMO_API_KEYS.find(x => x.id === id); if (k) k.status = 'revoked'; });
  res.json({ success: true, updated_count: targetIds.length, action, results });
});

// ==================== Members ====================

app.get('/api/members', authenticateToken, async (req, res) => {
  res.json(DEMO_MEMBERS);
});

app.post('/api/members/invite', authenticateToken, async (req, res) => {
  const { email, name, role, project_ids } = req.body;
  const tempPassword = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
  const newMember = {
    id: Date.now(), name, email, role: role || 'member', org_id: 1,
    projects: project_ids ? project_ids.map(pid => { const p = DEMO_PROJECTS.find(x => x.id === pid); return p ? { id: p.id, name: p.name } : null; }).filter(Boolean) : [],
    monthly_spend: 0
  };
  DEMO_MEMBERS.push(newMember);
  res.status(201).json({ member: newMember, temporary_password: tempPassword, temp_password: tempPassword });
});

app.patch('/api/members/:id/role', authenticateToken, async (req, res) => {
  const member = DEMO_MEMBERS.find(m => m.id === parseInt(req.params.id));
  if (member) member.role = req.body.role;
  res.json({ id: parseInt(req.params.id), role: req.body.role });
});

app.delete('/api/members/:id', authenticateToken, async (req, res) => {
  const idx = DEMO_MEMBERS.findIndex(m => m.id === parseInt(req.params.id));
  if (idx !== -1) DEMO_MEMBERS.splice(idx, 1);
  res.json({ success: true });
});

// ==================== Users ====================

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  const users = [
    { id: 1, name: '管理员', email: 'admin@anytokn.io', role: 'org_admin', org_id: 1, created_at: '2024-01-01', status: 'active' },
    { id: 2, name: 'Alice', email: 'alice@anytokn.io', role: 'member', org_id: 1, created_at: '2024-02-01', status: 'active' }
  ];
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.get('/api/users/:id/usage', authenticateToken, async (req, res) => {
  const isAdmin = parseInt(req.params.id) === 1;
  res.json({
    total_cost: isAdmin ? 720.50 : 430.00, total_tokens: isAdmin ? 9200 : 6220, total_requests: isAdmin ? 520 : 330,
    daily_usage: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      cost: Math.random() * 25 + 3, tokens: Math.floor(Math.random() * 400) + 80, requests: Math.floor(Math.random() * 25) + 3
    }))
  });
});

// ==================== Reports ====================

app.get('/api/reports', authenticateToken, async (req, res) => {
  res.json([
    { id: 1, title: '月度成本分析报告', type: 'monthly', created_at: '2024-03-01', status: 'completed' },
    { id: 2, title: '模型使用效率报告', type: 'efficiency', created_at: '2024-02-15', status: 'completed' },
    { id: 3, title: '预算执行报告', type: 'budget', created_at: '2024-02-01', status: 'completed' }
  ]);
});

app.get('/api/reports/:id', authenticateToken, async (req, res) => {
  const reports = [
    { id: 1, title: '月度成本分析报告', type: 'monthly', created_at: '2024-03-01', status: 'completed', content: '本月总成本 ¥12,500，较上月增长 15%' },
    { id: 2, title: '模型使用效率报告', type: 'efficiency', created_at: '2024-02-15', status: 'completed', content: 'GPT-4o 使用占比 45%，Claude 占比 30%' },
    { id: 3, title: '预算执行报告', type: 'budget', created_at: '2024-02-01', status: 'completed', content: '当前预算使用率 62%，预计月底不超支' }
  ];
  const report = reports.find(r => r.id === parseInt(req.params.id));
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
});

app.post('/api/reports', authenticateToken, async (req, res) => {
  res.status(201).json({ id: Date.now(), ...req.body, status: 'completed', created_at: new Date().toISOString() });
});

app.delete('/api/reports/:id', authenticateToken, async (req, res) => {
  res.json({ success: true, id: parseInt(req.params.id) });
});

// ==================== Usage ====================

app.get('/api/usage', authenticateToken, async (req, res) => {
  res.json({
    total_cost: 1250.50, total_tokens: 15420, total_requests: 850,
    items: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1, date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
      model: ['gpt-4o', 'gpt-4o-mini', 'claude-3-sonnet', 'deepseek-chat'][i % 4],
      project: ['产品开发', '市场营销', '客户支持'][i % 3],
      user: i % 2 === 0 ? '管理员' : 'Alice',
      cost: Math.random() * 5 + 0.5, tokens: Math.floor(Math.random() * 1000) + 100, requests: Math.floor(Math.random() * 10) + 1
    }))
  });
});

// ==================== Models ====================

app.get('/api/models', authenticateToken, async (req, res) => {
  res.json([
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', input_price: 5.00, output_price: 15.00, description: '最强大的多模态模型' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', input_price: 0.15, output_price: 0.60, description: '高性价比的快速模型' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', input_price: 0.50, output_price: 1.50, description: '可靠的通用模型' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', input_price: 15.00, output_price: 75.00, description: '顶级推理能力' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', input_price: 3.00, output_price: 15.00, description: '平衡性能与成本' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', input_price: 0.25, output_price: 1.25, description: '超快响应速度' },
    { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'DeepSeek', input_price: 0.10, output_price: 0.30, description: '中文优化模型' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', input_price: 0.50, output_price: 1.50, description: 'Google 多模态模型' }
  ]);
});

// ==================== Billing ====================

app.get('/api/billing', authenticateToken, async (req, res) => {
  res.json({
    balance: 10000.00, total_spent: 3250.80, this_month: 1250.50, last_month: 980.20,
    transactions: [
      { id: 1, type: 'recharge', amount: 5000.00, date: '2024-03-01', status: 'completed' },
      { id: 2, type: 'usage', amount: -520.30, date: '2024-03-15', status: 'completed', description: '产品开发项目' },
      { id: 3, type: 'usage', amount: -380.20, date: '2024-03-20', status: 'completed', description: '市场营销项目' },
      { id: 4, type: 'recharge', amount: 3000.00, date: '2024-02-01', status: 'completed' },
      { id: 5, type: 'usage', amount: -980.20, date: '2024-02-28', status: 'completed', description: '月度使用' }
    ]
  });
});

app.post('/api/billing/recharge', authenticateToken, async (req, res) => {
  res.json({ order_id: 'ORD' + Date.now(), amount: req.body.amount, status: 'pending', payment_url: 'https://example.com/pay/' + Date.now() });
});

// ==================== Budget ====================

app.get('/api/budget', authenticateToken, async (req, res) => {
  res.json({
    total_budget: 50000.00, used_budget: 12500.00, remaining_budget: 37500.00, usage_percentage: 25,
    alerts_enabled: true, alert_threshold: 80,
    projects: [
      { id: 1, name: '产品开发', budget: 20000, used: 5200, percentage: 26 },
      { id: 2, name: '市场营销', budget: 15000, used: 3800, percentage: 25 },
      { id: 3, name: '客户支持', budget: 10000, used: 2500, percentage: 25 }
    ]
  });
});

app.patch('/api/budget', authenticateToken, async (req, res) => {
  res.json({ total_budget: req.body.total_budget || 50000, alert_threshold: req.body.alert_threshold || 80, updated_at: new Date().toISOString() });
});

// ==================== Routing ====================

app.get('/api/routing', authenticateToken, async (req, res) => {
  res.json({
    enabled: true, strategy: 'cost_optimized', fallback_enabled: true,
    rules: [
      { id: 1, model: 'gpt-4o', priority: 1, condition: 'high_quality', enabled: true },
      { id: 2, model: 'gpt-4o-mini', priority: 2, condition: 'default', enabled: true },
      { id: 3, model: 'claude-3-sonnet', priority: 3, condition: 'fallback', enabled: true }
    ]
  });
});

app.patch('/api/routing', authenticateToken, async (req, res) => {
  res.json({ enabled: req.body.enabled !== undefined ? req.body.enabled : true, strategy: req.body.strategy || 'cost_optimized', updated_at: new Date().toISOString() });
});

// ==================== Settings ====================

app.get('/api/settings', authenticateToken, async (req, res) => {
  res.json({
    organization: { name: 'AnyTokn Demo', timezone: 'Asia/Shanghai', currency: 'CNY' },
    notifications: { email_enabled: true, slack_enabled: false, webhook_enabled: false },
    security: { mfa_enabled: false, ip_whitelist_enabled: false }
  });
});

app.patch('/api/settings', authenticateToken, async (req, res) => {
  res.json({ ...req.body, updated_at: new Date().toISOString() });
});

// ==================== Alerts ====================

app.get('/api/alerts', authenticateToken, async (req, res) => {
  res.json({
    alerts: [
      { id: 1, type: 'budget', title: '预算使用超过 50%', message: '当前预算使用率为 62%', severity: 'warning', created_at: '2024-03-20', read: false },
      { id: 2, type: 'usage', title: 'API 调用量激增', message: '今日 API 调用量较昨日增长 45%', severity: 'info', created_at: '2024-03-19', read: true },
      { id: 3, type: 'system', title: '系统维护通知', message: '系统将于今晚 2:00-4:00 进行维护', severity: 'info', created_at: '2024-03-18', read: true }
    ],
    unread_count: 1
  });
});

app.patch('/api/alerts/:id/read', authenticateToken, async (req, res) => {
  res.json({ id: parseInt(req.params.id), read: true });
});

// ==================== Start ====================

app.listen(PORT, () => {
  console.log('🚀 AnyTokn Server running on port 3001');
  console.log('📍 Demo mode enabled - Use:');
  console.log('   Admin: admin@anytokn.io / admin123');
  console.log('   Member: alice@anytokn.io / member123');
});
