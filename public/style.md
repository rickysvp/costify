STYLEKIT_STYLE_REFERENCE
style_name: 仪表盘布局
style_slug: dashboard-layout
style_source: /styles/dashboard-layout

# Hard Prompt

请严格遵守以下风格规则并保持一致性，禁止风格漂移。

## 执行要求
- 优先保证风格一致性，其次再做创意延展。
- 遇到冲突时以禁止项为最高优先级。
- 输出前自检：颜色、排版、间距、交互是否仍属于该风格。

## Style Rules
# Dashboard Layout (仪表盘布局) Design System

> 数据驱动的仪表盘布局，包含侧边导航、顶部工具栏、多模块数据面板和图表区域，适合后台管理系统、数据分析平台和监控面板。

## 核心理念

Dashboard Layout 是一种以数据展示为核心的布局方案，通过侧边导航、多模块数据面板和灵活的网格系统，让用户高效地监控和分析多维数据。

核心理念：
- 数据优先：所有布局决策服务于数据的高效展示
- 模块化：每个数据面板独立成模块，可灵活组合
- 密度控制：在信息密度和可读性之间取得平衡
- 实时性：布局支持数据的实时更新和刷新

设计原则：
- 视觉一致性：所有组件必须遵循统一的视觉语言，从色彩到字体到间距保持谐调
- 层次分明：通过颜色深浅、字号大小、留白空间建立清晰的信息层级
- 交互反馈：每个可交互元素都必须有明确的 hover、active、focus 状态反馈
- 响应式适配：设计必须在移动端、平板、桌面端上保持一致的体验
- 无障碍性：确保色彩对比度符合 WCAG 2.1 AA 标准，所有交互元素可键盘访问

---

## Token 字典（精确 Class 映射）

### 边框
```
宽度: border
颜色: border-gray-200
圆角: rounded-xl
```

### 阴影
```
小:   shadow-sm
中:   shadow-sm
大:   shadow-md
悬停: hover:shadow-md
聚焦: focus:shadow-sm
```

### 交互效果
```
悬停位移: undefined
过渡动画: transition-colors duration-200
按下状态: active:scale-95
```

### 字体
```
标题: font-semibold tracking-tight
正文: font-sans
```

### 字号
```
Hero:  text-2xl md:text-3xl
H1:    text-xl md:text-2xl
H2:    text-lg md:text-xl
H3:    text-sm md:text-base
正文:  text-sm
小字:  text-xs
```

### 间距
```
Section: py-4 md:py-6
容器:    px-4 md:px-6
卡片:    p-4 md:p-6
```

---

## [FORBIDDEN] 绝对禁止

以下 class 在本风格中**绝对禁止使用**，生成时必须检查并避免：

### 禁止的 Class
- `rounded-none`
- `shadow-2xl`
- `font-black`
- `font-extrabold`
- `text-5xl`
- `text-6xl`
- `text-7xl`
- `text-8xl`
- `rounded-3xl`
- `rounded-full`

### 禁止的模式
- 匹配 `^rounded-(?:none|3xl|full)`
- 匹配 `^shadow-2xl`
- 匹配 `^text-[5-8]xl`

### 禁止原因
- `rounded-none`: Dashboard Layout uses rounded-xl for a modern data panel aesthetic
- `shadow-2xl`: Dashboard Layout uses minimal shadows to keep data focused
- `text-6xl`: Dashboard Layout uses compact typography for data-dense screens
- `rounded-full`: Dashboard Layout uses consistent rounded-xl panels, not pill shapes

> WARNING: 如果你的代码中包含以上任何 class，必须立即替换。

---

## [REQUIRED] 必须包含

### 按钮必须包含
```
rounded-lg
font-medium text-sm
transition-colors
```

### 卡片必须包含
```
bg-white
rounded-xl
shadow-sm
border border-gray-100
```

### 输入框必须包含
```
bg-gray-50
border border-gray-200
rounded-lg
text-sm
focus:outline-none
focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]
transition-all
```

---

## [COMPARE] 错误 vs 正确对比

### 按钮

[WRONG] **错误示例**（使用了圆角和模糊阴影）：
```html
<button class="rounded-lg shadow-lg bg-blue-500 text-white px-4 py-2 hover:bg-blue-600">
  点击我
</button>
```

[CORRECT] **正确示例**（使用硬边缘、无圆角、位移效果）：
```html
<button class="rounded-lg font-medium text-sm transition-colors bg-[#ff006e] text-white px-4 py-2 md:px-6 md:py-3">
  点击我
</button>
```

### 卡片

[WRONG] **错误示例**（使用了渐变和圆角）：
```html
<div class="rounded-xl shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-6">
  <h3 class="text-xl font-semibold">标题</h3>
</div>
```

[CORRECT] **正确示例**（纯色背景、硬边缘阴影）：
```html
<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
  <h3 class="font-semibold tracking-tight text-sm md:text-base">标题</h3>
</div>
```

### 输入框

[WRONG] **错误示例**（灰色边框、圆角）：
```html
<input class="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500" />
```

[CORRECT] **正确示例**（黑色粗边框、聚焦阴影）：
```html
<input class="bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all px-3 py-2 md:px-4 md:py-3" placeholder="请输入..." />
```

---

## [TEMPLATES] 页面骨架模板

使用以下模板生成页面，只需替换 `{PLACEHOLDER}` 部分：

