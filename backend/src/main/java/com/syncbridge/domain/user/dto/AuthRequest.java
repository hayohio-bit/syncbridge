package com.syncbridge.domain.user.dto;

import com.syncbridge.domain.user.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthRequest {

    public record Signup(
            @NotBlank(message = "이메일은 필수 입력값입니다.")
            @Email(message = "올바른 이메일 형식이 아닙니다.")
            String email,

            @NotBlank(message = "비밀번호는 필수 입력값입니다.")
            String password,

            @NotBlank(message = "이름은 필수 입력값입니다.")
            String name,

            @NotNull(message = "직무 역할은 필수 입력값입니다.")
            Role role
    ) {}

    public record Login(
            @NotBlank(message = "이메일은 필수 입력값입니다.")
            @Email(message = "올바른 이메일 형식이 아닙니다.")
            String email,

            @NotBlank(message = "비밀번호는 필수 입력값입니다.")
            String password
    ) {}

    public record Refresh(
            @NotBlank(message = "리프레시 토큰은 필수입니다.")
            String refreshToken
    ) {}

    public record Logout(
            @NotBlank(message = "리프레시 토큰은 필수입니다.")
            String refreshToken
    ) {}
}
