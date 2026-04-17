import React, { useState, memo } from 'react';
import { Sidebar } from './Sidebar';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Menu, Bell, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell 컴포넌트
 * - 애플리케이션의 메인 레이아웃 프레임워크입니다.
 * - 사이드바, 헤더, 메인 콘텐츠 영역을 결합합니다.
 */
export const AppShell = memo(({ children }: AppShellProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar - Desktop is sticky, Mobile is drawer */}
      <Sidebar 
        isOpen={isMobile ? isSidebarOpen : false} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="main-container">
        {/* Top Header */}
        <header className="app-header">
          <div className="header-left">
            {isMobile && (
              <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
              </button>
            )}
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="업무, 용어, 프로젝트 검색..." />
            </div>
          </div>

          <div className="header-right">
            <button className="icon-btn" title="알림">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
            <div className="header-divider" />
            <div className="user-badge">
              <div className="status-indicator online" />
              <span>Workspace</span>
            </div>
          </div>
        </header>

        {/* Main View Area */}
        <main className="app-main">
          <div className="content-wrapper">
             <AnimatePresence mode="wait">
               {children}
             </AnimatePresence>
          </div>
        </main>
      </div>

      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-primary);
        }

        .main-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0; /* Prevent flex box overflow */
        }

        .app-header {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          background: rgba(18, 21, 30, 0.4);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--glass-border);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .menu-toggle {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          color: var(--text-main);
          border: 1px solid var(--glass-border);
        }

        .search-bar {
          position: relative;
          max-width: 400px;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-bar input {
          width: 100%;
          padding: 10px 14px 10px 42px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text-main);
          font-family: inherit;
          transition: all 0.2s;
        }

        .search-bar input:focus {
          outline: none;
          background: rgba(255,255,255,0.06);
          border-color: var(--primary);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .icon-btn {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.2s;
        }

        .icon-btn:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text-main);
        }

        .notification-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: var(--color-error);
          border-radius: 50%;
          border: 2px solid var(--bg-secondary);
        }

        .header-divider {
          width: 1px;
          height: 24px;
          background: var(--glass-border);
        }

        .user-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: var(--bg-tertiary);
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-indicator.online {
          background: var(--color-success);
          box-shadow: 0 0 8px var(--color-success);
        }

        .app-main {
          flex: 1;
          padding: 32px;
          overflow-x: hidden;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        @media (max-width: 768px) {
          .app-header {
            padding: 0 16px;
          }
          .app-main {
            padding: 20px 16px;
          }
          .search-bar { display: none; }
        }
      `}</style>
    </div>
  );
});

AppShell.displayName = 'AppShell';
