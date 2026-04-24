package com.syncbridge.domain.analytics.controller;

import com.syncbridge.domain.analytics.dto.AnalyticsResponse;
import com.syncbridge.domain.analytics.service.AnalyticsService;
import com.syncbridge.global.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Analytics", description = "통계 및 대시보드 관련 API")
@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Operation(summary = "대시보드 통계 조회", description = "사용자 직무에 따른 용어 조회 통계 및 대시보드 데이터를 제공합니다.")
    @GetMapping("/dashboard")
    public ResponseEntity<CommonResponse<AnalyticsResponse>> getDashboardData() {
        return ResponseEntity.ok(CommonResponse.success(analyticsService.getDashboardData()));
    }
}
