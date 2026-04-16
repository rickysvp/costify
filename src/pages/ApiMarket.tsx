import { useState } from 'react';
import {
  Cpu,
  Search,
  Sparkles,
  Zap,
  Globe,
  Check,
  Info,
  Copy,
  CheckCircle2,
  TrendingUp,
  Layers,
  DollarSign,
  Clock,
  BarChart3,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// ==================== 模型价格数据 ====================

interface ModelPricing {
  id: string;
  name: string;
  provider: string;
  category: 'flagship' | 'advanced' | 'lightweight' | 'economy' | 'reasoning';
  description: string;
  contextWindow: number;
  inputPrice: number;
  outputPrice: number;
  features: string[];
  tags: string[];
  popularity: number;
  latency: 'low' | 'medium' | 'high';
  recommended?: boolean;
}

const modelData: ModelPricing[] = [
  // OpenAI 模型
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    category: 'flagship',
    description: '最强大的多模态模型，支持文本、图像和音频处理',
    contextWindow: 128000,
    inputPrice: 2.5,
    outputPrice: 10.0,
    features: ['多模态', '128K 上下文', '函数调用', 'JSON 模式'],
    tags: ['旗舰', '多模态', '推荐'],
    popularity: 95,
    latency: 'medium',
    recommended: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    category: 'lightweight',
    description: '高性价比的轻量级模型，适合日常任务',
    contextWindow: 128000,
    inputPrice: 0.15,
    outputPrice: 0.6,
    features: ['128K 上下文', '函数调用', '快速响应'],
    tags: ['轻量', '高性价比', '推荐'],
    popularity: 88,
    latency: 'low',
    recommended: true,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    category: 'advanced',
    description: '高级模型，适合复杂推理任务',
    contextWindow: 128000,
    inputPrice: 10.0,
    outputPrice: 30.0,
    features: ['128K 上下文', '知识截止 2023-12', '函数调用'],
    tags: ['高级', '复杂任务'],
    popularity: 75,
    latency: 'medium',
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    category: 'economy',
    description: '经济实惠，适合简单任务和快速响应',
    contextWindow: 16385,
    inputPrice: 0.5,
    outputPrice: 1.5,
    features: ['16K 上下文', '快速响应', '低成本'],
    tags: ['经济', '快速'],
    popularity: 70,
    latency: 'low',
  },
  // Anthropic 模型
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    category: 'flagship',
    description: 'Anthropic 最强大的模型，出色的推理能力',
    contextWindow: 200000,
    inputPrice: 3.0,
    outputPrice: 15.0,
    features: ['200K 上下文', '出色推理', '代码生成', '视觉理解'],
    tags: ['旗舰', '推理', '代码'],
    popularity: 90,
    latency: 'medium',
    recommended: true,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    category: 'advanced',
    description: '深度推理和复杂任务处理',
    contextWindow: 200000,
    inputPrice: 15.0,
    outputPrice: 75.0,
    features: ['200K 上下文', '深度推理', '研究分析'],
    tags: ['高级', '研究'],
    popularity: 65,
    latency: 'high',
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    category: 'lightweight',
    description: '快速响应，适合日常对话',
    contextWindow: 200000,
    inputPrice: 0.25,
    outputPrice: 1.25,
    features: ['200K 上下文', '极速响应', '低成本'],
    tags: ['轻量', '极速'],
    popularity: 72,
    latency: 'low',
  },
  // DeepSeek 模型
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    category: 'economy',
    description: '国产大模型，高性价比',
    contextWindow: 64000,
    inputPrice: 0.14,
    outputPrice: 0.28,
    features: ['64K 上下文', '中文优化', '代码能力'],
    tags: ['经济', '国产', '中文'],
    popularity: 80,
    latency: 'low',
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    provider: 'DeepSeek',
    category: 'reasoning',
    description: '专注于推理和数学问题求解',
    contextWindow: 64000,
    inputPrice: 0.55,
    outputPrice: 2.19,
    features: ['64K 上下文', '数学推理', '逻辑分析'],
    tags: ['推理', '数学'],
    popularity: 68,
    latency: 'medium',
  },
  // Alibaba 模型
  {
    id: 'qwen-max',
    name: 'Qwen Max',
    provider: 'Alibaba',
    category: 'advanced',
    description: '通义千问最强模型',
    contextWindow: 32000,
    inputPrice: 3.0,
    outputPrice: 9.0,
    features: ['32K 上下文', '中文理解', '多语言'],
    tags: ['高级', '中文', '多语言'],
    popularity: 78,
    latency: 'medium',
  },
  {
    id: 'qwen-plus',
    name: 'Qwen Plus',
    provider: 'Alibaba',
    category: 'lightweight',
    description: '平衡的性价比选择',
    contextWindow: 32000,
    inputPrice: 0.8,
    outputPrice: 2.0,
    features: ['32K 上下文', '中文优化', '快速响应'],
    tags: ['轻量', '中文'],
    popularity: 74,
    latency: 'low',
  },
  // Google 模型
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    category: 'flagship',
    description: 'Google 最强多模态模型',
    contextWindow: 1000000,
    inputPrice: 3.5,
    outputPrice: 10.5,
    features: ['1M 上下文', '多模态', '长文档'],
    tags: ['旗舰', '超长上下文', '多模态'],
    popularity: 85,
    latency: 'medium',
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    category: 'lightweight',
    description: '快速高效的多模态模型',
    contextWindow: 1000000,
    inputPrice: 0.35,
    outputPrice: 1.05,
    features: ['1M 上下文', '极速响应', '多模态'],
    tags: ['轻量', '极速', '超长上下文'],
    popularity: 82,
    latency: 'low',
    recommended: true,
  },
];

