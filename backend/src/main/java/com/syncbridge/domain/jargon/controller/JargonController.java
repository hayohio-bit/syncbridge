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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/jargons")
@RequiredArgsConstructor
public class JargonController {

    private final JargonService jargonService;

    @GetMapping("/keywords")
    public ResponseEntity<CommonResponse<List<String>>> getKeywords() {
        return ResponseEntity.ok(CommonResponse.success(jargonService.getAllKeywords()));
    }

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

    @org.springframework.web.bind.annotation.PostMapping("/translations/{id}/feedback")
    public ResponseEntity<CommonResponse<Void>> addFeedback(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @RequestParam boolean isHelpful) {
        jargonService.addFeedback(id, isHelpful);
        return ResponseEntity.ok(CommonResponse.success(null));
    }
}
