package com.syncbridge.domain.analytics.controller;

import com.syncbridge.domain.analytics.dto.AnalyticsResponse;
import com.syncbridge.domain.analytics.service.InsightsService;
import com.syncbridge.global.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightsController {

    private final InsightsService insightsService;

    @GetMapping("/dashboard")
    public CommonResponse<AnalyticsResponse> getDashboardAnalytics() {
        return CommonResponse.success(insightsService.getDashboardAnalytics());
    }
}
