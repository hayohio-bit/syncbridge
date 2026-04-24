package com.syncbridge.domain.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResponse {
    private List<JargonHitDto> topJargonHits;
    private List<RoleRatioDto> roleRatios;
    private ProductivityDto productivity;
    private List<EventTypeCountDto> eventsByType;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JargonHitDto {
        private String keyword;
        private Long hitCount;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoleRatioDto {
        private String role;
        private Long hitCount;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductivityDto {
        private Long totalTasks;
        private Long completedTasks;
        private Double completionRate;
        private Integer avgCompletionDays;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EventTypeCountDto {
        private String eventType;
        private Long count;
    }
}
