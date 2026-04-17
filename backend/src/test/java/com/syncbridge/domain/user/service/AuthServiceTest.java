package com.syncbridge.domain.user.service;

import com.syncbridge.domain.user.dto.AuthRequest;
import com.syncbridge.domain.user.dto.AuthResponse;
import com.syncbridge.domain.user.entity.RefreshToken;
import com.syncbridge.domain.user.entity.Role;
import com.syncbridge.domain.user.entity.User;
import com.syncbridge.domain.user.repository.RefreshTokenRepository;
import com.syncbridge.domain.user.repository.UserRepository;
import com.syncbridge.global.exception.DuplicateException;
import com.syncbridge.global.exception.UnauthorizedException;
import com.syncbridge.global.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshExpirationDays", 7);
        user = User.builder()
                .email("test@example.com")
                .password("encodedPassword")
                .name("Tester")
                .role(Role.GENERAL)
                .build();
        ReflectionTestUtils.setField(user, "id", 1L);
    }

    @Test
    @DisplayName("회원가입 성공")
    void signup_success() {
        AuthRequest.Signup request = new AuthRequest.Signup("new@example.com", "pass1234", "홍길동", Role.GENERAL);
        given(userRepository.existsByEmail("new@example.com")).willReturn(false);
        given(passwordEncoder.encode("pass1234")).willReturn("encodedPassword");
        given(userRepository.save(any(User.class))).willReturn(user);

        AuthResponse.UserInfo result = authService.signup(request);

        assertThat(result).isNotNull();
        then(userRepository).should().save(any(User.class));
    }

    @Test
    @DisplayName("회원가입 - 중복 이메일 예외")
    void signup_duplicateEmail_throwsDuplicateException() {
        AuthRequest.Signup request = new AuthRequest.Signup("test@example.com", "pass1234", "홍길동", Role.GENERAL);
        given(userRepository.existsByEmail("test@example.com")).willReturn(true);

        assertThatThrownBy(() -> authService.signup(request))
                .isInstanceOf(DuplicateException.class);
    }

    @Test
    @DisplayName("로그인 성공 - accessToken과 refreshToken 모두 반환")
    void login_success_returnsBothTokens() {
        AuthRequest.Login request = new AuthRequest.Login("test@example.com", "password123");
        given(userRepository.findByEmail("test@example.com")).willReturn(Optional.of(user));
        given(passwordEncoder.matches("password123", "encodedPassword")).willReturn(true);
        given(jwtTokenProvider.createToken(1L, "GENERAL")).willReturn("access-token-value");
        given(refreshTokenRepository.save(any(RefreshToken.class))).willAnswer(inv -> inv.getArgument(0));

        AuthResponse.TokenInfo result = authService.login(request);

        assertThat(result.accessToken()).isEqualTo("access-token-value");
        assertThat(result.refreshToken()).isNotBlank();
        assertThat(result.userId()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("Tester");
    }

    @Test
    @DisplayName("로그인 실패 - 비밀번호 불일치")
    void login_wrongPassword_throwsUnauthorizedException() {
        AuthRequest.Login request = new AuthRequest.Login("test@example.com", "wrongPassword");
        given(userRepository.findByEmail("test@example.com")).willReturn(Optional.of(user));
        given(passwordEncoder.matches("wrongPassword", "encodedPassword")).willReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    @DisplayName("토큰 갱신 - 새 accessToken과 새 refreshToken 모두 반환")
    void refresh_returnsNewAccessTokenAndNewRefreshToken() {
        RefreshToken storedToken = RefreshToken.builder()
                .userId(1L)
                .token("old-refresh-token")
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        AuthRequest.Refresh request = new AuthRequest.Refresh("old-refresh-token");
        given(refreshTokenRepository.findByToken("old-refresh-token")).willReturn(Optional.of(storedToken));
        given(userRepository.findById(1L)).willReturn(Optional.of(user));
        given(jwtTokenProvider.createToken(1L, "GENERAL")).willReturn("new-access-token");
        given(refreshTokenRepository.save(any(RefreshToken.class))).willAnswer(inv -> inv.getArgument(0));

        AuthResponse.RefreshTokenInfo result = authService.refresh(request);

        assertThat(result.accessToken()).isEqualTo("new-access-token");
        assertThat(result.refreshToken()).isNotBlank();
        assertThat(result.refreshToken()).isNotEqualTo("old-refresh-token");
        then(refreshTokenRepository).should().delete(storedToken);
    }

    @Test
    @DisplayName("토큰 갱신 - 만료된 리프레시 토큰 예외")
    void refresh_expiredToken_throwsUnauthorizedException() {
        RefreshToken expiredToken = RefreshToken.builder()
                .userId(1L)
                .token("expired-token")
                .expiresAt(LocalDateTime.now().minusSeconds(1))
                .build();

        AuthRequest.Refresh request = new AuthRequest.Refresh("expired-token");
        given(refreshTokenRepository.findByToken("expired-token")).willReturn(Optional.of(expiredToken));

        assertThatThrownBy(() -> authService.refresh(request))
                .isInstanceOf(UnauthorizedException.class);
        then(refreshTokenRepository).should().delete(expiredToken);
    }
}
