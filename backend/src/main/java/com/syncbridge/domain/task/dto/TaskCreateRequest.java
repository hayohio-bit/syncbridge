package com.syncbridge.domain.task.dto;

import lombok.Getter;
import jakarta.validation.constraints.NotBlank;

@Getter
public class TaskCreateRequest {
    private Long projectId;
    
    @NotBlank(message = "제목은 필수입니다.")
    private String title;
    
    @NotBlank(message = "설명은 필수입니다.")
    private String content;
    
    private String purpose;
    private String target;
    private Long assigneeId;
    private com.syncbridge.domain.task.entity.TaskTemplate templateType;
    private java.util.List<Long> attachmentIds;
}
