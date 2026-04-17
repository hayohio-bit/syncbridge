import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-texture" />
      <div className="landing-grain" />

      <section className="hero">
        <div className="hero-sphere" />
        <h1 className="hero-title">
          SYNC<br />BRIDGE
        </h1>
        <p className="hero-subtitle">
          IT 전문 용어의 장벽을 허무는 혁신적인 소통 플랫폼. 일반직군과 실무자 사이의 언어를 실시간으로 연결합니다.
        </p>
        <button className="cta-button" onClick={() => navigate('/login')}>
          시작하기
        </button>
      </section>

      <section className="bento-section">

        {/* bento-1: 메인 피처 */}
        <div className="bento-item bento-1 glass-deep">
          <div className="bento-1-badge">✦ 핵심 기능</div>
          <h2 className="bento-1-title">Real-time Jargon Translation</h2>
          <p className="bento-1-desc">
            텍스트 속 IT 전문 용어를 직무별 맞춤 언어로 실시간 해석합니다. 개발자의 "CI/CD"가 기획자에게는 "자동 배포 프로세스"로, 디자이너의 "누끼"가 개발자에게는 "배경 제거 이미지"로 즉시 번역됩니다.
          </p>
          <img src="/assets/feature_card.png" alt="용어 번역 기능 미리보기" className="bento-1-img" />
        </div>

        {/* bento-2: 역할 기반 뷰 */}
        <div className="bento-item bento-2 glass-deep">
          <div className="bento-card-header">
            <span className="bento-icon">⊞</span>
            <h3 className="bento-card-title">Role-based View</h3>
          </div>
          <p className="bento-card-desc">직무에 따라 최적화된 업무 화면을 자동으로 제공합니다. 요청자에게는 심플한 리스트를, 실무자에게는 칸반 보드를 보여줍니다.</p>
          <img src="/assets/role_based_view.png" alt="역할 기반 뷰 전환" className="bento-card-img" />
        </div>

        {/* bento-3: AI 스마트 피드백 */}
        <div className="bento-item bento-3 glass-deep">
          <div className="bento-card-header">
            <span className="bento-icon">✦</span>
            <h3 className="bento-card-title">Smart Feedback</h3>
          </div>
          <p className="bento-card-desc">업무 요청의 맥락을 AI가 분석하여 누락된 정보와 개선점을 자동으로 가이드합니다.</p>
          <img src="/assets/smart_feedback.png" alt="AI 스마트 피드백 분석" className="bento-card-img" />
        </div>

        {/* bento-4: CTA */}
        <div className="bento-item bento-4 glass-deep">
          <div className="bento-4-inner">
            <div>
              <h3 className="bento-4-title">Start Bridging Today</h3>
              <p className="bento-4-desc">팀원들과의 소통 장벽을 지금 바로 허무세요. 무료로 시작할 수 있습니다.</p>
            </div>
            <button className="bento-4-btn" onClick={() => navigate('/signup')}>
              Create Account →
            </button>
          </div>
        </div>

      </section>

      <footer className="landing-footer">
        © 2026 SyncBridge. Built for the era of seamless communication.
      </footer>
    </div>
  );
};
