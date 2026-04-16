const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'anytokn-secret-key-2024';

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Demo users (fallback when Supabase is not configured)
const DEMO_USERS = [
  {
    id: 1,
    email: 'admin@anytokn.io',
    password: 'admin123',
    name: '管理员',
    role: 'org_admin',
    org_id: 1
  },
  {
    id: 2,
    email: 'alice@anytokn.io',
    password: 'member123',
    name: 'Alice',
    role: 'member',
    org_id: 1
  }
];

// Middleware
app.use(cors());
app.use(express.json());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Check if user is org admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'org_admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ==================== Authentication Routes ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check demo users first
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demoUser) {
      const token = jwt.sign(
        { userId: demoUser.id, email: demoUser.email, role: demoUser.role, orgId: demoUser.org_id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          orgId: demoUser.org_id
        }
      });
    }

    // Try Supabase
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (!error && user) {
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (validPassword) {
          const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role, orgId: user.org_id },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          return res.json({
            token,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              orgId: user.org_id
            }
          });
        }
      }
    } catch (supabaseError) {
      console.log('Supabase login failed, using demo mode');
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    // Check demo users first
    const demoUser = DEMO_USERS.find(u => u.id === req.user.userId);
    if (demoUser) {
      return res.json({
        user: {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          orgId: demoUser.org_id
        },
        organization: {
          id: 1,
          name: 'AnyTokn Demo',
          balance: 10000.00,
          total_budget: 50000.00
        }
      });
    }

    // Try Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { data: org } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', user.org_id)
      .single();

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        orgId: user.org_id
      },
      organization: org
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== Dashboard Routes ====================

// Get dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  // Return demo data
  res.json({
    totalCost: 1250.50,
    totalRequests: 15420,
    activeProjects: 3,
    activeMembers: 2
  });
});

// Get cost trend (last 30 days)
app.get('/api/dashboard/cost-trend', authenticateToken, async (req, res) => {
  const trend = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trend.push({
      date: date.toISOString().split('T')[0],
      cost: Math.random() * 100 + 20
    });
  }
  res.json(trend);
});

// Get model usage distribution
app.get('/api/dashboard/model-usage', authenticateToken, async (req, res) => {
  res.json([
    { model: 'gpt-4o', cost: 450.20, requests: 1200 },
    { model: 'gpt-4o-mini', cost: 180.50, requests: 3500 },
    { model: 'claude-3-sonnet', cost: 320.80, requests: 800 },
    { model: 'deepseek-chat', cost: 150.00, requests: 2100 }
  ]);
});

// Get project costs
app.get('/api/dashboard/project-costs', authenticateToken, async (req, res) => {
  res.json({
    1: 520.30,
    2: 380.20,
    3: 250.00
  });
});

// ==================== Projects Routes ====================

// Get all projects
app.get('/api/projects', authenticateToken, async (req, res) => {
  res.json([
    { id: 1, name: '产品开发', description: '核心产品功能开发', budget: 20000, org_id: 1 },
    { id: 2, name: '市场营销', description: '市场推广活动', budget: 15000, org_id: 1 },
    { id: 3, name: '客户支持', description: '客服自动化系统', budget: 10000, org_id: 1 }
  ]);
});

// ==================== API Keys Routes ====================

// Get all API keys
app.get('/api/api-keys', authenticateToken, async (req, res) => {
  res.json([
    { id: 1, name: 'Production Key', key_prefix: 'ak_prod_xxxx', status: 'active', project_id: 1 },
    { id: 2, name: 'Test Key', key_prefix: 'ak_test_xxxx', status: 'active', project_id: 2 }
  ]);
});

// ==================== Members Routes ====================

// Get all members
app.get('/api/members', authenticateToken, async (req, res) => {
  res.json([
    { id: 1, name: '管理员', email: 'admin@anytokn.io', role: 'org_admin', org_id: 1 },
    { id: 2, name: 'Alice', email: 'alice@anytokn.io', role: 'member', org_id: 1 }
  ]);
});

// ==================== Alerts Routes ====================

// Get alerts
app.get('/api/alerts', authenticateToken, async (req, res) => {
  res.json({
    alerts: [],
    unread_count: 0
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 AnyTokn Server running on port 3001');
  console.log('📍 Demo mode enabled - Use:');
  console.log('   Admin: admin@anytokn.io / admin123');
  console.log('   Member: alice@anytokn.io / member123');
});
