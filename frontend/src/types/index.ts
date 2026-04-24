export type Role = 'GENERAL' | 'PLANNER' | 'DESIGNER' | 'FRONTEND' | 'BACKEND';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface CommonResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface User {
  userId: number;
  email: string;
  name: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  name: string;
  role: Role;
}

export interface Project {
  projectId: number;
  title: string;
  description: string;
}

export type TaskTemplate = 'BUG_REPORT' | 'FEATURE_REQUEST' | 'UI_FIX' | 'DESIGN_REQUEST' | 'GENERAL';

export interface TaskListDto {
  taskId: number;
  title: string;
  requesterId: number;
  requesterName: string;
  assigneeId: number | null;
  assigneeName: string | null;
  status: TaskStatus;
  templateType: TaskTemplate;
  createdAt: string;
}

export interface Attachment {
  id: number;
  originalFileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
}

export interface TaskDetailDto {
  taskId: number;
  projectId: number;
  title: string;
  content: string;
  purpose: string;
  target: string;
  requesterId: number;
  requesterName: string;
  assigneeId: number | null;
  assigneeName: string | null;
  status: TaskStatus;
  templateType: TaskTemplate;
  createdAt: string;
  attachments?: Attachment[];
  aiInsight?: string;
}

export interface JargonResponse {
  id: number;
  keyword: string;
  easyDefinition: string;
  businessImpact?: string;
  helpfulCount: number;
  unhelpfulCount: number;
}
