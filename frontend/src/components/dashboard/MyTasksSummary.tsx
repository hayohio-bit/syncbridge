import React, { useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import type { TaskListDto } from '../../types';
import { Send, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface MyTasksSummaryProps {
  tasks: TaskListDto[];
}

const REQUESTER_ROLES = ['GENERAL', 'PLANNER'];

export const MyTasksSummary: React.FC<MyTasksSummaryProps> = ({ tasks }) => {
  const user = useAuthStore((s) => s.user);
  const isRequester = user?.role ? REQUESTER_ROLES.includes(user.role) : true;

  const summary = useMemo(() => {
    if (!user) return { todo: 0, inProgress: 0, done: 0, total: 0, overdue: 0 };

    const filtered = isRequester
      ? tasks.filter((t) => t.requesterId === user.userId)
      : tasks.filter((t) => t.assigneeId === user.userId);

    const nowTime = new Date().getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    return {
      todo: filtered.filter((t) => t.status === 'TODO').length,
      inProgress: filtered.filter((t) => t.status === 'IN_PROGRESS').length,
      done: filtered.filter((t) => t.status === 'DONE').length,
      total: filtered.length,
      overdue: filtered.filter(
        (t) => t.status !== 'DONE' && new Date(t.createdAt).getTime() < nowTime - sevenDaysMs
      ).length,
    };
  }, [tasks, user, isRequester]);

  const title = isRequester ? '내가 요청한 업무' : '나에게 배정된 업무';
  const subtitle = isRequester
    ? '요청한 업무의 진행 현황을 한눈에 확인하세요.'
    : '배정된 작업의 처리 현황입니다.';

  const cards = [
    { label: '대기 중', value: summary.todo, icon: Clock, color: '59, 130, 246' },
    { label: '진행 중', value: summary.inProgress, icon: isRequester ? Send : User, color: '245, 158, 11' },
    { label: '완료', value: summary.done, icon: CheckCircle2, color: '16, 185, 129' },
  ];

  return (
    <div className="my-tasks-summary-widget">
      <div className="summary-header">
        <div className="summary-title-group">
          <h3 className="summary-title">{title}</h3>
          <span className="summary-subtitle">{subtitle}</span>
        </div>
        <div className="summary-total">
          <span className="total-number">{summary.total}</span>
          <span className="total-label">총 건</span>
        </div>
      </div>

      <div className="summary-cards">
        {cards.map((card) => (
          <div
            key={card.label}
            className="summary-card"
            style={{
              '--card-color': `rgb(${card.color})`,
              '--card-bg': `rgba(${card.color}, 0.08)`,
            } as React.CSSProperties}
          >
            <div className="card-icon-wrap">
              <card.icon size={18} />
            </div>
            <div className="card-data">
              <span className="card-value">{card.value}</span>
              <span className="card-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {summary.overdue > 0 && (
        <div className="overdue-alert">
          <AlertCircle size={16} />
          <span>7일 이상 경과된 미완료 업무가 <strong>{summary.overdue}건</strong> 있습니다.</span>
        </div>
      )}

      <style>{`
        .my-tasks-summary-widget {
          padding: 24px 28px;
          background: var(--bg-tertiary);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .summary-title-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .summary-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }

        .summary-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .summary-total {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .total-number {
          font-size: 1.75rem;
          font-weight: 900;
          color: var(--primary);
        }

        .total-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--card-bg);
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .card-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--card-bg);
          color: var(--card-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-data {
          display: flex;
          flex-direction: column;
        }

        .card-value {
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--card-color);
          line-height: 1;
        }

        .card-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .overdue-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          color: #ef4444;
          font-size: 0.8rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .my-tasks-summary-widget { padding: 20px; }
          .summary-cards { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