// ==================== 分类配置 ====================

const categoryConfig = {
  flagship: {
    label: '旗舰模型',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Sparkles,
    description: '最强大的模型，适合复杂任务',
  },
  advanced: {
    label: '高级模型',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: TrendingUp,
    description: '高性能，适合专业场景',
  },
  lightweight: {
    label: '轻量模型',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Zap,
    description: '快速响应，高性价比',
  },
  economy: {
    label: '经济模型',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: DollarSign,
    description: '低成本，适合批量处理',
  },
  reasoning: {
    label: '推理模型',
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    icon: Layers,
    description: '专注推理和数学问题',
  },
};

const providerColors: Record<string, string> = {
  'OpenAI': 'bg-green-50 text-green-700',
  'Anthropic': 'bg-orange-50 text-orange-700',
  'DeepSeek': 'bg-blue-50 text-blue-700',
  'Alibaba': 'bg-red-50 text-red-700',
  'Google': 'bg-indigo-50 text-indigo-700',
};

// ==================== 组件 ====================

export default function ApiMarket() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'popularity' | 'context'>('popularity');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 过滤和排序模型
  const filteredModels = modelData
    .filter((model) => {
      const matchesSearch =
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
      const matchesProvider = selectedProvider === 'all' || model.provider === selectedProvider;
      return matchesSearch && matchesCategory && matchesProvider;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.inputPrice - b.inputPrice;
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'context') return b.contextWindow - a.contextWindow;
      return 0;
    });

  // 复制模型 ID
  const copyModelId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 格式化上下文窗口
  const formatContextWindow = (tokens: number) => {
    if (tokens >= 1000000) return `${tokens / 1000000}M`;
    if (tokens >= 1000) return `${tokens / 1000}K`;
    return tokens.toString();
  };

  // 获取延迟颜色
  const getLatencyColor = (latency: string) => {
    switch (latency) {
      case 'low':
        return 'text-emerald-600';
      case 'medium':
        return 'text-amber-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-surface-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-xl font-bold text-surface-900">{t.layout.apiMarket}</h1>
        <p className="text-sm text-surface-500 mt-1">
          {t.apiMarket?.subtitle || 'Explore all supported AI models, compare prices and performance'}
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-medium text-surface-500">可用模型</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">{modelData.length}</p>
          <p className="text-[11px] text-surface-400 mt-1">持续更新中</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-surface-500">提供商</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">
            {new Set(modelData.map((m) => m.provider)).size}
          </p>
          <p className="text-[11px] text-surface-400 mt-1">全球顶级厂商</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-surface-500">最低价格</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">
            ${Math.min(...modelData.map((m) => m.inputPrice))}
          </p>
          <p className="text-[11px] text-surface-400 mt-1">/ 1M tokens</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-medium text-surface-500">最大上下文</span>
          </div>
          <p className="text-2xl font-bold text-surface-900">1M</p>
          <p className="text-[11px] text-surface-400 mt-1">tokens</p>
        </div>
      </div>

      {/* 分类快速筛选 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-brand-600 text-white'
              : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
          }`}
        >
          全部模型
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* 筛选和搜索 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="搜索模型名称、提供商..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
          >
            <option value="all">全部提供商</option>
            {Array.from(new Set(modelData.map((m) => m.provider))).map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'price' | 'popularity' | 'context')}
            className="px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
          >
            <option value="popularity">按热度</option>
            <option value="price">按价格</option>
            <option value="context">按上下文</option>
          </select>
        </div>
      </div>

      {/* 模型列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredModels.map((model) => {
          const category = categoryConfig[model.category];
          const CategoryIcon = category.icon;

          return (
            <div
              key={model.id}
              className={`card p-5 hover:shadow-md transition-shadow ${
                model.recommended ? 'ring-2 ring-brand-500 ring-offset-2' : ''
              }`}
            >
              {/* 头部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}
                  >
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-surface-900">{model.name}</h3>
                      {model.recommended && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-medium">
                          推荐
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          providerColors[model.provider] || 'bg-surface-100 text-surface-600'
                        }`}
                      >
                        {model.provider}
                      </span>
                      <span className="text-xs text-surface-400">
                        {formatContextWindow(model.contextWindow)} 上下文
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => copyModelId(model.id)}
                  className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
                  title="复制模型 ID"
                >
                  {copiedId === model.id ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-surface-400" />
                  )}
                </button>
              </div>

              {/* 描述 */}
              <p className="text-sm text-surface-600 mb-4">{model.description}</p>

              {/* 价格 */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-surface-50 rounded-lg">
                <div>
                  <p className="text-[10px] text-surface-400 mb-1">输入价格</p>
                  <p className="text-lg font-bold text-surface-900">
                    ${model.inputPrice}
                    <span className="text-xs font-normal text-surface-500">/ 1M tokens</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-surface-400 mb-1">输出价格</p>
                  <p className="text-lg font-bold text-surface-900">
                    ${model.outputPrice}
                    <span className="text-xs font-normal text-surface-500">/ 1M tokens</span>
                  </p>
                </div>
              </div>

              {/* 特性标签 */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {model.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-0.5 rounded-full bg-surface-100 text-surface-600 text-[10px]"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* 底部信息 */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className={`w-3.5 h-3.5 ${getLatencyColor(model.latency)}`} />
                    <span className={`text-xs ${getLatencyColor(model.latency)}`}>
                      {model.latency === 'low' ? '低延迟' : model.latency === 'medium' ? '中延迟' : '高延迟'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-surface-400" />
                    <span className="text-xs text-surface-500">热度 {model.popularity}%</span>
                  </div>
                </div>
                <code className="text-[10px] font-mono text-surface-400 bg-surface-100 px-2 py-0.5 rounded">
                  {model.id}
                </code>
              </div>
            </div>
          );
        })}
      </div>

      {/* 空状态 */}
      {filteredModels.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-surface-400" />
          </div>
          <h3 className="text-lg font-medium text-surface-800 mb-2">未找到匹配的模型</h3>
          <p className="text-sm text-surface-500">请尝试调整搜索条件或筛选选项</p>
        </div>
      )}

      {/* 使用提示 */}
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-surface-800 mb-2">使用提示</h4>
            <ul className="space-y-1.5 text-xs text-surface-600">

              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>输入价格：每百万 tokens 的输入费用；输出价格：每百万 tokens 的生成费用</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>推荐模型经过优化，在性能和成本之间达到最佳平衡</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>长上下文模型适合处理大型文档和复杂对话</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
