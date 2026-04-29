import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  BookOpen,
  Terminal,
  Globe,
  Cpu,
  Zap,
  Code2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const DISPLAY_API_BASE = 'https://api.anytokn.com';

// Code Block Component with syntax highlighting
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Highlight key information: base_url and api_key values
  const renderHighlightedCode = () => {
    // Split by lines to process each line
    const lines = code.split('\n');
    
    return lines.map((line, lineIndex) => {
      
      // Match base_url patterns
      if (line.includes('base_url') || line.includes('baseURL') || line.includes('Base URL')) {
        const urlMatch = line.match(/(https:\/\/api\.anytokn\.com\/v1)/);
        if (urlMatch) {
          const parts = line.split(urlMatch[1]);
          return (
            <span key={lineIndex}>
              {parts[0]}
              <span className="text-emerald-400 font-bold bg-emerald-400/10 px-1 rounded">{urlMatch[1]}</span>
              {parts[1]}
            </span>
          );
        }
      }
      
      // Match api_key patterns
      if (line.includes('api_key') || line.includes('apiKey') || line.includes('API Key') || line.includes('Authorization')) {
        const keyMatch = line.match(/(sk-anytokn-[a-zA-Z0-9-]+|sk-your-api-key)/);
        if (keyMatch) {
          const parts = line.split(keyMatch[1]);
          return (
            <span key={lineIndex}>
              {parts[0]}
              <span className="text-amber-400 font-bold bg-amber-400/10 px-1 rounded">{keyMatch[1]}</span>
              {parts[1]}
            </span>
          );
        }
      }
      
      return <span key={lineIndex}>{line}</span>;
    }).reduce((acc: React.ReactNode[], curr, index, arr) => {
      acc.push(curr);
      if (index < arr.length - 1) {
        acc.push(<br key={`br-${index}`} />);
      }
      return acc;
    }, []);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 rounded-t-lg border-b border-slate-700">
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{language}</span>
        <button
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-slate-900 rounded-b-lg p-4 overflow-x-auto">
        <code className="text-xs leading-relaxed text-slate-200 font-mono">
          {renderHighlightedCode()}
        </code>
      </pre>
    </div>
  );
}

