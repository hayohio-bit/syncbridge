import React from 'react';
import { Link } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import { tasksApi } from '../api/tasks';
import type { TaskListDto, TaskStatus } from '../types';
import { Inbox, Tag, Calendar, MoreHorizontal, Layers } from 'lucide-react';

const COLUMNS: { status: TaskStatus; title: string; dotColor: string; icon: React.ReactNode }[] = [
  { status: 'TODO', title: '진행 대기', dotColor: '#94a3b8', icon: <Inbox size={18} /> },
  { status: 'IN_PROGRESS', title: '진행 중', dotColor: 'var(--primary)', icon: <Layers size={18} /> },
  { status: 'DONE', title: '완료됨', dotColor: 'var(--color-success)', icon: <Tag size={18} /> },
];

interface Props {
  tasks: TaskListDto[];
  onTaskUpdated: () => void;
  onStatusChange?: React.Dispatch<React.SetStateAction<TaskListDto[]>>; // Optional로 변경하여 유연성 확보
}

export const KanbanBoardView: React.FC<Props> = ({ tasks, onTaskUpdated, onStatusChange }) => {
  const grouped: Record<TaskStatus, TaskListDto[]> = {
    TODO: tasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter((t) => t.status === 'DONE'),
  };

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;
    const newStatus = destination.droppableId as TaskStatus;
    const taskId = Number(draggableId);
    const task = tasks.find((t) => t.taskId === taskId);
    if (!task || task.status === newStatus) return;

    // 1. 낙관적 업데이트
    if (onStatusChange) {
      onStatusChange(prev => prev.map(t => t.taskId === taskId ? { ...t, status: newStatus } : t));
    }

    try {
      await tasksApi.updateTask(taskId, { status: newStatus });
      onTaskUpdated();
    } catch (err) {
      console.error('Failed to update task status', err);
      // 롤백은 부모에서 처리하도록 유도 (onStatusChange가 있다면)
      alert('업무 상태 변경에 실패했습니다.');
      onTaskUpdated(); // 서버 데이터로 재동기화
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ color: 'var(--primary)', opacity: 0.2, marginBottom: '24px' }}>
          <Inbox size={80} strokeWidth={1} style={{ margin: '0 auto' }} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>나타낼 업무가 없습니다</h3>
        <p style={{ color: 'var(--text-muted)' }}>필터를 조정하거나 새로운 업무를 등록해보세요.</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-grid">
        {COLUMNS.map((col) => (
          <div key={col.status} className="kanban-column-container">
            <div className="column-header">
              <div className="column-title">
                <span className="dot" style={{ background: col.dotColor }} />
                {col.title}
              </div>
              <span className="count">{grouped[col.status].length}</span>
            </div>

            <Droppable droppableId={col.status}>
              {(provided, snapshot) => (
                <div 
                  className={`kanban-droppable ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                >
                  {grouped[col.status].map((task, idx) => (
                    <Draggable
                      key={task.taskId}
                      draggableId={String(task.taskId)}
                      index={idx}
                    >
                      {(prov, snap) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className={`kanban-card ${snap.isDragging ? 'is-dragging' : ''}`}
                        >
                          <div className="card-top">
                            <span className={`tag ${task.templateType?.toLowerCase() || 'default'}`}>
                              {task.templateType?.replace('_REQUEST', '') || 'TASK'}
                            </span>
                            <button className="more-btn"><MoreHorizontal size={14}/></button>
                          </div>

                          <Link to={`/tasks/${task.taskId}`} className="card-title">
                            {task.title}
                          </Link>

                          <div className="card-bottom">
                            <div className="assignee">
                              <div className="mini-avatar">
                                {task.assigneeName?.[0] || 'U'}
                              </div>
                              <span>{task.assigneeName || '미지정'}</span>
                            </div>
                            <div className="date">
                              <Calendar size={12} />
                              {new Date(task.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>

      <style>{`
        .kanban-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          align-items: start;
        }

        .kanban-column-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .column-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 8px;
        }

        .column-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          color: var(--text-main);
          font-size: 0.95rem;
        }

        .column-title .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .column-header .count {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          background: rgba(255,255,255,0.05);
          padding: 2px 8px;
          border-radius: 10px;
        }

        .kanban-droppable {
          min-height: 500px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-radius: 16px;
          transition: background 0.2s;
        }

        .kanban-droppable.dragging-over {
          background: rgba(255, 255, 255, 0.02);
        }

        .kanban-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          cursor: grab;
          transition: border-color 0.2s, background 0.2s;
        }

        .kanban-card:hover {
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
        }

        .kanban-card.is-dragging {
          border-color: var(--primary);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          background: var(--bg-secondary);
          cursor: grabbing;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .tag {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 2px 8px;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .tag.design { background: rgba(236, 72, 153, 0.1); color: #ec4899; }
        .tag.feature { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
        .tag.bug { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .tag.default { background: rgba(255,255,255,0.05); color: var(--text-muted); }

        .more-btn {
          color: var(--text-muted);
          padding: 4px;
          border-radius: 4px;
        }

        .card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-bottom {
          margin-top: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .assignee {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mini-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 800;
          color: white;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .assignee span {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .kanban-grid {
            grid-template-columns: 1fr;
          }
          .kanban-droppable {
            min-height: auto;
            padding-bottom: 20px;
          }
        }
      `}</style>
    </DragDropContext>
  );
};
