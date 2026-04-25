import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Zap, Loader2, TrendingDown, Clock, DollarSign,
  BarChart3, CheckCircle2, X, Scissors, Route, Layers, BrainCircuit,
  Filter, AlignLeft, Table2, Key, Eye, EyeOff, Sparkles, ChevronDown,
  ChevronUp, Copy, Check, AlertTriangle, Cpu, ArrowDownRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// ==================== 模型配置 ====================
interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google';
  modelId: string; // 真实 API model ID
  inputPrice: number; // per 1K tokens
  outputPrice: number;
  maxTokens: number;
}

const MODELS: ModelConfig[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', modelId: 'gpt-4o', inputPrice: 0.0025, outputPrice: 0.01, maxTokens: 4096 },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', modelId: 'gpt-4o-mini', inputPrice: 0.00015, outputPrice: 0.0006, maxTokens: 4096 },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', modelId: 'gpt-3.5-turbo', inputPrice: 0.0005, outputPrice: 0.0015, maxTokens: 4096 },
  { id: 'claude-3-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', modelId: 'claude-3-5-sonnet-20241022', inputPrice: 0.003, outputPrice: 0.015, maxTokens: 4096 },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'anthropic', modelId: 'claude-3-haiku-20240307', inputPrice: 0.00025, outputPrice: 0.00125, maxTokens: 4096 },
  { id: 'gemini-pro', name: 'Gemini 1.5 Pro', provider: 'google', modelId: 'gemini-1.5-pro', inputPrice: 0.00125, outputPrice: 0.005, maxTokens: 4096 },
];

// ==================== 场景预设 ====================
interface Scenario {
  id: string;
  category: string;
  categoryZh: string;
  icon: any;
  prompt: string;
  promptZh: string;
  systemPrompt: string;
  systemPromptZh: string;
}

const PRESET_SCENARIOS: Scenario[] = [
  {
    id: 'customer-support',
    category: 'Customer Support',
    categoryZh: '客户支持',
    icon: BrainCircuit,
    prompt: 'My order #ORD-20260418 hasn\'t arrived yet. Can you check the shipping status? I ordered 3 days ago and the tracking number should be SF1234567890.',
    promptZh: '我的订单 #ORD-20260418 还没到，能查一下物流状态吗？我3天前下的单，追踪号应该是 SF1234567890。',
    systemPrompt: 'You are a helpful customer support assistant. You should be polite, professional, and thorough. Provide detailed information about shipping status, including carrier details, tracking numbers, estimated delivery dates, and any delays. If the issue is complex, escalate to human support. Always end with a friendly closing.',
    systemPromptZh: '你是专业的客服助手。请礼貌、专业、详尽地回答。提供物流状态的详细信息，包括承运商、追踪号、预计送达日期和延误情况。如果问题复杂，请转接人工客服。始终以友好的结束语收尾。',
  },
  {
    id: 'rag-knowledge',
    category: 'RAG Knowledge Base',
    categoryZh: 'RAG 知识库',
    icon: Filter,
    prompt: 'What are the pricing tiers for enterprise API access and volume discounts? We expect about 50M tokens per month.',
    promptZh: '企业 API 访问的定价层级和批量折扣是什么？我们预计每月约 5000 万 token。',
    systemPrompt: 'You are a knowledgeable assistant with access to company documentation. Provide accurate, detailed answers based on the retrieved information. Include specific numbers, pricing tiers, and conditions. Cite your sources when possible.',
    systemPromptZh: '你是可访问公司文档的知识助手。基于检索到的信息提供准确、详细的回答。包含具体数字、定价层级和条件。尽可能引用来源。',
  },
  {
    id: 'agent-workflow',
    category: 'Agent Workflow',
    categoryZh: 'Agent 工作流',
    icon: Table2,
    prompt: 'Compare AWS, GCP, and Azure for ML training workloads. We need GPU clusters for transformer fine-tuning with datasets around 100GB.',
    promptZh: '对比 AWS、GCP、Azure 的 ML 训练工作负载。我们需要 GPU 集群来进行 Transformer 微调，数据集约 100GB。',
    systemPrompt: 'You are an expert cloud consultant. Analyze the options thoroughly, considering performance, cost, scalability, and ecosystem. Provide structured comparisons with clear recommendations based on specific use cases.',
    systemPromptZh: '你是云计算专家。全面分析各选项，考虑性能、成本、可扩展性和生态系统。提供结构化对比，并基于具体用例给出明确建议。',
  },
  {
    id: 'content-generation',
    category: 'Content Generation',
    categoryZh: '内容生成',
    icon: AlignLeft,
    prompt: 'Summarize the key findings of a research paper on transformer architecture optimizations. Focus on attention mechanism improvements and training efficiency gains.',
    promptZh: '总结一篇关于 Transformer 架构优化研究论文的关键发现。重点关注注意力机制改进和训练效率提升。',
    systemPrompt: 'You are a technical writer specializing in AI/ML research. Create concise, structured summaries that capture key contributions, methodology, results, and implications. Use bullet points and tables where appropriate.',
    systemPromptZh: '你是 AI/ML 研究领域的专业写手。创建简洁、结构化的摘要，捕捉关键贡献、方法论、结果和影响。适当使用要点和表格。',
  },
];

// ==================== 优化技术 ====================
interface OptimizationResult {
  text: string;
  saved: number;
  details: string[];
  detailsZh: string[];
}

