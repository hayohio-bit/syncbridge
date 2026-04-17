package com.syncbridge.domain.attachment.dto;

import com.syncbridge.domain.attachment.entity.Attachment;
import lombok.Builder;
import lombok.Getter;

@Getter
public class AttachmentResponse {
    private final Long id;
    private final String originalFileName;
    private final String fileUrl;
    private final long fileSize;
    private final String contentType;

    @Builder
    public AttachmentResponse(Long id, String originalFileName, String fileUrl, long fileSize, String contentType) {
        this.id = id;
        this.originalFileName = originalFileName;
        this.fileUrl = fileUrl;
        this.fileSize = fileSize;
        this.contentType = contentType;
    }

    public static AttachmentResponse from(Attachment attachment) {
        return AttachmentResponse.builder()
                .id(attachment.getId())
                .originalFileName(attachment.getOriginalFileName())
                .fileUrl(attachment.getFileUrl())
                .fileSize(attachment.getFileSize())
                .contentType(attachment.getContentType())
                .build();
    }
}
