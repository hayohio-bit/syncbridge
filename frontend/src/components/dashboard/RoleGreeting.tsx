import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useConfigStore } from '../../store/configStore';
import { ROLE_CONFIGS } from '../../config/roleConfig';
import {
  FilePlus2,
  FolderKanban,
  BarChart3,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
  FilePlus2,
  FolderKanban,
  BarChart3,
  ClipboardList,
};

export const RoleGreeting: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const dynamicConfig = useConfigStore((s) => s.roleConfig);
  const roleConfig = dynamicConfig || (user?.role ? ROLE_CONFIGS[user.role] : ROLE_CONFIGS.GENERAL);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요';
    if (hour < 18) return '좋은 오후예요';
    return '좋은 저녁이에요';
  };

  return (
    <div className="role-greeting-widget">
      <div className="greeting-content">
        <span className="greeting-wave">👋</span>
        <div className="greeting-text">
          <h2 className="greeting-title">
            {getTimeGreeting()}, <span className="user-name">{user?.name || '사용자'}</span>님!
          </h2>
          <p className="greeting-subtitle">{roleConfig.contextGreeting}</p>
        </div>
      </div>

      {roleConfig.quickActions.length > 0 && (
        <div className="quick-actions">
          {roleConfig.quickActions.map((action) => {
            const IconComponent = ICON_MAP[action.iconName];
            return (
              <Link
                key={action.path}
                to={action.path}
                className="quick-action-btn"
              >
                {IconComponent && <IconComponent size={16} />}
                <span>{action.label}</span>
                <ArrowRight size={14} className="arrow" />
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        .role-greeting-widget {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 32px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(59, 130, 246, 0.04) 100%);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 20px;
          gap: 24px;
          flex-wrap: wrap;
        }

        .greeting-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .greeting-wave {
          font-size: 2rem;
          line-height: 1;
        }

        .greeting-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .greeting-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .greeting-title .user-name {
          background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .greeting-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 500;
          margin: 0;
        }

        .quick-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text-main);
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }

        .quick-action-btn:hover {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px var(--primary-glow);
        }

        .quick-action-btn .arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s;
        }

        .quick-action-btn:hover .arrow {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 768px) {
          .role-greeting-widget {
            flex-direction: column;
            align-items: flex-start;
            padding: 24px;
          }

          .greeting-wave { font-size: 1.5rem; }
          .greeting-title { font-size: 1.15rem; }

          .quick-actions {
            width: 100%;
          }
          .quick-action-btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
