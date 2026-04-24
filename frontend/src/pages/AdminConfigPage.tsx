import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { ROLE_CONFIGS, RoleUIConfig } from '../config/roleConfig';
import { updateRoleConfig, fetchRoleConfig } from '../api/config';
import { Role } from '../types';
import { 
  Settings, Save, RefreshCw, AlertCircle, CheckCircle2, 
  Layout, Menu as MenuIcon, MessageSquare, List
} from 'lucide-react';
import { MotionView, MotionItem } from '../components/layout/MotionView';

const ROLES: Role[] = ['GENERAL', 'PLANNER', 'DESIGNER', 'FRONTEND', 'BACKEND'];

export const AdminConfigPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [selectedRole, setSelectedRole] = useState<Role>('GENERAL');
  const [config, setConfig] = useState<RoleUIConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadRoleConfig(selectedRole);
  }, [selectedRole]);

  const loadRoleConfig = async (role: Role) => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await fetchRoleConfig(role);
      setConfig(data);
    } catch (err) {
      console.error('Failed to fetch config, using default', err);
      setConfig(ROLE_CONFIGS[role]);
      setMessage({ type: 'error', text: 'DB 설정을 불러오지 못해 기본 설정을 표시합니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateRoleConfig(selectedRole, config);
      setMessage({ type: 'success', text: '설정이 성공적으로 저장되었습니다.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: '설정 저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof RoleUIConfig>(field: K, value: RoleUIConfig[K]) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  if (user?.role !== 'PLANNER' && user?.role !== 'BACKEND') {
    return <div className="page-container">접근 권한이 없습니다.</div>;
  }

  return (
    <MotionView className="page-container admin-config-page">
      <header className="admin-header">
        <div className="title-group">
          <Settings className="icon" size={28} />
          <h1>RBUIS Admin Console</h1>
        </div>
        <p className="subtitle">직무별 맞춤형 UI 레이아웃 및 컨텐츠를 실시간으로 제어합니다.</p>
      </header>

      <div className="admin-layout">
        <aside className="role-sidebar glass-card">
          <h3>대상 직무 선택</h3>
          <div className="role-list">
            {ROLES.map(r => (
              <button 
                key={r} 
                className={`role-item ${selectedRole === r ? 'active' : ''}`}
                onClick={() => setSelectedRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </aside>

        <main className="config-editor">
          {loading ? (
            <div className="loading-overlay"><RefreshCw className="spinner" /></div>
          ) : config && (
            <div className="editor-grid">
              <MotionItem index={1} className="editor-section glass-card">
                <div className="section-title">
                  <Layout size={18} />
                  <h4>대시보드 레이아웃 및 기본 뷰</h4>
                </div>
                
                <div className="field-group">
                  <label>기본 대시보드 뷰</label>
                  <select 
                    value={config.defaultDashboardView} 
                    onChange={(e) => updateField('defaultDashboardView', e.target.value as 'list' | 'kanban')}
                  >
                    <option value="list">리스트 (List)</option>
                    <option value="kanban">칸반 (Kanban)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>사용 가능한 위젯 (JSON Array)</label>
                  <textarea 
                    value={JSON.stringify(config.dashboardWidgets, null, 2)}
                    onChange={(e) => {
                      try { updateField('dashboardWidgets', JSON.parse(e.target.value)); } catch (err) { /* ignore parse error */ }
                    }}
                  />
                </div>
              </MotionItem>

              <MotionItem index={2} className="editor-section glass-card">
                <div className="section-title">
                  <MessageSquare size={18} />
                  <h4>텍스트 및 가이드</h4>
                </div>

                <div className="field-group">
                  <label>컨텍스트 인사말</label>
                  <input 
                    type="text" 
                    value={config.contextGreeting} 
                    onChange={(e) => updateField('contextGreeting', e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label>데이터 없음 메시지</label>
                  <textarea 
                    value={config.emptyStateMessage} 
                    onChange={(e) => updateField('emptyStateMessage', e.target.value)}
                  />
                </div>
              </MotionItem>

              <MotionItem index={3} className="editor-section glass-card">
                <div className="section-title">
                  <MenuIcon size={18} />
                  <h4>메뉴 및 액션</h4>
                </div>

                <div className="field-group">
                  <label>노출 메뉴 (JSON Array)</label>
                  <textarea 
                    value={JSON.stringify(config.menus, null, 2)}
                    onChange={(e) => {
                      try { updateField('menus', JSON.parse(e.target.value)); } catch (err) { /* ignore */ }
                    }}
                  />
                </div>

                <div className="field-group">
                  <label>퀵 액션 (JSON Array)</label>
                  <textarea 
                    style={{ minHeight: '150px' }}
                    value={JSON.stringify(config.quickActions, null, 2)}
                    onChange={(e) => {
                      try { updateField('quickActions', JSON.parse(e.target.value)); } catch (err) { /* ignore */ }
                    }}
                  />
                </div>
              </MotionItem>

              <MotionItem index={4} className="editor-section glass-card">
                <div className="section-title">
                  <List size={18} />
                  <h4>워크플로우 단계 및 통계</h4>
                </div>

                <div className="field-group">
                  <label>우선순위 워크플로우 (JSON Object)</label>
                  <textarea 
                    value={JSON.stringify(config.priorityWorkflowStep, null, 2)}
                    onChange={(e) => {
                      try { updateField('priorityWorkflowStep', JSON.parse(e.target.value)); } catch (err) { /* ignore */ }
                    }}
                  />
                </div>

                <div className="field-group">
                  <label>노출 통계 지표 (JSON Array)</label>
                  <textarea 
                    value={JSON.stringify(config.visibleStats, null, 2)}
                    onChange={(e) => {
                      try { updateField('visibleStats', JSON.parse(e.target.value)); } catch (err) { /* ignore */ }
                    }}
                  />
                </div>
              </MotionItem>
            </div>
          )}

          {message && (
            <div className={`admin-message ${message.type}`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          <footer className="editor-footer">
            <button className="btn-save" onClick={handleSave} disabled={saving || loading}>
              {saving ? <RefreshCw className="spinner" size={18} /> : <Save size={18} />}
              <span>변경 사항 저장 (실시간 반영)</span>
            </button>
          </footer>
        </main>
      </div>

      <style>{`
        .admin-header { margin-bottom: 40px; }
        .title-group { display: flex; align-items: center; gap: 12px; color: var(--primary); margin-bottom: 8px; }
        .title-group h1 { margin: 0; font-size: 1.8rem; font-weight: 900; color: var(--text-main); }
        .subtitle { color: var(--text-muted); font-size: 1rem; }

        .admin-layout { display: grid; grid-template-columns: 240px 1fr; gap: 32px; align-items: start; }
        
        .role-sidebar { padding: 24px; }
        .role-sidebar h3 { font-size: 0.9rem; text-transform: uppercase; color: var(--primary); margin-bottom: 16px; }
        .role-list { display: flex; flex-direction: column; gap: 8px; }
        .role-item { 
          padding: 12px 16px; border-radius: 10px; text-align: left; font-weight: 700; color: var(--text-muted);
          transition: all 0.2s;
        }
        .role-item:hover { background: rgba(255,255,255,0.05); color: var(--text-main); }
        .role-item.active { background: var(--primary); color: white; box-shadow: 0 4px 12px var(--primary-glow); }

        .editor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .editor-section { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
        .section-title { display: flex; align-items: center; gap: 10px; color: var(--primary); margin-bottom: 4px; }
        .section-title h4 { margin: 0; color: var(--text-main); font-weight: 800; }

        .field-group { display: flex; flex-direction: column; gap: 8px; }
        .field-group label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
        .field-group input, .field-group select, .field-group textarea {
          background: var(--bg-tertiary); border: 1px solid var(--glass-border); border-radius: 8px;
          padding: 10px 12px; color: var(--text-main); font-size: 0.9rem; outline: none;
        }
        .field-group textarea { min-height: 100px; font-family: monospace; font-size: 0.8rem; resize: vertical; }
        .field-group input:focus, .field-group textarea:focus { border-color: var(--primary); }

        .admin-message { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 10px; margin-top: 24px; font-weight: 600; font-size: 0.9rem; }
        .admin-message.success { background: rgba(16, 185, 129, 0.1); color: var(--color-success); border: 1px solid var(--color-success); }
        .admin-message.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444; }

        .editor-footer { margin-top: 32px; display: flex; justify-content: flex-end; }
        .btn-save {
          display: flex; align-items: center; gap: 10px; padding: 14px 32px; background: var(--primary);
          color: white; border-radius: 12px; font-weight: 800; box-shadow: 0 4px 14px var(--primary-glow);
          transition: all 0.2s;
        }
        .btn-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px var(--primary-glow); }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1200px) { .editor-grid { grid-template-columns: 1fr; } }
      `}</style>
    </MotionView>
  );
};
