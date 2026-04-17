package com.syncbridge.domain.task.repository;

import com.syncbridge.domain.task.entity.Task;
import com.syncbridge.domain.task.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project LEFT JOIN FETCH t.requester LEFT JOIN FETCH t.assignee WHERE t.isDeleted = false")
    List<Task> findAllActiveTasks();

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project LEFT JOIN FETCH t.requester LEFT JOIN FETCH t.assignee " +
           "WHERE t.requester.id = :requesterId AND t.isDeleted = false " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:projectId IS NULL OR t.project.id = :projectId) " +
           "AND (:keyword IS NULL OR t.title LIKE %:keyword% OR t.content LIKE %:keyword%)")
    List<Task> findByRequesterIdWithFilters(@Param("requesterId") Long requesterId, 
                                            @Param("status") TaskStatus status, 
                                            @Param("projectId") Long projectId,
                                            @Param("keyword") String keyword);

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project LEFT JOIN FETCH t.requester LEFT JOIN FETCH t.assignee " +
           "WHERE t.assignee.id = :assigneeId AND t.isDeleted = false " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:projectId IS NULL OR t.project.id = :projectId) " +
           "AND (:keyword IS NULL OR t.title LIKE %:keyword% OR t.content LIKE %:keyword%)")
    List<Task> findByAssigneeIdWithFilters(@Param("assigneeId") Long assigneeId, 
                                           @Param("status") TaskStatus status, 
                                           @Param("projectId") Long projectId,
                                           @Param("keyword") String keyword);
}
