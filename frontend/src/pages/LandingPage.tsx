import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/landing.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="landing-container">
      <div className="landing-texture" />
      <div className="landing-grain" />

      {/* Hero Section */}
      <section className="snap-section hero">
        <motion.div 
          className="hero-sphere"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          SYNC<br />BRIDGE
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          IT 전문 용어의 장벽을 허무는 혁신적인 소통 플랫폼.<br />
          일반직군과 실무자 사이의 언어를 실시간으로 연결합니다.
        </motion.p>
        
        <motion.button 
          className="cta-button"
          onClick={() => navigate('/login')}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Get Started
        </motion.button>
      </section>

      {/* Feature Section (Bento) */}
      <section className="snap-section">
        <motion.div 
          className="bento-section"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* bento-1: 메인 피처 */}
          <motion.div className="bento-item bento-1 glass-deep" variants={fadeInUp}>
            <div className="bento-1-badge">✦ 2026 NEXT-GEN</div>
            <h2 className="bento-1-title">Real-time<br />Jargon Translation</h2>
            <p className="bento-1-desc">
              텍스트 속 IT 전문 용어를 직무별 맞춤 언어로 실시간 해석합니다. 개발자의 "CI/CD"가 기획자에게는 "자동 배포 프로세스"로 즉시 번역됩니다.
            </p>
            <motion.img 
              src="/assets/feature_card.png" 
              alt="용어 번역 기능 미리보기" 
              className="bento-1-img" 
              loading="lazy"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>

          {/* bento-2: 역할 기반 뷰 */}
          <motion.div className="bento-item bento-2 glass-deep" variants={fadeInUp}>
            <div className="bento-card-header">
              <span className="bento-icon">⊞</span>
              <h3 className="bento-card-title">Role-based View</h3>
            </div>
            <p className="bento-card-desc">직무에 따라 최적화된 업무 화면을 자동으로 제공합니다.</p>
            <img src="/assets/role_based_view.png" alt="역할 기반 뷰 전환" className="bento-card-img" loading="lazy" />
          </motion.div>

          {/* bento-3: AI 스마트 피드백 */}
          <motion.div className="bento-item bento-3 glass-deep" variants={fadeInUp}>
            <div className="bento-card-header">
              <span className="bento-icon">✦</span>
              <h3 className="bento-card-title">Smart Feedback</h3>
            </div>
            <p className="bento-card-desc">AI가 분석하여 누락된 정보와 개선점을 가이드합니다.</p>
            <img src="/assets/smart_feedback.png" alt="AI 스마트 피드백 분석" className="bento-card-img" loading="lazy" />
          </motion.div>

          {/* bento-4: CTA */}
          <motion.div 
            className="bento-item bento-4 glass-deep" 
            variants={fadeInUp}
            whileHover={{ scale: 1.01 }}
          >
            <div className="bento-4-inner">
              <div>
                <h3 className="bento-4-title">Start Bridging Today</h3>
                <p className="bento-4-desc">팀원들과의 소통 장벽을 지금 바로 허무세요. 무료로 시작할 수 있습니다.</p>
              </div>
              <motion.button 
                className="bento-4-btn" 
                onClick={() => navigate('/signup')}
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Account →
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <footer className="landing-footer">
          © 2026 SyncBridge. Built for the era of seamless communication.
        </footer>
      </section>
    </div>
  );
};
