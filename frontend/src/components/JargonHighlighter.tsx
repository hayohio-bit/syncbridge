import React, { useEffect, useState, useMemo } from 'react';
import { jargonsApi } from '../api/jargons';
import { JargonTooltip } from './JargonTooltip';

interface Props {
  text: string;
}

/**
 * IT 용어 자동 감지 및 하이라이트 컴포넌트
 * - 텍스트 내 사전에 정의된 IT 전문 용어를 찾아내어 하이라이트 처리합니다.
 * - 마우스 오버 시 직무별 맞춤 해석 툴팁을 제공합니다.
 */
export const JargonHighlighter: React.FC<Props> = ({ text }) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    jargonsApi.getKeywords()
      .then((res) => {
        if (isMounted) {
          setKeywords(res.data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const content = useMemo(() => {
    if (!keywords.length || !text) return <>{text}</>;

    // Sort: Longest first to prevent partial matches (e.g., 'API' vs 'REST API')
    const sorted = [...keywords].sort((a, b) => b.length - a.length);
    const escaped = sorted.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
    
    const parts = text.split(pattern);

    return (
      <>
        {parts.map((part, i) => {
          const matchedKeyword = sorted.find(
            (k) => k.toLowerCase() === part.toLowerCase()
          );
          
          if (matchedKeyword) {
            return (
              <JargonTooltip 
                key={`${matchedKeyword}-${i}`} 
                keyword={matchedKeyword} 
                display={part} 
              />
            );
          }
          return <React.Fragment key={i}>{part}</React.Fragment>;
        })}
      </>
    );
  }, [keywords, text]);

  if (isLoading && !keywords.length) {
    return <span className="text-loading">{text}</span>;
  }

  return (
    <span className="jargon-container">
      {content}
      <style>{`
        .jargon-container {
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .jargon-highlight {
          position: relative;
          color: var(--primary);
          font-weight: 700;
          cursor: pointer;
          padding: 0 2px;
          margin: 0 -2px;
          border-radius: 4px;
          background: rgba(99, 102, 241, 0.05);
          transition: all 0.2s ease;
          text-decoration: underline dotted var(--primary);
          text-underline-offset: 4px;
        }

        .jargon-highlight:hover {
          background: var(--primary-glow);
          color: white;
          text-decoration: none;
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .text-loading {
          opacity: 0.7;
          filter: blur(0.5px);
        }
      `}</style>
    </span>
  );
};
