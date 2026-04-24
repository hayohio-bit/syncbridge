package com.syncbridge.domain.project.controller;

import com.syncbridge.domain.project.dto.ProjectCreateRequest;
import com.syncbridge.domain.project.dto.ProjectResponse;
import com.syncbridge.domain.project.service.ProjectService;
import com.syncbridge.global.common.CommonResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Project", description = "프로젝트 관련 API")
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @Operation(summary = "프로젝트 생성", description = "새로운 프로젝트를 생성합니다.")
    @PostMapping
    public ResponseEntity<CommonResponse<ProjectResponse>> createProject(@Valid @RequestBody ProjectCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponse.success(projectService.createProject(request)));
    }

    @Operation(summary = "프로젝트 목록 조회", description = "전체 프로젝트 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<CommonResponse<List<ProjectResponse>>> getProjects() {
        return ResponseEntity.ok(CommonResponse.success(projectService.getProjects()));
    }

    @Operation(summary = "프로젝트 단건 조회", description = "특정 프로젝트의 상세 정보를 조회합니다.")
    @GetMapping("/{projectId}")
    public ResponseEntity<CommonResponse<ProjectResponse>> getProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(CommonResponse.success(projectService.getProject(projectId)));
    }
}
