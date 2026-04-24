package com.syncbridge.domain.analytics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UIEventDto {

    @NotBlank(message = "이벤트 타입은 필수입니다.")
    @Size(max = 50)
    private String eventType;

    @NotBlank(message = "이벤트 대상은 필수입니다.")
    @Size(max = 255)
    private String target;

    private String metadata;

    @Size(max = 100)
    private String sessionId;
}
