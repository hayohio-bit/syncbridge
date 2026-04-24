package com.syncbridge.domain.task.service;

import com.syncbridge.domain.notification.dto.NotificationDto;
import com.syncbridge.domain.notification.service.NotificationService;
import com.syncbridge.domain.project.entity.Project;
import com.syncbridge.domain.project.repository.ProjectRepository;
import com.syncbridge.domain.task.dto.TaskCreateRequest;
import com.syncbridge.domain.task.dto.TaskDetailResponse;
import com.syncbridge.domain.task.dto.TaskListResponse;
import com.syncbridge.domain.task.dto.TaskUpdateRequest;
import com.syncbridge.domain.task.entity.Task;
import com.syncbridge.domain.task.entity.TaskStatus;
import com.syncbridge.domain.attachment.repository.AttachmentRepository;
import com.syncbridge.domain.task.repository.TaskRepository;
import com.syncbridge.domain.user.entity.Role;
import com.syncbridge.domain.user.entity.User;
import com.syncbridge.domain.user.repository.UserRepository;
import com.syncbridge.global.exception.ErrorCode;
import com.syncbridge.global.exception.NotFoundException;
import com.syncbridge.global.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final NotificationService notificationService;
    private final AttachmentRepository attachmentRepository;
    private final TaskAiService taskAiService;

    @Transactional
    public TaskDetailResponse createTask(Long userId, TaskCreateRequest request) {
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        Project project = null;
        if (request.getProjectId() != null) {
            project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new NotFoundException(ErrorCode.PROJECT_NOT_FOUND));
        }

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));
        }

        // 템플릿 필수 필드 검증
        com.syncbridge.domain.task.entity.TaskTemplate template = request.getTemplateType();
        if (template != null) {
            for (String field : template.getRequiredFields()) {
                boolean isMissing = switch (field) {
                    case "purpose" -> request.getPurpose() == null || request.getPurpose().isBlank();
                    case "target" -> request.getTarget() == null || request.getTarget().isBlank();
                    default -> false;
                };
                if (isMissing) {
                    throw new com.syncbridge.global.exception.CustomException(ErrorCode.INVALID_INPUT_VALUE, 
                        template.getDescription() + " 타입은 " + field + " 항목이 필수입니다.");
                }
            }
        }

        Task task = Task.builder()
                .project(project)
                .requester(requester)
                .assignee(assignee)
                .templateType(template)
                .title(request.getTitle())
                .content(request.getContent())
                .purpose(request.getPurpose())
                .target(request.getTarget())
                .status(TaskStatus.TODO)
                .build();

        Task savedTask = taskRepository.save(task);

        if (assignee != null) {
            notificationService.sendNotification(
                    assignee.getId(),
                    NotificationDto.builder()
                            .type("TASK_ASSIGNED")
                            .taskId(savedTask.getId())
                            .title("새로운 업무 배정")
                            .message(String.format("[%s] 업무가 당신에게 할당되었습니다.", savedTask.getTitle()))
                            .senderName(requester.getName())
                            .build()
            );
        }

        // 첨부파일 연관관계 설정
        if (request.getAttachmentIds() != null && !request.getAttachmentIds().isEmpty()) {
            List<com.syncbridge.domain.attachment.entity.Attachment> attachments =
                    attachmentRepository.findAllById(request.getAttachmentIds());
            if (attachments.size() != request.getAttachmentIds().size()) {
                throw new NotFoundException(ErrorCode.FILE_NOT_FOUND);
            }
            for (com.syncbridge.domain.attachment.entity.Attachment attachment : attachments) {
                if (attachment.isDeleted()) {
                    throw new NotFoundException(ErrorCode.FILE_NOT_FOUND);
                }
                if (!attachment.getUploader().getId().equals(userId)) {
                    throw new UnauthorizedException(ErrorCode.FORBIDDEN);
                }
                attachment.setTask(savedTask);
            }
        }

        return new TaskDetailResponse(savedTask);
    }

    public List<TaskListResponse> getTasksWithFilters(Long userId, String roleStr, TaskStatus status, Long projectId, String keyword) {
        List<Task> tasks = taskRepository.findByUserIdInvolvedWithFilters(userId, status, projectId, keyword);
        return tasks.stream().map(TaskListResponse::new).collect(Collectors.toList());
    }

    public TaskDetailResponse getTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> new NotFoundException(ErrorCode.TASK_NOT_FOUND));
        
        TaskDetailResponse response = new TaskDetailResponse(task);
        
        // AI 분석 연동 (상세 조회 시 실시간 분석)
        try {
            String insight = taskAiService.analyzeTask(task.getTitle(), task.getContent());
            response.setAiInsight(insight);
        } catch (Exception e) {
            // AI 실패 시 응답에 지장을 주지 않음
        }
        
        return response;
    }

    @Transactional
    public TaskDetailResponse updateTask(Long taskId, Long userId, TaskUpdateRequest request) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> new NotFoundException(ErrorCode.TASK_NOT_FOUND));

        boolean isRequester = task.getRequester().getId().equals(userId);
        boolean isAssignee = task.getAssignee() != null && task.getAssignee().getId().equals(userId);
        
        if (!isRequester && !isAssignee) {
            throw new UnauthorizedException(ErrorCode.FORBIDDEN);
        }

        if (request.getStatus() != null && task.getStatus() != request.getStatus()) {
            task.updateStatus(request.getStatus());
            
            // 상태를 변경한 사람이 요청자가 아닐 때만 요청자에게 알림 발송
            if (!isRequester) {
                notificationService.sendNotification(
                        task.getRequester().getId(),
                        NotificationDto.builder()
                                .type("STATUS_CHANGED")
                                .taskId(task.getId())
                                .title("업무 상태 변경")
                                .message(String.format("[%s] 업무의 상태가 %s(으)로 변경되었습니다.", task.getTitle(), request.getStatus().name()))
                                .senderName(task.getAssignee() != null ? task.getAssignee().getName() : "시스템")
                                .build()
                );
            }
        }

        return new TaskDetailResponse(task);
    }

    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> new NotFoundException(ErrorCode.TASK_NOT_FOUND));

        boolean isRequester = task.getRequester().getId().equals(userId);
        boolean isAssignee = task.getAssignee() != null && task.getAssignee().getId().equals(userId);
        
        if (!isRequester && !isAssignee) {
            throw new UnauthorizedException(ErrorCode.FORBIDDEN);
        }

        task.getAttachments().forEach(attachment -> attachment.softDelete());
        task.softDelete();
    }
}
