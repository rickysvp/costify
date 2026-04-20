import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react";
import { 
  Menu, 
  X, 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin, 
  ArrowRight,
  Terminal,
  Zap,
  ShieldCheck,
  BarChart3,
  Search,
} from "lucide-react";

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-sm">
              <Zap className="text-white w-5 h-5 fill-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">AnyTokn</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Platform</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Solutions</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Optimization Engine</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <Link 
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-sm shadow-indigo-100"
            >
              Book a Pilot
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-6 space-y-4">
          <a href="#" className="block text-lg font-medium text-slate-900 line-height-none">Docs</a>
          <a href="#" className="block text-lg font-medium text-slate-900 line-height-none">Pricing</a>
          <a href="#" className="block text-lg font-medium text-slate-900 line-height-none">Models</a>
          <a href="#" className="block text-lg font-medium text-slate-900 line-height-none">Resources</a>
          <Link to="/login" className="block w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-center">
            Log in
          </Link>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-tight"
        >
          Enterprise AI Cost Efficiency
        </motion.div>
        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Control AI cost without<br />compromising quality
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          AnyTokn is an enterprise-grade token optimization and cost control system for generative AI workflows. 
          Reduce wasted token spend with quality-aware compression, token orchestration, and long-term optimization.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link 
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 flex items-center gap-2 group transition-all w-full sm:w-auto justify-center"
          >
            Book a Pilot <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/login"
            className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg shadow-sm flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
          >
            Speak with the Team
          </Link>
        </motion.div>
      </div>

      <div className="mt-20 max-w-6xl mx-auto relative group">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/80 backdrop-blur rounded-full border border-slate-100 shadow-sm text-sm font-semibold text-slate-500 z-20">
          Operational visibility for high-quality savings
        </div>
        {/* Floating Icons Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-[10%] p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 animate-pulse" style={{ animationDuration: '3s' }}>
            <img src="https://picsum.photos/seed/openai/40/40" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
            <span className="text-[10px] whitespace-nowrap font-bold text-slate-900">OpenAI</span>
          </div>
          <div className="absolute bottom-40 left-[5%] p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 animate-pulse" style={{ animationDuration: '4s' }}>
            <img src="https://picsum.photos/seed/anthropic/40/40" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
            <span className="text-[10px] whitespace-nowrap font-bold text-slate-900">Anthropic</span>
          </div>
          <div className="absolute top-32 right-[8%] p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 animate-pulse" style={{ animationDuration: '3.5s' }}>
            <img src="https://picsum.photos/seed/google/40/40" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
            <span className="text-[10px] whitespace-nowrap font-bold text-center leading-none text-slate-900">Google<br />Gemini</span>
          </div>
          <div className="absolute top-10 right-[15%] p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 animate-pulse" style={{ animationDuration: '4.5s' }}>
            <img src="https://picsum.photos/seed/groq/40/40" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
            <span className="text-[10px] whitespace-nowrap font-bold text-slate-900">Groq</span>
          </div>
          <div className="absolute bottom-20 right-[12%] p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 animate-pulse" style={{ animationDuration: '5s' }}>
            <img src="https://picsum.photos/seed/llama/40/40" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
            <span className="text-[10px] whitespace-nowrap font-bold text-slate-900">Llama</span>
          </div>
          <div className="absolute bottom-40 right-[4%] p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 animate-pulse" style={{ animationDuration: '3.2s' }}>
            <img src="https://picsum.photos/seed/mistral/40/40" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
            <span className="text-[10px] whitespace-nowrap font-bold text-slate-900">Mistral AI</span>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div 
          className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="flex-1 px-8">
              <div className="w-full max-w-md bg-slate-50 border border-slate-100 rounded-xl py-1.5 px-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <div className="h-2 w-32 bg-slate-200 rounded-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm" />
            </div>
          </div>
          <div className="flex h-[550px]">
            <aside className="w-64 border-r border-slate-100 p-8 shrink-0 hidden md:block space-y-6">
              {[
                { label: 'Spend visibility', active: true },
                { label: 'Quality-aware optimization', active: false },
                { label: 'Policy controls', active: false },
                { label: 'Measurable savings', active: false }
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-4 ${item.active ? 'text-indigo-600 bg-indigo-50/50 p-3 rounded-2xl -mx-3' : 'text-slate-400'}`}>
                  <div className={`w-5 h-5 rounded-lg shrink-0 ${item.active ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                  <span className={`text-xs font-bold ${item.active ? 'text-indigo-700' : 'text-slate-400'}`}>{item.label}</span>
                </div>
              ))}
            </aside>
            <main className="flex-1 p-10 space-y-10 overflow-hidden">
               <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-6 w-64 bg-slate-100 rounded-lg" />
                    <div className="h-3 w-40 bg-slate-50 rounded-full" />
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-2 text-xs font-semibold text-slate-500">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Cloud Live</span>
                    </div>
                  </div>
               </div>
               <div className="grid grid-cols-4 gap-6">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3">
                      <div className="flex justify-between">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                          <div className="w-4 h-4 bg-indigo-500 rounded" />
                        </div>
                        <span className="text-green-500 text-xs font-bold">+12%</span>
                      </div>
                      <div className="h-2 w-16 bg-slate-50 rounded-full" />
                      <div className="h-6 w-24 bg-slate-900 rounded-lg" />
                    </div>
                  ))}
               </div>
               <div className="h-72 bg-slate-50 border border-slate-100 rounded-3xl flex items-end p-8 gap-3">
                  {[4,2,7,5,8,3,9,1,4,6,2,8,3,4,6,3,1,7,8,4].map((h, i) => (
                    <motion.div 
                      key={i} 
                      className={`flex-1 rounded-t-xl transition-all ${i % 2 === 0 ? 'bg-indigo-500' : 'bg-indigo-200'}`} 
                      initial={{ height: 0 }}
                      animate={{ height: `${h * 10}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                    />
                  ))}
               </div>
            </main>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const IntegrationPanel = () => {
  const capabilities = [
    {
      title: "Quality-aware compression engine",
      desc: "Compress low-value context and redundant input while preserving the information that matters for task completion.",
      icon: <Zap className="w-5 h-5" />,
      color: "text-indigo-400 bg-indigo-400/10"
    },
    {
      title: "Token orchestration engine",
      desc: "Allocate token budget by task complexity, workflow priority, and quality target.",
      icon: <Terminal className="w-5 h-5" />,
      color: "text-emerald-400 bg-emerald-400/10"
    },
    {
      title: "Long-term optimization loop",
      desc: "Use historical performance and usage patterns to continuously refine future token efficiency.",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-amber-400 bg-amber-400/10"
    },
    {
      title: "Budget and policy controls",
      desc: "Turn optimization into a governed operating layer with visibility, limits, and enforcement.",
      icon: <ShieldCheck className="w-5 h-5" />,
      color: "text-purple-400 bg-purple-400/10"
    }
  ];

  const [activeCap, setActiveCap] = useState(0);

  return (
    <section className="py-32 px-4 bg-[#0d1117] text-white">
      <div className="max-w-6xl mx-auto text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">A high-quality savings system for production AI</h2>
        <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
          AnyTokn is not a one-off prompt compression tool. It is a system designed to continuously improve the cost-quality balance of enterprise generative AI.
        </p>
      </div>
      <div className="max-w-5xl mx-auto rounded-[32px] bg-slate-800/30 border border-slate-700/30 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-700/30">
          {capabilities.map((cap, i) => (
            <button 
              key={i}
              onClick={() => setActiveCap(i)}
              className={`flex flex-col items-center gap-3 px-6 py-8 transition-all border-r border-slate-700/30 last:border-r-0 ${activeCap === i ? 'bg-slate-800/50' : 'hover:bg-slate-800/20'}`}
            >
              <div className={`p-3 rounded-xl ${cap.color}`}>
                {cap.icon}
              </div>
              <span className={`text-xs font-bold text-center leading-tight ${activeCap === i ? 'text-white' : 'text-slate-500'}`}>{cap.title}</span>
            </button>
          ))}
        </div>
        <div className="p-16 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-2xl font-bold">{capabilities[activeCap].title}</h3>
            <p className="text-slate-400 text-lg leading-relaxed">{capabilities[activeCap].desc}</p>
          </div>
          <div className="w-full max-w-2xl bg-[#080b10] rounded-2xl border border-slate-700/50 p-8 font-mono text-sm overflow-hidden">
             <div className="flex gap-2 mb-6 opacity-30">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
             </div>
             <div className="text-left space-y-2">
                <p className="text-indigo-400"># AnyTokn optimization active</p>
                <p><span className="text-emerald-400">await</span> anytokn.optimize({'{'}</p>
                <p>&nbsp;&nbsp;workflowId: <span className="text-emerald-400">"enterprise-copilot-v2"</span>,</p>
                <p>&nbsp;&nbsp;qualityConstraint: <span className="text-amber-400">0.98</span>,</p>
                <p>&nbsp;&nbsp;priority: <span className="text-indigo-400">"high"</span></p>
                <p>{'})'};</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section className="py-32 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center mb-20 space-y-4">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">Built to reduce waste, protect quality, and improve control</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="group bg-white border border-slate-100 rounded-[32px] p-10 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="mb-8 space-y-4">
            <div className="p-4 bg-indigo-50 w-fit rounded-2xl">
              <Zap className="w-6 h-6 text-indigo-600 fill-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Reduce wasted token spend</h3>
            <p className="text-slate-500 leading-relaxed">
              Identify low-value token usage across prompts, context, and multi-step workflows before it turns into recurring cost.
            </p>
          </div>
          <div className="mt-12 bg-slate-50 rounded-2xl border border-slate-100 p-8 flex flex-col items-center relative h-56 justify-center overflow-hidden">
             <div className="w-full space-y-2 opacity-40">
                <div className="h-2 w-3/4 bg-slate-200 rounded" />
                <div className="h-2 w-1/2 bg-slate-200 rounded" />
                <div className="h-2 w-full bg-slate-200 rounded" />
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 scale-110">
                   <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <Zap className="w-4 h-4 fill-red-600" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Waste detected</span>
                      <span className="text-sm font-bold text-slate-900">-42% Tokens</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="group bg-white border border-slate-100 rounded-[32px] p-10 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="mb-8 space-y-4">
            <div className="p-4 bg-emerald-50 w-fit rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Protect output quality</h3>
            <p className="text-slate-500 leading-relaxed">
              Optimize under quality constraints so efficiency gains do not come at the expense of task performance.
            </p>
          </div>
          <div className="mt-12 bg-slate-50 rounded-2xl border border-slate-100 p-8 flex flex-col items-center relative h-56 justify-center overflow-hidden">
             <div className="h-32 w-32 border-4 border-emerald-500/20 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-2xl font-black text-emerald-600">99.8%</span>
             </div>
             <span className="mt-4 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Quality Invariant</span>
          </div>
        </div>

        <div className="group bg-white border border-slate-100 rounded-[32px] p-10 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="mb-8 space-y-4">
            <div className="p-4 bg-amber-50 w-fit rounded-2xl">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Improve operational control</h3>
            <p className="text-slate-500 leading-relaxed">
              Apply budgets, policies, and workflow-level optimization logic across production AI usage.
            </p>
          </div>
          <div className="mt-12 bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col space-y-4 h-56">
             {[
               { label: 'Global Budget', val: '84%', color: 'bg-indigo-500' },
               { label: 'Token Policy', val: 'Active', color: 'bg-emerald-500' },
               { label: 'Cost Limit', val: '$12k/mo', color: 'bg-amber-500' }
             ].map((item, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                   <span className="text-xs font-bold text-slate-500">{item.label}</span>
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${item.color}`}>{item.val}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Solutions = () => {
  const solutions = [
    { title: "AIGC Operations", desc: "Improve efficiency across content production pipelines with lower token waste and more predictable costs." },
    { title: "Workplace Productivity", desc: "Optimize internal copilots, knowledge workflows, and document generation without degrading usefulness." },
    { title: "Finance & Compliance", desc: "Support more controlled AI usage in workflows where quality, traceability, and policy discipline matter." },
    { title: "AI Education", desc: "Reduce the long-term cost of tutoring, feedback, and large-scale learning interactions." },
    { title: "Agentic Automation", desc: "Control token usage across multi-step agent workflows with clearer efficiency logic and better guardrails." }
  ];

  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-16 text-center">Built for real generative AI workloads</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {solutions.map((sol, i) => (
            <div key={i} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 hover:border-indigo-200 transition-all group">
              <h4 className="text-lg font-bold text-slate-900 mb-4">{sol.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600">{sol.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LogoCloud = () => {
  const logos = [
    { name: 'together.ai', url: 'https://picsum.photos/seed/t1/100/30' },
    { name: 'GA WOLF', url: 'https://picsum.photos/seed/t2/100/30' },
    { name: 'CLAY', url: 'https://picsum.photos/seed/t3/100/30' },
    { name: 'Flevine', url: 'https://picsum.photos/seed/t4/100/30' },
    { name: 'PadPitch', url: 'https://picsum.photos/seed/t5/100/30' },
  ];

  return (
    <section className="py-24 border-t border-slate-100 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-12">Used across high-consumption generative AI workflows</p>
        <div className="flex flex-wrap justify-center items-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all">
          {logos.map(logo => (
            <div key={logo.name} className="flex items-center gap-2">
               <img src={logo.url} alt={logo.name} className="h-6 md:h-8 object-contain" referrerPolicy="no-referrer" />
               <span className="font-bold text-slate-800 text-sm uppercase tracking-tight">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Proof = () => {
  const bullets = [
    "Workflow-level spend visibility",
    "Optimization opportunities by usage pattern",
    "Quality-sensitive control logic",
    "Savings tracking over time"
  ];

  return (
    <section className="py-32 px-4 bg-slate-50 border-t border-slate-100">
       <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 space-y-8">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">See where cost goes — and where savings come from</h2>
             <p className="text-lg text-slate-500 leading-relaxed">
               Track spend across teams, projects, and workflows. Identify optimization opportunities, apply controls, and measure results over time.
             </p>
             <div className="space-y-4">
                {bullets.map((bullet, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-emerald-600" />
                     </div>
                     <span className="text-slate-700 font-medium">{bullet}</span>
                  </div>
                ))}
             </div>
          </div>
          <div className="flex-1 bg-white rounded-[40px] border border-slate-200 p-10 shadow-2xl shadow-slate-200/50 relative">
             <div className="space-y-8">
                <div className="flex justify-between items-end">
                   <div className="space-y-2">
                      <div className="h-3 w-24 bg-slate-100 rounded" />
                      <div className="h-8 w-40 bg-slate-900 rounded-xl" />
                   </div>
                   <div className="h-12 w-32 bg-indigo-50 border border-indigo-100 rounded-xl" />
                </div>
                <div className="space-y-6">
                   {[65, 42, 88].map((w, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <span>Workflow {i+1}</span>
                           <span>{w}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 transition-all" style={{ width: `${w}%` }} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="absolute -bottom-6 -left-6 px-6 py-4 bg-emerald-500 text-white rounded-2xl shadow-xl font-bold shadow-emerald-500/20 italic">
                -30% Avg Cost Reduction
             </div>
          </div>
       </div>
    </section>
  );
};

const Testimonial = () => {
  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Designed for teams moving AI from experimentation to production</h2>
      </div>
      <div className="max-w-5xl mx-auto bg-slate-900 rounded-[48px] px-10 py-24 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
        
        <div className="flex flex-col items-center text-center space-y-12 relative z-10">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <Zap className="w-8 h-8 text-indigo-400 fill-indigo-400" />
          </div>
          <blockquote className="text-2xl md:text-4xl font-bold leading-tight text-white tracking-tight max-w-3xl">
            &ldquo;AnyTokn helped us move from rough AI spend estimates to a more controllable and explainable cost structure.&rdquo;
          </blockquote>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-bold text-white uppercase tracking-widest text-sm">Pilot customer</p>
            <p className="text-lg font-medium text-slate-400">AI platform team</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  return (
    <section className="py-32 px-4 bg-slate-50 border-y border-slate-200 text-center">
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Optimization becomes more valuable at scale</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-0">
        <div className="text-center space-y-4 px-8 border-slate-200 md:border-r">
          <p className="text-6xl font-black tracking-tighter text-indigo-600">XXM+</p>
          <div className="space-y-1">
            <p className="text-xl font-bold text-slate-900">tokens optimized</p>
            <p className="text-slate-500">Across production AI workflows</p>
          </div>
        </div>
        <div className="text-center space-y-4 px-8 border-slate-200 md:border-r">
          <p className="text-6xl font-black tracking-tighter text-emerald-500">XX%</p>
          <div className="space-y-1">
            <p className="text-xl font-bold text-slate-900">potential waste identified</p>
            <p className="text-slate-500">Across repeated prompt and context patterns</p>
          </div>
        </div>
        <div className="text-center space-y-4 px-8">
          <p className="text-6xl font-black tracking-tighter text-amber-500">XX</p>
          <div className="space-y-1">
            <p className="text-xl font-bold text-slate-900">workflows under control</p>
            <p className="text-slate-500">With policy-aware optimization logic</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Enterprise = () => {
  const items = [
    "Role-based access", "Cost attribution", "Budget controls",
    "Policy enforcement", "Auditability", "Private deployment readiness"
  ];

  return (
    <section className="py-32 px-4 bg-slate-900 overflow-hidden text-white relative">
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Built for enterprise deployment</h2>
             <p className="text-slate-400 text-lg leading-relaxed">
               Governance is not the product identity of AnyTokn, but it is a necessary condition for high-quality savings in production environments.
             </p>
             <div className="grid grid-cols-2 gap-4">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                     <ShieldCheck className="w-5 h-5 text-indigo-400" />
                     <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
             </div>
          </div>
          <div className="relative">
             <div className="p-8 bg-slate-800/50 rounded-[40px] border border-slate-700/50 backdrop-blur-xl">
                <div className="space-y-6">
                   <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <span>Deployment Status</span>
                      <span className="text-emerald-400">Ready</span>
                   </div>
                   <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-indigo-500" />
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-24 bg-slate-900/50 rounded-2xl border border-slate-700/30" />
                      ))}
                   </div>
                </div>
             </div>
             <div className="absolute -top-6 -right-6 p-4 bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-500/20 rotate-12">
                <ShieldCheck className="w-8 h-8 text-white" />
             </div>
          </div>
       </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="py-32 px-4 bg-white relative">
       <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">Bring cost efficiency to your AI workflows</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Turn token usage from a growing cost center into an optimizable production resource.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
             <Link 
               to="/login"
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 flex items-center gap-2 group transition-all w-full sm:w-auto justify-center"
             >
               Book a Pilot <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link 
               to="/login"
               className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl font-bold text-lg shadow-sm flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
             >
               Speak with the Team
             </Link>
          </div>
       </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-50 text-slate-500 py-24 px-4 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-16 mb-24">
        <div className="col-span-2 md:col-span-1 space-y-8">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="p-1.5 bg-indigo-600 rounded-lg shadow-indigo-100 shadow-lg">
              <Zap className="w-6 h-6 fill-white text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">AnyTokn</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs font-medium">
            AnyTokn helps enterprises reduce wasted token spend without compromising output quality.
          </p>
          <div className="flex gap-5">
            <Twitter className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" />
            <Github className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" />
            <Instagram className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" />
          </div>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Product</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing Plans</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Supported Models</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Open Source</a></li>
          </ul>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Engineering</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">API Reference</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">SDKs</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Security</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Resources</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Case Studies</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">System Status</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Guides</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Company</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">About</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Legal</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-10 border-t border-slate-100 text-[13px] flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-medium">&copy; 2026 Helicone AI. All rights reserved.</p>
        <div className="flex gap-10 font-bold">
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

// --- Main Component ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <IntegrationPanel />
        <Features />
        <Solutions />
        <LogoCloud />
        <Proof />
        <Testimonial />
        <Stats />
        <Enterprise />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
