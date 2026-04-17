package com.syncbridge.domain.project.controller;

import com.syncbridge.domain.project.dto.ProjectCreateRequest;
import com.syncbridge.domain.project.dto.ProjectResponse;
import com.syncbridge.domain.project.service.ProjectService;
import com.syncbridge.global.common.CommonResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<CommonResponse<ProjectResponse>> createProject(@Valid @RequestBody ProjectCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponse.success(projectService.createProject(request)));
    }

    @GetMapping
    public ResponseEntity<CommonResponse<List<ProjectResponse>>> getProjects() {
        return ResponseEntity.ok(CommonResponse.success(projectService.getProjects()));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<CommonResponse<ProjectResponse>> getProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(CommonResponse.success(projectService.getProject(projectId)));
    }
}
