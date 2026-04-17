package com.syncbridge.domain.user.dto;

import com.syncbridge.domain.user.entity.Role;
import com.syncbridge.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthResponse {

    public record UserInfo(
            Long userId,
            String email,
            String name,
            Role role
    ) {
        public static UserInfo from(User user) {
            return new UserInfo(
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole()
            );
        }
    }

    public record TokenInfo(
            String accessToken,
            String refreshToken,
            Long userId,
            String name,
            Role role
    ) {}

    public record AccessTokenInfo(
            String accessToken
    ) {}

    public record RefreshTokenInfo(
            String accessToken,
            String refreshToken
    ) {}
}
