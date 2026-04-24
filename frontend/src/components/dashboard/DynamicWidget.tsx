import React from 'react';
import { MotionItem } from '../layout/MotionView';
import { AlertCircle } from 'lucide-react';

interface DynamicWidgetProps {
  type: string;
  children: React.ReactNode;
  order: number;
  adaptiveMode?: 'standard' | 'compact';
}

export const DynamicWidget: React.FC<DynamicWidgetProps> = ({ 
  type, 
  children, 
  order, 
  adaptiveMode = 'standard' 
}) => {
  return (
    <MotionItem 
      index={order} 
      className={`dynamic-widget widget-${type} mode-${adaptiveMode}`}
    >
      {children}
      <style>{`
        .dynamic-widget {
          margin-bottom: 24px;
        }
        .mode-compact {
          margin-bottom: 12px;
        }
      `}</style>
    </MotionItem>
  );
};

export const SituationAlert: React.FC<{ isOverloaded: boolean }> = ({ isOverloaded }) => {
  if (!isOverloaded) return null;

  return (
    <div className="situation-alert">
      <AlertCircle size={18} />
      <span>업무 과부하 감지: 필수 정보 위주로 화면을 최적화했습니다. (Compact Mode)</span>
      <style>{`
        .situation-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 12px;
          color: #f59e0b;
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};