### 导航栏骨架
```html
<nav class="bg-white border-b-2 md:border-b-4 border-black px-4 md:px-8 py-3 md:py-4">
  <div class="flex items-center justify-between max-w-6xl mx-auto">
    <a href="/" class="font-black text-xl md:text-2xl tracking-wider">
      {LOGO_TEXT}
    </a>
    <div class="flex gap-4 md:gap-8 font-mono text-sm md:text-base">
      {NAV_LINKS}
    </div>
  </div>
</nav>
```

### Hero 区块骨架
```html
<section class="min-h-[60vh] md:min-h-[80vh] flex items-center px-4 md:px-8 py-12 md:py-0 bg-{ACCENT_COLOR} border-b-2 md:border-b-4 border-black">
  <div class="max-w-4xl mx-auto">
    <h1 class="font-black text-4xl md:text-6xl lg:text-8xl leading-tight tracking-tight mb-4 md:mb-6">
      {HEADLINE}
    </h1>
    <p class="font-mono text-base md:text-xl max-w-xl mb-6 md:mb-8">
      {SUBHEADLINE}
    </p>
    <button class="bg-black text-white font-black px-6 py-3 md:px-8 md:py-4 border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,0,110,1)] md:shadow-[8px_8px_0px_0px_rgba(255,0,110,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-sm md:text-base">
      {CTA_TEXT}
    </button>
  </div>
</section>
```

### 卡片网格骨架
```html
<section class="py-12 md:py-24 px-4 md:px-8">
  <div class="max-w-6xl mx-auto">
    <h2 class="font-black text-2xl md:text-4xl mb-8 md:mb-12">{SECTION_TITLE}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <!-- Card template - repeat for each card -->
      <div class="bg-white border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6 hover:shadow-[4px_4px_0px_0px_rgba(255,0,110,1)] md:hover:shadow-[8px_8px_0px_0px_rgba(255,0,110,1)] hover:-translate-y-1 transition-all">
        <h3 class="font-black text-lg md:text-xl mb-2">{CARD_TITLE}</h3>
        <p class="font-mono text-sm md:text-base text-gray-700">{CARD_DESCRIPTION}</p>
      </div>
    </div>
  </div>
</section>
```

### 页脚骨架
```html
<footer class="bg-black text-white py-12 md:py-16 px-4 md:px-8 border-t-2 md:border-t-4 border-black">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <span class="font-black text-xl md:text-2xl">{LOGO_TEXT}</span>
        <p class="font-mono text-sm mt-4 text-gray-400">{TAGLINE}</p>
      </div>
      <div>
        <h4 class="font-black text-lg mb-4">{COLUMN_TITLE}</h4>
        <ul class="space-y-2 font-mono text-sm text-gray-400">
          {FOOTER_LINKS}
        </ul>
      </div>
    </div>
  </div>
</footer>
```

---

## [CHECKLIST] 生成后自检清单

**在输出代码前，必须逐项验证以下每一条。如有违反，立即修正后再输出：**

### 1. 圆角检查
- [ ] 搜索代码中的 `rounded-`
- [ ] 确认只有 `rounded-none` 或无圆角
- [ ] 如果发现 `rounded-lg`、`rounded-md` 等，替换为 `rounded-none`

### 2. 阴影检查
- [ ] 搜索代码中的 `shadow-`
- [ ] 确认只使用 `shadow-[Xpx_Xpx_0px_0px_rgba(...)]` 格式
- [ ] 如果发现 `shadow-lg`、`shadow-xl` 等，替换为正确格式

### 3. 边框检查
- [ ] 搜索代码中的 `border-`
- [ ] 确认边框颜色是 `border-black`
- [ ] 如果发现 `border-gray-*`、`border-slate-*`，替换为 `border-black`

### 4. 交互检查
- [ ] 所有按钮都有 `hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`
- [ ] 所有卡片都有 hover 效果（阴影变色或位移）
- [ ] 都包含 `transition-all`

### 5. 响应式检查
- [ ] 边框有 `border-2 md:border-4`
- [ ] 阴影有 `shadow-[4px...] md:shadow-[8px...]`
- [ ] 间距有 `p-4 md:p-6` 或类似的响应式值
- [ ] 字号有 `text-sm md:text-base` 或类似的响应式值

### 6. 字体检查
- [ ] 标题使用 `font-black`
- [ ] 正文使用 `font-mono`

> CRITICAL: **如果任何一项检查不通过，必须修正后重新生成代码。**

---

## [EXAMPLES] 示例 Prompt

### 1. 电商仪表盘

电商数据分析仪表盘

```
用 Dashboard Layout 设计一个电商仪表盘，要求：
1. 侧边栏：概览、订单、商品、客户、分析、设置
2. KPI：总收入、订单数、平均客单价、退货率
3. 主图表：收入趋势折线图（占2/3宽）
4. 辅助图表：商品分类饼图
5. 底部：最近订单表格
6. 所有数字带增长/下降百分比
7. 响应式折叠侧边栏
```

### 2. SaaS 着陆页

生成 仪表盘布局风格的 SaaS 产品着陆页

```
Create a SaaS landing page using Dashboard Layout style with hero section, feature grid, testimonials, pricing table, and footer.
```

### 3. 作品集展示

生成 仪表盘布局风格的作品集页面

```
Create a portfolio showcase page using Dashboard Layout style with project grid, about section, contact form, and consistent visual language.
```