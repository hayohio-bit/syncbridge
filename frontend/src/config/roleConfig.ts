import type { Role, TaskStatus } from '../types';

export interface QuickAction {
  label: string;
  iconName: string; // lucide icon identifier
  path: string;
}

export interface LayoutItem {
  widget:
    | 'stats'
    | 'toolbar'
    | 'main-view'
    | 'workflow-hint'
    | 'greeting'
    | 'my-summary'
    | 'my-tasks'
    | 'team-progress';
  order: number;
}

export interface RoleUIConfig {
  // ── 기존 필드 (변경 없음) ──
  menus: string[];
  defaultDashboardView: 'list' | 'kanban';
  visibleStats: string[];
  dashboardLayout: LayoutItem[];
  priorityWorkflowStep: Record<TaskStatus, string | null>;

  // ── 신규 필드 ──
  quickActions: QuickAction[];
  dashboardWidgets: string[];
  defaultTemplateType: string;
  contextGreeting: string;
  emptyStateMessage: string;
}

export const ROLE_CONFIGS: Record<Role, RoleUIConfig> = {
  GENERAL: {
    menus: ['대시보드', '업무 요청'],
    defaultDashboardView: 'list',
    visibleStats: ['total', 'todo', 'done'],
    dashboardLayout: [
      { widget: 'greeting', order: 1 },
      { widget: 'stats', order: 2 },
      { widget: 'my-summary', order: 3 },
      { widget: 'toolbar', order: 4 },
      { widget: 'main-view', order: 5 },
    ],
    priorityWorkflowStep: {
      TODO: '요청 내용 확인',
      IN_PROGRESS: '진행 상태 모니터링',
      DONE: '최종 결과 검토',
    },
    quickActions: [
      { label: '업무 요청', iconName: 'FilePlus2', path: '/create-task' },
      { label: '내 요청 현황', iconName: 'ClipboardList', path: '/dashboard' },
    ],
    dashboardWidgets: ['greeting', 'stats', 'my-summary', 'toolbar', 'main-view'],
    defaultTemplateType: 'GENERAL',
    contextGreeting: '오늘 요청하실 업무가 있으신가요?',
    emptyStateMessage: '새로운 업무를 요청하여 팀원들과 협업을 시작해보세요.',
  },

  PLANNER: {
    menus: ['대시보드', '업무 요청', '프로젝트', '데이터 분석'],
    defaultDashboardView: 'list',
    visibleStats: ['total', 'todo', 'inProgress', 'done'],
    dashboardLayout: [
      { widget: 'greeting', order: 1 },
      { widget: 'stats', order: 2 },
      { widget: 'team-progress', order: 3 },
      { widget: 'my-summary', order: 4 },
      { widget: 'toolbar', order: 5 },
      { widget: 'main-view', order: 6 },
    ],
    priorityWorkflowStep: {
      TODO: '기획안 상세화',
      IN_PROGRESS: '일정 관리',
      DONE: '데이터 분석 반영',
    },
    quickActions: [
      { label: '업무 요청', iconName: 'FilePlus2', path: '/create-task' },
      { label: '프로젝트', iconName: 'FolderKanban', path: '/projects' },
      { label: '데이터 분석', iconName: 'BarChart3', path: '/analytics' },
    ],
    dashboardWidgets: ['greeting', 'stats', 'team-progress', 'my-summary', 'toolbar', 'main-view'],
    defaultTemplateType: 'FEATURE_REQUEST',
    contextGreeting: '프로젝트 진행 상황을 확인하세요.',
    emptyStateMessage: '기획을 시작해보세요. 프로젝트별 진행률을 한눈에 확인할 수 있습니다.',
  },

  DESIGNER: {
    menus: ['대시보드', '업무 요청', '프로젝트'],
    defaultDashboardView: 'kanban',
    visibleStats: ['total', 'inProgress', 'done'],
    dashboardLayout: [
      { widget: 'greeting', order: 1 },
      { widget: 'stats', order: 2 },
      { widget: 'my-tasks', order: 3 },
      { widget: 'toolbar', order: 4 },
      { widget: 'main-view', order: 5 },
    ],
    priorityWorkflowStep: {
      TODO: '디자인 가이드 확인',
      IN_PROGRESS: '에셋 업로드',
      DONE: '피드백 반영 확인',
    },
    quickActions: [
      { label: '업무 요청', iconName: 'FilePlus2', path: '/create-task' },
      { label: '프로젝트', iconName: 'FolderKanban', path: '/projects' },
    ],
    dashboardWidgets: ['greeting', 'stats', 'my-tasks', 'toolbar', 'main-view'],
    defaultTemplateType: 'DESIGN_REQUEST',
    contextGreeting: '배정된 디자인 작업을 확인하세요.',
    emptyStateMessage: '현재 배정된 디자인 업무가 없습니다. 새로운 작업이 오면 알려드릴게요.',
  },

  FRONTEND: {
    menus: ['대시보드', '프로젝트'],
    defaultDashboardView: 'kanban',
    visibleStats: ['total', 'todo', 'inProgress'],
    dashboardLayout: [
      { widget: 'greeting', order: 1 },
      { widget: 'my-tasks', order: 2 },
      { widget: 'main-view', order: 3 },
      { widget: 'stats', order: 4 },
      { widget: 'toolbar', order: 5 },
    ],
    priorityWorkflowStep: {
      TODO: 'UI 컴포넌트 설계',
      IN_PROGRESS: 'API 연동 테스트',
      DONE: '버그 수정 완료',
    },
    quickActions: [
      { label: '프로젝트', iconName: 'FolderKanban', path: '/projects' },
    ],
    dashboardWidgets: ['greeting', 'my-tasks', 'main-view', 'stats', 'toolbar'],
    defaultTemplateType: 'UI_FIX',
    contextGreeting: '진행 중인 프론트엔드 이슈를 확인하세요.',
    emptyStateMessage: '배정된 프론트엔드 작업이 없습니다. 여유로운 시간을 활용해보세요!',
  },

  BACKEND: {
    menus: ['대시보드', '프로젝트'],
    defaultDashboardView: 'kanban',
    visibleStats: ['total', 'todo', 'inProgress'],
    dashboardLayout: [
      { widget: 'greeting', order: 1 },
      { widget: 'my-tasks', order: 2 },
      { widget: 'main-view', order: 3 },
      { widget: 'stats', order: 4 },
      { widget: 'toolbar', order: 5 },
    ],
    priorityWorkflowStep: {
      TODO: 'API 명세 확인',
      IN_PROGRESS: '데이터베이스 마이그레이션',
      DONE: '성능 최적화 확인',
    },
    quickActions: [
      { label: '프로젝트', iconName: 'FolderKanban', path: '/projects' },
    ],
    dashboardWidgets: ['greeting', 'my-tasks', 'main-view', 'stats', 'toolbar'],
    defaultTemplateType: 'BUG_REPORT',
    contextGreeting: '대기 중인 백엔드 작업을 확인하세요.',
    emptyStateMessage: '배정된 백엔드 작업이 없습니다. 코드 리뷰나 기술 부채 정리를 해보세요!',
  },
};
