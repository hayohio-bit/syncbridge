import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useConfigStore } from '../store/configStore';
import { ROLE_CONFIGS } from '../config/roleConfig';
import { tasksApi } from '../api/tasks';
import { TaskListView } from '../components/TaskListView';
import { KanbanBoardView } from '../components/KanbanBoardView';
import { Skeleton, CardSkeleton } from '../components/ui/Skeleton';
import { MotionView, MotionItem } from '../components/layout/MotionView';
import { DynamicWidget, SituationAlert } from '../components/dashboard/DynamicWidget';
import { RoleGreeting } from '../components/dashboard/RoleGreeting';
import { MyTasksSummary } from '../components/dashboard/MyTasksSummary';
import { TeamProgress } from '../components/dashboard/TeamProgress';
import { WidgetTogglePanel } from '../components/dashboard/WidgetTogglePanel';
import { useWidgetPreferenceStore } from '../store/widgetPreferenceStore';
import type { TaskListDto, TaskStatus } from '../types';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, FilePlus2, Search, ListFilter, Lightbulb } from 'lucide-react';

const STAT_CONFIG = [
  { label: '전체 티켓',  icon: ClipboardList, colorRgb: '99,102,241',  key: 'total'      as const },
  { label: '대기 중',    icon: ListFilter,    colorRgb: '59,130,246',   key: 'todo'       as const },
  { label: '진행 중',    icon: Clock,         colorRgb: '245,158,11',   key: 'inProgress' as const },
  { label: '완료',       icon: CheckCircle2,  colorRgb: '16,185,129',   key: 'done'       as const },
];

