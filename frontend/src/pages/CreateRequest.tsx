import React, { memo } from 'react';
import { RequestForm } from '../components/request/RequestForm';
import { ArrowLeft } from 'lucide-react';

export const CreateRequest: React.FC = memo(() => {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'var(--space-8) var(--space-10)',
      animation: 'pageReveal 300ms var(--ease-out-expo) both',
    }}>
      <style>{`
        @keyframes pageReveal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes titleReveal {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header style={{ marginBottom: 'var(--space-6)' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--text-sm)',
            transition: 'color var(--duration-fast)',
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            padding: 0,
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        >
          <ArrowLeft size={16} />
          대시보드로 돌아가기
        </button>
      </header>

      <div style={{
        marginBottom: 'var(--space-8)',
        animation: 'titleReveal 400ms var(--ease-out-expo) both',
        animationDelay: '60ms',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: 0,
        }}>
          업무 요청
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-secondary)',
          marginTop: 'var(--space-2)',
        }}>
          IT 팀에 필요한 작업을 명확하게 전달해보세요
        </p>
      </div>

      <RequestForm />
    </div>
  );
});

CreateRequest.displayName = 'CreateRequest';
