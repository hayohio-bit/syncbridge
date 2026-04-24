import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksApi } from '../api/tasks';
import { projectsApi } from '../api/projects';
import { usersApi } from '../api/users';
import { attachmentsApi } from '../api/attachments';
import type { User, Project } from '../types';
import { 
  FileText, Users, Send, Paperclip, X, File, 
  ChevronDown, Search, Loader2, AlertCircle, Info, CheckCircle2 
} from 'lucide-react';
import { MotionView, MotionItem } from '../components/layout/MotionView';
import { useAuthStore } from '../store/authStore';
import { useConfigStore } from '../store/configStore';
import { ROLE_CONFIGS } from '../config/roleConfig';

const TEMPLATE_TYPES = [
  { value: 'DESIGN_REQUEST', label: '🎨 디자인 요청' },
  { value: 'FEATURE_REQUEST', label: '🚀 기능 개발 요청' },
  { value: 'BUG_REPORT', label: '🐞 버그 수정 요청' },
  { value: 'UI_FIX', label: '🖥️ UI 수정 요청' },
  { value: 'GENERAL', label: '📁 일반 요청' },
];

export const TaskCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const dynamicConfig = useConfigStore((s) => s.roleConfig);
  const roleConfig = dynamicConfig || (user?.role ? ROLE_CONFIGS[user.role] : ROLE_CONFIGS.GENERAL);
  const isDevRole = user?.role ? ['DESIGNER', 'FRONTEND', 'BACKEND'].includes(user.role) : false;

  // Form States
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [purpose, setPurpose] = useState('');
  const [target, setTarget] = useState('');
  const [templateType, setTemplateType] = useState(roleConfig.defaultTemplateType);
  const [showExtraFields, setShowExtraFields] = useState(!isDevRole);
  const [projectId, setProjectId] = useState<number | ''>('');
  const [projects, setProjects] = useState<Project[]>([]);

  // Attachments
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Assignee search
  const [assigneeId, setAssigneeId] = useState<number | null>(null);
  const [assigneeKeyword, setAssigneeKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Fetch Projects ──
  useEffect(() => {
    projectsApi.getProjects()
      .then((res) => setProjects(res.data))
      .catch(() => console.error('Failed to fetch projects'));
  }, []);

  // ── Assignee Search Throttling ──
  useEffect(() => {
    if (assigneeKeyword.length < 1 || assigneeId) {
      if (!assigneeKeyword) setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await usersApi.searchUsers(assigneeKeyword);
        setSearchResults(res.data);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [assigneeKeyword, assigneeId]);

  // ── Click Outside Dropdown ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectAssignee = useCallback((u: User) => {
    setAssigneeId(u.userId);
    setAssigneeKeyword(`${u.name} (${u.email})`);
    setShowDropdown(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setError('');
    setLoading(true);
    try {
      const payload = {
        title,
        content,
        purpose: purpose || undefined,
        target: target || undefined,
        templateType: templateType || undefined,
        assigneeId: assigneeId || undefined,
        projectId: projectId || undefined,
      };
      
      const res = await tasksApi.createTask(payload);
      const taskId = res.data.taskId;

      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          await attachmentsApi.uploadFile(file, taskId);
        }
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || '업무 요청 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionView className="page-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px' }}>
      {/* ── Header ── */}
      <header style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-1px' }}>협업의 시작, 업무 요청</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
          당신의 아이디어를 실무자에게 전달하세요. <span style={{ color: 'var(--primary)', fontWeight: 700 }}>IT 전문 용어</span>는 SyncBridge가 친절하게 번역해 드립니다.
        </p>
      </header>

      {error && (
        <MotionItem index={0} className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </MotionItem>
      )}

      <form onSubmit={handleSubmit} className="premium-form">
        
        {/* Row 1: Basic Info */}
        <div className="form-row">
          <MotionItem index={1} className="form-card glass-card">
            <div className="card-header">
              <FileText size={20} />
              <h3>공통 정보</h3>
            </div>
            
            <div className="grid-2">
              <div className="field-group">
                <label>소속 프로젝트</label>
                <div className="select-wrapper">
                  <select 
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : '')}
                  >
                    <option value="">프로젝트 선택</option>
                    {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.title}</option>)}
                  </select>
                  <ChevronDown className="arrow" size={16} />
                </div>
              </div>
              
              <div className="field-group">
                <label>요청 유형</label>
                <div className="select-wrapper">
                  <select 
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                  >
                    {TEMPLATE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <ChevronDown className="arrow" size={16} />
                </div>
              </div>
            </div>
          </MotionItem>
        </div>

        {/* Row 2: Title & Content */}
        <MotionItem index={2} className="form-card glass-card main-content-card">
          <div className="card-header">
            <Info size={20} />
            <h3>요청 상세</h3>
          </div>

          <div className="field-group">
            <label>업무 제목 *</label>
            <input 
              className="premium-input" 
              placeholder="무엇을 도와드릴까요? 명확하고 간결하게 적어주세요." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Purpose/Target: collapsible for developer roles */}
          {isDevRole && !showExtraFields ? (
            <button
              type="button"
              className="toggle-extra-btn"
              onClick={() => setShowExtraFields(true)}
              style={{ marginTop: '24px' }}
            >
              <ChevronDown size={16} />
              <span>요청 목적 & 타겟 입력 (선택)</span>
            </button>
          ) : (
            <div className="grid-2" style={{ marginTop: '24px' }}>
              <div className="field-group">
                <label>요청 목적</label>
                <input 
                  className="premium-input" 
                  placeholder="어떤 배경에서 요청되었나요?" 
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label>타겟 사용자</label>
                <input 
                  className="premium-input" 
                  placeholder="누구를 위한 기능인가요?" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="field-group" style={{ marginTop: '24px' }}>
            <label>상세 설명 *</label>
            <textarea 
              className="premium-textarea" 
              placeholder="자유롭게 작성해주세요. IT 용어(API, CI/CD 등)를 사용하면 실무자가 더 정확히 이해할 수 있으며, 요청자에게는 툴팁으로 설명이 제공됩니다." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="jargon-notice">
              <CheckCircle2 size={14} color="var(--primary)" />
              <span>실시간 IT 용어 하이라이트 시스템 가동 중</span>
            </div>
          </div>
        </MotionItem>

        {/* Row 3: Attachments & Assignee */}
        <div className="grid-2">
          <MotionItem index={3} className="form-card glass-card secondary-card">
            <div className="card-header">
              <Paperclip size={18} />
              <h3>파일 첨부</h3>
            </div>
            
            <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} hidden multiple onChange={handleFileChange} />
              <div className="dropzone-inner">
                <File className="icon" size={32} />
                <p>파일 선택 및 드래그</p>
                <span>최대 5개 (이미지, PDF, 기획서 등)</span>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="file-list">
                {selectedFiles.map((f, i) => (
                  <div key={i} className="file-item">
                    <span className="file-name">{f.name}</span>
                    <button type="button" className="remove-btn" onClick={(e) => { e.stopPropagation(); removeFile(i); }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </MotionItem>

          <MotionItem index={4} className="form-card glass-card secondary-card">
            <div className="card-header">
              <Users size={18} />
              <h3>담당자 지정</h3>
            </div>

            <div className="assignee-search-root" ref={dropdownRef}>
              <div className="search-input-wrapper">
                <Search className="icon" size={18} />
                <input 
                  className="premium-input search-input" 
                  placeholder="담당자 이름 검색..."
                  value={assigneeKeyword}
                  onChange={(e) => {
                    setAssigneeKeyword(e.target.value);
                    setAssigneeId(null);
                  }}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                />
                {loading && <Loader2 className="spinner" size={16} />}
              </div>

              {showDropdown && searchResults.length > 0 && (
                <div className="search-dropdown glass-card">
                  {searchResults.map(u => (
                    <div key={u.userId} className="search-item" onClick={() => selectAssignee(u)}>
                      <div className="avatar-small">{u.name[0]}</div>
                      <div className="meta">
                        <span className="name">{u.name}</span>
                        <span className="role">{u.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="hint">담당 실무자를 지정하면 즉시 알림이 전달됩니다.</p>
          </MotionItem>
        </div>

        {/* Action Footer */}
        <footer className="form-footer">
          <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>취소</button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <Loader2 size={18} className="spinner" /> : <Send size={18} />}
            <span>{loading ? '제출 중...' : '업무 요청 제출하기'}</span>
          </button>
        </footer>
      </form>

      <style>{`
        .premium-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-card {
          padding: 32px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.02);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          color: var(--primary);
        }

        .card-header h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .field-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-left: 4px;
        }

        .premium-input, .select-wrapper select, .premium-textarea {
          width: 100%;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 14px 16px;
          color: var(--text-main);
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .premium-input:focus, .select-wrapper select:focus, .premium-textarea:focus {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.05);
          outline: none;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
        }

        .premium-textarea {
          min-height: 240px;
          line-height: 1.6;
          resize: vertical;
        }

        .select-wrapper {
          position: relative;
        }

        .select-wrapper select {
          appearance: none;
          padding-right: 40px;
        }

        .select-wrapper .arrow {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          opacity: 0.5;
        }

        .jargon-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .upload-dropzone {
          border: 2px dashed var(--glass-border);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-dropzone:hover {
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
        }

        .dropzone-inner .icon {
          color: var(--text-muted);
          margin-bottom: 12px;
          opacity: 0.4;
        }

        .dropzone-inner p {
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .dropzone-inner span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .file-list {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
        }

        .file-item .file-name {
          font-size: 0.8rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .remove-btn {
          color: var(--color-error);
          opacity: 0.5;
          padding: 2px;
        }

        .assignee-search-root {
          position: relative;
        }

        .search-input-wrapper {
          position: relative;
        }

        .search-input-wrapper .icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.4;
        }

        .search-input-wrapper .search-input {
          padding-left: 44px;
        }

        .search-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 100;
          margin-top: 8px;
          background: var(--bg-tertiary);
          max-height: 200px;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }

        .search-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .search-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .avatar-small {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
        }

        .search-item .meta {
          display: flex;
          flex-direction: column;
        }

        .search-item .name { font-size: 0.85rem; font-weight: 700; }
        .search-item .role { font-size: 0.7rem; color: var(--text-muted); }

        .form-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 16px;
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1px solid var(--glass-border);
        }

        .btn-cancel {
          padding: 14px 28px;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .btn-submit {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 40px;
          background: var(--primary);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          font-weight: 800;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
          transition: all 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .toggle-extra-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed var(--glass-border);
          border-radius: 12px;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          justify-content: center;
        }

        .toggle-extra-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
        }

        @media (max-width: 768px) {
          .premium-form { padding-bottom: 100px; }
          .form-card { padding: 24px; }
          .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </MotionView>
  );
};
