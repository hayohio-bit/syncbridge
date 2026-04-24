import React, { useMemo } from 'react';
import type { TaskListDto } from '../../types';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

interface TeamProgressProps {
  tasks: TaskListDto[];
}

export const TeamProgress: React.FC<TeamProgressProps> = ({ tasks }) => {
  const progressData = useMemo(() => {
    const total = tasks.length;
    if (total === 0) return { donePercent: 0, inProgressPercent: 0, todoPercent: 0, total: 0 };

    const done = tasks.filter((t) => t.status === 'DONE').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todo = tasks.filter((t) => t.status === 'TODO').length;

    return {
      donePercent: Math.round((done / total) * 100),
      inProgressPercent: Math.round((inProgress / total) * 100),
      todoPercent: Math.round((todo / total) * 100),
      total,
      done,
      inProgress,
      todo,
    };
  }, [tasks]);

  if (progressData.total === 0) return null;

  return (
    <div className="team-progress-widget">
      <div className="tp-header">
        <div className="tp-title-group">
          <TrendingUp size={18} className="tp-icon" />
          <h3 className="tp-title">전체 팀 진행률</h3>
        </div>
        <div className="tp-completion">
          <CheckCircle2 size={16} />
          <span>{progressData.donePercent}% 완료</span>
        </div>
      </div>

      <div className="tp-bar-container">
        <div className="tp-bar">
          <div
            className="tp-bar-segment done"
            style={{ width: `${progressData.donePercent}%` }}
          />
          <div
            className="tp-bar-segment in-progress"
            style={{ width: `${progressData.inProgressPercent}%` }}
          />
          <div
            className="tp-bar-segment todo"
            style={{ width: `${progressData.todoPercent}%` }}
          />
        </div>
      </div>

      <div className="tp-legend">
        <div className="tp-legend-item">
          <span className="tp-dot done" />
          <span className="tp-legend-label">완료 {progressData.done}건</span>
        </div>
        <div className="tp-legend-item">
          <span className="tp-dot in-progress" />
          <span className="tp-legend-label">진행 중 {progressData.inProgress}건</span>
        </div>
        <div className="tp-legend-item">
          <span className="tp-dot todo" />
          <span className="tp-legend-label">대기 {progressData.todo}건</span>
        </div>
      </div>

      <style>{`
        .team-progress-widget {
          padding: 24px 28px;
          background: var(--bg-tertiary);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .tp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .tp-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .tp-icon {
          color: var(--primary);
        }

        .tp-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }

        .tp-completion {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 10px;
          color: #10b981;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .tp-bar-container {
          width: 100%;
        }

        .tp-bar {
          display: flex;
          width: 100%;
          height: 10px;
          border-radius: 6px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.04);
        }

        .tp-bar-segment {
          height: 100%;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tp-bar-segment.done {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .tp-bar-segment.in-progress {
          background: linear-gradient(90deg, #6366f1, #818cf8);
        }

        .tp-bar-segment.todo {
          background: rgba(148, 163, 184, 0.3);
        }

        .tp-legend {
          display: flex;
          gap: 20px;
        }

        .tp-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tp-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .tp-dot.done { background: #10b981; }
        .tp-dot.in-progress { background: #6366f1; }
        .tp-dot.todo { background: rgba(148, 163, 184, 0.5); }

        .tp-legend-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .team-progress-widget { padding: 20px; }
          .tp-legend { flex-wrap: wrap; gap: 12px; }
        }
      `}</style>
    </div>
  );
};
