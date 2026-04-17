package com.syncbridge.domain.jargon.dto;

import com.syncbridge.domain.jargon.entity.JargonTranslation;
import lombok.Getter;

@Getter
public class JargonResponse {
    private String keyword;
    private String easyDefinition;
    private String businessImpact;

    public JargonResponse(JargonTranslation translation) {
        this.keyword = translation.getJargonTerm().getKeyword();
        this.easyDefinition = translation.getEasyDefinition();
        this.businessImpact = translation.getBusinessImpact();
    }
}
