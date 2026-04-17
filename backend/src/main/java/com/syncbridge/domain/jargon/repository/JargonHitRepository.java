package com.syncbridge.domain.jargon.repository;

import com.syncbridge.domain.jargon.entity.JargonHit;
import com.syncbridge.domain.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JargonHitRepository extends JpaRepository<JargonHit, Long> {

    @Query("SELECT j.keyword, COUNT(h) as hitCount " +
           "FROM JargonHit h " +
           "JOIN h.jargonTerm j " +
           "GROUP BY j.keyword " +
           "ORDER BY hitCount DESC")
    List<Object[]> findTopHits();

    @Query("SELECT h.userRole, COUNT(h) as hitCount " +
           "FROM JargonHit h " +
           "GROUP BY h.userRole")
    List<Object[]> findHitRatioByRole();

    @Query("SELECT j.keyword, h.userRole, COUNT(h) as hitCount " +
           "FROM JargonHit h " +
           "JOIN h.jargonTerm j " +
           "GROUP BY j.keyword, h.userRole")
    List<Object[]> findHitsByTermAndRole();
}
