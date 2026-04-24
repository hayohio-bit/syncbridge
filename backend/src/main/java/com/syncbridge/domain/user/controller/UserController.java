package com.syncbridge.domain.user.controller;

import com.syncbridge.domain.user.dto.AuthResponse;
import com.syncbridge.domain.user.service.UserService;
import com.syncbridge.global.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User", description = "사용자 관련 API")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "내 정보 조회", description = "현재 로그인한 사용자의 정보를 조회합니다.")
    @GetMapping("/me")
    public CommonResponse<AuthResponse.UserInfo> getMyInfo(@AuthenticationPrincipal Long userId) {
        AuthResponse.UserInfo response = userService.getMyInfo(userId);
        return CommonResponse.success(response);
    }

    @Operation(summary = "사용자 검색", description = "이름이나 이메일로 사용자를 검색합니다.")
    @GetMapping("/search")
    public CommonResponse<java.util.List<AuthResponse.UserInfo>> searchUsers(@org.springframework.web.bind.annotation.RequestParam String keyword) {
        return CommonResponse.success(userService.searchUsers(keyword));
    }
}
