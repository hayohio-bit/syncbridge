package com.syncbridge.domain.analytics.service;

import com.syncbridge.domain.analytics.dto.AnalyticsResponse;
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
public class AnalyticsService {

    private final JargonHitRepository jargonHitRepository;
    private final TaskRepository taskRepository;

    public AnalyticsResponse getDashboardData() {
        // 1. Top 5 Jargon Hits
        List<AnalyticsResponse.JargonHitStats> topHits = jargonHitRepository.findTopHits().stream()
                .limit(5)
                .map(row -> new AnalyticsResponse.JargonHitStats((String) row[0], (Long) row[1]))
                .collect(Collectors.toList());

        // 2. Role Ratio
        List<AnalyticsResponse.RoleRatioStats> roleRatios = jargonHitRepository.findHitRatioByRole().stream()
                .map(row -> new AnalyticsResponse.RoleRatioStats(row[0].toString(), (Long) row[1]))
                .collect(Collectors.toList());

        // 3. Project Productivity
        List<Task> allTasks = taskRepository.findAllActiveTasks();

        long totalCount = allTasks.size();
        long completedCount = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        double completionRate = totalCount == 0 ? 0 : (double) completedCount / totalCount * 100;

        double avgDays = allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE && t.getDoneAt() != null)
                .mapToLong(t -> Duration.between(t.getCreatedAt(), t.getDoneAt()).toDays())
                .average()
                .orElse(0.0);

        AnalyticsResponse.ProjectEfficiencyStats productivity = AnalyticsResponse.ProjectEfficiencyStats.builder()
                .totalTasks(totalCount)
                .completedTasks(completedCount)
                .completionRate(Math.round(completionRate * 10.0) / 10.0)
                .avgCompletionDays(Math.round(avgDays * 10.0) / 10.0)
                .build();

        return AnalyticsResponse.builder()
                .topJargonHits(topHits)
                .roleRatios(roleRatios)
                .productivity(productivity)
                .build();
    }
}
