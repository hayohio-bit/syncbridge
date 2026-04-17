package com.syncbridge.domain.task.dto;

import com.syncbridge.domain.task.entity.TaskStatus;
import lombok.Getter;

@Getter
public class TaskUpdateRequest {
    private TaskStatus status;
}
