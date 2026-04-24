package com.syncbridge.domain.analytics.controller;

import com.syncbridge.domain.analytics.dto.UIEventDto;
import com.syncbridge.domain.analytics.service.UIEventService;
import com.syncbridge.global.common.CommonResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Analytics", description = "UI 이벤트 분석 API")
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class UIEventController {

    private final UIEventService uiEventService;

    @Operation(summary = "UI 이벤트 기록", description = "프론트엔드에서 발생한 UI 인터랙션 이벤트를 기록합니다.")
    @PostMapping("/events")
    public ResponseEntity<CommonResponse<Void>> logEvent(
            @AuthenticationPrincipal Long userId,
            Authentication authentication,
            @Valid @RequestBody UIEventDto request) {

        String role = extractRole(authentication);
        uiEventService.logEvent(userId, role, request);
        return ResponseEntity.ok(CommonResponse.success(null));
    }

    @Operation(summary = "UI 이벤트 배치 기록", description = "다수의 UI 이벤트를 한 번에 기록합니다.")
    @PostMapping("/events/batch")
    public ResponseEntity<CommonResponse<Void>> logBatchEvents(
            @AuthenticationPrincipal Long userId,
            Authentication authentication,
            @Valid @RequestBody List<UIEventDto> requests) {

        String role = extractRole(authentication);
        uiEventService.logBatchEvents(userId, role, requests);
        return ResponseEntity.ok(CommonResponse.success(null));
    }

    private String extractRole(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .map(auth -> auth.replace("ROLE_", ""))
                .orElse("GENERAL");
    }
}
