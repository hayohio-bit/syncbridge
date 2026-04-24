package com.syncbridge.domain.task.dto;

import com.syncbridge.domain.task.entity.Task;
import com.syncbridge.domain.task.entity.TaskStatus;
import lombok.Getter;

@Getter
public class TaskListResponse {
    private Long taskId;
    private String title;
    private Long requesterId;
    private String requesterName;
    private Long assigneeId;
    private String assigneeName;
    private TaskStatus status;
    private String templateType;

    public TaskListResponse(Task task) {
        this.taskId = task.getId();
        this.title = task.getTitle();
        this.requesterId = task.getRequester().getId();
        this.requesterName = task.getRequester().getName();
        this.assigneeId = task.getAssignee() != null ? task.getAssignee().getId() : null;
        this.assigneeName = task.getAssignee() != null ? task.getAssignee().getName() : null;
        this.status = task.getStatus();
        this.templateType = task.getTemplateType() != null ? task.getTemplateType().name() : null;
    }
}
