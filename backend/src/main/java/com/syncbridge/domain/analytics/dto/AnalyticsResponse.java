package com.syncbridge.domain.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class AnalyticsResponse {

    private List<JargonHitStats> topJargonHits;
    private List<RoleRatioStats> roleRatios;
    private ProjectEfficiencyStats productivity;

    @Getter
    @AllArgsConstructor
    public static class JargonHitStats {
        private String keyword;
        private Long hitCount;
    }

    @Getter
    @AllArgsConstructor
    public static class RoleRatioStats {
        private String role;
        private Long hitCount;
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class ProjectEfficiencyStats {
        private Long totalTasks;
        private Long completedTasks;
        private Double completionRate;
        private Double avgCompletionDays;
    }
}
