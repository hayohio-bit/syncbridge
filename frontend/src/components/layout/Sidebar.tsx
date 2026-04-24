import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus2,
  FolderKanban,
  BarChart3,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useConfigStore } from '../../store/configStore';
import { authApi } from '../../api/auth';
import { ROLE_CONFIGS } from '../../config/roleConfig';

const ROLE_LABELS: Record<string, string> = {
  GENERAL:  '일반 사무직',
  PLANNER:  '기획자',
  DESIGNER: '디자이너',
  FRONTEND: '프론트엔드',
  BACKEND:  '백엔드',
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user         = useAuthStore((s) => s.user);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const logout       = useAuthStore((s) => s.logout);
  const dynamicConfig = useConfigStore((s) => s.roleConfig);
  const navigate     = useNavigate();

  const handleLogout = async () => {
    try { if (refreshToken) await authApi.logout(refreshToken); } catch { /* ignore */ }
    logout();
    navigate('/login');
  };

  const menuItems = useMemo(() => {
    const allItems = [
      { to: '/dashboard',   label: '대시보드',  icon: LayoutDashboard },
      { to: '/create-task', label: '업무 요청',  icon: FilePlus2 },
      { to: '/projects',    label: '프로젝트',   icon: FolderKanban },
      { to: '/analytics',   label: '데이터 분석', icon: BarChart3 },
    ];

    if (!user?.role) return allItems;

    const roleConfig = dynamicConfig || ROLE_CONFIGS[user.role] || ROLE_CONFIGS.GENERAL;
    const allowedMenus = roleConfig.menus || [];
    return allItems.filter(item => allowedMenus.includes(item.label));
  }, [user, dynamicConfig]);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
          }}
        />
      )}

      <aside className={`sb-root${isCollapsed ? ' sb-collapsed' : ''}${isOpen ? ' sb-mobile-open' : ''}`}>
        {/* Header */}
        <div className="sb-header">
          <div className="sb-logo">SB</div>
          {!isCollapsed && <span className="sb-title">SyncBridge</span>}
          <button
            className="sb-collapse-btn"
            onClick={() => setIsCollapsed((v) => !v)}
            title={isCollapsed ? '펼치기' : '접기'}
          >
            <ChevronLeft
              size={14}
              style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
            />
          </button>
        </div>

        {/* Nav */}
        <nav className="sb-nav">
          {!isCollapsed && <span className="sb-section-title">메뉴</span>}
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}
              title={isCollapsed ? item.label : ''}
              onClick={onClose}
            >
              <item.icon size={20} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-avatar">{userInitial}</div>
            {!isCollapsed && (
              <div className="sb-user-info">
                <span className="sb-user-name">{user?.name || '사용자'}</span>
                <span className="sb-user-role">{user?.role ? ROLE_LABELS[user.role] : '역할'}</span>
              </div>
            )}
          </div>

          <button className="sb-logout" onClick={handleLogout} title="로그아웃">
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {!isCollapsed && <span>로그아웃</span>}
          </button>
        </div>
      </aside>

      <style>{`
        /* ── Sidebar Root ── */
        .sb-root {
          width: var(--sidebar-width, 280px);
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border-right: 1px solid var(--glass-border);
          padding: 22px 14px;
          transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 200;
          flex-shrink: 0;
          overflow: hidden;
        }

        .sb-root.sb-collapsed { width: 72px; }

        /* ── Header ── */
        .sb-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          padding: 0 8px;
          position: relative;
          min-height: 40px;
        }

        .sb-logo {
          width: 38px;
          height: 38px;
          min-width: 38px;
          background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 0.9rem;
          color: #fff;
          box-shadow: 0 4px 14px var(--primary-glow);
          letter-spacing: -0.03em;
        }

        .sb-title {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
        }

        .sb-collapse-btn {
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          width: 22px;
          height: 22px;
          background: var(--primary);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px var(--primary-glow);
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 10;
        }

        .sb-root:hover .sb-collapse-btn { opacity: 1; }

        /* ── Navigation ── */
        .sb-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          overflow: hidden;
        }

        .sb-section-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 0 10px;
          margin: 8px 0 10px;
          opacity: 0.6;
          white-space: nowrap;
        }

        .sb-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border-radius: 11px;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          transition: background 0.18s, color 0.18s, transform 0.18s;
          white-space: nowrap;
          overflow: hidden;
        }

        .sb-collapsed .sb-link {
          justify-content: center;
          padding: 11px;
        }

        .sb-link:hover {
          background: var(--primary-subtle, rgba(99,102,241,0.08));
          color: var(--text-main);
        }

        .sb-link.active {
          background: var(--primary-subtle, rgba(99,102,241,0.12));
          color: var(--primary);
        }

        /* ── Footer ── */
        .sb-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sb-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 8px;
          border-radius: 11px;
          overflow: hidden;
        }

        .sb-collapsed .sb-user { justify-content: center; }

        .sb-avatar {
          width: 34px;
          height: 34px;
          min-width: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary, #6366f1) 0%, #8b5cf6 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 800;
          box-shadow: 0 2px 8px var(--primary-glow, rgba(99, 102, 241, 0.25));
        }

        .sb-user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        .sb-user-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sb-user-role {
          font-size: 0.72rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sb-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 11px;
          color: var(--color-error);
          font-weight: 600;
          font-size: 0.875rem;
          opacity: 0.65;
          transition: background 0.18s, opacity 0.18s;
          white-space: nowrap;
          overflow: hidden;
        }

        .sb-collapsed .sb-logout { justify-content: center; padding: 10px; }

        .sb-logout:hover {
          background: rgba(239, 68, 68, 0.08);
          opacity: 1;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .sb-root {
            position: fixed;
            left: -300px;
            height: 100vh;
            width: 280px !important;
            transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 1000;
            box-shadow: 4px 0 40px rgba(0,0,0,0.3);
          }
          .sb-root.sb-mobile-open { left: 0; }
          .sb-collapse-btn { display: none; }
          /* Always show labels on mobile */
          .sb-title,
          .sb-link > span,
          .sb-section-title,
          .sb-user-info,
          .sb-logout > span {
            display: flex !important;
            opacity: 1 !important;
          }
          .sb-link { justify-content: flex-start !important; padding: 11px 12px !important; }
          .sb-user { justify-content: flex-start !important; }
          .sb-logout { justify-content: flex-start !important; padding: 10px 12px !important; }
        }
      `}</style>
    </>
  );
};
