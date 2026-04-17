import React from 'react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCreateTicket } from '../../hooks/useCreateTicket';

export const RequestForm: React.FC = () => {
  const { form, isSubmitting, isSuccess, errors, handleChange, handleSubmit } = useCreateTicket();

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontWeight: 500,
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-2)',
    display: 'block',
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    backgroundColor: 'var(--color-surface-2)',
    border: `1px solid ${hasError ? 'var(--color-status-error)' : 'var(--color-border)'}`,
    borderRadius: '6px',
    padding: 'var(--space-3) var(--space-4)',
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--text-base)',
    color: 'var(--color-text-primary)',
    transition: 'border-color var(--duration-fast)',
    outline: 'none',
  });

  const fieldWrapperStyle = (delay: number): React.CSSProperties => ({
    animation: 'formReveal 400ms var(--ease-out-expo) both',
    animationDelay: `${delay}ms`,
    marginBottom: 'var(--space-6)',
  });

  const errorStyle: React.CSSProperties = {
    color: 'var(--color-status-error)',
    fontSize: 'var(--text-xs)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-1)',
    marginTop: 'var(--space-1)',
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div style={{
      maxWidth: '640px',
      margin: '0 auto',
      backgroundColor: 'var(--color-surface-1)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: 'var(--space-8)',
      animation: 'formReveal 400ms var(--ease-out-expo) both',
    }}>
      <style>{`
        @keyframes formReveal {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:focus, textarea:focus, select:focus {
          border-color: var(--color-accent) !important;
        }
        option {
          background-color: var(--color-surface-2);
        }
      `}</style>

      <form onSubmit={onSubmit}>
        <div style={fieldWrapperStyle(0)}>
          <label style={labelStyle}>업무 제목</label>
          <input
            style={inputStyle(!!errors.title)}
            placeholder="요청 내용을 한 줄로 요약해주세요"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          {errors.title && (
            <div style={errorStyle}>
              <AlertCircle size={12} />
              {errors.title}
            </div>
          )}
        </div>

        <div style={fieldWrapperStyle(60)}>
          <label style={labelStyle}>상세 내용</label>
          <textarea
            style={{ ...inputStyle(!!errors.description), minHeight: '140px', resize: 'vertical' }}
            placeholder="어떤 작업이 필요한지, 배경과 목적을 포함해 설명해주세요"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          {errors.description && (
            <div style={errorStyle}>
              <AlertCircle size={12} />
              {errors.description}
            </div>
          )}
        </div>

        <div style={fieldWrapperStyle(120)}>
          <label style={labelStyle}>프로젝트</label>
          <select
            style={inputStyle(!!errors.projectId)}
            value={form.projectId}
            onChange={(e) => handleChange('projectId', e.target.value)}
          >
            <option value="" disabled hidden>프로젝트를 선택하세요</option>
            <option value="p1">ERP 고도화 프로젝트</option>
            <option value="p2">사내 포털 개편</option>
            <option value="p3">신규 입사자 온보딩 시스템</option>
          </select>
          {errors.projectId && (
            <div style={errorStyle}>
              <AlertCircle size={12} />
              {errors.projectId}
            </div>
          )}
        </div>

        <div style={fieldWrapperStyle(180)}>
          <label style={labelStyle}>우선순위</label>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {(['low', 'medium', 'high'] as const).map((p) => {
              const isActive = form.priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleChange('priority', p)}
                  style={{
                    flex: 1,
                    borderRadius: '6px',
                    padding: 'var(--space-2) var(--space-5)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    transition: 'var(--duration-fast)',
                    border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    backgroundColor: isActive ? 'rgba(232, 160, 32, 0.15)' : 'var(--color-surface-2)',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  }}
                >
                  {p === 'low' ? '낮음' : p === 'medium' ? '보통' : '높음'}
                </button>
              );
            })}
          </div>
          {errors.priority && (
            <div style={errorStyle}>
              <AlertCircle size={12} />
              {errors.priority}
            </div>
          )}
        </div>

        <div style={fieldWrapperStyle(240)}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              fontWeight: 500,
              borderRadius: '6px',
              padding: 'var(--space-3) var(--space-6)',
              transition: 'var(--duration-fast)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              backgroundColor: isSuccess ? 'var(--color-status-done)' : 'var(--color-accent)',
              color: '#0E0D0B',
            }}
            onMouseOver={(e) => {
              if (!isSubmitting && !isSuccess) e.currentTarget.style.backgroundColor = 'var(--color-accent-dim)';
            }}
            onMouseOut={(e) => {
              if (!isSubmitting && !isSuccess) e.currentTarget.style.backgroundColor = 'var(--color-accent)';
            }}
          >
            {isSubmitting ? (
              '제출 중...'
            ) : isSuccess ? (
              <>
                <CheckCircle2 size={16} />
                요청이 접수되었어요
              </>
            ) : (
              <>
                <Send size={16} />
                업무 요청 제출
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
