package com.syncbridge.domain.config.repository;

import com.syncbridge.domain.config.entity.RoleConfig;
import com.syncbridge.domain.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleConfigRepository extends JpaRepository<RoleConfig, Long> {
    Optional<RoleConfig> findByRoleAndIsDeletedFalse(Role role);
}
