package com.syncbridge.domain.project.repository;

import com.syncbridge.domain.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByIsDeletedFalse();
}
