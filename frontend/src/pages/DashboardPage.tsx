import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { tasksApi } from '../api/tasks';
import { TaskListView } from '../components/TaskListView';
import { KanbanBoardView } from '../components/KanbanBoardView';
import { Skeleton, CardSkeleton } from '../components/ui/Skeleton';
import { MotionView, MotionItem } from '../components/layout/MotionView';
import type { TaskListDto, TaskStatus } from '../types';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, FilePlus2, Search, ListFilter } from 'lucide-react';

const REQUESTER_ROLES = ['GENERAL', 'PLANNER'];

const STAT_CONFIG = [
  { label: '전체 티켓',  icon: ClipboardList, colorRgb: '99,102,241',  key: 'total'      as const },
  { label: '대기 중',    icon: ListFilter,    colorRgb: '59,130,246',   key: 'todo'       as const },
  { label: '진행 중',    icon: Clock,         colorRgb: '245,158,11',   key: 'inProgress' as const },
  { label: '완료',       icon: CheckCircle2,  colorRgb: '16,185,129',   key: 'done'       as const },
];

export const DashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [tasks, setTasks] = useState<TaskListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // New Filter & View States
  const [taskSource, setTaskSource] = useState<'all' | 'requested' | 'assigned'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const isRequester = user?.role && REQUESTER_ROLES.includes(user.role);

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
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => ({
    total:      tasks.length,
    todo:       tasks.filter((t) => t.status === 'TODO').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    done:       tasks.filter((t) => t.status === 'DONE').length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    if (taskSource === 'all') return tasks;
    if (taskSource === 'requested') return tasks.filter(t => t.requesterId === user?.userId);
    if (taskSource === 'assigned') return tasks.filter(t => t.assigneeId === user?.userId);
    return tasks;
  }, [tasks, taskSource, user]);

  if (loading && tasks.length === 0) {
    return (
      <MotionView className="page-container">
        <div className="stat-cards-grid">
          <Skeleton height={104} borderRadius={18} />
          <Skeleton height={104} borderRadius={18} />
          <Skeleton height={104} borderRadius={18} />
          <Skeleton height={104} borderRadius={18} />
        </div>
        <CardSkeleton />
      </MotionView>
    );
  }

  return (
    <MotionView className="page-container" style={{ padding: 0 }}>
      {/* ── Stats ── */}
      <div className="stat-cards-grid">
        {STAT_CONFIG.map((stat, i) => (
          <MotionItem
            key={stat.label}
            index={i}
            className="stat-card"
            style={{
              '--stat-accent':   `rgb(${stat.colorRgb})`,
              '--stat-icon-bg':  `rgba(${stat.colorRgb}, 0.10)`,
            } as React.CSSProperties}
          >
            <div className="stat-card-icon">
              <stat.icon size={22} />
            </div>
            <div>
              <div className="stat-card-value">{stats[stat.key]}</div>
              <div className="stat-card-label">{stat.label}</div>
            </div>
          </MotionItem>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="dashboard-toolbar-v2">
        <div className="source-tabs">
          <button className={`source-tab ${taskSource === 'all' ? 'active' : ''}`} onClick={() => setTaskSource('all')}>
            전체 ({tasks.length})
          </button>
          <button className={`source-tab ${taskSource === 'requested' ? 'active' : ''}`} onClick={() => setTaskSource('requested')}>
            내가 보낸 요청 ({tasks.filter(t => t.requesterId === user?.userId).length})
          </button>
          <button className={`source-tab ${taskSource === 'assigned' ? 'active' : ''}`} onClick={() => setTaskSource('assigned')}>
            나에게 배정된 업무 ({tasks.filter(t => t.assigneeId === user?.userId).length})
          </button>
        </div>

        <div className="view-mode-toggle">
          <button className={`mode-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            <ListFilter size={16} /> 리스트
          </button>
          <button className={`mode-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>
            <Clock size={16} /> 칸반
          </button>
        </div>
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
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
          >
            <option value="">전체 상태</option>
            <option value="TODO">대기 (TODO)</option>
            <option value="IN_PROGRESS">진행 중</option>
            <option value="DONE">완료</option>
          </select>
        </div>
        <Link to="/create-task" className="btn btn-primary">
          <FilePlus2 size={17} />
          <span>신규 업무 요청</span>
        </Link>
      </div>

      {/* ── View ── */}
      <div className="view-panel">
        {viewMode === 'list' ? (
          <TaskListView tasks={filteredTasks} />
        ) : (
          <KanbanBoardView tasks={filteredTasks} onTaskUpdated={fetchTasks} onStatusChange={setTasks} />
        )}
      </div>

      <style>{`
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
          background: rgba(255,255,255,0.03);
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
      `}</style>
    </MotionView>
  );
};
