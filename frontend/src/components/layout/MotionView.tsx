import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface MotionViewProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
}

/**
 * MotionView 컴포넌트
 * - 페이지 진입 시 페이드 인 및 상단 이동 애니메이션을 제공합니다.
 * - 지연 시간(delay)을 설정하여 스태거 효과를 줄 수 있습니다.
 */
export function MotionView({ children, delay = 0, ...props }: MotionViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for premium feel
        delay 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * 리스트 아이템을 위한 Staggered Motion 컴포넌트
 */
export function MotionItem({ children, index = 0, ...props }: MotionViewProps & { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: 'easeOut'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
