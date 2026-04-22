// 内存数据库 - 适用于 Vercel Serverless 和本地开发
// 数据在内存中保持，服务器重启后重置（适合 Demo）

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// 内存数据存储
const memoryDB = {
  users: [],
  projects: [],
  apiKeys: [],
  members: [],
  organizations: [],
  reports: [],
  initialized: false
};

// 初始化演示数据
async function initDemoData() {
  if (memoryDB.initialized) return;

  console.log('Initializing demo data...');

  // 演示用户
  const adminPassword = await bcrypt.hash('admin123', 10);
  const memberPassword = await bcrypt.hash('member123', 10);

  memoryDB.users = [
    { id: 1, email: 'admin@anytokn.io', password: adminPassword, name: 'System Admin', role: 'org_admin', org_id: 1, created_at: new Date().toISOString() },
    { id: 2, email: 'alice@anytokn.io', password: memberPassword, name: 'Alice', role: 'member', org_id: 1, created_at: new Date().toISOString() }
  ];

  // 演示项目
  memoryDB.projects = [
    { id: 1, name: 'Production App', description: 'Core product features and API', monthly_budget: 20000, routing_profile: 'balanced', max_tokens_per_request: 4096, default_model: 'gpt-4o-mini', models: 'gpt-4o-mini,gpt-4o,claude-3-sonnet', status: 'active', org_id: 1, month_spend: 520.30, month_savings: 120.50, budget_percentage: 26, key_count: 2, member_count: 2, created_at: new Date().toISOString() },
    { id: 2, name: 'Marketing Web', description: 'Marketing and landing page analytics', monthly_budget: 15000, routing_profile: 'cost_saver', max_tokens_per_request: 2048, default_model: 'gpt-4o-mini', models: 'gpt-4o-mini,deepseek-chat', status: 'active', org_id: 1, month_spend: 380.20, month_savings: 85.30, budget_percentage: 25, key_count: 1, member_count: 1, created_at: new Date().toISOString() },
    { id: 3, name: 'Customer Support', description: 'Customer support automation bot', monthly_budget: 10000, routing_profile: 'quality', max_tokens_per_request: 8192, default_model: 'gpt-4o', models: 'gpt-4o,claude-3-opus', status: 'active', org_id: 1, month_spend: 250.00, month_savings: 45.20, budget_percentage: 25, key_count: 1, member_count: 2, created_at: new Date().toISOString() }
  ];

  // 演示 API Keys
  memoryDB.apiKeys = [
    { id: 1, name: 'Production Key', key_value: 'csk_prod_1234567890abcdef', key_prefix: 'csk_prod', status: 'active', project_id: 1, type: 'project', user_id: null, monthly_budget: 1000, monthly_spend: 320.50, total_cost: 1250.30, total_tokens: 1500000, total_requests: 8500, budget_usage: 32, description: 'Production environment API key', last_used: new Date().toISOString(), created_at: new Date().toISOString() },
    { id: 2, name: 'Development Key', key_value: 'csk_dev_0987654321fedcba', key_prefix: 'csk_dev', status: 'active', project_id: 1, type: 'project', user_id: null, monthly_budget: 500, monthly_spend: 199.80, total_cost: 450.20, total_tokens: 600000, total_requests: 3200, budget_usage: 40, description: 'Development environment API key', last_used: new Date().toISOString(), created_at: new Date().toISOString() },
    { id: 3, name: 'Marketing Key', key_value: 'csk_mkt_abcdef1234567890', key_prefix: 'csk_mkt', status: 'active', project_id: 2, type: 'project', user_id: null, monthly_budget: 800, monthly_spend: 380.20, total_cost: 890.50, total_tokens: 900000, total_requests: 5600, budget_usage: 48, description: 'Marketing team API key', last_used: new Date().toISOString(), created_at: new Date().toISOString() },
    { id: 4, name: 'Support Bot Key', key_value: 'csk_sup_1234abcd5678efgh', key_prefix: 'csk_sup', status: 'active', project_id: 3, type: 'project', user_id: null, monthly_budget: 600, monthly_spend: 250.00, total_cost: 650.00, total_tokens: 750000, total_requests: 4200, budget_usage: 42, description: 'Customer support bot API key', last_used: new Date().toISOString(), created_at: new Date().toISOString() }
  ];

  // 演示成员
  memoryDB.members = [
    { id: 1, name: '管理员', email: 'admin@anytokn.io', role: 'org_admin', org_id: 1, monthly_spend: 720.50, created_at: new Date().toISOString() },
    { id: 2, name: 'Alice', email: 'alice@anytokn.io', role: 'member', org_id: 1, monthly_spend: 430.00, created_at: new Date().toISOString() }
  ];

  // 项目成员关联
  memoryDB.projectMembers = [
    { id: 1, project_id: 1, user_id: 1, role: 'admin', created_at: new Date().toISOString() },
    { id: 2, project_id: 1, user_id: 2, role: 'member', created_at: new Date().toISOString() },
    { id: 3, project_id: 2, user_id: 1, role: 'admin', created_at: new Date().toISOString() },
    { id: 4, project_id: 3, user_id: 1, role: 'admin', created_at: new Date().toISOString() },
    { id: 5, project_id: 3, user_id: 2, role: 'member', created_at: new Date().toISOString() }
  ];

  // 演示组织
  memoryDB.organizations = [
    { id: 1, name: 'AnyTokn Demo', balance_threshold: 80, created_at: new Date().toISOString() }
  ];

  // 演示报告
  memoryDB.reports = [
    { id: 1, name: '2024-01 Monthly Report', description: 'January usage analysis', type: 'monthly', subtype: 'usage', status: 'ready', content: null, ai_insights: null, data_snapshot: null, user_id: 1, created_at: new Date().toISOString(), generated_at: new Date().toISOString() }
  ];

  memoryDB.initialized = true;
  console.log('Demo data initialized successfully');
}

