export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    // Navigation
    nav: {
      features: '功能',
      pricing: '价格',
      docs: '文档',
      login: '登录',
      signup: '免费试用',
    },
    // Hero Section
    hero: {
      badge: 'AI Token 智能管理',
      title: '统一 AI 资源',
      titleHighlight: '管理平台',
      description: '聚合多模型 API，智能路由，成本优化。让 AI 资源管理更简单、更高效。全球增长最快的 AI 公司信赖之选。',
      ctaPrimary: '开始免费试用',
      ctaSecondary: '查看文档',
      stats: {
        companies: '500+ 企业信赖',
        uptime: '99.9% 可用性',
        models: '50+ 模型支持',
      },
    },
    // Features Section
    features: {
      badge: '核心功能',
      title: '全方位的 AI Token 管理能力',
      description: '从成本监控到智能优化，AnyTokn 提供企业级 AI 资源管理解决方案',
      items: [
        {
          title: '统一 API 网关',
          description: '一个接口访问所有主流大模型，自动路由到最优模型，降低 30% 成本',
          icon: 'gateway',
        },
        {
          title: '实时成本监控',
          description: '毫秒级成本追踪，实时了解每个项目、每个用户的 Token 消耗情况',
          icon: 'monitor',
        },
        {
          title: '智能预算管理',
          description: '灵活的预算设置与预警机制，防止意外超支，保障业务稳定运行',
          icon: 'budget',
        },
        {
          title: '语义缓存',
          description: '智能缓存相似请求，减少重复调用，进一步降低 API 成本',
          icon: 'cache',
        },
        {
          title: '多模型支持',
          description: '支持 GPT-4o、Claude、DeepSeek 等 50+ 主流模型，一键切换',
          icon: 'models',
        },
        {
          title: '企业级安全',
          description: '细粒度权限控制、审计日志、数据加密，满足企业合规要求',
          icon: 'security',
        },
      ],
    },
    // Social Proof
    socialProof: {
      title: '深受全球 AI 公司信赖',
      description: '从初创企业到财富 500 强，团队选择 AnyTokn 管理他们的 AI 资源',
    },
    // Pricing
    pricing: {
      badge: '价格方案',
      title: '选择适合您的方案',
      description: '无论您是个人开发者还是大型企业，我们都有适合您的方案',
      toggle: {
        monthly: '月付',
        yearly: '年付',
        save: '省 20%',
      },
      plans: [
        {
          name: '免费版',
          price: '¥0',
          period: '/月',
          description: '适合个人开发者探索',
          features: [
            '每月 10,000 次 API 调用',
            '基础成本监控',
            '3 个项目',
            '社区支持',
          ],
          cta: '开始免费使用',
        },
        {
          name: '专业版',
          price: '¥999',
          period: '/月',
          description: '适合成长中的团队',
          features: [
            '每月 500,000 次 API 调用',
            '高级分析与报表',
            '20 个项目',
            '预算警报',
            '优先支持',
          ],
          cta: '立即开始',
          popular: true,
        },
        {
          name: '企业版',
          price: '定制',
          description: '适合大型组织',
          features: [
            '无限 API 调用',
            '企业级功能',
            '无限项目',
            '专属客户经理',
            'SLA 保障',
          ],
          cta: '联系销售',
        },
      ],
    },
    // CTA
    cta: {
      title: '准备好优化您的 AI 成本了吗？',
      description: '加入 500+ 企业，使用 AnyTokn 智能管理 AI 资源',
      primary: '免费开始',
      secondary: '预约演示',
    },
    // Footer
    footer: {
      product: '产品',
      resources: '资源',
      company: '公司',
      legal: '法律',
      copyright: '© 2024 AnyTokn. 保留所有权利。',
    },
  },
  en: {
    // Navigation
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      docs: 'Docs',
      login: 'Login',
      signup: 'Start Free',
    },
    // Hero Section
    hero: {
      badge: 'AI Token Management',
      title: 'Unified AI Resource',
      titleHighlight: 'Management',
      description: 'Aggregate multi-model APIs, intelligent routing, cost optimization. Make AI resource management simpler and more efficient. Trusted by the fastest-growing AI companies worldwide.',
      ctaPrimary: 'Start Free Trial',
      ctaSecondary: 'View Docs',
      stats: {
        companies: '500+ Companies',
        uptime: '99.9% Uptime',
        models: '50+ Models',
      },
    },
    // Features Section
    features: {
      badge: 'Core Features',
      title: 'Comprehensive AI Token Management',
      description: 'From cost monitoring to intelligent optimization, AnyTokn provides enterprise-grade AI resource management solutions',
      items: [
        {
          title: 'Unified API Gateway',
          description: 'Access all major models through one interface, automatically route to optimal models, reduce costs by 30%',
          icon: 'gateway',
        },
        {
          title: 'Real-time Cost Monitoring',
          description: 'Millisecond-level cost tracking, understand Token consumption for each project and user in real-time',
          icon: 'monitor',
        },
        {
          title: 'Smart Budget Management',
          description: 'Flexible budget settings with early warning mechanisms to prevent unexpected overruns',
          icon: 'budget',
        },
        {
          title: 'Semantic Caching',
          description: 'Intelligently cache similar requests to reduce duplicate calls and further lower API costs',
          icon: 'cache',
        },
        {
          title: 'Multi-Model Support',
          description: 'Support 50+ mainstream models including GPT-4o, Claude, DeepSeek, switch with one click',
          icon: 'models',
        },
        {
          title: 'Enterprise Security',
          description: 'Granular access control, audit logs, data encryption to meet enterprise compliance requirements',
          icon: 'security',
        },
      ],
    },
    // Social Proof
    socialProof: {
      title: 'Trusted by AI Companies Worldwide',
      description: 'From startups to Fortune 500, teams choose AnyTokn to manage their AI resources',
    },
    // Pricing
    pricing: {
      badge: 'Pricing',
      title: 'Choose Your Plan',
      description: 'Whether you are an individual developer or a large enterprise, we have a plan for you',
      toggle: {
        monthly: 'Monthly',
        yearly: 'Yearly',
        save: 'Save 20%',
      },
      plans: [
        {
          name: 'Free',
          price: '$0',
          period: '/mo',
          description: 'For individual developers exploring',
          features: [
            '10,000 API calls per month',
            'Basic cost monitoring',
            '3 projects',
            'Community support',
          ],
          cta: 'Start Free',
        },
        {
          name: 'Pro',
          price: '$149',
          period: '/mo',
          description: 'For growing teams',
          features: [
            '500,000 API calls per month',
            'Advanced analytics & reports',
            '20 projects',
            'Budget alerts',
            'Priority support',
          ],
          cta: 'Get Started',
          popular: true,
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          description: 'For large organizations',
          features: [
            'Unlimited API calls',
            'Enterprise features',
            'Unlimited projects',
            'Dedicated account manager',
            'SLA guarantee',
          ],
          cta: 'Contact Sales',
        },
      ],
    },
    // CTA
    cta: {
      title: 'Ready to Optimize Your AI Costs?',
      description: 'Join 500+ companies using AnyTokn to intelligently manage AI resources',
      primary: 'Start Free',
      secondary: 'Book Demo',
    },
    // Footer
    footer: {
      product: 'Product',
      resources: 'Resources',
      company: 'Company',
      legal: 'Legal',
      copyright: '© 2024 AnyTokn. All rights reserved.',
    },
  },
};

export function getTranslation(lang: Language) {
  return translations[lang];
}
