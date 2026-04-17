package com.syncbridge.domain.user.controller;

import com.syncbridge.domain.user.dto.AuthResponse;
import com.syncbridge.domain.user.service.UserService;
import com.syncbridge.global.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public CommonResponse<AuthResponse.UserInfo> getMyInfo(@AuthenticationPrincipal Long userId) {
        AuthResponse.UserInfo response = userService.getMyInfo(userId);
        return CommonResponse.success(response);
    }

    @GetMapping("/search")
    public CommonResponse<java.util.List<AuthResponse.UserInfo>> searchUsers(@org.springframework.web.bind.annotation.RequestParam String keyword) {
        return CommonResponse.success(userService.searchUsers(keyword));
    }
}
