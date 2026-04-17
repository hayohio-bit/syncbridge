package com.syncbridge.domain.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private String type; // TASK_ASSIGNED, STATUS_CHANGED
    private Long taskId;
    private String title;
    private String message;
    private String senderName;
}
