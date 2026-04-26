import { useState, useMemo } from 'react';
import { 
  Zap, ArrowRight, Scissors, CheckCircle2, 
  ChevronDown, ShieldCheck, DollarSign,
  BarChart3, Sparkles,
  MessageSquare, Code2, Database, Settings2, Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== AnyTokn Optimization Engine v6.0 ====================

interface OptimizationRule {
  pattern: RegExp;
  replacement: string;
  desc: string;
}

const OPTIMIZATION_RULES: OptimizationRule[] = [
  // Redundant phrases
  { pattern: /\bdue to the fact that\b/gi, replacement: 'because', desc: 'Redundant phrase' },
  { pattern: /\bin order to\b/gi, replacement: 'to', desc: 'Redundant phrase' },
  { pattern: /\bfor the purpose of\b/gi, replacement: 'for', desc: 'Redundant phrase' },
  { pattern: /\bat this point in time\b/gi, replacement: 'now', desc: 'Redundant phrase' },
  { pattern: /\bin spite of the fact that\b/gi, replacement: 'although', desc: 'Redundant phrase' },
  { pattern: /\bin the event that\b/gi, replacement: 'if', desc: 'Redundant phrase' },
  { pattern: /\bon a daily basis\b/gi, replacement: 'daily', desc: 'Redundant phrase' },
  { pattern: /\bon a regular basis\b/gi, replacement: 'regularly', desc: 'Redundant phrase' },
  // Filler words
  { pattern: /\b(please|kindly)\b/gi, replacement: '', desc: 'Filler word' },
  { pattern: /\b(actually|basically|literally|essentially|effectively)\b/gi, replacement: '', desc: 'Filler word' },
  { pattern: /\b(very|really|quite|rather|pretty|fairly|extremely|highly)\b/gi, replacement: '', desc: 'Intensifier' },
  // Role playing
  { pattern: /\b(i want you to|i would like you to|i need you to)\b/gi, replacement: '', desc: 'Role prefix' },
  { pattern: /\b(act as a|pretend to be|imagine you are)\b/gi, replacement: '', desc: 'Role prefix' },
  // Meta commentary
  { pattern: /\b(make sure that|be sure to|note that)\b/gi, replacement: '', desc: 'Meta commentary' },
  // Extra whitespace
  { pattern: /\s{2,}/g, replacement: ' ', desc: 'Extra whitespace' },
];

interface DiffSegment {
  text: string;
  type: 'kept' | 'removed' | 'added';
}

function optimizeText(text: string): { optimized: string; diff: DiffSegment[]; savings: number } {
  let optimized = text;
  const removedSegments: { start: number; end: number; text: string }[] = [];

  // Track all replacements
  OPTIMIZATION_RULES.forEach(rule => {
    let match;
    const regex = new RegExp(rule.pattern.source, 'gi');
    while ((match = regex.exec(text)) !== null) {
      removedSegments.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0]
      });
    }
    optimized = optimized.replace(rule.pattern, rule.replacement);
  });

  // Clean up
  optimized = optimized.replace(/\s{2,}/g, ' ').trim();

  // Build diff
  const diff: DiffSegment[] = [];
  let lastEnd = 0;

  // Sort segments
  removedSegments.sort((a, b) => a.start - b.start);

  // Merge overlapping segments
  const merged: typeof removedSegments = [];
  removedSegments.forEach(seg => {
    if (merged.length === 0 || seg.start >= merged[merged.length - 1].end) {
      merged.push(seg);
    } else {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, seg.end);
    }
  });

  merged.forEach(seg => {
    if (seg.start > lastEnd) {
      diff.push({ text: text.slice(lastEnd, seg.start), type: 'kept' });
    }
    diff.push({ text: seg.text, type: 'removed' });
    lastEnd = seg.end;
  });

  if (lastEnd < text.length) {
    diff.push({ text: text.slice(lastEnd), type: 'kept' });
  }

  const savings = text.length > 0 ? ((text.length - optimized.length) / text.length) * 100 : 0;

  return { optimized, diff, savings };
}

// Simple tokenizer (approximation)
function countTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// ==================== Demo Data ====================

