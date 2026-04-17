package com.syncbridge.domain.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class ProjectCreateRequest {
    @NotBlank(message = "프로젝트명은 필수입니다.")
    private String title;
    
    private String description;
}
