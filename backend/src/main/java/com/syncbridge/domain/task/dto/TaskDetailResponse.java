package com.syncbridge.domain.task.dto;

import com.syncbridge.domain.attachment.dto.AttachmentResponse;
import com.syncbridge.domain.task.entity.Task;
import com.syncbridge.domain.task.entity.TaskStatus;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class TaskDetailResponse {
    private Long taskId;
    private Long projectId;
    private String title;
    private String content;
    private String purpose;
    private String target;
    private String requesterName;
    private String assigneeName;
    private TaskStatus status;
    private String templateType;
    private LocalDateTime createdAt;
    private List<AttachmentResponse> attachments;
    private String aiInsight;

    public TaskDetailResponse(Task task) {
        this.taskId = task.getId();
        this.projectId = task.getProject() != null ? task.getProject().getId() : null;
        this.title = task.getTitle();
        this.content = task.getContent();
        this.purpose = task.getPurpose();
        this.target = task.getTarget();
        this.requesterName = task.getRequester().getName();
        this.assigneeName = task.getAssignee() != null ? task.getAssignee().getName() : null;
        this.status = task.getStatus();
        this.templateType = task.getTemplateType() != null ? task.getTemplateType().name() : null;
        this.attachments = task.getAttachments() != null ? 
                task.getAttachments().stream().map(AttachmentResponse::from).collect(Collectors.toList()) : null;
    }

    public void setAiInsight(String aiInsight) {
        this.aiInsight = aiInsight;
    }
}
