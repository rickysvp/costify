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

    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, orgId: user.org_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        orgId: user.org_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get organization
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
  try {
    const { orgId } = req.user;

    // Get total cost (current month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: costData } = await supabase
      .from('api_usage')
      .select('cost_usd')
      .eq('org_id', orgId)
      .gte('created_at', startOfMonth.toISOString());

    const totalCost = costData?.reduce((sum, item) => sum + (item.cost_usd || 0), 0) || 0;

    // Get total requests
    const { data: requestData } = await supabase
      .from('api_usage')
      .select('id')
      .eq('org_id', orgId)
      .gte('created_at', startOfMonth.toISOString());

    const totalRequests = requestData?.length || 0;

    // Get active projects count
    const { data: projectsData } = await supabase
      .from('projects')
      .select('id')
      .eq('org_id', orgId);

    const activeProjects = projectsData?.length || 0;

    // Get active members count
    const { data: membersData } = await supabase
      .from('users')
      .select('id')
      .eq('org_id', orgId);

    const activeMembers = membersData?.length || 0;

    res.json({
      totalCost,
      totalRequests,
      activeProjects,
      activeMembers
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get cost trend (last 30 days)
app.get('/api/dashboard/cost-trend', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.user;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: usageData, error } = await supabase
      .from('api_usage')
      .select('created_at, cost_usd')
      .eq('org_id', orgId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Group by date
    const dailyCosts = {};
    usageData?.forEach(item => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if (!dailyCosts[date]) {
        dailyCosts[date] = 0;
      }
      dailyCosts[date] += item.cost_usd || 0;
    });

    // Fill in missing dates
    const trend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trend.push({
        date: dateStr,
        cost: dailyCosts[dateStr] || 0
      });
    }

    res.json(trend);
  } catch (error) {
    console.error('Cost trend error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get model usage distribution
app.get('/api/dashboard/model-usage', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.user;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: usageData, error } = await supabase
      .from('api_usage')
      .select('model, cost_usd')
      .eq('org_id', orgId)
      .gte('created_at', startOfMonth.toISOString());

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Group by model
    const modelUsage = {};
    usageData?.forEach(item => {
      const model = item.model || 'unknown';
      if (!modelUsage[model]) {
        modelUsage[model] = { cost: 0, requests: 0 };
      }
      modelUsage[model].cost += item.cost_usd || 0;
      modelUsage[model].requests += 1;
    });

    const result = Object.entries(modelUsage).map(([model, data]) => ({
      model,
      cost: data.cost,
      requests: data.requests
    }));

    res.json(result);
  } catch (error) {
    console.error('Model usage error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get project costs
app.get('/api/dashboard/project-costs', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.user;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: usageData, error } = await supabase
      .from('api_usage')
      .select('project_id, cost_usd')
      .eq('org_id', orgId)
      .gte('created_at', startOfMonth.toISOString());

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Group by project
    const projectCosts = {};
    usageData?.forEach(item => {
      const projectId = item.project_id || 'unknown';
      if (!projectCosts[projectId]) {
        projectCosts[projectId] = 0;
      }
      projectCosts[projectId] += item.cost_usd || 0;
    });

    res.json(projectCosts);
  } catch (error) {
    console.error('Project costs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 AnyTokn Server running on port 3001');
});
