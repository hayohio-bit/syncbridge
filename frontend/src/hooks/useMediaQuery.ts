import { useSyncExternalStore } from 'react';

/**
 * useMediaQuery 커스텀 훅
 * - React 18의 useSyncExternalStore를 사용하여 미디어 쿼리 상태를 안전하게 구독합니다.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', callback);
      return () => media.removeEventListener('change', callback);
    },
    () => window.matchMedia(query).matches,
    () => false // 서버 사이드 렌더링 시 기본값
  );
}

/**
 * 자주 사용되는 모바일/태블릿 브레이크포인트 전용 훅
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 768px)');
}

export function useIsTablet() {
  return useMediaQuery('(max-width: 1024px)');
}
