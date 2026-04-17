import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import type { Role } from '../types';
import { Mail, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';
import '../styles/auth.css';

const ROLES: { value: Role; icon: string; label: string; desc: string }[] = [
  { value: 'GENERAL', icon: '💼', label: '일반 사무직', desc: '요청자' },
  { value: 'PLANNER', icon: '📋', label: '기획자', desc: '요청자' },
  { value: 'DESIGNER', icon: '🎨', label: '디자이너', desc: '실무자' },
  { value: 'FRONTEND', icon: '🖥️', label: '프론트엔드', desc: '실무자' },
  { value: 'BACKEND', icon: '⚙️', label: '백엔드', desc: '실무자' },
];

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('GENERAL');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.signup(email, password, name, role);
      // 회원가입 성공 후 자동 로그인 또는 로그인 페이지로 이동
      // 여기서는 명세서에 따라 로그인 페이지로 이동시키거나 필요시 바로 토큰 처리 가능
      // MVP 가이드에 따라 로그인 페이지로 이동
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(errorMsg || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative Background Elements */}
      <div className="auth-texture"></div>
      <div className="auth-grain"></div>
      <div className="auth-glow-sphere"></div>

      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">SyncBridge</div>
          <p className="auth-subtitle">우리의 소통을 잇다. 회원가입</p>
        </header>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="input-block">
            <label className="input-label" htmlFor="signup-name">이름</label>
            <div className="input-wrapper">
              <UserIcon className="input-icon" />
              <input
                id="signup-name"
                className="auth-input"
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="input-block">
            <label className="input-label" htmlFor="signup-email">이메일</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                id="signup-email"
                className="auth-input"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-block">
            <label className="input-label" htmlFor="signup-password">비밀번호</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="signup-password"
                className="auth-input"
                type="password"
                placeholder="6자 이상 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="input-block">
            <label className="input-label">직무 선택</label>
            <div className="role-selector">
              {ROLES.map((r) => (
                <label key={r.value} className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value)}
                  />
                  <div className="role-card">
                    <span className="role-card-icon">{r.icon}</span>
                    <span className="role-card-name">{r.label}</span>
                    <span className="role-card-desc">{r.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="auth-submit btn" disabled={loading}>
            {loading ? (
              '가입 중...'
            ) : (
              <>
                가입 완료 <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </>
            )}
          </button>
        </form>

        <footer className="auth-footer">
          이미 계정이 있으신가요? 
          <Link to="/login" className="auth-link">로그인</Link>
        </footer>
      </div>
    </div>
  );
};
