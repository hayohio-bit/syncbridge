import type { Role, TaskStatus } from '../types';

export interface LayoutItem {
  widget: 'stats' | 'toolbar' | 'main-view' | 'workflow-hint';
  order: number;
}

export interface RoleUIConfig {
  menus: string[]; // List of navigation labels/paths
  defaultDashboardView: 'list' | 'kanban';
  visibleStats: string[]; // 'total', 'todo', 'inProgress', 'done'
  dashboardLayout: LayoutItem[];
  priorityWorkflowStep: Record<TaskStatus, string | null>;
}

export const ROLE_CONFIGS: Record<Role, RoleUIConfig> = {
  GENERAL: {
    menus: ['대시보드', '업무 요청'],
    defaultDashboardView: 'list',
    visibleStats: ['total', 'todo', 'done'],
    dashboardLayout: [
      { widget: 'stats', order: 1 },
      { widget: 'toolbar', order: 2 },
      { widget: 'main-view', order: 3 },
    ],
    priorityWorkflowStep: {
      TODO: '요청 내용 확인',
      IN_PROGRESS: '진행 상태 모니터링',
      DONE: '최종 결과 검토',
    },
  },
  PLANNER: {
    menus: ['대시보드', '업무 요청', '프로젝트', '데이터 분석'],
    defaultDashboardView: 'list',
    visibleStats: ['total', 'todo', 'inProgress', 'done'],
    dashboardLayout: [
      { widget: 'stats', order: 1 },
      { widget: 'toolbar', order: 2 },
      { widget: 'main-view', order: 3 },
    ],
    priorityWorkflowStep: {
      TODO: '기획안 상세화',
      IN_PROGRESS: '일정 관리',
      DONE: '데이터 분석 반영',
    },
  },
  DESIGNER: {
    menus: ['대시보드', '업무 요청', '프로젝트'],
    defaultDashboardView: 'kanban',
    visibleStats: ['total', 'inProgress', 'done'],
    dashboardLayout: [
      { widget: 'stats', order: 1 },
      { widget: 'toolbar', order: 2 },
      { widget: 'main-view', order: 3 },
    ],
    priorityWorkflowStep: {
      TODO: '디자인 가이드 확인',
      IN_PROGRESS: '에셋 업로드',
      DONE: '피드백 반영 확인',
    },
  },
  FRONTEND: {
    menus: ['대시보드', '프로젝트'],
    defaultDashboardView: 'kanban',
    visibleStats: ['total', 'todo', 'inProgress'],
    dashboardLayout: [
      { widget: 'main-view', order: 1 },
      { widget: 'stats', order: 2 },
      { widget: 'toolbar', order: 3 },
    ],
    priorityWorkflowStep: {
      TODO: 'UI 컴포넌트 설계',
      IN_PROGRESS: 'API 연동 테스트',
      DONE: '버그 수정 완료',
    },
  },
  BACKEND: {
    menus: ['대시보드', '프로젝트'],
    defaultDashboardView: 'kanban',
    visibleStats: ['total', 'todo', 'inProgress'],
    dashboardLayout: [
      { widget: 'main-view', order: 1 },
      { widget: 'stats', order: 2 },
      { widget: 'toolbar', order: 3 },
    ],
    priorityWorkflowStep: {
      TODO: 'API 명세 확인',
      IN_PROGRESS: '데이터베이스 마이그레이션',
      DONE: '성능 최적화 확인',
    },
  },
};
