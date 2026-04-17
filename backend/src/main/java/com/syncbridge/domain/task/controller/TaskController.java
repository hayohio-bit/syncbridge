package com.syncbridge.domain.task.controller;

import com.syncbridge.domain.task.dto.TaskCreateRequest;
import com.syncbridge.domain.task.dto.TaskDetailResponse;
import com.syncbridge.domain.task.dto.TaskListResponse;
import com.syncbridge.domain.task.dto.TaskUpdateRequest;
import com.syncbridge.domain.task.entity.TaskStatus;
import com.syncbridge.domain.task.service.TaskService;
import com.syncbridge.global.common.CommonResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<CommonResponse<TaskDetailResponse>> createTask(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody TaskCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponse.success(taskService.createTask(userId, request)));
    }

    @GetMapping
    public ResponseEntity<CommonResponse<List<TaskListResponse>>> getTasks(
            @AuthenticationPrincipal Long userId,
            org.springframework.security.core.Authentication authentication,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) String keyword) {
        
        String roleStr = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .map(auth -> auth.replace("ROLE_", ""))
                .orElse("GENERAL");

        return ResponseEntity.ok(CommonResponse.success(
                taskService.getTasksWithFilters(userId, roleStr, status, projectId, keyword)));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<CommonResponse<TaskDetailResponse>> getTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(CommonResponse.success(taskService.getTask(taskId)));
    }

    @PatchMapping("/{taskId}")
    public ResponseEntity<CommonResponse<TaskDetailResponse>> updateTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal Long userId,
            @RequestBody TaskUpdateRequest request) {
        return ResponseEntity.ok(CommonResponse.success(taskService.updateTask(taskId, userId, request)));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<CommonResponse<Void>> deleteTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal Long userId) {
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.ok(CommonResponse.success(null));
    }
}
