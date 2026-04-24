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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Task", description = "업무(티켓) 관련 API")
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "업무 생성", description = "새로운 업무(티켓)를 생성합니다.")
    @PostMapping
    public ResponseEntity<CommonResponse<TaskDetailResponse>> createTask(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody TaskCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponse.success(taskService.createTask(userId, request)));
    }

    @Operation(summary = "업무 목록 조회", description = "권한에 따라 필터링된 업무 목록을 조회합니다.")
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

    @Operation(summary = "업무 단건 조회", description = "특정 업무의 상세 정보를 조회합니다.")
    @GetMapping("/{taskId}")
    public ResponseEntity<CommonResponse<TaskDetailResponse>> getTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(CommonResponse.success(taskService.getTask(taskId)));
    }

    @Operation(summary = "업무 수정", description = "특정 업무의 정보를 수정합니다. (상태 변경 등)")
    @PatchMapping("/{taskId}")
    public ResponseEntity<CommonResponse<TaskDetailResponse>> updateTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal Long userId,
            @RequestBody TaskUpdateRequest request) {
        return ResponseEntity.ok(CommonResponse.success(taskService.updateTask(taskId, userId, request)));
    }

    @Operation(summary = "업무 삭제", description = "특정 업무를 소프트 삭제합니다.")
    @DeleteMapping("/{taskId}")
    public ResponseEntity<CommonResponse<Void>> deleteTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal Long userId) {
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.ok(CommonResponse.success(null));
    }
}
