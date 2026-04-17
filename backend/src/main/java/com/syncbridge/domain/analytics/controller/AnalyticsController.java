package com.syncbridge.domain.analytics.controller;

import com.syncbridge.domain.analytics.dto.AnalyticsResponse;
import com.syncbridge.domain.analytics.service.AnalyticsService;
import com.syncbridge.global.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<CommonResponse<AnalyticsResponse>> getDashboardData() {
        return ResponseEntity.ok(CommonResponse.success(analyticsService.getDashboardData()));
    }
}
