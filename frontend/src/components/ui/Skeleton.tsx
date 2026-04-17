import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Skeleton 컴포넌트
 * - 데이터 로딩 중에 표시할 자리표시자입니다.
 * - CSS 클래스 .skeleton (index.css 정의)을 사용하여 Shimmer 효과를 냅니다.
 */
export function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  borderRadius, 
  className = '', 
  style 
}: SkeletonProps) {
  const customStyles: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: borderRadius ? (typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius) : undefined,
    ...style,
  };

  return (
    <div 
      className={`skeleton ${className}`} 
      style={customStyles}
      aria-hidden="true"
    />
  );
}

/**
 * 전형적인 카드 형태의 스켈레톤 번들
 */
export function CardSkeleton() {
  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Skeleton width="40%" height="1.5rem" borderRadius="8px" />
      <Skeleton width="100%" height="4rem" borderRadius="12px" />
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <Skeleton width="60px" height="24px" borderRadius="12px" />
        <Skeleton width="60px" height="24px" borderRadius="12px" />
      </div>
    </div>
  );
}
