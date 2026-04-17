package com.syncbridge.domain.attachment.controller;

import com.syncbridge.domain.attachment.dto.AttachmentResponse;
import com.syncbridge.domain.attachment.entity.Attachment;
import com.syncbridge.domain.attachment.repository.AttachmentRepository;
import com.syncbridge.domain.attachment.service.AttachmentService;
import com.syncbridge.domain.user.entity.User;
import com.syncbridge.domain.user.repository.UserRepository;
import com.syncbridge.global.common.CommonResponse;
import com.syncbridge.global.util.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final FileService fileService;
    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final AttachmentService attachmentService;

    @PostMapping("/upload")
    public ResponseEntity<CommonResponse<AttachmentResponse>> uploadFile(
            @AuthenticationPrincipal Long userId,
            @RequestParam("file") MultipartFile file) {
            
        User uploader = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FileService.StoredFile storedFile = fileService.storeFile(file);

        Attachment attachment = Attachment.builder()
                .originalFileName(storedFile.originalFileName())
                .storedFileName(storedFile.storedFileName())
                .fileUrl(storedFile.fileUrl())
                .fileSize(storedFile.fileSize())
                .contentType(storedFile.contentType())
                .uploader(uploader)
                .build();

        Attachment savedAttachment = attachmentRepository.save(attachment);

        return ResponseEntity.ok(CommonResponse.success(AttachmentResponse.from(savedAttachment)));
    }

    @GetMapping("/{attachmentId}/download")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Long attachmentId,
            @AuthenticationPrincipal Long userId) {

        Attachment attachment = attachmentService.getAttachment(attachmentId);
        Resource resource = attachmentService.loadFileAsResource(attachmentId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getOriginalFileName() + "\"")
                .body(resource);
    }
}
