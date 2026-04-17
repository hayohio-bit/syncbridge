import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Sidebar } from './layout/Sidebar';
import { Sun, Moon, Menu } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  GENERAL:  '일반 사무직',
  PLANNER:  '기획자',
  DESIGNER: '디자이너',
  FRONTEND: '프론트엔드',
  BACKEND:  '백엔드',
};

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':   '대시보드',
  '/create-task': '신규 업무 요청',
  '/projects':    '프로젝트 관리',
  '/analytics':   '데이터 분석',
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user        = useAuthStore((s) => s.user);
  const theme       = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const location    = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const getPageTitle = () => {
    if (location.pathname.startsWith('/tasks/')) return '업무 상세 정보';
    return PAGE_TITLES[location.pathname] || 'SyncBridge';
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="main-content">
        {/* Top header */}
        <header className="main-header">
          {/* Left: hamburger (mobile) + page title */}
          <div className="header-left-group">
            <button
              className="mobile-menu-btn icon-btn"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="메뉴 열기"
            >
              <Menu size={18} />
            </button>
            <h1 className="main-header-title">{getPageTitle()}</h1>
          </div>

          {/* Right: theme toggle + role badge + avatar */}
          <div className="header-right-group">
            <button
              className="icon-btn"
              onClick={toggleTheme}
              title={theme === 'light' ? '다크 모드' : '라이트 모드'}
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            <div className="role-badge">
              {user?.role ? ROLE_LABELS[user.role] : 'GUEST'}
            </div>

            <div className="user-avatar">
              {userInitial}
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="main-body">
          {children}
        </main>
      </div>

      <style>{`
        .header-left-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .header-right-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mobile-menu-btn { display: none; }
        .role-badge {
          padding: 5px 12px;
          border-radius: 8px;
          background: var(--primary-subtle);
          color: var(--primary);
          border: 1px solid rgba(99, 102, 241, 0.18);
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary, #6366f1) 0%, #8b5cf6 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 800;
          flex-shrink: 0;
          box-shadow: 0 2px 8px var(--primary-glow, rgba(99, 102, 241, 0.3));
        }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex; }
          .role-badge { display: none; }
        }
      `}</style>
    </div>
  );
};
