package com.syncbridge.domain.attachment.repository;

import com.syncbridge.domain.attachment.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByTaskIdAndIsDeletedFalse(Long taskId);
}
