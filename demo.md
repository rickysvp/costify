你是一个资深产品设计师 + 前端工程师，请直接为 AnyTokn 官网新增一个 Demo 演示页面，用于向访客证明 AnyTokn 的 token 优化引擎可以真实节省 token，同时尽量不牺牲回答质量。

先做可运行版本，不要只给方案说明，直接输出页面代码。
如果当前项目已存在官网页面与组件体系，请复用现有设计系统、布局节奏、颜色、字体、按钮风格和卡片样式，不要做成一个风格割裂的新页面。
产品名统一使用 AnyTokn，禁止出现 Costify、Frugai 等旧命名。

# 一、页面目标

这个页面不是普通营销页，而是“价值验证页”。
用户进入页面后，应该在 10 秒内看懂三件事：

1. AnyTokn 确实可以节省 token。
2. 节省不是靠粗暴压缩，而是有优化引擎在工作。
3. 节省之后，回答质量依然基本可用，适合接入真实业务。

页面的核心目标是：
- 先证明价值
- 再解释机制
- 最后引导注册 / 创建项目 / 获取 API Key / 开始接入

# 二、页面定位

请在 AnyTokn 官网中新增一个独立页面，建议路由为：
/demo
或
/token-savings-demo

这个页面需要与现有官网和 onboarding 体系衔接自然。
它应该像官网的一部分，而不是一个外置工具页。

# 三、页面信息架构

请把页面拆成以下 6 个区块，按顺序输出完整页面实现。

## 1. Hero 区

目标：
让用户第一眼知道这个页面是“验证 AnyTokn 节省能力”的地方。

需要包含：
- 小标签：Token Optimization Demo / Live Savings Proof / Savings Engine Demo
- 主标题：明确表达 AnyTokn 可以在保持质量基本稳定的前提下减少 token 消耗
- 副标题：强调这是一个直观的对比演示，展示优化前后差异
- 主按钮：Try the Demo / See Savings in Action
- 次按钮：Start Integrating / Get API Key
- 一组核心数据徽章：
  - Up to XX% fewer input tokens
  - Lower output waste
  - Faster response path
  - Quality-aware optimization

视觉要求：
- 风格克制、可信、偏 enterprise software
- 不要 generic AI startup 风格
- 不要发光球、蓝紫渐变、抽象 AI 背景、悬浮发光卡片
- 更像精密基础设施软件，而不是玩具 AI 网站

## 2. 核心对比区（最重要）

这是页面最核心的模块，必须做成“左 baseline，右 optimized，中间总结”的三栏结构，桌面端并排，移动端纵向堆叠。

左侧 Baseline 卡片展示：
- 原始 prompt / context 状态标签
- input tokens
- output tokens
- total tokens
- latency
- estimated cost
- 回答内容
- 一个标签：Unoptimized Path

右侧 Optimized 卡片展示：
- 优化后状态标签
- input tokens
- output tokens
- total tokens
- latency
- estimated cost
- 回答内容
- 一个标签：AnyTokn Optimized

中间 Summary 卡片展示：
- Total tokens saved
- Input tokens reduced
- Output tokens reduced
- Latency change
- Estimated cost saved
- Quality status（例如：Quality preserved / Slightly shorter / Needs review）

交互要求：
- 顶部提供场景切换 tabs：
  - Customer Support
  - RAG Q&A
  - Multi-turn Assistant
  - Long-form Summarization
- 切换不同场景时，三栏内容同步变化
- 数字变化时有平滑动画
- token 节省百分比要非常醒目
- 回答内容不要过长，但必须足够让用户看出差异

## 3. 优化过程拆解区

这一屏要回答：为什么 AnyTokn 能省，不是黑盒乱压缩。

请做一个“引擎动作拆解”模块，用时间线、流程图或 4 张机制卡片来展示 AnyTokn 的优化动作。

建议展示 4 个动作：
- Prompt compression
- Context trimming / ranking
- Output constraint control
- Smart routing / caching / execution optimization

每个动作卡片都需要包含：
- 一个简洁标题
- 一句解释
- 一个“小效果标签”，例如：
  - Removes repetitive instruction overhead
  - Keeps only high-value context
  - Reduces unnecessary completion length
  - Avoids waste on repeated patterns

要求：
- 解释必须工程化、可信、克制
- 不要写成“魔法般优化”“AI 黑科技”这种文案
- 让人感觉这是一个真实、可控、可审计的优化引擎

## 4. 多维指标区

这一屏专门把“节省结果”拆开讲，让用户理解 AnyTokn 不只是把总 token 压低。

请做成一组 KPI 卡片 + 简单图表。

至少展示：
- Input token reduction
- Output token reduction
- Total token reduction
- Estimated cost reduction
- Response latency delta
- Quality consistency indicator

图表建议：
- 一个 grouped bar chart：baseline vs optimized 的 input / output / total
- 可选第二个 mini chart：latency 对比
- 可选第三个趋势图：多个请求的累计节省

要求：
- 图表风格要简洁，像产品 dashboard 的一部分
- 颜色控制克制，只用 1 个主强调色
- 不要做得像 data art

## 5. 场景覆盖区