// Tool Card Component
function ToolCard({ 
  icon: Icon, 
  name, 
  description, 
  color,
  children 
}: { 
  icon: React.ElementType;
  name: string;
  description: string;
  color: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  const colorClasses: Record<string, { bg: string; icon: string }> = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
    rose: { bg: 'bg-rose-50', icon: 'text-rose-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600' },
    cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600' },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-900 text-lg">{name}</h3>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-slate-100"
        >
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function Docs() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isEn = lang === 'en';

  const [apiKeyValue] = useState(() => 
    localStorage.getItem('anytokn_api_key_value') || 'sk-your-api-key'
  );

  // Tool configurations
  const tools = [
    {
      id: 'openclaw',
      icon: Zap,
      name: 'OpenClaw',
      description: isEn ? 'AI IDE plugin for VS Code / Cursor' : 'VS Code / Cursor 的 AI IDE 插件',
      color: 'blue',
      config: `# OpenClaw Config
base_url: ${DISPLAY_API_BASE}/v1
api_key: ${apiKeyValue}
model: gpt-4o`,
      steps: isEn 
        ? ['Install OpenClaw extension', 'Open settings (Cmd/Ctrl + ,)', 'Search "OpenClaw"', 'Paste base_url and api_key']
        : ['安装 OpenClaw 插件', '打开设置 (Cmd/Ctrl + ,)', '搜索 "OpenClaw"', '粘贴 base_url 和 api_key'],
    },
    {
      id: 'hermes',
      icon: Cpu,
      name: 'Hermes',
      description: isEn ? 'Workflow automation tool' : '工作流自动化工具',
      color: 'purple',
      config: `# Hermes LLM Node Configuration
Provider: OpenAI Compatible
Base URL: ${DISPLAY_API_BASE}/v1
API Key: ${apiKeyValue}
Model: gpt-4o
Temperature: 0.7`,
      steps: isEn
        ? ['Add LLM Node to workflow', 'Select "OpenAI Compatible" provider', 'Enter Base URL and API Key', 'Select model and test']
        : ['添加 LLM 节点到工作流', '选择 "OpenAI Compatible" 提供商', '输入 Base URL 和 API Key', '选择模型并测试'],
    },
    {
      id: 'claude-code',
      icon: Terminal,
      name: 'Claude Code',
      description: isEn ? 'Anthropic\'s CLI coding assistant' : 'Anthropic 的 CLI 编程助手',
      color: 'amber',
      config: `# Set environment variables
export ANTHROPIC_BASE_URL=${DISPLAY_API_BASE}/v1
export ANTHROPIC_API_KEY=${apiKeyValue}

# Or create config file
claude config set apiBaseUrl ${DISPLAY_API_BASE}/v1`,
      steps: isEn
        ? ['Run `claude config` command', 'Set apiBaseUrl to AnyTokn endpoint', 'Set apiKey to your key', 'Start using `claude` command']
        : ['运行 `claude config` 命令', '设置 apiBaseUrl 为 AnyTokn 地址', '设置 apiKey 为你的密钥', '开始使用 `claude` 命令'],
    },
    {
      id: 'codex',
      icon: Code2,
      name: 'OpenAI Codex',
      description: isEn ? 'OpenAI\'s CLI coding tool' : 'OpenAI 的 CLI 编程工具',
      color: 'emerald',
      config: `# Configure Codex to use AnyTokn
export OPENAI_BASE_URL=${DISPLAY_API_BASE}/v1
export OPENAI_API_KEY=${apiKeyValue}

# Or use --base-url flag
codex --base-url ${DISPLAY_API_BASE}/v1`,
      steps: isEn
        ? ['Set OPENAI_BASE_URL environment variable', 'Set OPENAI_API_KEY to your AnyTokn key', 'Run `codex` command', 'Or use --base-url flag per command']
        : ['设置 OPENAI_BASE_URL 环境变量', '设置 OPENAI_API_KEY 为你的 AnyTokn 密钥', '运行 `codex` 命令', '或在每个命令使用 --base-url 参数'],
    },
    {
      id: 'n8n',
      icon: Globe,
      name: 'n8n',
      description: isEn ? 'Open source workflow automation' : '开源工作流自动化',
      color: 'orange',
      config: `# n8n OpenAI Node Settings
Base URL: ${DISPLAY_API_BASE}/v1
API Key: ${apiKeyValue}
Model: gpt-4o

# Or use HTTP Request node:
URL: ${DISPLAY_API_BASE}/v1/chat/completions
Method: POST
Headers:
  Authorization: Bearer ${apiKeyValue}
  Content-Type: application/json`,
      steps: isEn
        ? ['Add OpenAI node to workflow', 'Toggle "Use custom base URL"', 'Enter AnyTokn Base URL', 'Paste your API Key']
        : ['添加 OpenAI 节点到工作流', '开启 "使用自定义 Base URL"', '输入 AnyTokn Base URL', '粘贴你的 API Key'],
    },
    {
      id: 'make',
      icon: Zap,
      name: 'Make (Integromat)',
      description: isEn ? 'Visual automation platform' : '可视化自动化平台',
      color: 'rose',
      config: `# Make HTTP Module Configuration
URL: ${DISPLAY_API_BASE}/v1/chat/completions
Method: POST
Headers:
  Authorization: Bearer ${apiKeyValue}
  Content-Type: application/json
Body:
  model: gpt-4o
  messages: [{{your messages}}]`,
      steps: isEn
        ? ['Add HTTP module to scenario', 'Set URL to AnyTokn endpoint', 'Add Authorization header', 'Configure request body']
        : ['添加 HTTP 模块到场景', '设置 URL 为 AnyTokn 地址', '添加 Authorization 请求头', '配置请求体'],
    },
    {
      id: 'python',
      icon: Terminal,
      name: 'Python (OpenAI SDK)',
      description: isEn ? 'Direct API integration' : '直接 API 集成',
      color: 'cyan',
      config: `from openai import OpenAI

client = OpenAI(
    base_url="${DISPLAY_API_BASE}/v1",
    api_key="${apiKeyValue}"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "Hello, AnyTokn!"}
    ]
)

print(response.choices[0].message.content)`,
      steps: isEn
        ? ['Install openai package: `pip install openai`', 'Set base_url to AnyTokn endpoint', 'Use your AnyTokn API Key', 'Make API calls as usual']
        : ['安装 openai 包: `pip install openai`', '设置 base_url 为 AnyTokn 地址', '使用你的 AnyTokn API Key', '像往常一样调用 API'],
    },
    {
      id: 'nodejs',
      icon: Code2,
      name: 'Node.js (OpenAI SDK)',
      description: isEn ? 'JavaScript/TypeScript integration' : 'JavaScript/TypeScript 集成',
      color: 'emerald',
      config: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${DISPLAY_API_BASE}/v1',
  apiKey: '${apiKeyValue}'
});

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'user', content: 'Hello, AnyTokn!' }
  ]
});

