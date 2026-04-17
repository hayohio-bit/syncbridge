import React, { useEffect, useState, useCallback } from 'react';
import { projectsApi } from '../api/projects';
import type { Project } from '../types';
import { Plus, FolderKanban, X, Loader2, Layers } from 'lucide-react';
import { MotionItem } from '../components/layout/MotionView';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await projectsApi.getProjects();
      setProjects(res.data);
    } catch {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      await projectsApi.createProject(newTitle, newDesc);
      setNewTitle('');
      setNewDesc('');
      setShowModal(false);
      fetchProjects();
    } catch {
      alert('프로젝트 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="spinner" size={32} style={{ color: 'var(--primary)' }} />
        <p>프로젝트 목록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      <div className="project-grid">
        <MotionItem
          index={0}
          className="project-card project-create-card"
          onClick={() => setShowModal(true)}
        >
          <div className="project-icon-wrap" style={{ background: 'var(--primary-subtle)' }}>
            <Plus size={22} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div className="project-card-title">새 프로젝트</div>
            <p className="project-card-desc">협업 공간 만들기</p>
          </div>
        </MotionItem>

        {projects.map((p, i) => (
          <MotionItem key={p.projectId} index={i + 1} className="project-card">
            <div className="project-card-header">
              <div className="project-icon-wrap">
                <FolderKanban size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="project-card-title">{p.title}</h3>
            </div>
            <p className="project-card-desc project-card-body">
              {p.description || '이 프로젝트에 대한 상세 설명이 아직 등록되지 않았습니다.'}
            </p>
            <div className="project-card-footer">
              <Layers size={13} />
              <span>활성 프로젝트</span>
            </div>
          </MotionItem>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="project-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="project-modal-header">
              <h2>새 프로젝트 생성</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-field">
                <label className="input-label">프로젝트 이름 *</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="예: 신규 랜딩 페이지 개발"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-field">
                <label className="input-label">프로젝트 설명</label>
                <textarea
                  className="input-field project-textarea"
                  placeholder="프로젝트의 목적과 주요 범위를 입력하세요"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="project-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  취소
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                  style={{ flex: 2 }}
                >
                  {creating && <Loader2 size={16} className="spinner" />}
                  {creating ? '생성 중...' : '프로젝트 생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .project-card {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform 0.22s var(--ease-out-expo), box-shadow 0.22s, border-color 0.22s;
          cursor: pointer;
        }

        .project-card:hover {
          border-color: var(--primary);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
        }

        [data-theme='dark'] .project-card:hover {
          background: var(--bg-tertiary);
        }

        .project-create-card {
          border-style: dashed;
          background: transparent;
        }

        .project-create-card:hover {
          background: var(--primary-subtle);
        }

        .project-icon-wrap {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 12px;
          background: rgba(99, 102, 241, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .project-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .project-card-title {
          font-size: var(--text-base);
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .project-card-desc {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
        }

        .project-card-body {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .project-card-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-muted);
          margin-top: auto;
          opacity: 0.6;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.2s ease both;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .project-modal {
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 36px;
          animation: modalReveal 0.3s var(--ease-out-expo) both;
        }

        @keyframes modalReveal {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .project-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .project-modal-header h2 {
          font-size: var(--text-xl);
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
          letter-spacing: -0.03em;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .project-textarea {
          min-height: 120px;
          resize: none;
          line-height: 1.6;
        }

        .project-modal-footer {
          display: flex;
          gap: 12px;
          margin-top: 28px;
        }

        @media (max-width: 640px) {
          .project-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};
