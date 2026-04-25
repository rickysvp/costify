export interface DemoScenario {
  id: string;
  label: string;
  labelEn: string;
  baseline: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    latencyMs: number;
    estimatedCost: string;
    answer: string;
    answerEn: string;
  };
  optimized: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    latencyMs: number;
    estimatedCost: string;
    answer: string;
    answerEn: string;
  };
  engineBreakdown: {
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    impactLabel: string;
    impactLabelEn: string;
  }[];
  qualityStatus: string;
  qualityStatusEn: string;
  savings: {
    inputPct: number;
    outputPct: number;
    totalPct: number;
    costPct: number;
    latencyPct: number;
  };
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'customer-support',
    label: '客服支持',
    labelEn: 'Customer Support',
    baseline: {
      inputTokens: 1847,
      outputTokens: 423,
      totalTokens: 2270,
      latencyMs: 2340,
      estimatedCost: '$0.0341',
      answer: '您好，感谢您联系我们。关于您提到的订单问题，我已经查询了您的订单记录。您的订单 #ORD-20260418 已于4月20日发货，预计4月23日送达。物流单号为 SF1234567890，您可以通过顺丰官网查询实时物流信息。如果超过预计送达时间仍未收到，请再次联系我们，我们会帮您跟进处理。',
      answerEn: 'Hello, thank you for contacting us. Regarding your order issue, I have checked your order records. Your order #ORD-20260418 was shipped on April 20 and is expected to arrive on April 23. The tracking number is SF1234567890. You can check real-time logistics on the SF Express website. If you still haven\'t received it after the estimated delivery time, please contact us again and we will follow up for you.',
    },
    optimized: {
      inputTokens: 1214,
      outputTokens: 298,
      totalTokens: 1512,
      latencyMs: 1680,
      estimatedCost: '$0.0227',
      answer: '您好！订单 #ORD-20260418 已于4月20日发货，预计4月23日送达。物流单号：SF1234567890，可在顺丰官网查询。超期未收件请再联系我们跟进。',
      answerEn: 'Hi! Order #ORD-20260418 shipped Apr 20, expected Apr 23. Tracking: SF1234567890 (SF Express). Contact us if not received by then.',
    },
    engineBreakdown: [
      {
        title: 'Prompt 压缩',
        titleEn: 'Prompt Compression',
        description: '移除重复的系统指令和冗余上下文描述',
        descriptionEn: 'Removes repetitive instruction overhead',
        impactLabel: '输入减少 34%',
        impactLabelEn: '34% fewer input tokens',
      },
      {
        title: '上下文裁剪',
        titleEn: 'Context Trimming',
        description: '保留高价值上下文，移除无关历史对话',
        descriptionEn: 'Keeps only high-value context',
        impactLabel: '上下文精简 28%',
        impactLabelEn: '28% context reduction',
      },
      {
        title: '输出约束',
        titleEn: 'Output Constraint',
        description: '控制输出长度，避免冗余的客套和重复信息',
        descriptionEn: 'Reduces unnecessary completion length',
        impactLabel: '输出减少 30%',
        impactLabelEn: '30% fewer output tokens',
      },
      {
        title: '智能路由',
        titleEn: 'Smart Routing',
        description: '缓存常见问题模板，跳过重复处理',
        descriptionEn: 'Avoids waste on repeated patterns',
        impactLabel: '延迟降低 28%',
        impactLabelEn: '28% lower latency',
      },
    ],
    qualityStatus: '质量保持',
    qualityStatusEn: 'Quality Preserved',
    savings: {
      inputPct: 34,
      outputPct: 30,
      totalPct: 33,
      costPct: 33,
      latencyPct: 28,
    },
  },
  {
    id: 'rag-qa',
    label: 'RAG 问答',
    labelEn: 'RAG Q&A',
    baseline: {
      inputTokens: 3421,
      outputTokens: 567,
      totalTokens: 3988,
      latencyMs: 3120,
      estimatedCost: '$0.0598',
      answer: '根据检索到的文档内容，AnyTokn 的计费方式采用按量计费模式。具体来说，系统会根据您实际使用的 token 数量进行计费，包括输入 token 和输出 token。输入 token 的价格为每 1K token $0.0015，输出 token 的价格为每 1K token $0.002。此外，系统还提供预算管理功能，您可以为每个项目设置月度预算上限，当使用量接近预算时会自动提醒。详细的价格信息请参考我们的定价页面。',
      answerEn: 'Based on the retrieved documents, AnyTokn uses a pay-as-you-go billing model. Specifically, the system charges based on the actual number of tokens used, including input and output tokens. Input tokens are priced at $0.0015 per 1K tokens, and output tokens at $0.002 per 1K tokens. Additionally, the system provides budget management features where you can set monthly budget limits for each project, with automatic alerts when usage approaches the budget. For detailed pricing, please refer to our pricing page.',
    },
    optimized: {
      inputTokens: 1892,
      outputTokens: 389,
      totalTokens: 2281,
      latencyMs: 2140,
      estimatedCost: '$0.0342',
      answer: 'AnyTokn 按量计费：输入 $0.0015/1K token，输出 $0.002/1K token。支持项目级月度预算上限和自动提醒。',
      answerEn: 'AnyTokn pay-as-you-go: Input $0.0015/1K token, Output $0.002/1K token. Supports project-level monthly budgets with auto-alerts.',
    },
    engineBreakdown: [
      {
        title: 'Prompt 压缩',
        titleEn: 'Prompt Compression',
        description: '压缩检索结果中的重复段落和低相关度内容',
        descriptionEn: 'Compresses duplicate passages and low-relevance content',
        impactLabel: '输入减少 45%',
        impactLabelEn: '45% fewer input tokens',
      },
      {
        title: '上下文裁剪',
        titleEn: 'Context Trimming',
        description: '对检索结果排序，仅保留 top-k 高相关片段',
        descriptionEn: 'Ranks and keeps only top-k relevant passages',
        impactLabel: '检索精简 52%',
        impactLabelEn: '52% context reduction',
      },
      {
        title: '输出约束',
        titleEn: 'Output Constraint',
        description: '避免重复引用原文，直接给出精炼答案',
        descriptionEn: 'Avoids redundant quotes, delivers concise answers',
        impactLabel: '输出减少 31%',
        impactLabelEn: '31% fewer output tokens',
      },
      {
        title: '智能路由',
        titleEn: 'Smart Routing',
        description: '缓存高频查询的检索结果，减少重复检索',
        descriptionEn: 'Caches frequent query results to reduce re-retrieval',
        impactLabel: '延迟降低 31%',
        impactLabelEn: '31% lower latency',
      },
    ],
    qualityStatus: '质量保持',
    qualityStatusEn: 'Quality Preserved',
    savings: {
      inputPct: 45,
      outputPct: 31,
      totalPct: 43,
      costPct: 43,
      latencyPct: 31,
    },
  },
  {
    id: 'multi-turn',
    label: '多轮对话',
    labelEn: 'Multi-turn Assistant',
    baseline: {
      inputTokens: 4218,
      outputTokens: 612,
      totalTokens: 4830,
      latencyMs: 3560,
      estimatedCost: '$0.0725',
      answer: '好的，我来帮您分析一下这三个方案的对比。首先是方案A，它的优势在于部署简单，维护成本低，但是扩展性有限。方案B的优势是扩展性好，支持高并发，但是初期投入较高，技术复杂度也更高。方案C则是一个折中方案，兼顾了部署便利性和扩展性，但在极端高并发场景下可能不如方案B。综合考虑，如果您的业务规模在中等水平，我建议选择方案C；如果预期会有快速增长，方案B更合适；如果只是小规模使用，方案A就够了。',
      answerEn: 'Sure, let me analyze these three options. Option A has the advantage of simple deployment and low maintenance cost, but limited scalability. Option B offers good scalability and high concurrency support, but requires higher initial investment and greater technical complexity. Option C is a compromise, balancing deployment ease and scalability, though it may not match Option B under extreme high concurrency. Overall, for medium-scale business, I recommend Option C; for expected rapid growth, Option B is better; for small-scale use, Option A suffices.',
    },
    optimized: {
      inputTokens: 2654,
      outputTokens: 418,
      totalTokens: 3072,
      latencyMs: 2480,
      estimatedCost: '$0.0461',
      answer: '三方案对比：A 部署简单、成本低，但扩展有限；B 扩展好、支持高并发，但投入高、复杂度高；C 折中兼顾。建议：中等规模选 C，快速增长选 B，小规模选 A。',
      answerEn: 'Comparison: A - simple/low-cost but limited scale; B - scalable/high-concurrency but expensive/complex; C - balanced. Recommendation: medium scale → C, rapid growth → B, small scale → A.',
    },
    engineBreakdown: [
      {
        title: 'Prompt 压缩',
        titleEn: 'Prompt Compression',
        description: '压缩多轮对话历史，移除已解决的上下文',
        descriptionEn: 'Compresses conversation history, removes resolved context',
        impactLabel: '输入减少 37%',
        impactLabelEn: '37% fewer input tokens',
      },
      {
        title: '上下文裁剪',
        titleEn: 'Context Trimming',
        description: '保留当前轮次相关上下文，裁剪早期无关对话',
        descriptionEn: 'Keeps current-turn context, trims early irrelevant turns',
        impactLabel: '历史精简 41%',
        impactLabelEn: '41% history reduction',
      },
      {
        title: '输出约束',
        titleEn: 'Output Constraint',
        description: '结构化输出，避免重复分析和冗余过渡句',
        descriptionEn: 'Structured output, avoids redundant analysis and filler',
        impactLabel: '输出减少 32%',
        impactLabelEn: '32% fewer output tokens',
      },
      {
        title: '智能路由',
        titleEn: 'Smart Routing',
        description: '识别相似对话模式，复用已有分析框架',
        descriptionEn: 'Identifies similar patterns, reuses existing analysis',
        impactLabel: '延迟降低 30%',
        impactLabelEn: '30% lower latency',
      },
    ],
    qualityStatus: '略短但完整',
    qualityStatusEn: 'Slightly Shorter',
    savings: {
      inputPct: 37,
      outputPct: 32,
      totalPct: 36,
      costPct: 36,
      latencyPct: 30,
    },
  },
  {
    id: 'summarization',
    label: '长文摘要',
    labelEn: 'Long-form Summarization',
    baseline: {
      inputTokens: 5234,
      outputTokens: 1247,
      totalTokens: 6481,
      latencyMs: 4280,
      estimatedCost: '$0.0972',
      answer: '本文主要讨论了人工智能在企业成本管理中的应用。文章首先介绍了传统成本管理面临的挑战，包括数据分散、实时性不足和预测能力有限等问题。随后，文章详细分析了 AI 技术如何通过自动化数据采集、实时监控和智能预测来改善这些问题。特别是在 API 成本管理领域，AI 可以通过 token 优化、智能路由和预算预警等机制，帮助企业将 API 调用成本降低 30-50%。文章还介绍了几个实际案例，展示了不同规模企业如何通过 AI 驱动的成本管理实现显著的成本节约。最后，文章展望了未来 AI 在成本管理领域的发展趋势，包括更精细的优化策略和更智能的自动化决策。',
      answerEn: 'This article discusses the application of AI in enterprise cost management. It first introduces challenges in traditional cost management, including scattered data, insufficient real-time capabilities, and limited predictive power. It then analyzes how AI improves these issues through automated data collection, real-time monitoring, and intelligent prediction. Particularly in API cost management, AI can reduce API call costs by 30-50% through token optimization, smart routing, and budget alerts. The article also presents case studies showing how companies of different sizes achieve significant savings through AI-driven cost management. Finally, it outlines future trends including more refined optimization strategies and smarter automated decision-making.',
    },
    optimized: {
      inputTokens: 3891,
      outputTokens: 684,
      totalTokens: 4575,
      latencyMs: 3120,
      estimatedCost: '$0.0686',
      answer: '本文探讨 AI 在企业成本管理中的应用：1）传统成本管理面临数据分散、实时性不足、预测能力有限等挑战；2）AI 通过自动数据采集、实时监控、智能预测改善这些问题；3）在 API 成本管理领域，token 优化、智能路由、预算预警可降低 30-50% 调用成本；4）实际案例验证了不同规模企业的成本节约效果；5）未来趋势是更精细的优化策略和更智能的自动化决策。',
      answerEn: 'This article explores AI in enterprise cost management: 1) Traditional challenges: scattered data, poor real-time, limited prediction; 2) AI solutions: automated collection, real-time monitoring, intelligent prediction; 3) API cost management: token optimization, smart routing, budget alerts reduce costs 30-50%; 4) Case studies validate savings across company sizes; 5) Future: refined optimization and smarter automation.',
    },
    engineBreakdown: [
      {
        title: 'Prompt 压缩',
        titleEn: 'Prompt Compression',
        description: '压缩长文档中的冗余段落和重复论述',
        descriptionEn: 'Compresses redundant passages and repeated arguments',
        impactLabel: '输入减少 26%',
        impactLabelEn: '26% fewer input tokens',
      },
      {
        title: '上下文裁剪',
        titleEn: 'Context Trimming',
        description: '识别核心论点，移除支撑性细节和过渡内容',
        descriptionEn: 'Identifies core arguments, removes supporting details',
        impactLabel: '文档精简 31%',
        impactLabelEn: '31% document reduction',
      },
      {
        title: '输出约束',
        titleEn: 'Output Constraint',
        description: '结构化摘要输出，避免逐段复述原文',
        descriptionEn: 'Structured summary, avoids paragraph-by-paragraph restating',
        impactLabel: '输出减少 45%',
        impactLabelEn: '45% fewer output tokens',
      },
      {
        title: '智能路由',
        titleEn: 'Smart Routing',
        description: '识别摘要任务模式，选择最优生成策略',
        descriptionEn: 'Identifies summarization pattern, selects optimal strategy',
        impactLabel: '延迟降低 27%',
        impactLabelEn: '27% lower latency',
      },
    ],
    qualityStatus: '略短但完整',
    qualityStatusEn: 'Slightly Shorter',
    savings: {
      inputPct: 26,
      outputPct: 45,
      totalPct: 29,
      costPct: 29,
      latencyPct: 27,
    },
  },
];