console.log(response.choices[0].message.content);`,
      steps: isEn
        ? ['Install openai package: `npm install openai`', 'Set baseURL to AnyTokn endpoint', 'Use your AnyTokn API Key', 'Make API calls as usual']
        : ['安装 openai 包: `npm install openai`', '设置 baseURL 为 AnyTokn 地址', '使用你的 AnyTokn API Key', '像往常一样调用 API'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
              {isEn ? 'Documentation' : '使用文档'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            {isEn ? 'Integration Guides' : '集成配置指南'}
          </h1>
          <p className="text-slate-600 max-w-2xl text-lg">
            {isEn 
              ? 'Learn how to configure AnyTokn with your favorite tools and frameworks. Replace the base URL and API key to start saving costs.'
              : '了解如何在各种工具和框架中配置 AnyTokn。只需替换 Base URL 和 API Key，即可开始节省成本。'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Start */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {isEn ? 'Quick Start' : '快速开始'}
          </h2>
          <div className="bg-slate-900 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-4">
              {isEn 
                ? 'The only change you need to make is replacing the base URL and API key:'
                : '你只需要做以下替换即可：'}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{isEn ? 'Original (OpenAI)' : '原始 (OpenAI)'}</p>
                <code className="text-xs text-slate-400 font-mono block">
                  base_url: https://api.openai.com/v1<br/>
                  api_key: sk-openai-...
                </code>
              </div>
              <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4">
                <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2">{isEn ? 'With AnyTokn' : '使用 AnyTokn'}</p>
                <code className="text-xs text-emerald-300 font-mono block">
                  base_url: {DISPLAY_API_BASE}/v1<br/>
                  api_key: {apiKeyValue.substring(0, 20)}...
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Guides */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {isEn ? 'Tool-Specific Guides' : '工具配置指南'}
          </h2>
          
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              icon={tool.icon}
              name={tool.name}
              description={tool.description}
              color={tool.color}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    {isEn ? 'Configuration' : '配置'}
                  </h4>
                  <CodeBlock code={tool.config} language="yaml" />
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    {isEn ? 'Steps' : '步骤'}
                  </h4>
                  <ol className="space-y-2">
                    {tool.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-500 flex-shrink-0">
                          {idx + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </ToolCard>
          ))}
        </div>

        {/* API Reference */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {isEn ? 'API Reference' : 'API 参考'}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="font-medium text-slate-900">Base URL</p>
                <p className="text-sm text-slate-500">{isEn ? 'All API requests should use this base URL' : '所有 API 请求应使用此基础 URL'}</p>
              </div>
              <code className="text-sm font-mono bg-slate-100 px-3 py-1.5 rounded-lg">{DISPLAY_API_BASE}/v1</code>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="font-medium text-slate-900">Authentication</p>
                <p className="text-sm text-slate-500">{isEn ? 'Include your API key in the Authorization header' : '在 Authorization 请求头中包含你的 API Key'}</p>
              </div>
              <code className="text-sm font-mono bg-slate-100 px-3 py-1.5 rounded-lg">Bearer {apiKeyValue.substring(0, 15)}...</code>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900">Supported Models</p>
                <p className="text-sm text-slate-500">{isEn ? 'All OpenAI-compatible models are supported' : '支持所有 OpenAI 兼容的模型'}</p>
              </div>
              <span className="text-sm text-slate-600">gpt-4o, gpt-4, gpt-3.5-turbo...</span>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 mb-3">
            {isEn ? 'Need help with other tools or have questions?' : '需要其他工具的帮助或有疑问？'}
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {isEn ? 'Contact Support' : '联系客服'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
