package com.syncbridge.domain.user.service;

import com.syncbridge.domain.user.dto.AuthResponse;
import com.syncbridge.domain.user.entity.User;
import com.syncbridge.domain.user.repository.UserRepository;
import com.syncbridge.global.exception.ErrorCode;
import com.syncbridge.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public AuthResponse.UserInfo getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));

        return AuthResponse.UserInfo.from(user);
    }

    public List<AuthResponse.UserInfo> searchUsers(String keyword) {
        return userRepository.findByNameContainingOrEmailContaining(keyword, keyword).stream()
                .map(AuthResponse.UserInfo::from)
                .collect(Collectors.toList());
    }
}
