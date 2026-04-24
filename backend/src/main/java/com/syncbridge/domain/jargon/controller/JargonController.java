package com.syncbridge.domain.jargon.controller;

import com.syncbridge.domain.jargon.dto.JargonTranslationResponse;
import com.syncbridge.domain.jargon.service.JargonService;
import com.syncbridge.global.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Jargon", description = "용어 및 번역 관련 API")
@RestController
@RequestMapping("/api/jargons")
@RequiredArgsConstructor
public class JargonController {

    private final JargonService jargonService;

    @Operation(summary = "전체 용어 키워드 조회", description = "시스템에 등록된 모든 용어 키워드 목록을 반환합니다.")
    @GetMapping("/keywords")
    public ResponseEntity<CommonResponse<List<String>>> getKeywords() {
        return ResponseEntity.ok(CommonResponse.success(jargonService.getAllKeywords()));
    }

    @Operation(summary = "용어 번역 요청", description = "요청자의 직무에 맞게 IT 용어를 번역하여 반환합니다. (캐시 미스 시 AI로 자동 생성)")
    @GetMapping("/translate")
    public ResponseEntity<CommonResponse<JargonTranslationResponse>> translate(
            @org.springframework.security.core.annotation.AuthenticationPrincipal Long userId,
            org.springframework.security.core.Authentication authentication,
            @RequestParam String keyword) {

        String roleStr = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .map(auth -> auth.replace("ROLE_", ""))
                .orElse("GENERAL");

        return ResponseEntity.ok(CommonResponse.success(jargonService.translate(keyword, roleStr, userId)));
    }

    @Operation(summary = "용어 번역 피드백", description = "제공된 번역 결과에 대해 도움됨/안됨 피드백을 남깁니다.")
    @org.springframework.web.bind.annotation.PostMapping("/translations/{id}/feedback")
    public ResponseEntity<CommonResponse<Void>> addFeedback(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @RequestParam boolean isHelpful) {
        jargonService.addFeedback(id, isHelpful);
        return ResponseEntity.ok(CommonResponse.success(null));
    }
}
