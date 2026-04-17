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
        {isRequester ? (
          <TaskListView tasks={tasks} />
        ) : (
          <KanbanBoardView tasks={tasks} onTaskUpdated={fetchTasks} onStatusChange={setTasks} />
        )}
      </div>
    </MotionView>
  );
};