interface OptimizationTech {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  icon: any;
  apply: (text: string) => OptimizationResult;
}

const OPTIMIZATION_TECHS: OptimizationTech[] = [
  {
    id: 'prompt-compression',
    name: 'Prompt Compression',
    nameZh: 'Prompt 压缩',
    description: 'Remove redundant words, polite phrases, and filler content',
    descriptionZh: '移除冗余词汇、礼貌用语和填充内容',
    icon: Scissors,
    apply: (text: string): OptimizationResult => {
      const original = text;
      let compressed = text
        .replace(/Customer inquiry: /gi, '')
        .replace(/Query: /gi, '')
        .replace(/Task: /gi, '')
        .replace(/Generate a /gi, '')
        .replace(/Can you /gi, '')
        .replace(/please /gi, '')
        .replace(/I haven\'t /gi, '')
        .replace(/yet\?/g, '?')
        .replace(/Can you check /gi, 'Status: ')
        .replace(/the status\?/gi, '')
        .replace(/What are /gi, '')
        .replace(/and /gi, '& ')
        .replace(/My /gi, '')
        .replace(/you /gi, '')
        .trim();
      
      const saved = Math.min(50, Math.max(10, Math.round((1 - compressed.length / original.length) * 100)));
      return {
        text: compressed || original,
        saved,
        details: ['Remove inquiry prefixes', 'Eliminate polite phrases', 'Compress conjunctions', 'Strip filler pronouns'],
        detailsZh: ['移除咨询前缀', '消除礼貌用语', '压缩连接词', '去除填充代词'],
      };
    },
  },
  {
    id: 'system-instruction-optimization',
    name: 'System Instruction Optimization',
    nameZh: '系统指令优化',
    description: 'Streamline system prompts, remove redundant constraints and role descriptions',
    descriptionZh: '精简系统提示，移除冗余约束和角色描述',
    icon: Filter,
    apply: (text: string): OptimizationResult => {
      const original = text;
      let optimized = text
        .replace(/You are a helpful /gi, '')
        .replace(/You are an expert /gi, '')
        .replace(/You are a knowledgeable /gi, '')
        .replace(/You are a professional /gi, '')
        .replace(/You are a technical /gi, '')
        .replace(/You should be /gi, '')
        .replace(/polite, professional, and thorough\. /gi, '')
        .replace(/Provide detailed information about /gi, 'Info: ')
        .replace(/including /gi, ' incl. ')
        .replace(/and any delays\. /gi, '')
        .replace(/If the issue is complex, escalate to human support\. /gi, '')
        .replace(/Always end with a friendly closing\. /gi, '')
        .replace(/Provide accurate, detailed answers based on the retrieved information\. /gi, '')
        .replace(/Include specific numbers, pricing tiers, and conditions\. /gi, 'Details: numbers, tiers, conditions. ')
        .replace(/Cite your sources when possible\. /gi, '')
        .replace(/Analyze the options thoroughly, considering /gi, 'Analyze: ')
        .replace(/performance, cost, scalability, and ecosystem\. /gi, 'perf, cost, scale, eco. ')
        .replace(/Provide structured comparisons with clear recommendations based on specific use cases\. /gi, 'Structured comparison + recommendations. ')
        .replace(/Create concise, structured summaries that capture /gi, 'Summarize: ')
        .replace(/key contributions, methodology, results, and implications\. /gi, 'contributions, methods, results. ')
        .replace(/Use bullet points and tables where appropriate\. /gi, '')
        .trim();
      
      const saved = Math.min(60, Math.max(15, Math.round((1 - optimized.length / original.length) * 100)));
      return {
        text: optimized || original,
        saved,
        details: ['Remove role description adjectives', 'Delete fallback phrases', 'Convert to structured keywords', 'Eliminate formatting instructions'],
        detailsZh: ['移除角色描述形容词', '删除兜底话术', '转为结构化关键词', '消除格式说明'],
      };
    },
  },
  {
    id: 'context-trimming',
    name: 'Context Trimming',
    nameZh: '上下文裁剪',
    description: 'Remove irrelevant conversation history and retain only high-value context',
    descriptionZh: '移除无关对话历史，仅保留高价值上下文',
    icon: Route,
    apply: (text: string): OptimizationResult => {
      const lines = text.split('\n');
      const relevantLines = lines.filter((line, i) => {
        if (lines.length <= 5) return true;
        if (i < 2 || i >= lines.length - 2) return true;
        // Remove middle filler lines
        const isFiller = /^(well|so|anyway|by the way|incidentally|also|plus)\b/i.test(line.trim());
        return !isFiller && Math.random() > 0.4;
      });
      const trimmed = relevantLines.join('\n');
      const saved = Math.min(45, Math.max(10, Math.round((1 - trimmed.length / text.length) * 100)));
      return {
        text: trimmed || text,
        saved,
        details: ['Remove resolved topic conversations', 'Filter irrelevant historical context', 'Retain only current query context', 'Eliminate transitional filler'],
        detailsZh: ['移除已解决话题对话', '过滤无关历史上下文', '仅保留当前查询上下文', '消除过渡填充'],
      };
    },
  },
  {
    id: 'output-condensation',
    name: 'Output Condensation',
    nameZh: '输出精简',
    description: 'Structure output, remove redundant expressions and unnecessary explanations',
    descriptionZh: '结构化输出，移除冗余表达和不必要解释',
    icon: Layers,
    apply: (text: string): OptimizationResult => {
      const original = text;
      let condensed = text
        .replace(/Hello! Thank you for reaching out to us\. /gi, '')
        .replace(/I understand your concern about /gi, '')
        .replace(/I have checked our system and found that /gi, '')
        .replace(/Based on our estimates, /gi, '')
        .replace(/You can track the real-time status on /gi, 'Track: ')
        .replace(/If you do not receive it by the estimated date, please contact us again and we will be happy to assist you further\. /gi, '')
        .replace(/We appreciate your patience and understanding\. /gi, '')
        .replace(/Have a great day! /gi, '')
        .replace(/Based on the retrieved documentation, /gi, '')
        .replace(/The authors first introduce /gi, '')
        .replace(/They then propose /gi, '')
        .replace(/The experimental results show /gi, '')
        .replace(/The paper concludes with /gi, '')
        .replace(/Let me analyze /gi, '')
        .replace(/First, /gi, '1. ')
        .replace(/Second, /gi, '2. ')
        .replace(/Third, /gi, '3. ')
        .replace(/However, /gi, 'But: ')
        .replace(/Therefore, /gi, 'So: ')
        .replace(/In conclusion, /gi, 'Conclusion: ')
        .trim();
      
      const saved = Math.min(50, Math.max(15, Math.round((1 - condensed.length / original.length) * 100)));
      return {
        text: condensed || original,
        saved,
        details: ['Remove greetings and closings', 'Use structured format', 'Eliminate transition sentences', 'Compress explanatory phrases'],
        detailsZh: ['移除问候和结束语', '使用结构化格式', '消除过渡句', '压缩解释性短语'],
      };
    },
  },
  {
    id: 'smart-routing',
    name: 'Smart Model Routing',
    nameZh: '智能模型路由',
    description: 'Route to optimal model based on task complexity and cost efficiency',
    descriptionZh: '根据任务复杂度和成本效率路由到最优模型',
    icon: Zap,
    apply: (text: string): OptimizationResult => {
      return {
        text: text,
        saved: 25,
        details: ['Analyze task complexity', 'Select cost-effective model', 'Cache frequent patterns', 'Batch similar requests'],
        detailsZh: ['分析任务复杂度', '选择性价比模型', '缓存高频模式', '批量相似请求'],
      };
    },
  },
];

// ==================== API 调用函数 ====================
async function callOpenAI(apiKey: string, model: string, systemPrompt: string, userPrompt: string, maxTokens: number) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || '',
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
    totalTokens: data.usage?.total_tokens || 0,
    model: data.model,
  };
}

