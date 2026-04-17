import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tasksApi } from '../api/tasks';
import { attachmentsApi } from '../api/attachments';
import { JargonHighlighter } from '../components/JargonHighlighter';
import type { TaskDetailDto, TaskStatus, Attachment } from '../types';
import { 
  ArrowLeft, Trash2, FileText, AlertCircle,
  Tag, 
  Image as ImageIcon, Paperclip, Edit3, Check, Loader2,
  ChevronDown, Download, Clock, Sparkles, Zap
} from 'lucide-react';
import { MotionView, MotionItem } from '../components/layout/MotionView';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  TODO: { label: '대기 중', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
  IN_PROGRESS: { label: '진행 중', color: 'var(--primary)', bg: 'rgba(99, 102, 241, 0.1)' },
  DONE: { label: '완료됨', color: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.1)' },
};

export const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Edit States
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editPurpose, setEditPurpose] = useState('');
  const [editTarget, setEditTarget] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchTask = useCallback(async () => {
    try {
      if (!taskId) return;
      const { data } = await tasksApi.getTask(Number(taskId));
      setTask(data);
      setEditTitle(data.title);
      setEditContent(data.content);
      setEditPurpose(data.purpose || '');
      setEditTarget(data.target || '');
    } catch {
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [taskId, navigate]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task || task.status === newStatus) return;
    try {
      await tasksApi.updateTask(task.taskId, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleSaveEdit = async () => {
    if (!task) return;
    setSaving(true);
    try {
      await tasksApi.updateTask(task.taskId, {
        title: editTitle,
        content: editContent,
        purpose: editPurpose,
        target: editTarget,
      });
      setTask({
        ...task,
        title: editTitle,
        content: editContent,
        purpose: editPurpose,
        target: editTarget,
      });
      setIsEditing(false);
    } catch {
      alert('업무 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    try {
      await tasksApi.deleteTask(task.taskId);
      navigate('/');
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleDownload = (id: number, originalFileName: string) => {
    const url = attachmentsApi.getDownloadUrl(id);
    const link = document.createElement('a');
    link.href = url;
    link.download = originalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const status = useMemo(() => 
    task ? (STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO) : STATUS_CONFIG.TODO, 
    [task]
  );

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="spinner" size={40} />
        <p>업무 상세 내역을 불러오는 중...</p>
      </div>
    );
  }

  if (!task) return null;

  return (
    <MotionView className="detail-container">
      {/* ── Top Bar ── */}
      <div className="detail-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            <span>목록으로</span>
          </button>
          <div className="header-meta">
            <span className="task-id">#{task.taskId}</span>
            <div className="divider" />
            <span className="task-date">
              <Clock size={14} />
              {new Date(task.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>

        <div className="header-right">
          {isEditing ? (
            <div className="action-group">
              <button className="btn-secondary" onClick={() => { setIsEditing(false); fetchTask(); }}>취소</button>
              <button className="btn-primary" onClick={handleSaveEdit} disabled={saving}>
                {saving ? <Loader2 size={16} className="spinner" /> : <Check size={16} />}
                저장
              </button>
            </div>
          ) : (
            <div className="action-group">
              <button className="btn-icon-label" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} /> 수정하기
              </button>
              <button className="btn-icon-label delete" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 size={16} /> 삭제
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="detail-main-layout">
        {/* ── Left Content ── */}
        <div className="detail-content-area">
          <MotionItem index={1} className="glass-card main-info-card">
            <div className="status-selector-wrapper">
              <div className="status-badge" style={{ color: status.color, background: status.bg }}>
                {status.label}
                <ChevronDown size={14} />
                <select 
                  className="status-native-select"
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                >
                  <option value="TODO">진행 대기</option>
                  <option value="IN_PROGRESS">진행 중</option>
                  <option value="DONE">완료됨</option>
                </select>
              </div>
            </div>

            {isEditing ? (
              <input 
                className="edit-title-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            ) : (
              <h1 className="detail-title">{task.title}</h1>
            )}

            <div className="content-body">
              <div className="section-header">
                <FileText size={18} />
                <h3>업무 상세 내용</h3>
              </div>
              
              {isEditing ? (
                <textarea 
                  className="edit-content-textarea"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              ) : (
                <div className="text-viewer">
                  <JargonHighlighter text={task.content} />
                </div>
              )}
            </div>
          </MotionItem>

          {task.attachments && task.attachments.length > 0 && (
            <MotionItem index={2} className="glass-card attachment-card">
              <div className="section-header">
                <Paperclip size={18} />
                <h3>첨부 파일 ({task.attachments.length})</h3>
              </div>
              <div className="attachment-grid">
                {task.attachments.map((att: Attachment) => (
                    <div key={att.id} className="attachment-tile-wrapper">
                      <div className="attachment-tile" onClick={() => handleDownload(att.id, att.originalFileName)}>
                        <div className="tile-icon">
                          {att.contentType.startsWith('image/') ? <ImageIcon size={20} /> : <FileText size={20} />}
                        </div>
                        <div className="tile-info">
                          <span className="file-name">{att.originalFileName}</span>
                          <span className="file-size">{(att.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        <Download className="download-icon" size={16} />
                      </div>
                      {att.contentType.startsWith('image/') && (
                        <div className="image-preview-mini">
                          <img src={att.fileUrl} alt={att.originalFileName} />
                        </div>
                      )}
                    </div>
                ))}
              </div>
            </MotionItem>
          )}
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="detail-sidebar">
          <MotionItem index={3} className="glass-card sidebar-card">
            <h3>업무 배정 정보</h3>
            
            <div className="sidebar-group">
              <div className="label">요청자</div>
              <div className="value-row">
                <div className="avatar">{task.requesterName?.[0]}</div>
                <span>{task.requesterName}</span>
              </div>
            </div>

            <div className="sidebar-group">
              <div className="label">담당자</div>
              <div className="value-row">
                <div className="avatar assignee">{task.assigneeName?.[0] || '?'}</div>
                <span className={task.assigneeName ? 'filled' : 'empty'}>
                  {task.assigneeName || '미배정'}
                </span>
              </div>
            </div>

            <div className="sidebar-group">
              <div className="label">요청 유형</div>
              <div className="value-row">
                <Tag size={16} color="var(--primary)" />
                <span className="filled">{task.templateType || '일반 요청'}</span>
              </div>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-group">
              <div className="label">요청 목적</div>
              {isEditing ? (
                <input className="edit-sidebar-input" value={editPurpose} onChange={(e) => setEditPurpose(e.target.value)} />
              ) : (
                <div className="text-val">{task.purpose || '-'}</div>
              )}
            </div>

            <div className="sidebar-group">
              <div className="label">타겟 사용자</div>
              {isEditing ? (
                <input className="edit-sidebar-input" value={editTarget} onChange={(e) => setEditTarget(e.target.value)} />
              ) : (
                <div className="text-val">{task.target || '-'}</div>
              )}
            </div>
          </MotionItem>

          {/* ── AI Insight Section ── */}
          {task.aiInsight && (
            <MotionItem index={4} className="glass-card ai-insight-card">
              <div className="section-header ai">
                <Sparkles size={20} />
                <h3>AI 업무 커뮤니케이션 분석</h3>
              </div>
              
              {(() => {
                try {
                  const insight = JSON.parse(task.aiInsight);
                  return (
                    <div className="ai-content">
                      <div className="insight-top">
                        <div className="score-box">
                          <div className="score-label">명확도 점수</div>
                          <div className="score-value" style={{ color: insight.clarityScore > 70 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                            {insight.clarityScore}
                            <span className="unit">점</span>
                          </div>
                        </div>
                        <div className="summary-box">
                          <div className="box-label">AI 요약</div>
                          <p className="summary-text">"{insight.summary}"</p>
                        </div>
                      </div>

                      <div className="suggestions-box">
                        <div className="box-label">
                          <Zap size={14} /> 실무자를 위한 개선 제안
                        </div>
                        <ul className="suggestions-list">
                          {insight.suggestions.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                } catch {
                  return <p className="ai-error">분석 결과를 불러오는 중에 오류가 발생했습니다.</p>;
                }
              })()}
            </MotionItem>
          )}
        </aside>
      </div>

      {/* ── Delete Confirmation ── */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="premium-modal glass-card">
            <div className="modal-header">
              <AlertCircle size={24} color="var(--color-error)" />
              <h2>업무 삭제 확인</h2>
            </div>
            <p>정말로 <strong>"{task.title}"</strong> 업무를 삭제하시겠습니까?<br/>이 작업은 되돌릴 수 없습니다.</p>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setShowDeleteConfirm(false)}>취소</button>
              <button className="btn-danger" onClick={handleDelete}>삭제하기</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .detail-container {
          padding: 40px 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .back-btn:hover { color: var(--text-main); }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .header-meta .divider {
          width: 1px;
          height: 12px;
          background: rgba(255,255,255,0.1);
        }

        .task-date {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-group {
          display: flex;
          gap: 12px;
        }

        .btn-icon-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid var(--glass-border);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          transition: all 0.2s;
        }

        .btn-icon-label:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text-main);
        }

        .btn-icon-label.delete:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: #ef4444;
        }

        .detail-main-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: start;
        }

        .main-info-card {
          padding: 48px;
          margin-bottom: 32px;
        }

        .status-selector-wrapper {
          margin-bottom: 24px;
        }

        .status-badge {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 800;
          cursor: pointer;
        }

        .status-native-select {
          position: absolute;
          inset: 0;
          width: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .detail-title {
          font-size: 2.25rem;
          font-weight: 900;
          color: var(--text-main);
          margin-bottom: 40px;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        .edit-title-input {
          width: 100%;
          font-size: 2.25rem;
          font-weight: 900;
          background: var(--bg-tertiary);
          border: 1px solid var(--primary);
          border-radius: 12px;
          padding: 8px 16px;
          color: var(--text-main);
          font-family: var(--font-ui);
          outline: none;
          margin-bottom: 40px;
          box-shadow: 0 0 0 3px var(--primary-subtle);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--primary);
          margin-bottom: 24px;
        }

        .section-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .text-viewer {
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text-main);
          opacity: 0.9;
          white-space: pre-wrap;
        }

        .edit-content-textarea {
          width: 100%;
          min-height: 400px;
          background: var(--bg-tertiary);
          border: 1px solid var(--primary);
          border-radius: 16px;
          padding: 24px;
          color: var(--text-main);
          font-family: var(--font-ui);
          font-size: 1.05rem;
          line-height: 1.8;
          resize: vertical;
          outline: none;
          box-shadow: 0 0 0 3px var(--primary-subtle);
        }

        .attachment-card {
          padding: 32px;
        }

        .attachment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }

        .attachment-tile {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .attachment-tile:hover {
          background: rgba(255,255,255,0.05);
          border-color: var(--primary);
        }

        .tile-icon {
          color: var(--primary);
          opacity: 0.7;
        }

        .tile-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .file-name {
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .download-icon {
          color: var(--text-muted);
          opacity: 0.3;
        }

        .sidebar-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sidebar-card h3 {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--primary);
          font-weight: 800;
          margin: 0;
        }

        .sidebar-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-group .label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
        }

        .value-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 32px;
          height: 32px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .avatar.assignee { background: var(--primary-glow); }

        .value-row span { font-weight: 700; font-size: 0.95rem; }
        .value-row .empty { color: var(--text-muted); opacity: 0.5; }

        .sidebar-divider {
          height: 1px;
          background: var(--glass-border);
        }

        /* ── AI Insight Card ── */
        .ai-insight-card {
          margin-top: 24px;
          padding: 28px;
          border-left: 2px solid var(--primary);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(0,0,0,0) 100%);
        }

        .section-header.ai {
          color: var(--primary);
          margin-bottom: 20px;
        }

        .insight-top {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
        }

        .score-box {
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          text-align: center;
          min-width: 100px;
        }

        .score-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .score-value {
          font-size: 1.5rem;
          font-weight: 900;
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 2px;
        }

        .score-value .unit {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .summary-box {
          flex: 1;
        }

        .box-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .summary-text {
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--text-main);
          font-weight: 600;
          margin: 0;
          font-style: italic;
        }

        .suggestions-box {
          padding: 16px;
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
        }

        .suggestions-list {
          margin: 0;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .suggestions-list li {
          font-size: 0.85rem;
          color: var(--text-main);
          line-height: 1.4;
          opacity: 0.85;
        }

        .suggestions-list li::marker {
          color: var(--primary);
        }

        .ai-error {
          font-size: 0.85rem;
          color: var(--color-error);
          opacity: 0.7;
        }

        .text-val {
          font-size: 0.9rem;
          color: var(--text-main);
          line-height: 1.5;
        }

        .edit-sidebar-input {
          width: 100%;
          background: var(--bg-tertiary);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 8px 10px;
          color: var(--text-main);
          font-family: var(--font-ui);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .edit-sidebar-input:focus {
          border-color: var(--primary);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
        }

        .premium-modal {
          width: 440px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 40px;
          text-align: center;
        }

        .modal-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .modal-header h2 { margin: 0; font-weight: 900; }

        .modal-footer {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .btn-ghost { flex: 1; padding: 12px; font-weight: 700; color: var(--text-muted); }
        .btn-danger { flex: 1; padding: 12px; background: #ef4444; border-radius: 10px; font-weight: 700; color: white; }

        @media (max-width: 1024px) {
          .detail-main-layout { grid-template-columns: 1fr; }
          .detail-sidebar { order: -1; }
        }
      `}</style>
    </MotionView>
  );
};
