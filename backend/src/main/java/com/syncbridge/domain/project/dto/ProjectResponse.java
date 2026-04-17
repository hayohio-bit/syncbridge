package com.syncbridge.domain.project.dto;

import com.syncbridge.domain.project.entity.Project;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProjectResponse {
    private Long projectId;
    private String title;
    private String description;

    public static ProjectResponse from(Project project) {
        return new ProjectResponse(project.getId(), project.getTitle(), project.getDescription());
    }
}