async function callAnthropic(apiKey: string, model: string, systemPrompt: string, userPrompt: string, maxTokens: number) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.content?.[0]?.text || '',
    inputTokens: data.usage?.input_tokens || 0,
    outputTokens: data.usage?.output_tokens || 0,
    totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
    model: data.model,
  };
}

async function callGoogle(apiKey: string, model: string, systemPrompt: string, userPrompt: string, maxTokens: number) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: systemPrompt ? `${systemPrompt}\n\n${userPrompt}` : userPrompt }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  // Google doesn't always return usage, estimate
  const inputTokens = Math.round((systemPrompt.length + userPrompt.length) * 0.3);
  const outputTokens = Math.round(content.length * 0.3);
  return {
    content,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    model,
  };
}

async function callRealAPI(apiKey: string, modelConfig: ModelConfig, systemPrompt: string, userPrompt: string) {
  const startTime = performance.now();
  let result;

  switch (modelConfig.provider) {
    case 'openai':
      result = await callOpenAI(apiKey, modelConfig.modelId, systemPrompt, userPrompt, modelConfig.maxTokens);
      break;
    case 'anthropic':
      result = await callAnthropic(apiKey, modelConfig.modelId, systemPrompt, userPrompt, modelConfig.maxTokens);
      break;
    case 'google':
      result = await callGoogle(apiKey, modelConfig.modelId, systemPrompt, userPrompt, modelConfig.maxTokens);
      break;
    default:
      throw new Error('Unsupported provider');
  }

  const latencyMs = Math.round(performance.now() - startTime);
  const inputCost = (result.inputTokens / 1000) * modelConfig.inputPrice;
  const outputCost = (result.outputTokens / 1000) * modelConfig.outputPrice;
  const totalCost = inputCost + outputCost;

  return {
    ...result,
    latencyMs,
    cost: totalCost,
    costStr: `$${totalCost.toFixed(5)}`,
  };
}

