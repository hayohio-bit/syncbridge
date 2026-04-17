package com.syncbridge.domain.jargon.dto;

import com.syncbridge.domain.jargon.entity.JargonTranslation;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JargonTranslationResponse {
    private Long id;
    private String keyword;
    private String easyDefinition;
    private String businessImpact;
    private int helpfulCount;
    private int unhelpfulCount;

    public static JargonTranslationResponse from(JargonTranslation translation) {
        return new JargonTranslationResponse(
                translation.getId(),
                translation.getJargonTerm().getKeyword(),
                translation.getEasyDefinition(),
                translation.getBusinessImpact(),
                translation.getHelpfulCount(),
                translation.getUnhelpfulCount()
        );
    }
}