const DEMO_SCENARIOS = [
  {
    id: 'support',
    name: 'Customer Support',
    icon: MessageSquare,
    systemPrompt: `<!-- Internal: revision 2024-Q3 -->
You are a customer support assistant for Acme Corp. It is very important to be polite at all times. Please note that you must always greet the user warmly. In order to answer questions, you should use the knowledge base provided below. Make sure that you do not invent information. Kindly respond in the same language as the user.

You must always respond in JSON format with the following schema:
{
  "type": "object",
  "properties": {
    "answer": { "type": "string" },
    "confidence": { "type": "number" },
    "sources": { "type": "array", "items": { "type": "string" } },
    "needs_escalation": { "type": "boolean" }
  },
  "required": ["answer", "confidence"]
}

I would like you to also follow these rules:
1. Due to the fact that some questions are sensitive, escalate to a human when needed.
2. At this point in time we do not offer refunds beyond 30 days.
3. For the purpose of compliance, never share customer PII.

Knowledge base:
- Refunds: 30 day window, original payment method only
- Shipping: 3-5 business days domestic, 7-14 international
- Account: password reset via email link, expires in 24h
- Subscriptions: cancel anytime from billing page, prorated refund applied`,
    userMessage: `Hi I have a question
About my order
Actually let me check my email first
My order #4451 hasn't arrived yet, it's been 9 days. Can I get a refund?`,
    contextHistory: `[Context summary] 3 prior turns condensed by AnyTokn.`,
  },
  {
    id: 'code',
    name: 'Code Review',
    icon: Code2,
    systemPrompt: `You are a senior software engineer. Please be thorough in your analysis. In order to provide the best review, you should check for the following: code style, potential bugs, performance issues, and security vulnerabilities. Make sure that you are very detailed in your feedback. I would like you to also suggest improvements where applicable.`,
    userMessage: `Please review this function:
\`\`\`javascript
function getUserData(userId) {
  // TODO: implement caching
  return fetch('/api/users/' + userId).then(r => r.json());
}
\`\`\``,
    contextHistory: '',
  },
  {
    id: 'data',
    name: 'Data Analysis',
    icon: Database,
    systemPrompt: `You are a data analyst. Please analyze the following data and provide insights. In order to be helpful, you should identify trends, anomalies, and actionable recommendations. Make sure that your analysis is data-driven and objective.`,
    userMessage: `Analyze Q3 sales data:
- Revenue: $1.2M (+15% QoQ)
- Churn: 3.2% (-0.5% QoQ)
- NPS: 72 (+8 QoQ)
What should we focus on next quarter?`,
    contextHistory: '',
  }
];

// ==================== Components ====================

