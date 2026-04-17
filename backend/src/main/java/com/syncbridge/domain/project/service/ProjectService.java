package com.syncbridge.domain.project.service;

import com.syncbridge.domain.project.dto.ProjectCreateRequest;
import com.syncbridge.domain.project.dto.ProjectResponse;
import com.syncbridge.domain.project.entity.Project;
import com.syncbridge.domain.project.repository.ProjectRepository;
import com.syncbridge.global.exception.ErrorCode;
import com.syncbridge.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional
    public ProjectResponse createProject(ProjectCreateRequest request) {
        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .build();
        return ProjectResponse.from(projectRepository.save(project));
    }

    public List<ProjectResponse> getProjects() {
        return projectRepository.findAllByIsDeletedFalse().stream()
                .map(ProjectResponse::from)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new NotFoundException(ErrorCode.PROJECT_NOT_FOUND));
        return ProjectResponse.from(project);
    }
}
