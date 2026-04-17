package com.syncbridge.domain.jargon.repository;

import com.syncbridge.domain.jargon.entity.JargonTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface JargonTermRepository extends JpaRepository<JargonTerm, Long> {
    Optional<JargonTerm> findByKeywordAndIsDeletedFalse(String keyword);

    @Query("SELECT j.keyword FROM JargonTerm j WHERE j.isDeleted = false")
    List<String> findAllKeywords();
}
