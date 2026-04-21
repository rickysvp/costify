import { useNavigate } from 'react-router-dom';
import { ChevronRight, ExternalLink, Github, Twitter, Globe, MessageCircle } from 'lucide-react';

interface SOPNode {
  id: string;
  title: string;
  children?: SOPNode[];
  links?: { name: string; url: string; icon?: string }[];
}

const sopData: SOPNode[] = [
  {
    id: '1',
    title: '确定要做什么',
    children: [
      { id: '1-1', title: '自己的痛点 / 痒点' },
      { id: '1-2', title: '新词 / 热词' },
      { id: '1-3', title: '致敬成功案例' }
    ]
  },
  {
    id: '2',
    title: '确定产品名称',
    children: [
      {
        id: '2-1',
        title: '确定品牌词',
        children: [
          { id: '2-1-1', title: '自己想' },
          { id: '2-1-2', title: 'GPT 生成' }
        ]
      },
      {
        id: '2-2',
        title: '品牌重名检测',
        children: [
          { id: '2-2-1', title: 'Google', links: [{ name: 'Google', url: 'https://google.com' }] },
          { id: '2-2-2', title: 'Github', links: [{ name: 'Github', url: 'https://github.com' }] },
          { id: '2-2-3', title: 'Twitter', links: [{ name: 'Twitter', url: 'https://twitter.com' }] }
        ]
      },
      {
        id: '2-3',
        title: '购买域名',
        links: [{ name: 'namecheap', url: 'https://namecheap.com' }]
      }
    ]
  },
  {
    id: '3',
    title: '把产品做出来',
    children: [
      {
        id: '3-1',
        title: '选择全栈开发框架',
        links: [{ name: 'nextjs', url: 'https://nextjs.org' }]
      },
      {
        id: '3-2',
        title: '后台开发',
        children: [
          { id: '3-2-1', title: '调用下游 API' },
          { id: '3-2-2', title: '数据读写' },
          { id: '3-2-3', title: '暴露 API 给上游' }
        ]
      },
      {
        id: '3-3',
        title: '前端开发',
        children: [
          { id: '3-3-1', title: '写 UI 组件' },
          { id: '3-3-2', title: '写落地页' }
        ]
      }
    ]
  },
  {
    id: '4',
    title: '部署上线',
    children: [
      {
        id: '4-1',
        title: '代码托管',
        links: [{ name: 'Github', url: 'https://github.com' }]
      },
      {
        id: '4-2',
        title: '自动发布',
        links: [{ name: 'Vercel', url: 'https://vercel.com' }]
      },
      {
        id: '4-3',
        title: '域名解析',
        links: [{ name: 'Cloudflare', url: 'https://cloudflare.com' }]
      }
    ]
  },
  {
    id: '5',
    title: '推广宣传',
    children: [
      {
        id: '5-1',
        title: '产品发布',
        children: [
          { id: '5-1-1', title: 'ProductHunt', links: [{ name: 'ProductHunt', url: 'https://producthunt.com' }] },
          { id: '5-1-2', title: 'Github', links: [{ name: 'Github', url: 'https://github.com' }] },
          { id: '5-1-3', title: 'V2EX', links: [{ name: 'V2EX', url: 'https://v2ex.com' }] }
        ]
      },
      {
        id: '5-2',
        title: '社交传播',
        children: [
          { id: '5-2-1', title: 'Twitter', links: [{ name: 'Twitter', url: 'https://twitter.com' }] },
          { id: '5-2-2', title: '即刻', links: [{ name: '即刻', url: 'https://jike.city' }] }
        ]
      }
    ]
  },
  {
    id: '6',
    title: '数据分析',
    children: [
      {
        id: '6-1',
        title: '访问统计',
        links: [{ name: 'Google Analytics', url: 'https://analytics.google.com' }]
      },
      {
        id: '6-2',
        title: '搜索分析',
        links: [{ name: 'Google Search Console', url: 'https://search.google.com/search-console' }]
      }
    ]
  },
  {
    id: '7',
    title: '运营迭代',
    children: [
      {
        id: '7-1',
        title: '收集用户反馈',
        children: [
          { id: '7-1-1', title: 'Email' },
          { id: '7-1-2', title: 'Discord', links: [{ name: 'Discord', url: 'https://discord.com' }] },
          { id: '7-1-3', title: 'Github Issues', links: [{ name: 'Github Issues', url: 'https://github.com' }] }
        ]
      }
    ]
  }
];

const LinkIcon = ({ name }: { name: string }) => {
  if (name.includes('github')) return <Github className="w-3 h-3" />;
  if (name.includes('twitter')) return <Twitter className="w-3 h-3" />;
  if (name.includes('google')) return <Globe className="w-3 h-3" />;
  if (name.includes('discord')) return <MessageCircle className="w-3 h-3" />;
  return <ExternalLink className="w-3 h-3" />;
};

const TreeNode = ({ node, level = 0, isLast = false }: { node: SOPNode; level?: number; isLast?: boolean }) => {
  const hasChildren = node.children && node.children.length > 0;
  const hasLinks = node.links && node.links.length > 0;

  return (
    <div className="relative">
      {/* 连接线 */}
      {level > 0 && (
        <>
          {/* 水平线 */}
          <div 
            className="absolute bg-blue-300" 
            style={{ 
              left: '-24px', 
              top: '20px', 
              width: '24px', 
              height: '2px' 
            }} 
          />
          {/* 垂直线 - 如果不是最后一个子节点 */}
          {!isLast && (
            <div 
              className="absolute bg-blue-300" 
              style={{ 
                left: '-24px', 
                top: '20px', 
                width: '2px', 
                height: 'calc(100% + 16px)' 
              }} 
            />
          )}
        </>
      )}

      {/* 节点内容 */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`
          px-4 py-2 rounded-lg text-sm font-medium min-w-[140px]
          ${level === 0 
            ? 'bg-blue-500 text-white shadow-md' 
            : hasChildren 
              ? 'bg-white border-2 border-blue-400 text-blue-700' 
              : 'bg-blue-50 border border-blue-200 text-blue-600'
          }
        `}>
          {node.title}
        </div>

        {/* 链接 */}
        {hasLinks && (
          <div className="flex flex-wrap gap-2 mt-1">
            {node.links!.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors"
              >
                <LinkIcon name={link.name.toLowerCase()} />
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* 子节点 */}
      {hasChildren && (
        <div className="ml-8 relative">
          {node.children!.map((child, index) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              level={level + 1}
              isLast={index === node.children!.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SOPHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img src="/anytokn.png" alt="AnyTokn" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">AnyTokn</span>
            </div>
            <nav className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                控制台
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                登录
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">独立开发 SOP</h1>
          <p className="text-gray-600">从想法到产品的完整流程指南</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-4">
            {sopData.map((node, index) => (
              <TreeNode 
                key={node.id} 
                node={node} 
                level={0}
                isLast={index === sopData.length - 1}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">© 2024 AnyTokn. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SOPHome;
