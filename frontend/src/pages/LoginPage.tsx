import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';
import type { User } from '../types';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { AxiosError } from 'axios';
import '../styles/auth.css';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.login(email, password);
      const user: User = {
        userId: data.userId,
        email,
        name: data.name,
        role: data.role,
      };
      login(user, data.accessToken, data.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(axiosError.response?.data?.error || '로그인에 실패했습니다.');
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
          <p className="auth-subtitle">계정에 로그인하여 시작하세요</p>
        </header>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-block">
            <label className="input-label" htmlFor="login-email">이메일</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                id="login-email"
                className="auth-input"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="input-block">
            <label className="input-label" htmlFor="login-password">비밀번호</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="login-password"
                className="auth-input"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit btn" disabled={loading}>
            {loading ? (
              '로그인 중...'
            ) : (
              <>
                로그인 <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </>
            )}
          </button>
        </form>

        <footer className="auth-footer">
          계정이 없으신가요? 
          <Link to="/signup" className="auth-link">회원가입</Link>
        </footer>
      </div>
    </div>
  );
};
