import React, { useState, useRef, useEffect } from 'react';
import { useWidgetPreferenceStore } from '../../store/widgetPreferenceStore';
import { Settings, RotateCcw, Eye, EyeOff } from 'lucide-react';

const WIDGET_LABELS: Record<string, string> = {
  greeting: '인사말 & 퀵액션',
  stats: '통계 카드',
  'my-summary': '내 업무 요약',
  'my-tasks': '배정 업무 요약',
  'team-progress': '팀 진행률',
  'workflow-hint': '워크플로우 가이드',
  toolbar: '필터 & 검색 도구',
  'main-view': '업무 목록/칸반',
};

// 숨기기 불가능한 핵심 위젯
const LOCKED_WIDGETS = ['main-view', 'toolbar'];

interface WidgetTogglePanelProps {
  availableWidgets: string[];
}

export const WidgetTogglePanel: React.FC<WidgetTogglePanelProps> = ({ availableWidgets }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { hiddenWidgets, toggleWidget, resetToDefault } = useWidgetPreferenceStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleableWidgets = availableWidgets.filter((w) => !LOCKED_WIDGETS.includes(w));

  return (
    <div className="widget-toggle-root" ref={panelRef}>
      <button
        className="widget-toggle-btn"
        onClick={() => setIsOpen((v) => !v)}
        title="위젯 설정"
      >
        <Settings size={16} />
      </button>

      {isOpen && (
        <div className="widget-toggle-panel">
          <div className="panel-header">
            <span className="panel-title">대시보드 위젯 설정</span>
            <button className="reset-btn" onClick={resetToDefault} title="기본값 복원">
              <RotateCcw size={14} />
              <span>초기화</span>
            </button>
          </div>

          <div className="panel-items">
            {toggleableWidgets.map((widgetId) => {
              const isHidden = hiddenWidgets.includes(widgetId);
              return (
                <button
                  key={widgetId}
                  className={`panel-item ${isHidden ? 'hidden' : 'visible'}`}
                  onClick={() => toggleWidget(widgetId)}
                >
                  {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{WIDGET_LABELS[widgetId] || widgetId}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .widget-toggle-root {
          position: relative;
        }

        .widget-toggle-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          transition: all 0.2s;
          cursor: pointer;
        }

        .widget-toggle-btn:hover {
          color: var(--primary);
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.08);
        }

        .widget-toggle-panel {
          position: absolute;
          top: 44px;
          right: 0;
          z-index: 100;
          min-width: 260px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-title {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .reset-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .reset-btn:hover {
          color: var(--primary);
          background: rgba(99, 102, 241, 0.08);
        }

        .panel-items {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .panel-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .panel-item.visible {
          color: var(--text-main);
        }

        .panel-item.hidden {
          color: var(--text-muted);
          opacity: 0.5;
        }

        .panel-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }
      `}</style>
    </div>
  );
};