// 数据库操作
const db = {
  // 用户相关
  async findUserByEmail(email) {
    await initDemoData();
    return memoryDB.users.find(u => u.email === email);
  },

  async findUserById(id) {
    await initDemoData();
    return memoryDB.users.find(u => u.id === parseInt(id));
  },

  // 项目相关
  async getAllProjects(orgId = 1) {
    await initDemoData();
    return memoryDB.projects.filter(p => p.org_id === orgId);
  },

  async findProjectById(id) {
    await initDemoData();
    return memoryDB.projects.find(p => p.id === parseInt(id));
  },

  async createProject(projectData) {
    await initDemoData();
    const newProject = {
      id: Date.now(),
      ...projectData,
      month_spend: 0,
      month_savings: 0,
      budget_percentage: 0,
      key_count: 0,
      member_count: 0,
      created_at: new Date().toISOString()
    };
    memoryDB.projects.push(newProject);
    return newProject;
  },

  async updateProject(id, updateData) {
    await initDemoData();
    const idx = memoryDB.projects.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return null;
    memoryDB.projects[idx] = { ...memoryDB.projects[idx], ...updateData };
    return memoryDB.projects[idx];
  },

  async deleteProject(id) {
    await initDemoData();
    const idx = memoryDB.projects.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return false;
    memoryDB.projects.splice(idx, 1);
    // 同时删除关联的 API Keys
    memoryDB.apiKeys = memoryDB.apiKeys.filter(k => k.project_id !== parseInt(id));
    return true;
  },

  // API Keys 相关
  async getAllApiKeys(projectId) {
    await initDemoData();
    if (projectId) {
      return memoryDB.apiKeys.filter(k => k.project_id === parseInt(projectId));
    }
    return memoryDB.apiKeys;
  },

  async findApiKeyById(id) {
    await initDemoData();
    return memoryDB.apiKeys.find(k => k.id === parseInt(id));
  },

  async findApiKeyByValue(keyValue) {
    await initDemoData();
    return memoryDB.apiKeys.find(k => k.key_value === keyValue);
  },

  async createApiKey(keyData) {
    await initDemoData();
    const newKey = {
      id: Date.now(),
      ...keyData,
      monthly_spend: 0,
      total_cost: 0,
      total_tokens: 0,
      total_requests: 0,
      budget_usage: 0,
      created_at: new Date().toISOString()
    };
    memoryDB.apiKeys.push(newKey);
    // 更新项目的 key_count
    const project = await this.findProjectById(keyData.project_id);
    if (project) {
      project.key_count = memoryDB.apiKeys.filter(k => k.project_id === keyData.project_id).length;
    }
    return newKey;
  },

  async updateApiKey(id, updateData) {
    await initDemoData();
    const idx = memoryDB.apiKeys.findIndex(k => k.id === parseInt(id));
    if (idx === -1) return null;
    memoryDB.apiKeys[idx] = { ...memoryDB.apiKeys[idx], ...updateData };
    return memoryDB.apiKeys[idx];
  },

  async deleteApiKey(id) {
    await initDemoData();
    const idx = memoryDB.apiKeys.findIndex(k => k.id === parseInt(id));
    if (idx === -1) return false;
    const key = memoryDB.apiKeys[idx];
    memoryDB.apiKeys.splice(idx, 1);
    // 更新项目的 key_count
    const project = await this.findProjectById(key.project_id);
    if (project) {
      project.key_count = memoryDB.apiKeys.filter(k => k.project_id === key.project_id).length;
    }
    return true;
  },

  // 成员相关
  async getAllMembers(orgId = 1) {
    await initDemoData();
    return memoryDB.members.filter(m => m.org_id === orgId);
  },

  async findMemberById(id) {
    await initDemoData();
    return memoryDB.members.find(m => m.id === parseInt(id));
  },

  async findMemberByEmail(email) {
    await initDemoData();
    return memoryDB.members.find(m => m.email === email);
  },

  async createMember(memberData) {
    await initDemoData();
    const newMember = {
      id: Date.now(),
      ...memberData,
      monthly_spend: 0,
      created_at: new Date().toISOString()
    };
    memoryDB.members.push(newMember);
    return newMember;
  },

  // 项目成员关联
  async getProjectMembers(projectId) {
    await initDemoData();
    const relations = memoryDB.projectMembers.filter(pm => pm.project_id === parseInt(projectId));
    return relations.map(pm => {
      const member = memoryDB.members.find(m => m.id === pm.user_id);
      return member ? { ...member, project_role: pm.role } : null;
    }).filter(Boolean);
  },

  async addProjectMember(projectId, userId, role = 'member') {
    await initDemoData();
    const exists = memoryDB.projectMembers.find(pm => pm.project_id === parseInt(projectId) && pm.user_id === parseInt(userId));
    if (exists) return exists;
    const newRelation = {
      id: Date.now(),
      project_id: parseInt(projectId),
      user_id: parseInt(userId),
      role,
      created_at: new Date().toISOString()
    };
    memoryDB.projectMembers.push(newRelation);
    // 更新项目的 member_count
    const project = await this.findProjectById(projectId);
    if (project) {
      project.member_count = memoryDB.projectMembers.filter(pm => pm.project_id === parseInt(projectId)).length;
    }
    return newRelation;
  },

  async removeProjectMember(projectId, userId) {
    await initDemoData();
    const idx = memoryDB.projectMembers.findIndex(pm => pm.project_id === parseInt(projectId) && pm.user_id === parseInt(userId));
    if (idx === -1) return false;
    memoryDB.projectMembers.splice(idx, 1);
    // 更新项目的 member_count
    const project = await this.findProjectById(projectId);
    if (project) {
      project.member_count = memoryDB.projectMembers.filter(pm => pm.project_id === parseInt(projectId)).length;
    }
    return true;
  },

  // 组织相关
  async getOrganization(id) {
    await initDemoData();
    return memoryDB.organizations.find(o => o.id === parseInt(id));
  },

  async updateOrganization(id, updateData) {
    await initDemoData();
    const idx = memoryDB.organizations.findIndex(o => o.id === parseInt(id));
    if (idx === -1) return null;
    memoryDB.organizations[idx] = { ...memoryDB.organizations[idx], ...updateData };
    return memoryDB.organizations[idx];
  },

  // 报告相关
  async getAllReports(userId) {
    await initDemoData();
    if (userId) {
      return memoryDB.reports.filter(r => r.user_id === parseInt(userId));
    }
    return memoryDB.reports;
  },

  async findReportById(id) {
    await initDemoData();
    return memoryDB.reports.find(r => r.id === parseInt(id));
  },

  async createReport(reportData) {
    await initDemoData();
    const newReport = {
      id: Date.now(),
      ...reportData,
      status: 'ready',
      created_at: new Date().toISOString(),
      generated_at: new Date().toISOString()
    };
    memoryDB.reports.push(newReport);
    return newReport;
  },

  async deleteReport(id) {
    await initDemoData();
    const idx = memoryDB.reports.findIndex(r => r.id === parseInt(id));
    if (idx === -1) return false;
    memoryDB.reports.splice(idx, 1);
    return true;
  },

  // 统计数据
  async getDashboardStats(orgId = 1) {
    await initDemoData();
    const projects = await this.getAllProjects(orgId);
    const apiKeys = await this.getAllApiKeys();
    const members = await this.getAllMembers(orgId);

    const totalSpend = projects.reduce((sum, p) => sum + (p.month_spend || 0), 0);
    const totalSavings = projects.reduce((sum, p) => sum + (p.month_savings || 0), 0);
    const totalBudget = projects.reduce((sum, p) => sum + (p.monthly_budget || 0), 0);
    const totalRequests = apiKeys.reduce((sum, k) => sum + (k.total_requests || 0), 0);
    const totalTokens = apiKeys.reduce((sum, k) => sum + (k.total_tokens || 0), 0);

    return {
      month_spend: totalSpend,
      month_savings: totalSavings,
      total_budget: totalBudget,
      budget_usage: totalBudget > 0 ? (totalSpend / totalBudget * 100).toFixed(1) : 0,
      total_requests: totalRequests,
      total_tokens: totalTokens,
      active_projects: projects.filter(p => p.status === 'active').length,
      active_keys: apiKeys.filter(k => k.status === 'active').length,
      member_count: members.length
    };
  }
};

module.exports = { db, initDemoData };
