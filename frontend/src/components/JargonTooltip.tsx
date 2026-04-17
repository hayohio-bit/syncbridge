import React, { useState, useCallback } from 'react';
import { jargonsApi } from '../api/jargons';
import type { JargonResponse } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertCircle, BookOpen, TrendingUp, ThumbsUp, ThumbsDown, CheckCircle, X } from 'lucide-react';

interface Props {
  keyword: string;
  display: string;
}

// Simple in-memory cache for translations
const cache: Record<string, JargonResponse> = {};

/**
 * 용어 번역 상세 모달 컴포넌트
 * - 하이라이트된 용어 클릭 시 상세 정보를 중앙 모달로 표시합니다.
 * - Glassmorphism 디자인 및 고급 애니메이션 효과가 적용되었습니다.
 */
export const JargonTooltip: React.FC<Props> = ({ keyword, display }) => {
  const [tooltip, setTooltip] = useState<JargonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleOpen = useCallback(async () => {
    setVisible(true);
    if (cache[keyword]) {
      setTooltip(cache[keyword]);
      return;
    }

    setLoading(true);
    try {
      const res = await jargonsApi.translateKeyword(keyword);
      cache[keyword] = res.data;
      setTooltip(res.data);
    } catch {
      setTooltip(null);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  const handleClose = () => {
    setVisible(false);
    setFeedbackSent(false);
  };

  const handleFeedback = async (isHelpful: boolean) => {
    if (!tooltip?.id) return;
    try {
      await jargonsApi.addFeedback(tooltip.id, isHelpful);
      setFeedbackSent(true);
    } catch (err) {
      console.error('Feedback failed', err);
    }
  };

  return (
    <>
      <span
        className="jargon-highlight"
        onClick={handleOpen}
      >
        {display}
      </span>

      <AnimatePresence>
        {visible && (
          <div className="jargon-modal-root">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="jargon-modal-backdrop"
              onClick={handleClose}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="jargon-modal-container"
            >
              <button className="modal-close-btn" onClick={handleClose}>
                <X size={20} />
              </button>

              {loading ? (
                <div className="tooltip-loading">
                  <div className="tooltip-shimmer" />
                  <BookOpen size={24} className="spin-icon" />
                  <span>AI가 직무에 최적화된 정의를 조합 중...</span>
                </div>
              ) : tooltip ? (
                <div className="tooltip-content">
                  <div className="tooltip-header">
                    <div className="tooltip-badge">
                      <Info size={14} />
                      맞춤형 해석
                    </div>
                    <h4 className="tooltip-keyword">{tooltip.keyword || keyword}</h4>
                  </div>
                  
                  <div className="tooltip-scroll-area">
                    <div className="tooltip-body">
                      <p className="tooltip-definition">{tooltip.easyDefinition}</p>
                    </div>

                    {tooltip.businessImpact && (
                      <div className="tooltip-footer">
                        <div className="footer-title">
                          <TrendingUp size={14} />
                          비즈니스 임팩트
                        </div>
                        <p className="impact-text">{tooltip.businessImpact}</p>
                      </div>
                    )}
                  </div>

                  <div className="tooltip-actions">
                    {!feedbackSent ? (
                      <>
                        <span className="actions-label">해설이 이해에 도움이 되었나요?</span>
                        <div className="action-buttons">
                          <button 
                            className="action-btn positive" 
                            onClick={() => handleFeedback(true)}
                          >
                            <ThumbsUp size={14} /> 예
                          </button>
                          <button 
                            className="action-btn negative" 
                            onClick={() => handleFeedback(false)}
                          >
                            <ThumbsDown size={14} /> 아니오
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="feedback-done">
                        <CheckCircle size={14} /> 소중한 피드백 감사합니다!
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="tooltip-error">
                  <AlertCircle size={24} />
                  <span>번역 데이터를 불러올 수 없습니다.</span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .jargon-modal-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .jargon-modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
        }

        .jargon-modal-container {
          position: relative;
          width: 100%;
          max-width: 420px;
          max-height: min(600px, 90vh);
          background: rgba(18, 21, 30, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 28px;
          box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          color: var(--text-main);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
          z-index: 10;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: rotate(90deg);
        }

        .tooltip-loading, .tooltip-error {
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          font-size: 1rem;
          color: var(--text-muted);
          text-align: center;
        }

        .tooltip-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          animation: shimmer-swipe 2s infinite linear;
        }

        @keyframes shimmer-swipe {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .tooltip-header {
          padding: 32px 32px 24px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .tooltip-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--primary);
          background: var(--primary-glow);
          padding: 6px 12px;
          border-radius: 10px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .tooltip-keyword {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .tooltip-scroll-area {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
        }

        .tooltip-body {
          padding: 24px 32px;
        }

        .tooltip-definition {
          margin: 0;
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--text-main);
          opacity: 0.95;
        }

        .tooltip-footer {
          padding: 20px 32px;
          margin: 0 20px 20px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 20px;
        }

        .footer-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--color-success);
          margin-bottom: 8px;
        }

        .impact-text {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .tooltip-actions {
          padding: 24px 32px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(255,255,255,0.02);
        }

        .actions-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: var(--text-main);
        }

        .action-btn:hover {
          background: rgba(255,255,255,0.12);
          transform: translateY(-2px);
        }

        .action-btn.positive:hover {
          background: var(--color-success);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .action-btn.negative:hover {
          background: var(--color-error);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .feedback-done {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--color-success);
          font-weight: 700;
          padding: 8px 0;
        }

        .spin-icon {
          animation: spin 3s infinite linear;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