export const DashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { isOverloaded, adaptiveMode, evaluateSituation, lastTaskUpdate } = useUIStore();
  const dynamicConfig = useConfigStore((s) => s.roleConfig);
  const hiddenWidgets = useWidgetPreferenceStore((s) => s.hiddenWidgets);
  
  const roleConfig = useMemo(() => {
    return dynamicConfig || (user?.role ? ROLE_CONFIGS[user.role] : ROLE_CONFIGS.GENERAL);
  }, [user?.role, dynamicConfig]);

  const [tasks, setTasks] = useState<TaskListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter] = useState<TaskStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Adaptive States
  const [taskSource, setTaskSource] = useState<'all' | 'requested' | 'assigned'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>(roleConfig.defaultDashboardView);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await tasksApi.getTasks(
        statusFilter ? statusFilter as TaskStatus : undefined,
        undefined,
        debouncedSearch || undefined
      );
      setTasks(data);
      
      // Situational Analysis
      const overdueCount = data.filter(t => t.status !== 'DONE' && new Date(t.createdAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
      evaluateSituation(data.length, overdueCount);
      
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, evaluateSituation]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, lastTaskUpdate]);

  // If overloaded, force list view for high density
  useEffect(() => {
    if (isOverloaded) {
      setViewMode('list');
    }
  }, [isOverloaded]);

  const stats = useMemo(() => ({
    total:      tasks.length,
    todo:       tasks.filter((t) => t.status === 'TODO').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    done:       tasks.filter((t) => t.status === 'DONE').length,
  }), [tasks]);

  const filteredStats = useMemo(() => {
    return STAT_CONFIG.filter(s => roleConfig.visibleStats.includes(s.key));
  }, [roleConfig.visibleStats]);

  const filteredTasks = useMemo(() => {
    if (taskSource === 'all') return tasks;
    if (taskSource === 'requested') return tasks.filter(t => t.requesterId === user?.userId);
    if (taskSource === 'assigned') return tasks.filter(t => t.assigneeId === user?.userId);
    return tasks;
  }, [tasks, taskSource, user]);

  const workflowHint = useMemo(() => {
    // Basic Workflow recommendation based on role and tasks
    const todoCount = tasks.filter(t => t.status === 'TODO').length;
    if (todoCount > 0) {
      return roleConfig.priorityWorkflowStep['TODO'];
    }
    return null;
  }, [tasks, roleConfig]);

  if (loading && tasks.length === 0) {
    return (
      <MotionView className="page-container">
        <div className="stat-cards-grid">
          <Skeleton height={104} borderRadius={18} />
          <Skeleton height={104} borderRadius={18} />
        </div>
        <CardSkeleton />
      </MotionView>
    );
  }

  const renderWidget = (widgetType: string) => {
    switch (widgetType) {
      case 'greeting':
        return <RoleGreeting key="greeting" />;

      case 'my-summary':
      case 'my-tasks':
        return <MyTasksSummary key="my-summary" tasks={tasks} />;

      case 'team-progress':
        return <TeamProgress key="team-progress" tasks={tasks} />;

      case 'stats':
        return (
          <div key="stats" className="stat-cards-grid">
            {filteredStats.map((stat, i) => (
              <MotionItem
                key={stat.label}
                index={i}
                className={`stat-card ${adaptiveMode}`}
                style={{
                  '--stat-accent':   `rgb(${stat.colorRgb})`,
                  '--stat-icon-bg':  `rgba(${stat.colorRgb}, 0.10)`,
                } as React.CSSProperties}
              >
                <div className="stat-card-icon">
                  <stat.icon size={adaptiveMode === 'compact' ? 18 : 22} />
                </div>
                <div>
                  <div className="stat-card-value">{stats[stat.key]}</div>
                  <div className="stat-card-label">{stat.label}</div>
                </div>
              </MotionItem>
            ))}
          </div>
        );

      case 'workflow-hint':
        if (!workflowHint) return null;
        return (
          <div key="workflow" className="workflow-hint-card">
            <div className="hint-icon"><Lightbulb size={18} /></div>
            <div className="hint-content">
              <span className="hint-label">오늘의 우선순위 가이드 ({user?.role})</span>
              <span className="hint-text">{workflowHint}</span>
            </div>
          </div>
        );

      case 'toolbar':
        return (
          <div key="toolbar">
            <div className="dashboard-toolbar-v2">
              <div className="source-tabs">
                <button className={`source-tab ${taskSource === 'all' ? 'active' : ''}`} onClick={() => setTaskSource('all')}>
                  전체 ({tasks.length})
                </button>
                <button className={`source-tab ${taskSource === 'requested' ? 'active' : ''}`} onClick={() => setTaskSource('requested')}>
                  요청한 업무
                </button>
                <button className={`source-tab ${taskSource === 'assigned' ? 'active' : ''}`} onClick={() => setTaskSource('assigned')}>
                  내 업무
                </button>
              </div>

              {!isOverloaded && (
                <div className="view-mode-toggle">
                  <button className={`mode-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                    <ListFilter size={16} /> 리스트
                  </button>
                  <button className={`mode-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>
                    <Clock size={16} /> 칸반
                  </button>
                </div>
              )}
            </div>

            <div className="dashboard-toolbar">
              <div className="dashboard-filters">
                <div className="search-box">
                  <Search className="search-icon" size={17} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="업무 제목 또는 내용 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Link to="/create-task" className="btn btn-primary">
                <FilePlus2 size={17} />
                <span>신규 업무 요청</span>
              </Link>
            </div>
          </div>
        );

      case 'main-view':
        return (
          <div key="view" className="view-panel">
            {viewMode === 'list' ? (
              <TaskListView tasks={filteredTasks} />
            ) : (
              <KanbanBoardView tasks={filteredTasks} onTaskUpdated={fetchTasks} onStatusChange={setTasks} />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MotionView className="page-container" style={{ padding: 0 }}>
      <div className="dashboard-top-bar">
        <SituationAlert isOverloaded={isOverloaded} />
        <WidgetTogglePanel availableWidgets={roleConfig.dashboardLayout.map(l => l.widget)} />
      </div>
      
      {/* Role-based Dynamic Layout Rendering */}
      {roleConfig.dashboardLayout
        .filter((item) => !hiddenWidgets.includes(item.widget))
        .sort((a, b) => a.order - b.order)
        .map((item) => (
          <DynamicWidget 
            key={item.widget} 
            type={item.widget} 
            order={item.order} 
            adaptiveMode={adaptiveMode}
          >
            {renderWidget(item.widget)}
          </DynamicWidget>
        ))}

      <style>{`
        .dashboard-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .dashboard-toolbar-v2 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 20px;
        }

        .source-tabs {
          display: flex;
          background: rgba(255,255,255,0.03);
          padding: 4px;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
        }

        .source-tab {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          transition: all 0.2s;
        }

        .source-tab.active {
          background: var(--primary);
          color: #fff;
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .view-mode-toggle {
          display: flex;
          gap: 8px;
        }

        .mode-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .mode-btn.active {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
        }

        .workflow-hint-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .hint-icon {
          width: 40px;
          height: 40px;
          background: rgba(99, 102, 241, 0.2);
          color: var(--primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hint-content {
          display: flex;
          flex-direction: column;
        }

        .hint-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hint-text {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .stat-card.compact {
          padding: 12px 16px;
        }
        .stat-card.compact .stat-card-value {
          font-size: 1.25rem;
        }
      `}</style>
    </MotionView>
  );
};

export default DashboardPage;
