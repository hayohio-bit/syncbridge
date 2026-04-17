package com.syncbridge.domain.jargon.repository;

import com.syncbridge.domain.jargon.entity.JargonTranslation;
import com.syncbridge.domain.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JargonTranslationRepository extends JpaRepository<JargonTranslation, Long> {
    Optional<JargonTranslation> findByJargonTermIdAndTargetRoleAndIsDeletedFalse(Long jargonId, Role role);
}
