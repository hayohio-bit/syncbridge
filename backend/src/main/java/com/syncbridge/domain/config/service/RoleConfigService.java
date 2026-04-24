package com.syncbridge.domain.config.service;

import com.syncbridge.domain.config.entity.RoleConfig;
import com.syncbridge.domain.config.repository.RoleConfigRepository;
import com.syncbridge.domain.user.entity.Role;
import com.syncbridge.global.exception.CustomException;
import com.syncbridge.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoleConfigService {

    private final RoleConfigRepository roleConfigRepository;

    public Map<String, Object> getConfigByRole(Role role) {
        return roleConfigRepository.findByRoleAndIsDeletedFalse(role)
                .map(RoleConfig::getUiConfig)
                .orElseThrow(() -> new CustomException(ErrorCode.CONFIG_NOT_FOUND));
    }

    @Transactional
    public void updateConfig(Role role, Map<String, Object> newConfig) {
        RoleConfig roleConfig = roleConfigRepository.findByRoleAndIsDeletedFalse(role)
                .orElseGet(() -> RoleConfig.builder()
                        .role(role)
                        .uiConfig(newConfig)
                        .build());
        
        if (roleConfig.getId() != null) {
            roleConfig.updateConfig(newConfig);
        } else {
            roleConfigRepository.save(roleConfig);
        }
    }
}