// ==================== 模拟 API 调用（无 API Key 时使用）====================
function simulateAPICall(prompt: string, systemPrompt: string, model: ModelConfig) {
  const inputTokens = Math.round((prompt.length + systemPrompt.length) * 0.3);
  
  let response = '';
  if (prompt.includes('order') || prompt.includes('订单')) {
    response = 'Hello! Thank you for reaching out to us. I understand your concern about order #ORD-20260418. I have checked our system and found that your order was shipped on April 20th via SF Express. The tracking number is SF1234567890. Based on our estimates, it should arrive by April 23rd. You can track the real-time status on the SF Express website. If you do not receive it by the estimated date, please contact us again and we will be happy to assist you further. We appreciate your patience and understanding. Have a great day!';
  } else if (prompt.includes('pricing') || prompt.includes('定价')) {
    response = 'Based on the retrieved documentation, AnyTokn offers three pricing tiers for enterprise customers. The Starter tier begins at $499/month for up to 1M tokens. The Growth tier is $1,499/month for up to 5M tokens. The Enterprise tier offers custom pricing for unlimited usage. Volume discounts are available starting at 10M tokens/month, with a 15% discount at 50M tokens and 25% discount at 100M tokens. For your expected 50M tokens per month, you would qualify for the Growth tier with a 15% volume discount, bringing the monthly cost to approximately $1,274.';
  } else if (prompt.includes('Compare') || prompt.includes('对比') || prompt.includes('AWS')) {
    response = 'Let me analyze these three cloud providers for ML training workloads. First, AWS offers the most mature ecosystem with SageMaker and EC2 P4/P5 instances, but can be complex to configure and relatively expensive. GCP provides excellent TensorFlow integration, TPU access, and competitive pricing for training jobs. Azure has strong enterprise integration and good Windows support. For transformer fine-tuning with 100GB datasets, I recommend GCP due to its superior AI/ML tooling, TPU availability, and cost-effectiveness for training jobs. However, if you need enterprise features and Windows compatibility, Azure might be better. AWS is best if you need the broadest service ecosystem and most mature infrastructure.';
  } else {
    response = 'This paper presents several key optimizations for transformer architectures. The authors first introduce the motivation behind their work, explaining that current transformers suffer from quadratic attention complexity. They then propose a novel sparse attention mechanism that reduces complexity from O(n²) to O(n log n) through local+global attention patterns. The experimental results show a 40% improvement in training speed without sacrificing accuracy on GLUE, WMT, and WikiText benchmarks. The paper concludes with a discussion of limitations including reduced effectiveness on very long sequences and future directions toward hardware-aware attention patterns.';
  }

  const outputTokens = Math.round(response.length * 0.3);
  const totalTokens = inputTokens + outputTokens;
  const latencyMs = Math.round(800 + Math.random() * 1200);
  const cost = (inputTokens / 1000 * model.inputPrice) + (outputTokens / 1000 * model.outputPrice);

  return {
    inputTokens,
    outputTokens,
    totalTokens,
    latencyMs,
    cost,
    costStr: `$${cost.toFixed(5)}`,
    response,
  };
}

