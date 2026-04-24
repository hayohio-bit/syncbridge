package com.syncbridge.domain.analytics.service;

import com.syncbridge.domain.analytics.dto.UIEventDto;
import com.syncbridge.domain.analytics.entity.UIEvent;
import com.syncbridge.domain.analytics.repository.UIEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UIEventService {

    private final UIEventRepository uiEventRepository;

    @Transactional
    public void logEvent(Long userId, String userRole, UIEventDto dto) {
        UIEvent event = UIEvent.builder()
                .userId(userId)
                .userRole(userRole)
                .eventType(dto.getEventType())
                .target(dto.getTarget())
                .metadata(dto.getMetadata())
                .sessionId(dto.getSessionId())
                .build();

        uiEventRepository.save(event);
    }

    @Transactional
    public void logBatchEvents(Long userId, String userRole, List<UIEventDto> dtos) {
        List<UIEvent> events = dtos.stream()
                .map(dto -> UIEvent.builder()
                        .userId(userId)
                        .userRole(userRole)
                        .eventType(dto.getEventType())
                        .target(dto.getTarget())
                        .metadata(dto.getMetadata())
                        .sessionId(dto.getSessionId())
                        .build())
                .toList();

        uiEventRepository.saveAll(events);
    }
}
