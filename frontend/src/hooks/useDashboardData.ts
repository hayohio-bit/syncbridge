import React, { useState, useEffect } from 'react';

/**
 * 티켓 단일 항목 인터페이스
 */
export interface Ticket {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'done';
  createdAt: string;
  assignee: string;
}

/**
 * 대시보드 데이터 전체 인터페이스
 */
export interface DashboardData {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    done: number;
  };
  tickets: Ticket[];
  isLoading: boolean;
}

/**
 * 대시보드 데이터를 관리하는 커스텀 훅
 * 현재는 목업 데이터를 반환하며, 향후 실제 API 호출로 교체 가능합니다.
 */
export const useDashboardData = (): DashboardData => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 500ms 후 목업 데이터 세팅 (실제 API 호출 시뮬레이션)
    const timer = setTimeout(() => {
      // [TODO] 실제 API 연동 시 아래 목업 데이터를 fetch 결과로 교체하세요.
      // 예: const response = await fetch('/api/dashboard/tickets');
      const mockTickets: Ticket[] = [
        {
          id: 'TKT-001',
          title: 'ERP 시스템 권한 변경 요청 (재무팀)',
          status: 'pending',
          createdAt: '2026-03-30 09:00',
          assignee: '김철수',
        },
        {
          id: 'TKT-002',
          title: '신규 입사자 메일 계정 및 Slack 초대 요청',
          status: 'done',
          createdAt: '2026-03-30 09:30',
          assignee: '이영희',
        },
        {
          id: 'TKT-003',
          title: '사내 위키(Confluence) 접속 장애 긴급 조치',
          status: 'in_progress',
          createdAt: '2026-03-30 10:15',
          assignee: '박지민',
        },
        {
          id: 'TKT-004',
          title: 'VPN 라이선스 연간 갱신 및 추가 구매 검토',
          status: 'pending',
          createdAt: '2026-03-30 11:00',
          assignee: '최도윤',
        },
        {
          id: 'TKT-005',
          title: '분기별 정기 보안 취약점 점검 및 조치',
          status: 'in_progress',
          createdAt: '2026-03-30 13:20',
          assignee: '강지훈',
        },
        {
          id: 'TKT-006',
          title: '메인 데이터베이스 인덱스 최적화 및 쿼리 튜닝',
          status: 'done',
          createdAt: '2026-03-29 17:45',
          assignee: '정우진',
        },
        {
          id: 'TKT-007',
          title: '사내 협업 도구 연동 모듈 개발 및 테스트',
          status: 'pending',
          createdAt: '2026-03-30 14:10',
          assignee: '한소망',
        },
      ];

      setTickets(mockTickets);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const stats = React.useMemo(() => ({
    total: tickets.length,
    pending: tickets.filter((t) => t.status === 'pending').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    done: tickets.filter((t) => t.status === 'done').length,
  }), [tickets]);

  return {
    stats,
    tickets,
    isLoading,
  };
};
