package com.syncbridge.domain.analytics.repository;

import com.syncbridge.domain.analytics.entity.UIEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UIEventRepository extends JpaRepository<UIEvent, Long> {
    
    @Query("SELECT e.eventType, COUNT(e) FROM UIEvent e GROUP BY e.eventType")
    List<Object[]> findEventCountsByType();
}
