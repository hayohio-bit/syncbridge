package com.syncbridge.domain.user.controller;

import com.syncbridge.domain.user.dto.AuthRequest;
import com.syncbridge.domain.user.dto.AuthResponse;
import com.syncbridge.domain.user.service.AuthService;
import com.syncbridge.global.common.CommonResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth", description = "인증 관련 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<AuthResponse.UserInfo> signup(@Valid @RequestBody AuthRequest.Signup request) {
        AuthResponse.UserInfo response = authService.signup(request);
        return CommonResponse.success(response);
    }

    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인하여 토큰을 발급받습니다.")
    @PostMapping("/login")
    public CommonResponse<AuthResponse.TokenInfo> login(@Valid @RequestBody AuthRequest.Login request) {
        AuthResponse.TokenInfo response = authService.login(request);
        return CommonResponse.success(response);
    }

    @Operation(summary = "토큰 재발급", description = "리프레시 토큰을 사용하여 액세스 토큰을 재발급받습니다.")
    @PostMapping("/refresh")
    public CommonResponse<AuthResponse.RefreshTokenInfo> refresh(@Valid @RequestBody AuthRequest.Refresh request) {
        AuthResponse.RefreshTokenInfo response = authService.refresh(request);
        return CommonResponse.success(response);
    }

    @Operation(summary = "로그아웃", description = "사용자의 리프레시 토큰을 무효화합니다.")
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody AuthRequest.Logout request) {
        authService.logout(request);
    }
}