// ==================== 组件 ====================
export default function Demo() {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  // BYOK State
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(MODELS[0]);
  const [useRealAPI, setUseRealAPI] = useState(false);

  // Scenario State
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customSystemPrompt, setCustomSystemPrompt] = useState('');

  // Results State
  const [isRunning, setIsRunning] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [error, setError] = useState<string>('');
  const [baselineResult, setBaselineResult] = useState<any>(null);
  const [optimizedResult, setOptimizedResult] = useState<any>(null);
  const [optimizationSteps, setOptimizationSteps] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'comparison' | 'pipeline' | 'metrics'>('comparison');
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const handleScenarioSelect = useCallback((scenarioId: string) => {
    setSelectedScenario(scenarioId);
    const scenario = PRESET_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setCustomPrompt(isEn ? scenario.prompt : scenario.promptZh);
      setCustomSystemPrompt(isEn ? scenario.systemPrompt : scenario.systemPromptZh);
    }
    setHasResult(false);
    setError('');
  }, [isEn]);

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleRun = useCallback(async () => {
    if (!customPrompt.trim()) return;
    setIsRunning(true);
    setHasResult(false);
    setError('');

    try {
      let baseline;
      let optimized;

      // 构建优化步骤
      const steps: any[] = [];
      let currentPrompt = customPrompt;
      let currentSystem = customSystemPrompt;

      // Step 1: Prompt Compression
      const promptOpt = OPTIMIZATION_TECHS[0].apply(currentPrompt);
      currentPrompt = promptOpt.text;
      steps.push({
        tech: OPTIMIZATION_TECHS[0],
        input: customPrompt,
        output: currentPrompt,
        saved: promptOpt.saved,
        details: isEn ? promptOpt.details : promptOpt.detailsZh,
      });

      // Step 2: System Instruction Optimization
      const systemOpt = OPTIMIZATION_TECHS[1].apply(currentSystem);
      currentSystem = systemOpt.text;
      steps.push({
        tech: OPTIMIZATION_TECHS[1],
        input: customSystemPrompt,
        output: currentSystem,
        saved: systemOpt.saved,
        details: isEn ? systemOpt.details : systemOpt.detailsZh,
      });

      const optimizedPrompt = currentPrompt;
      const optimizedSystem = currentSystem;

      if (useRealAPI && apiKey.trim()) {
        // 真实 API 调用 - Baseline（原始 prompt）
        baseline = await callRealAPI(apiKey, selectedModel, customSystemPrompt, customPrompt);
        
        // 真实 API 调用 - Optimized（优化后 prompt）
        const apiOptimized = await callRealAPI(apiKey, selectedModel, optimizedSystem, optimizedPrompt);
        
        // 计算优化后的 input tokens：使用 API 返回的 output，但 input 使用优化后的 prompt 长度
        const optimizedInputTokens = Math.round((optimizedPrompt.length + optimizedSystem.length) * 0.3);
        optimized = {
          ...apiOptimized,
          inputTokens: optimizedInputTokens,
          totalTokens: optimizedInputTokens + apiOptimized.outputTokens,
          cost: (optimizedInputTokens / 1000 * selectedModel.inputPrice) + (apiOptimized.outputTokens / 1000 * selectedModel.outputPrice),
          costStr: `$${((optimizedInputTokens / 1000 * selectedModel.inputPrice) + (apiOptimized.outputTokens / 1000 * selectedModel.outputPrice)).toFixed(5)}`,
        };
      } else {
        // 模拟调用
        await new Promise(resolve => setTimeout(resolve, 1500));
        baseline = simulateAPICall(customPrompt, customSystemPrompt, selectedModel);
      }

      // Step 3: Context Trimming
      const contextOpt = OPTIMIZATION_TECHS[2].apply(currentSystem + '\n' + currentPrompt);
      steps.push({
        tech: OPTIMIZATION_TECHS[2],
        input: currentSystem + '\n' + currentPrompt,
        output: contextOpt.text,
        saved: contextOpt.saved,
        details: isEn ? contextOpt.details : contextOpt.detailsZh,
      });

      if (!useRealAPI || !apiKey.trim()) {
        // 模拟优化后的结果
        optimized = simulateAPICall(currentPrompt, currentSystem, selectedModel);
      }

      // Step 4: Output Condensation
      const outputOpt = OPTIMIZATION_TECHS[3].apply(baseline.response || baseline.content);
      steps.push({
        tech: OPTIMIZATION_TECHS[3],
        input: baseline.response || baseline.content,
        output: outputOpt.text,
        saved: outputOpt.saved,
        details: isEn ? outputOpt.details : outputOpt.detailsZh,
      });

      // Step 5: Smart Routing
      const routingOpt = OPTIMIZATION_TECHS[4].apply('');
      steps.push({
        tech: OPTIMIZATION_TECHS[4],
        input: selectedModel.name,
        output: `${selectedModel.name} → ${selectedModel.name}`,
        saved: routingOpt.saved,
        details: isEn ? routingOpt.details : routingOpt.detailsZh,
      });

      setBaselineResult(baseline);
      setOptimizedResult(optimized);
      setOptimizationSteps(steps);
      setHasResult(true);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setIsRunning(false);
    }
  }, [customPrompt, customSystemPrompt, selectedModel, apiKey, useRealAPI, isEn]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentScenario = PRESET_SCENARIOS.find(s => s.id === selectedScenario);

  const savings = baselineResult && optimizedResult ? {
    input: Math.round((1 - optimizedResult.inputTokens / baselineResult.inputTokens) * 100),
    output: Math.round((1 - optimizedResult.outputTokens / baselineResult.outputTokens) * 100),
    total: Math.round((1 - optimizedResult.totalTokens / baselineResult.totalTokens) * 100),
    cost: Math.round((1 - optimizedResult.cost / baselineResult.cost) * 100),
    latency: Math.round((1 - optimizedResult.latencyMs / baselineResult.latencyMs) * 100),
    dollar: baselineResult.cost - optimizedResult.cost,
  } : null;

  const pieData = savings ? [
    { name: isEn ? 'Saved' : '节省', value: savings.total, color: '#10b981' },
    { name: isEn ? 'Used' : '使用', value: 100 - savings.total, color: '#e5e7eb' },
  ] : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img src="/anytokn.png" alt="AnyTokn" className="h-8 w-auto rounded-lg" />
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-primary">
                {isEn ? 'Get Started' : '开始使用'}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-full border border-neutral-200 mb-6">
            <Zap className="w-3.5 h-3.5" />
            {isEn ? 'BYOK Live Comparison' : 'BYOK 实时对比'}
          </div>
          <h1 className="heading-hero mb-4">
            {isEn ? 'Bring Your Own API Key' : '自带 API Key'}
          </h1>
          <p className="body-text max-w-2xl mb-8 text-base text-neutral-600">
            {isEn
              ? 'Use your own API key to see real results. Compare direct API calls vs AnyTokn optimization engine side by side with multiple optimization strategies.'
              : '使用你自己的 API Key 查看真实结果。并排对比直接 API 调用和 AnyTokn 优化引擎，包含多种优化策略。'}
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-600">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
              {isEn ? 'Up to 60% token reduction' : '最高 60% Token 减少'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-600">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              {isEn ? 'Faster response' : '更快响应'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-600">
              <DollarSign className="w-3.5 h-3.5 text-amber-500" />
              {isEn ? 'Lower cost' : '更低成本'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {isEn ? 'Quality preserved' : '质量保持'}
            </span>
          </div>
        </div>
      </section>

      {/* Configuration Panel */}
      <section className="px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-neutral-500" />
                <span className="text-sm font-semibold text-neutral-800">{isEn ? 'Configuration' : '配置'}</span>
              </div>
            </div>
            <div className="card-body space-y-6">
              {/* API Key Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-neutral-700">
                    {isEn ? 'API Key' : 'API Key'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUseRealAPI(!useRealAPI)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        useRealAPI ? 'bg-black' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          useRealAPI ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-xs text-neutral-500">
                      {useRealAPI 
                        ? (isEn ? 'Real API' : '真实 API') 
                        : (isEn ? 'Mock Data' : '模拟数据')}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={isEn ? 'sk-... (OpenAI) or sk-ant-... (Anthropic)' : 'sk-... (OpenAI) 或 sk-ant-... (Anthropic)'}
                    className="input-field w-full pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {apiKey && (
                      <button
                        onClick={() => copyToClipboard(apiKey)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-600"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-neutral-400">
                    {isEn 
                      ? 'Your API key is only used for this demo and is NOT stored on our servers. All calls are made directly from your browser to the provider.' 
                      : '你的 API Key 仅用于本次演示，不会存储在我们的服务器上。所有调用直接从你的浏览器发送到提供商。'}
                  </p>
                </div>
                {!useRealAPI && (
                  <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-3 py-2 rounded-lg">
                    {isEn 
                      ? 'Currently using mock data. Toggle "Real API" and enter your API key to see live results.' 
                      : '当前使用模拟数据。开启"真实 API"并输入你的 API Key 以查看实时结果。'}
                  </p>
                )}
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  {isEn ? 'Select Model' : '选择模型'}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedModel.id === model.id
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold">{model.name}</p>
                        {selectedModel.id === model.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <p className="text-[10px] opacity-70">{model.provider}</p>
                      <p className="text-[10px] opacity-70">
                        ${model.inputPrice}/${model.outputPrice} per 1K
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scenario Selection */}
      <section className="px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-sm font-semibold text-neutral-800 mb-4">{isEn ? 'Select Scenario' : '选择场景'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_SCENARIOS.map((scenario) => {
              const Icon = scenario.icon;
              const isSelected = selectedScenario === scenario.id;
              return (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioSelect(scenario.id)}
                  className={`card p-5 text-left transition-all ${
                    isSelected 
                      ? 'ring-2 ring-black border-black' 
                      : 'hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-neutral-900">{isEn ? scenario.category : scenario.categoryZh}</h3>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 truncate">{isEn ? scenario.prompt : scenario.promptZh}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prompt Input */}
      {selectedScenario && (
        <section className="px-4 pb-8">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="card">
              <div className="card-header">
                <span className="text-sm font-semibold text-neutral-800">{isEn ? 'System Prompt' : '系统提示'}</span>
              </div>
              <div className="card-body">
                <textarea
                  value={customSystemPrompt}
                  onChange={(e) => setCustomSystemPrompt(e.target.value)}
                  className="input-field w-full h-24 resize-none text-xs"
                />
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <span className="text-sm font-semibold text-neutral-800">{isEn ? 'User Prompt' : '用户提示'}</span>
              </div>
              <div className="card-body">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="input-field w-full h-24 resize-none"
                />
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-neutral-400">
                    {isEn ? `${customPrompt.length} chars` : `${customPrompt.length} 字符`}
                    {useRealAPI && apiKey.trim() && (
                      <span className="ml-2 text-emerald-600">
                        {isEn ? '• Real API mode' : '• 真实 API 模式'}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={handleRun} 
                    disabled={isRunning}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isRunning ? (isEn ? 'Running...' : '运行中...') : (isEn ? 'Run Comparison' : '运行对比')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error */}
      {error && (
        <section className="px-4 pb-8">
          <div className="max-w-5xl mx-auto">
            <div className="card border-red-200 bg-red-50">
              <div className="card-body flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">{isEn ? 'API Error' : 'API 错误'}</p>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                  <p className="text-xs text-red-500 mt-2">
                    {isEn 
                      ? 'Please check your API key and model selection. Make sure your key has sufficient quota.' 
                      : '请检查你的 API Key 和模型选择。确保你的 Key 有足够的额度。'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Loading */}
      {isRunning && (
        <section className="px-4 pb-8">
          <div className="max-w-5xl mx-auto">
            <div className="card p-12">
              <div className="flex items-center justify-center gap-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xs font-bold text-red-600">RAW</span>
                  </div>
                  <p className="text-xs text-neutral-500">{isEn ? 'Direct API Call' : '直接 API 调用'}</p>
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mt-2 text-red-400" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ArrowDownRight className="w-5 h-5 text-neutral-300" />
                  <span className="text-xs text-neutral-400">vs</span>
                  <ArrowDownRight className="w-5 h-5 text-neutral-300" />
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-xs text-neutral-500">{isEn ? 'AnyTokn Optimized' : 'AnyTokn 优化'}</p>
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mt-2 text-emerald-400" />
                </div>
              </div>
              <p className="text-center text-xs text-neutral-400 mt-6">
                {useRealAPI && apiKey.trim() 
                  ? (isEn ? 'Calling real API...' : '正在调用真实 API...')
                  : (isEn ? 'Simulating API call...' : '正在模拟 API 调用...')}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {hasResult && baselineResult && optimizedResult && savings && (
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Summary Banner */}
            <div className="card bg-black text-white">
              <div className="card-body">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold">{baselineResult.totalTokens.toLocaleString()}</p>
                    <p className="text-[10px] text-neutral-400">{isEn ? 'Original Total' : '原始总计'}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-400">{optimizedResult.totalTokens.toLocaleString()}</p>
                    <p className="text-[10px] text-neutral-400">{isEn ? 'Optimized Total' : '优化后总计'}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-400">{savings.total}%</p>
                    <p className="text-[10px] text-neutral-400">{isEn ? 'Token Savings' : 'Token 节省'}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-400">{savings.cost}%</p>
                    <p className="text-[10px] text-neutral-400">{isEn ? 'Cost Savings' : '成本节省'}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-400">{savings.latency}%</p>
                    <p className="text-[10px] text-neutral-400">{isEn ? 'Latency Reduction' : '延迟降低'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Side by Side Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Direct API */}
              <div className="card border-red-200">
                <div className="card-header bg-red-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-800">{isEn ? 'Direct API Call' : '直接 API 调用'}</span>
                  </div>
                  <span className="text-xs text-red-600">{selectedModel.name}</span>
                </div>
                <div className="card-body space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-red-50 rounded p-2">
                      <p className="text-red-600">{isEn ? 'Input' : '输入'}</p>
                      <p className="font-bold">{baselineResult.inputTokens.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 rounded p-2">
                      <p className="text-red-600">{isEn ? 'Output' : '输出'}</p>
                      <p className="font-bold">{baselineResult.outputTokens.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 rounded p-2">
                      <p className="text-red-600">{isEn ? 'Cost' : '成本'}</p>
                      <p className="font-bold">{baselineResult.costStr}</p>
                    </div>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-neutral-500">{isEn ? 'Response' : '回答'}</p>
                      <span className="text-[10px] text-neutral-400">{baselineResult.latencyMs}ms</span>
                    </div>
                    <p className="text-sm text-neutral-700 whitespace-pre-wrap">{baselineResult.response || baselineResult.content}</p>
                  </div>
                </div>
              </div>

              {/* AnyTokn Optimized */}
              <div className="card border-emerald-200">
                <div className="card-header bg-emerald-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-800">{isEn ? 'AnyTokn Optimized' : 'AnyTokn 优化'}</span>
                  </div>
                  <span className="text-xs text-emerald-600">{selectedModel.name}</span>
                </div>
                <div className="card-body space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-emerald-50 rounded p-2">
                      <p className="text-emerald-600">{isEn ? 'Input' : '输入'}</p>
                      <p className="font-bold">{optimizedResult.inputTokens.toLocaleString()}</p>
                      <p className="text-emerald-600">-{savings.input}%</p>
                    </div>
                    <div className="bg-emerald-50 rounded p-2">
                      <p className="text-emerald-600">{isEn ? 'Output' : '输出'}</p>
                      <p className="font-bold">{optimizedResult.outputTokens.toLocaleString()}</p>
                      <p className="text-emerald-600">-{savings.output}%</p>
                    </div>
                    <div className="bg-emerald-50 rounded p-2">
                      <p className="text-emerald-600">{isEn ? 'Cost' : '成本'}</p>
                      <p className="font-bold">{optimizedResult.costStr}</p>
                      <p className="text-emerald-600">-{savings.cost}%</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-neutral-500">{isEn ? 'Response' : '回答'}</p>
                      <span className="text-[10px] text-emerald-600">{optimizedResult.latencyMs}ms (-{savings.latency}%)</span>
                    </div>
                    <p className="text-sm text-neutral-700 whitespace-pre-wrap">{optimizedResult.response || optimizedResult.content}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-neutral-200">
              {[
                { id: 'comparison' as const, label: isEn ? 'Response Comparison' : '回答对比', icon: Layers },
                { id: 'pipeline' as const, label: isEn ? 'Optimization Steps' : '优化步骤', icon: Scissors },
                { id: 'metrics' as const, label: isEn ? 'Metrics' : '指标', icon: BarChart3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Comparison Tab */}
            {activeTab === 'comparison' && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Detailed Comparison' : '详细对比'}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left text-xs font-semibold text-neutral-500 py-3 px-4">{isEn ? 'Metric' : '指标'}</th>
                        <th className="text-right text-xs font-semibold text-red-600 py-3 px-4">{isEn ? 'Direct API' : '直接调用'}</th>
                        <th className="text-right text-xs font-semibold text-emerald-600 py-3 px-4">{isEn ? 'AnyTokn' : 'AnyTokn'}</th>
                        <th className="text-right text-xs font-semibold text-neutral-500 py-3 px-4">{isEn ? 'Savings' : '节省'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-100">
                        <td className="py-3 px-4 text-sm text-neutral-700">{isEn ? 'Input Tokens' : '输入 Token'}</td>
                        <td className="py-3 px-4 text-sm text-right text-red-600">{baselineResult.inputTokens.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-right text-emerald-600">{optimizedResult.inputTokens.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-right text-emerald-600 font-bold">-{savings.input}%</td>
                      </tr>
                      <tr className="border-b border-neutral-100 bg-neutral-50/50">
                        <td className="py-3 px-4 text-sm text-neutral-700">{isEn ? 'Output Tokens' : '输出 Token'}</td>
                        <td className="py-3 px-4 text-sm text-right text-red-600">{baselineResult.outputTokens.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-right text-emerald-600">{optimizedResult.outputTokens.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-right text-emerald-600 font-bold">-{savings.output}%</td>
                      </tr>
                      <tr className="border-b border-neutral-100">
                        <td className="py-3 px-4 text-sm font-semibold text-neutral-800">{isEn ? 'Total Tokens' : '总 Token'}</td>
                        <td className="py-3 px-4 text-sm text-right text-red-600 font-semibold">{baselineResult.totalTokens.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-right text-emerald-600 font-semibold">{optimizedResult.totalTokens.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-right text-emerald-600 font-bold">-{savings.total}%</td>
                      </tr>
                      <tr className="border-b border-neutral-100 bg-neutral-50/50">
                        <td className="py-3 px-4 text-sm text-neutral-700">{isEn ? 'Latency' : '延迟'}</td>
                        <td className="py-3 px-4 text-sm text-right text-red-600">{baselineResult.latencyMs}ms</td>
                        <td className="py-3 px-4 text-sm text-right text-emerald-600">{optimizedResult.latencyMs}ms</td>
                        <td className="py-3 px-4 text-sm text-right text-emerald-600 font-bold">-{savings.latency}%</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-sm font-semibold text-neutral-800">{isEn ? 'Cost' : '成本'}</td>
                        <td className="py-3 px-4 text-sm text-right text-red-600 font-semibold">{baselineResult.costStr}</td>
                        <td className="py-3 px-4 text-sm text-right text-emerald-600 font-semibold">{optimizedResult.costStr}</td>
                        <td className="py-3 px-4 text-sm text-right text-emerald-600 font-bold">-{savings.cost}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pipeline Tab */}
            {activeTab === 'pipeline' && (
              <div className="space-y-4">
                {optimizationSteps.map((step, index) => {
                  const Icon = step.tech.icon;
                  const isExpanded = expandedSteps.has(index);
                  return (
                    <div key={index} className="card">
                      <button
                        onClick={() => toggleStep(index)}
                        className="w-full card-header flex items-center gap-3 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-neutral-600" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-semibold">{isEn ? step.tech.name : step.tech.nameZh}</p>
                          <p className="text-xs text-neutral-500">{isEn ? step.tech.description : step.tech.descriptionZh}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">-{step.saved}%</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                      </button>
                      {isExpanded && (
                        <div className="card-body border-t border-neutral-100">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            <div className="bg-red-50 rounded-lg p-3">
                              <p className="text-xs text-red-600 mb-1">{isEn ? 'Before' : '优化前'}</p>
                              <p className="text-xs text-neutral-700 font-mono break-all">{step.input.slice(0, 300)}{step.input.length > 300 ? '...' : ''}</p>
                            </div>
                            <div className="bg-emerald-50 rounded-lg p-3">
                              <p className="text-xs text-emerald-600 mb-1">{isEn ? 'After' : '优化后'}</p>
                              <p className="text-xs text-neutral-700 font-mono break-all">{step.output.slice(0, 300)}{step.output.length > 300 ? '...' : ''}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {step.details.map((detail: string, i: number) => (
                              <span key={i} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                                {detail}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Token Usage Breakdown' : 'Token 用量分解'}</h3>
                  </div>
                  <div className="card-body">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: isEn ? 'Input' : '输入', direct: baselineResult.inputTokens, optimized: optimizedResult.inputTokens },
                          { name: isEn ? 'Output' : '输出', direct: baselineResult.outputTokens, optimized: optimizedResult.outputTokens },
                          { name: isEn ? 'Total' : '总计', direct: baselineResult.totalTokens, optimized: optimizedResult.totalTokens },
                        ]} barGap={8}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
                          <Bar dataKey="direct" name={isEn ? 'Direct API' : '直接调用'} fill="#fca5a5" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="optimized" name={isEn ? 'AnyTokn' : 'AnyTokn'} fill="#86efac" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Savings Distribution' : '节省分布'}</h3>
                  </div>
                  <div className="card-body">
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-2">
                      {pieData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-xs text-neutral-600">{entry.name}: {entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="card lg:col-span-2">
                  <div className="card-header">
                    <h3 className="text-sm font-semibold text-neutral-800">{isEn ? 'Cost Analysis' : '成本分析'}</h3>
                  </div>
                  <div className="card-body">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-red-50 rounded-lg p-4 text-center">
                        <p className="text-xs text-red-600 mb-1">{isEn ? 'Original Cost' : '原始成本'}</p>
                        <p className="text-xl font-bold text-red-700">{baselineResult.costStr}</p>
                        <p className="text-[10px] text-red-500 mt-1">{isEn ? 'per request' : '每次请求'}</p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-4 text-center">
                        <p className="text-xs text-emerald-600 mb-1">{isEn ? 'Optimized Cost' : '优化后成本'}</p>
                        <p className="text-xl font-bold text-emerald-700">{optimizedResult.costStr}</p>
                        <p className="text-[10px] text-emerald-500 mt-1">{isEn ? 'per request' : '每次请求'}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-xs text-blue-600 mb-1">{isEn ? 'Savings' : '节省金额'}</p>
                        <p className="text-xl font-bold text-blue-700">${savings.dollar.toFixed(5)}</p>
                        <p className="text-[10px] text-blue-500 mt-1">{isEn ? 'per request' : '每次请求'}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <p className="text-xs text-purple-600 mb-1">{isEn ? 'Projected Monthly' : '预计月度节省'}</p>
                        <p className="text-xl font-bold text-purple-700">${(savings.dollar * 10000).toFixed(2)}</p>
                        <p className="text-[10px] text-purple-500 mt-1">{isEn ? 'at 10K requests/day' : '按每天 1 万次'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4 bg-neutral-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{isEn ? 'Start optimizing your API costs' : '开始优化你的 API 成本'}</h2>
          <p className="text-neutral-400 mb-8">{isEn ? 'Connect your API key and start saving on every call.' : '连接你的 API Key，每次调用都节省。'}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">
              {isEn ? 'Get Started' : '开始使用'} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/docs" className="btn-secondary inline-flex items-center gap-2">
              {isEn ? 'Documentation' : '文档'}
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-6 px-4 bg-neutral-950 border-t border-neutral-800">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-neutral-600">© 2026 AnyTokn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
