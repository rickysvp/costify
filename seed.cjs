const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // 1. Create organization
    console.log('Creating organization...');
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .upsert({
        id: 1,
        name: 'AnyTokn Demo',
        balance: 10000.00,
        total_budget: 50000.00,
        alert_threshold: 80
      }, { onConflict: 'id' })
      .select()
      .single();

    if (orgError) {
      console.error('Organization error:', orgError);
      throw orgError;
    }
    console.log('✅ Organization created:', org.name);

    // 2. Hash passwords
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const memberPasswordHash = await bcrypt.hash('member123', 10);

    // 3. Create admin user
    console.log('Creating admin user...');
    const { data: admin, error: adminError } = await supabase
      .from('users')
      .upsert({
        id: 1,
        email: 'admin@anytokn.io',
        password_hash: adminPasswordHash,
        name: '管理员',
        role: 'org_admin',
        org_id: 1
      }, { onConflict: 'email' })
      .select()
      .single();

    if (adminError) {
      console.error('Admin user error:', adminError);
      throw adminError;
    }
    console.log('✅ Admin user created:', admin.email);

    // 4. Create member user
    console.log('Creating member user...');
    const { data: member, error: memberError } = await supabase
      .from('users')
      .upsert({
        id: 2,
        email: 'alice@anytokn.io',
        password_hash: memberPasswordHash,
        name: 'Alice',
        role: 'member',
        org_id: 1
      }, { onConflict: 'email' })
      .select()
      .single();

    if (memberError) {
      console.error('Member user error:', memberError);
      throw memberError;
    }
    console.log('✅ Member user created:', member.email);

    // 5. Create demo projects
    console.log('Creating demo projects...');
    const projects = [
      { id: 1, name: '产品开发', description: '核心产品功能开发', org_id: 1, budget: 20000 },
      { id: 2, name: '市场营销', description: '市场推广活动', org_id: 1, budget: 15000 },
      { id: 3, name: '客户支持', description: '客服自动化系统', org_id: 1, budget: 10000 }
    ];

    for (const project of projects) {
      const { data: proj, error: projError } = await supabase
        .from('projects')
        .upsert(project, { onConflict: 'id' })
        .select()
        .single();

      if (projError) {
        console.error('Project error:', projError);
        throw projError;
      }
      console.log('✅ Project created:', proj.name);
    }

    // 6. Create demo API keys
    console.log('Creating demo API keys...');
    const apiKeys = [
      {
        id: 1,
        name: 'Production Key',
        key_prefix: 'ak_prod_',
        key_hash: await bcrypt.hash('ak_prod_' + Math.random().toString(36), 10),
        org_id: 1,
        project_id: 1,
        status: 'active'
      },
      {
        id: 2,
        name: 'Test Key',
        key_prefix: 'ak_test_',
        key_hash: await bcrypt.hash('ak_test_' + Math.random().toString(36), 10),
        org_id: 1,
        project_id: 2,
        status: 'active'
      }
    ];

    for (const apiKey of apiKeys) {
      const { data: key, error: keyError } = await supabase
        .from('api_keys')
        .upsert(apiKey, { onConflict: 'id' })
        .select()
        .single();

      if (keyError) {
        console.error('API key error:', keyError);
        throw keyError;
      }
      console.log('✅ API key created:', key.name);
    }

    // 7. Create demo API usage data
    console.log('Creating demo API usage...');
    const models = ['gpt-4o', 'gpt-4o-mini', 'claude-3-sonnet', 'deepseek-chat'];
    const now = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Create 5-10 usage records per day
      const recordsCount = Math.floor(Math.random() * 6) + 5;

      for (let j = 0; j < recordsCount; j++) {
        const model = models[Math.floor(Math.random() * models.length)];
        const projectId = Math.floor(Math.random() * 3) + 1;
        const cost = Math.random() * 5 + 0.5;
        const tokens = Math.floor(Math.random() * 5000) + 500;

        const { error: usageError } = await supabase
          .from('api_usage')
          .insert({
            org_id: 1,
            project_id: projectId,
            user_id: Math.random() > 0.5 ? 1 : 2,
            api_key_id: Math.random() > 0.5 ? 1 : 2,
            model: model,
            prompt_tokens: Math.floor(tokens * 0.7),
            completion_tokens: Math.floor(tokens * 0.3),
            total_tokens: tokens,
            cost_usd: cost,
            status: 'success',
            created_at: date.toISOString()
          });

        if (usageError) {
          console.error('API usage error:', usageError);
          // Don't throw, continue with other records
        }
      }
    }
    console.log('✅ Demo API usage created');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n演示账号:');
    console.log('  管理员: admin@anytokn.io / admin123');
    console.log('  成员:   alice@anytokn.io / member123');

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed
seed();