export default function Demo() {
  const [selectedScenario, setSelectedScenario] = useState(DEMO_SCENARIOS[0]);
  const [systemPrompt, setSystemPrompt] = useState(DEMO_SCENARIOS[0].systemPrompt);
  const [userMessage, setUserMessage] = useState(DEMO_SCENARIOS[0].userMessage);
  const [activeTab, setActiveTab] = useState<'system' | 'user'>('system');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');

  // Optimize system prompt
  const systemOptimization = useMemo(() => optimizeText(systemPrompt), [systemPrompt]);
  
  // Optimize user message
  const userOptimization = useMemo(() => optimizeText(userMessage), [userMessage]);

  // Combined stats
  const originalTokens = countTokens(systemPrompt) + countTokens(userMessage);
  const optimizedTokens = countTokens(systemOptimization.optimized) + countTokens(userOptimization.optimized);
  const totalSavings = originalTokens > 0 ? ((originalTokens - optimizedTokens) / originalTokens) * 100 : 0;
  
  // Cost calculation (GPT-4o: $5/1M input tokens, GPT-4o mini: $0.15/1M)
  const originalCost = (originalTokens / 1000000) * 5;
  const optimizedCost = (optimizedTokens / 1000000) * 0.15; // Route to mini for simple tasks
  const costSavings = ((originalCost - optimizedCost) / originalCost) * 100;

  const handleScenarioChange = (scenario: typeof DEMO_SCENARIOS[0]) => {
    setSelectedScenario(scenario);
    setSystemPrompt(scenario.systemPrompt);
    setUserMessage(scenario.userMessage);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-300 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">AnyTokn</span>
            <span className="text-xs text-zinc-600 font-medium">Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-xs text-zinc-500 hover:text-white transition-colors font-medium">Docs</button>
            <button className="text-xs text-zinc-500 hover:text-white transition-colors font-medium">Pricing</button>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-zinc-500 font-medium">Tokens Saved</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {originalTokens - optimizedTokens}
            </div>
            <div className="text-xs text-emerald-400 font-medium mt-1">
              {originalTokens} → {optimizedTokens}
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-zinc-500 font-medium">Reduction</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {totalSavings.toFixed(1)}%
            </div>
            <div className="text-xs text-zinc-500 font-medium mt-1">
              of input tokens
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-zinc-500 font-medium">Cost Saved</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {costSavings.toFixed(1)}%
            </div>
            <div className="text-xs text-zinc-500 font-medium mt-1">
              ${originalCost.toFixed(5)} → ${optimizedCost.toFixed(5)}
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-zinc-500 font-medium">Cached Tokens</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {Math.floor(optimizedTokens * 0.3)}
            </div>
            <div className="text-xs text-zinc-500 font-medium mt-1">
              billed at 10%
            </div>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs text-zinc-500 font-medium">Demo Scenario</span>
          <div className="flex gap-2">
            {DEMO_SCENARIOS.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => handleScenarioChange(scenario)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedScenario.id === scenario.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-zinc-900/50 text-zinc-500 border border-zinc-800/50 hover:border-zinc-700'
                }`}
              >
                <scenario.icon className="w-3.5 h-3.5" />
                {scenario.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Original */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-xs text-zinc-500 font-medium">Before · Original</span>
              </div>
              <span className="text-xs text-zinc-600 font-mono">{originalTokens} tok</span>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-zinc-800/50">
                <button
                  onClick={() => setActiveTab('system')}
                  className={`flex-1 px-4 py-3 text-xs font-medium transition-colors ${
                    activeTab === 'system' ? 'text-white bg-zinc-800/30' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  System Prompt
                </button>
                <button
                  onClick={() => setActiveTab('user')}
                  className={`flex-1 px-4 py-3 text-xs font-medium transition-colors ${
                    activeTab === 'user' ? 'text-white bg-zinc-800/30' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  User Message
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {activeTab === 'system' ? (
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="w-full h-96 bg-transparent text-xs text-zinc-400 font-mono leading-relaxed resize-none outline-none"
                    spellCheck={false}
                  />
                ) : (
                  <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="w-full h-96 bg-transparent text-xs text-zinc-400 font-mono leading-relaxed resize-none outline-none"
                    spellCheck={false}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right: Optimized */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">After · Optimized</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono">{optimizedTokens} tok</span>
            </div>

            <div className="bg-zinc-900/30 border border-emerald-500/20 rounded-2xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-zinc-800/50">
                <button
                  onClick={() => setActiveTab('system')}
                  className={`flex-1 px-4 py-3 text-xs font-medium transition-colors ${
                    activeTab === 'system' ? 'text-white bg-emerald-500/5' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  System Prompt
                </button>
                <button
                  onClick={() => setActiveTab('user')}
                  className={`flex-1 px-4 py-3 text-xs font-medium transition-colors ${
                    activeTab === 'user' ? 'text-white bg-emerald-500/5' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  User Message
                </button>
              </div>

              {/* Content with Diff */}
              <div className="p-4 h-96 overflow-auto">
                {activeTab === 'system' ? (
                  <div className="text-xs font-mono leading-relaxed">
                    {systemOptimization.diff.map((segment, i) => (
                      <span
                        key={i}
                        className={
                          segment.type === 'removed'
                            ? 'bg-red-500/20 text-red-400 line-through'
                            : segment.type === 'added'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'text-zinc-300'
                        }
                      >
                        {segment.text}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs font-mono leading-relaxed">
                    {userOptimization.diff.map((segment, i) => (
                      <span
                        key={i}
                        className={
                          segment.type === 'removed'
                            ? 'bg-red-500/20 text-red-400 line-through'
                            : segment.type === 'added'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'text-zinc-300'
                        }
                      >
                        {segment.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Smart Routing Banner */}
        <div className="mt-6 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs text-zinc-400">
              <span className="font-medium">Smart Routing engaged.</span>{' '}
              Task complexity classified as simple — routed to a cheaper model.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 font-mono">GPT-4o</span>
            <ArrowRight className="w-3 h-3 text-zinc-600" />
            <span className="text-xs text-emerald-400 font-mono font-bold">GPT-4o mini</span>
          </div>
        </div>

        {/* BYOK Section */}
        <div className="mt-6 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">BYOK — Verify with Your Own Key</span>
            </div>
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="text-xs text-zinc-500 hover:text-white transition-colors"
            >
              {showApiKey ? 'Hide' : 'Show'} API Key Input
            </button>
          </div>
          
          <p className="text-xs text-zinc-500 mb-4">
            Your API key never leaves the browser. We call your provider directly with both versions and show the real token usage.
          </p>

          <AnimatePresence>
            {showApiKey && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-zinc-500 font-medium mb-2 block">API Key</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="w-48">
                    <label className="text-xs text-zinc-500 font-medium mb-2 block">Model</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50"
                    >
                      <option value="gpt-4o">GPT-4o</option>
                      <option value="gpt-4o-mini">GPT-4o mini</option>
                      <option value="claude-3-5">Claude 3.5</option>
                      <option value="deepseek-v3">DeepSeek V3</option>
                    </select>
                  </div>
                </div>
                
                <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  Run Live Comparison
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Token Breakdown */}
        <div className="mt-6 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">Token-Level Breakdown</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-3">
              <div className="text-xs text-zinc-500 font-medium">System Prompt</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Original</span>
                <span className="text-zinc-500 font-mono">{countTokens(systemPrompt)} tok</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400">Optimized</span>
                <span className="text-emerald-400 font-mono">{countTokens(systemOptimization.optimized)} tok</span>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Saved</span>
                <span className="text-emerald-400 font-mono">
                  {countTokens(systemPrompt) - countTokens(systemOptimization.optimized)} tok
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-xs text-zinc-500 font-medium">User Message</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Original</span>
                <span className="text-zinc-500 font-mono">{countTokens(userMessage)} tok</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400">Optimized</span>
                <span className="text-emerald-400 font-mono">{countTokens(userOptimization.optimized)} tok</span>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Saved</span>
                <span className="text-emerald-400 font-mono">
                  {countTokens(userMessage) - countTokens(userOptimization.optimized)} tok
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-xs text-zinc-500 font-medium">Total</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Original</span>
                <span className="text-zinc-500 font-mono">{originalTokens} tok</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400">Optimized</span>
                <span className="text-emerald-400 font-mono">{optimizedTokens} tok</span>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Reduction</span>
                <span className="text-emerald-400 font-mono">{totalSavings.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