这一屏告诉用户：AnyTokn 不是只对单一 prompt 有效，而是对多类工作流都有效。

请做 4 张场景卡片：
- Customer Support
- Retrieval / RAG
- Agent Workflows
- Long Context Analysis

每张卡片包含：
- 场景标题
- 一句场景说明
- 这个场景常见的 token 浪费来源
- AnyTokn 在该场景下主要优化点
- 一个小型节省标签，例如：Typical savings 18–42%

要求：
- 卡片内容偏业务表达，不要太学术
- 要让访客联想到自己的真实使用场景

## 6. CTA 收口区

最终目标是引导转化，而不是让页面停在演示。

请做一个高质量 CTA 区块，承接前面的证明内容。

需要包含：
- 标题：将节省结果转化为真实调用收益
- 文案：强调 AnyTokn 让团队在不明显牺牲质量的情况下更高效地使用模型
- 主按钮：Create Project
- 次按钮：Get API Key
- 辅助链接：View Docs / Start Onboarding
- 一个小提示：适合高频 API 调用、RAG、Agent、团队级工作流

# 四、页面风格要求

整体视觉方向：
enterprise precision + premium calm + operational clarity

关键词：
- calm
- credible
- technical
- structured
- premium
- measurable

避免：
- 蓝紫霓虹
- 发光背景
- 抽象球体
- 赛博朋克
- 夸张渐变按钮
- 典型 AI landing page 套板
- 过度 center 对齐
- 全页同质化 feature cards

推荐：
- 左对齐为主
- 强调数据卡片的秩序感
- 卡片边框克制
- 更像一个真实基础设施产品官网页面
- 页面要有“证明”感，而不是“宣传”感

# 五、文案原则

页面文案必须遵循以下原则：
1. 少说空话，不要写“unlock the power of AI”“empower your workflow”这种套话。
2. 强调 measurable savings、controlled optimization、quality-aware results。
3. 语气要有信心，但不能浮夸。
4. 像真正懂 LLM 成本控制的人写的，不像市场部套模板。

请优先使用以下表达方向：
- Reduce avoidable tokens
- Preserve useful quality
- Make optimization visible
- Show where savings come from
- Turn lower token usage into better operating efficiency

# 六、交互要求

请加入以下交互：

1. 场景 tabs 切换
- 切换 Customer Support / RAG / Multi-turn / Summarization 时，更新对比卡片与数据

2. 数值动画
- token、百分比、cost 在切换时平滑更新

3. 回答内容切换
- baseline 与 optimized 的回答可并排查看
- 不需要真实 API 请求，首版先用高质量 mock 数据实现

4. Hover / active / focus 状态
- 所有按钮、tab、卡片都要有清晰状态反馈

5. 响应式
- 桌面端清晰大气
- 移动端可读，不拥挤
- 核心对比模块在手机上也要能看懂

# 七、数据实现要求

首版先使用 mock data，不接真实后端。
请在页面内定义结构化 mock 数据，至少包含 4 个场景，每个场景都包含：

{
  id,
  label,
  baseline: {
    inputTokens,
    outputTokens,
    totalTokens,
    latencyMs,
    estimatedCost,
    answer
  },
  optimized: {
    inputTokens,
    outputTokens,
    totalTokens,
    latencyMs,
    estimatedCost,
    answer
  },
  engineBreakdown: [
    { title, description, impactLabel }
  ],
  qualityStatus,
  savings: {
    inputPct,
    outputPct,
    totalPct,
    costPct,
    latencyPct
  }
}

mock 数据不要乱写，要看起来真实可信。
不同场景的节省比例不要完全一样。
建议范围：
- Customer Support：中等节省
- RAG：输入 token 节省更明显
- Multi-turn：上下文优化更明显
- Summarization：输出 token 节省更明显

# 八、技术实现要求

请优先基于当前项目已有技术栈实现。
如果当前官网是 React + TypeScript：
- 直接输出可合并的页面组件代码
- 拆出必要子组件
- 保持目录结构清晰

如果当前官网是静态页面或其他前端体系：
- 仍然输出完整可运行实现
- 优先复用现有组件与样式约束

请优先产出以下结构：
- 页面主组件
- mock data 文件
- 对比卡片组件
- 场景切换 tabs 组件
- 指标卡片组件
- 引擎拆解组件
- CTA section 组件

如果项目中已有 design system、Button、Card、Badge、Tabs、Chart 组件，优先复用。
不要重新发明一套 UI。

# 九、代码质量要求

必须满足：
- 代码可直接运行
- 组件结构清晰
- 文案已填充，不要留占位 lorem ipsum
- 所有 mock 数据真实可信
- 移动端与桌面端都适配
- 深浅色模式兼容
- 不要出现 console error
- 不要只给 JSX 片段，给完整页面实现

# 十、输出方式

请按下面顺序输出：
1. 先说明准备新增或修改哪些文件
2. 再输出完整代码
3. 如果需要新建 mock data 文件，也一起输出
4. 如果需要注册路由，也输出对应修改
5. 最后说明页面默认入口与预览方式

不要只输出设计说明。
不要只输出草图。
直接输出可以落地的前端页面代码。
优先基于现有路由和组件库实现，不要新建一套独立样式体系