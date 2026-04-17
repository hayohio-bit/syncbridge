package com.syncbridge.domain.user.service;

import com.syncbridge.domain.user.dto.AuthRequest;
import com.syncbridge.domain.user.dto.AuthResponse;
import com.syncbridge.domain.user.entity.RefreshToken;
import com.syncbridge.domain.user.entity.User;
import com.syncbridge.domain.user.repository.RefreshTokenRepository;
import com.syncbridge.domain.user.repository.UserRepository;
import com.syncbridge.global.exception.DuplicateException;
import com.syncbridge.global.exception.ErrorCode;
import com.syncbridge.global.exception.NotFoundException;
import com.syncbridge.global.exception.UnauthorizedException;
import com.syncbridge.global.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration-days:7}")
    private int refreshExpirationDays;

    @Transactional
    public AuthResponse.UserInfo signup(AuthRequest.Signup request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateException(ErrorCode.DUPLICATE_EMAIL);
        }

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .name(request.name())
                .role(request.role())
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.UserInfo.from(savedUser);
    }

    @Transactional
    public AuthResponse.TokenInfo login(AuthRequest.Login request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException(ErrorCode.UNAUTHORIZED);
        }

        String accessToken = jwtTokenProvider.createToken(user.getId(), user.getRole().name());
        String refreshTokenValue = generateAndSaveRefreshToken(user.getId());

        return new AuthResponse.TokenInfo(
                accessToken,
                refreshTokenValue,
                user.getId(),
                user.getName(),
                user.getRole()
        );
    }

    @Transactional
    public AuthResponse.RefreshTokenInfo refresh(AuthRequest.Refresh request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new UnauthorizedException(ErrorCode.UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다."));

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException(ErrorCode.UNAUTHORIZED, "만료된 리프레시 토큰입니다. 다시 로그인해주세요.");
        }

        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        // 토큰 로테이션: 기존 토큰 삭제 후 새 토큰 발급
        refreshTokenRepository.delete(refreshToken);
        String newRefreshToken = generateAndSaveRefreshToken(user.getId());

        String newAccessToken = jwtTokenProvider.createToken(user.getId(), user.getRole().name());

        return new AuthResponse.RefreshTokenInfo(newAccessToken, newRefreshToken);
    }

    @Transactional
    public void logout(AuthRequest.Logout request) {
        refreshTokenRepository.deleteByToken(request.refreshToken());
    }

    private String generateAndSaveRefreshToken(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
        String tokenValue = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .userId(userId)
                .token(tokenValue)
                .expiresAt(LocalDateTime.now().plusDays(refreshExpirationDays))
                .build();
        refreshTokenRepository.save(refreshToken);
        return tokenValue;
    }
}
