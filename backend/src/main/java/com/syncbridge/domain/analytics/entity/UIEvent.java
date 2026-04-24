package com.syncbridge.domain.analytics.entity;

import com.syncbridge.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ui_events")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UIEvent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 30)
    private String userRole;

    @Column(nullable = false, length = 50)
    private String eventType;

    @Column(nullable = false, length = 255)
    private String target;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @Column(length = 100)
    private String sessionId;

    @Builder
    public UIEvent(Long userId, String userRole, String eventType, String target,
                   String metadata, String sessionId) {
        this.userId = userId;
        this.userRole = userRole;
        this.eventType = eventType;
        this.target = target;
        this.metadata = metadata;
        this.sessionId = sessionId;
    }
}
