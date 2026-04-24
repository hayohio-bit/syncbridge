package com.syncbridge.domain.analytics.service;

import com.syncbridge.domain.analytics.dto.AnalyticsResponse;
import com.syncbridge.domain.analytics.repository.UIEventRepository;
import com.syncbridge.domain.jargon.repository.JargonHitRepository;
import com.syncbridge.domain.task.entity.Task;
import com.syncbridge.domain.task.entity.TaskStatus;
import com.syncbridge.domain.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InsightsService {

    private final JargonHitRepository jargonHitRepository;
    private final TaskRepository taskRepository;
    private final UIEventRepository uiEventRepository;

    public AnalyticsResponse getDashboardAnalytics() {
        // 1. Top Jargon Hits
        List<AnalyticsResponse.JargonHitDto> topHits = jargonHitRepository.findTopHits().stream()
                .limit(5)
                .map(row -> new AnalyticsResponse.JargonHitDto((String) row[0], (Long) row[1]))
                .collect(Collectors.toList());

        // 2. Role Ratios
        List<AnalyticsResponse.RoleRatioDto> roleRatios = jargonHitRepository.findHitRatioByRole().stream()
                .map(row -> new AnalyticsResponse.RoleRatioDto(row[0].toString(), (Long) row[1]))
                .collect(Collectors.toList());

        // 3. Productivity Stats
        List<Task> allTasks = taskRepository.findAllActiveTasks();
        long totalTasks = allTasks.size();
        List<Task> completedTasks = allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE)
                .collect(Collectors.toList());
        
        double completionRate = totalTasks == 0 ? 0.0 : (double) completedTasks.size() / totalTasks * 100;
        
        int avgDays = 0;
        if (!completedTasks.isEmpty()) {
            long totalDays = completedTasks.stream()
                    .mapToLong(t -> Duration.between(t.getCreatedAt(), t.getUpdatedAt()).toDays())
                    .sum();
            avgDays = (int) (totalDays / completedTasks.size());
        }

        AnalyticsResponse.ProductivityDto productivity = AnalyticsResponse.ProductivityDto.builder()
                .totalTasks(totalTasks)
                .completedTasks((long) completedTasks.size())
                .completionRate(Math.round(completionRate * 10.0) / 10.0)
                .avgCompletionDays(avgDays)
                .build();

        // 4. Events by Type (Heuristic Analysis)
        List<AnalyticsResponse.EventTypeCountDto> eventsByType = uiEventRepository.findEventCountsByType().stream()
                .map(row -> new AnalyticsResponse.EventTypeCountDto((String) row[0], (Long) row[1]))
                .collect(Collectors.toList());

        return AnalyticsResponse.builder()
                .topJargonHits(topHits)
                .roleRatios(roleRatios)
                .productivity(productivity)
                .eventsByType(eventsByType)
                .build();
    }
}
