import axiosInstance from './axiosInstance';

/**
 * UI 이벤트 로깅 유틸리티 (Phase 2 데이터 수집 기반)
 *
 * 사용자 인터랙션 이벤트를 localStorage 버퍼에 저장하고,
 * 일정 개수 이상 쌓이면 백엔드에 배치 전송한다.
 * 전송 실패 시 silently fail하여 사용자 경험에 영향을 주지 않는다.
 */

export interface UIEvent {
  eventType: 'PAGE_VIEW' | 'CLICK' | 'WIDGET_TOGGLE' | 'VIEW_SWITCH' | 'SEARCH' | 'FORM_SUBMIT';
  target: string;
  metadata?: Record<string, string>;
  sessionId?: string;
}

const BUFFER_KEY = 'syncbridge_event_buffer';
const BATCH_SIZE = 10;

let sessionId: string | null = null;

const getSessionId = (): string => {
  if (!sessionId) {
    sessionId = sessionStorage.getItem('sb_session_id');
    if (!sessionId) {
      sessionId = `ses_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem('sb_session_id', sessionId);
    }
  }
  return sessionId;
};

const getBuffer = (): UIEvent[] => {
  try {
    const raw = localStorage.getItem(BUFFER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveBuffer = (buffer: UIEvent[]) => {
  try {
    localStorage.setItem(BUFFER_KEY, JSON.stringify(buffer));
  } catch {
    // localStorage 용량 초과 시 버퍼 클리어
    localStorage.removeItem(BUFFER_KEY);
  }
};

const flushBuffer = async () => {
  const buffer = getBuffer();
  if (buffer.length === 0) return;

  try {
    const payload = buffer.map((e) => ({
      eventType: e.eventType,
      target: e.target,
      metadata: e.metadata ? JSON.stringify(e.metadata) : null,
      sessionId: e.sessionId || getSessionId(),
    }));

    await axiosInstance.post('/api/analytics/events/batch', payload);
    localStorage.removeItem(BUFFER_KEY);
  } catch {
    // Silently fail — 이벤트 로깅 실패가 사용자 경험에 영향 주지 않음
    if (import.meta.env.DEV) {
      console.debug('[EventLogger] Failed to flush event buffer');
    }
  }
};

/**
 * UI 이벤트를 기록한다.
 * 버퍼에 저장 후, BATCH_SIZE 이상이면 자동 전송.
 */
export const logUIEvent = (event: UIEvent) => {
  if (import.meta.env.DEV) {
    console.debug('[EventLogger]', event.eventType, event.target, event.metadata);
  }

  const enrichedEvent: UIEvent = {
    ...event,
    sessionId: getSessionId(),
  };

  const buffer = getBuffer();
  buffer.push(enrichedEvent);
  saveBuffer(buffer);

  if (buffer.length >= BATCH_SIZE) {
    flushBuffer();
  }
};

/**
 * 페이지 언로드 시 남은 버퍼를 강제 전송 (best-effort)
 */
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const buffer = getBuffer();
    if (buffer.length > 0) {
      const payload = buffer.map((e) => ({
        eventType: e.eventType,
        target: e.target,
        metadata: e.metadata ? JSON.stringify(e.metadata) : null,
        sessionId: e.sessionId || getSessionId(),
      }));

      // navigator.sendBeacon for reliable delivery during unload
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/events/batch', blob);
      localStorage.removeItem(BUFFER_KEY);
    }
  });
}
