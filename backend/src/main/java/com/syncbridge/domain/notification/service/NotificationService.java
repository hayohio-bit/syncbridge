package com.syncbridge.domain.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

import com.syncbridge.domain.notification.dto.NotificationDto;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(Long userId, NotificationDto dto) {
        String destination = "/queue/notifications";
        
        log.info("Sending notification to user {}: {}", userId, dto.getMessage());
        
        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                destination,
                dto
        );
    }

    public void broadcastTaskUpdate(String action, Long taskId) {
        log.info("Broadcasting task update: {} for task {}", action, taskId);
        messagingTemplate.convertAndSend("/topic/tasks", Map.of(
            "action", action,
            "taskId", taskId
        ));
    }
}
