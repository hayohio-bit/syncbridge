import React from 'react';
import { Link } from 'react-router-dom';
import type { TaskListDto } from '../types';
import { Inbox, Tag, Calendar, ChevronRight, User } from 'lucide-react';
import { MotionItem } from './layout/MotionView';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  TODO: { label: '대기 중', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
  IN_PROGRESS: { label: '진행 중', color: 'var(--primary)', bg: 'rgba(99, 102, 241, 0.1)' },
  DONE: { label: '완료됨', color: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.1)' },
};

interface Props {
  tasks: TaskListDto[];
}

export const TaskListView: React.FC<Props> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ color: 'var(--primary)', opacity: 0.15, marginBottom: '24px' }}>
          <Inbox size={100} strokeWidth={1} style={{ margin: '0 auto' }} />
        </div>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '16px' }}>등록된 업무가 없습니다</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
          새로운 업무를 요청하여 팀원들과 협업을 시작해보세요. IT 용어 번역 기술이 소통을 도와드립니다.
        </p>
        <Link to="/create-task" className="btn btn-primary" style={{ padding: '14px 32px', borderRadius: '12px' }}>
          신규 업무 요청하기
        </Link>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      {tasks.map((task, index) => {
        const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;
        return (
          <MotionItem key={task.taskId} index={index}>
            <Link to={`/tasks/${task.taskId}`} className="task-row">
              <div className="task-main-info">
                <div className="task-meta-top">
                  <span className="task-id">#{task.taskId}</span>
                  <span className="task-type">
                    <Tag size={12} />
                    {task.templateType === 'DESIGN_REQUEST' ? '디자인' : 
                     task.templateType === 'FEATURE_REQUEST' ? '개발' : '일반'}
                  </span>
                </div>
                <h3 className="task-title">{task.title}</h3>
                <div className="task-meta-bottom">
                  <div className="meta-item">
                    <div className="mini-avatar">{task.requesterName?.[0]}</div>
                    <span>{task.requesterName}</span>
                  </div>
                  <div className="meta-divider" />
                  <div className="meta-item">
                    <User size={14} />
                    <span style={{ color: task.assigneeName ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {task.assigneeName || '담당자 미지정'}
                    </span>
                  </div>
                  <div className="meta-divider" />
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{new Date(task.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
              </div>

              <div className="task-status-area">
                <span className="status-badge" style={{ color: status.color, background: status.bg }}>
                  {status.label}
                </span>
                <ChevronRight size={20} className="chevron" />
              </div>
            </Link>
          </MotionItem>
        );
      })}

      <style>{`
        .task-list-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .task-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          background: var(--bg-tertiary);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
        }

        .task-row:hover {
          background: var(--primary-subtle);
          border-color: var(--primary);
          transform: translateX(4px);
          box-shadow: -3px 0 0 0 var(--primary);
        }

        .task-main-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .task-meta-top {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .task-id {
          color: var(--text-muted);
          opacity: 0.6;
        }

        .task-type {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--primary);
          background: var(--primary-glow);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .task-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
        }

        .task-meta-bottom {
          display: flex;
          align-items: center;
          gap: 16px;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .meta-divider {
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .mini-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--text-main);
          border: 1px solid var(--glass-border);
        }

        .task-status-area {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .status-badge {
          font-size: 0.8rem;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 10px;
          min-width: 80px;
          text-align: center;
        }

        .chevron {
          color: var(--text-muted);
          opacity: 0.3;
          transition: transform 0.2s, opacity 0.2s;
        }

        .task-row:hover .chevron {
          opacity: 1;
          transform: translateX(4px);
          color: var(--text-main);
        }

        @media (max-width: 768px) {
          .task-row {
            padding: 20px;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .task-status-area {
            width: 100%;
            justify-content: space-between;
            padding-top: 16px;
            border-top: 1px solid var(--glass-border);
          }
          .task-meta-bottom {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};
