package com.syncbridge.domain.task.dto;

import com.syncbridge.domain.task.entity.Task;
import com.syncbridge.domain.task.entity.TaskStatus;
import lombok.Getter;

@Getter
public class TaskListResponse {
    private Long taskId;
    private String title;
    private String requesterName;
    private String assigneeName;
    private TaskStatus status;
    private String templateType;

    public TaskListResponse(Task task) {
        this.taskId = task.getId();
        this.title = task.getTitle();
        this.requesterName = task.getRequester().getName();
        this.assigneeName = task.getAssignee() != null ? task.getAssignee().getName() : null;
        this.status = task.getStatus();
        this.templateType = task.getTemplateType() != null ? task.getTemplateType().name() : null;
    }
}
