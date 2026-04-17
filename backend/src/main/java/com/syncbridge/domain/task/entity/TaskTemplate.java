package com.syncbridge.domain.task.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Set;

@Getter
@RequiredArgsConstructor
public enum TaskTemplate {
    BUG_REPORT("버그 리포트", Set.of("purpose", "target")),
    FEATURE_REQUEST("기능 요청", Set.of("purpose", "target")),
    UI_FIX("UI 수정", Set.of("target")),
    DESIGN_REQUEST("디자인 요청", Set.of("purpose")),
    GENERAL("일반 요청", Set.of());

    private final String description;
    private final Set<String> requiredFields;

    public boolean isFieldRequired(String fieldName) {
        return requiredFields.contains(fieldName);
    }
}
