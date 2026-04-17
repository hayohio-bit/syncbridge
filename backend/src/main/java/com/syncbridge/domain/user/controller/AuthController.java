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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<AuthResponse.UserInfo> signup(@Valid @RequestBody AuthRequest.Signup request) {
        AuthResponse.UserInfo response = authService.signup(request);
        return CommonResponse.success(response);
    }

    @PostMapping("/login")
    public CommonResponse<AuthResponse.TokenInfo> login(@Valid @RequestBody AuthRequest.Login request) {
        AuthResponse.TokenInfo response = authService.login(request);
        return CommonResponse.success(response);
    }

    @PostMapping("/refresh")
    public CommonResponse<AuthResponse.RefreshTokenInfo> refresh(@Valid @RequestBody AuthRequest.Refresh request) {
        AuthResponse.RefreshTokenInfo response = authService.refresh(request);
        return CommonResponse.success(response);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody AuthRequest.Logout request) {
        authService.logout(request);
    }
}
