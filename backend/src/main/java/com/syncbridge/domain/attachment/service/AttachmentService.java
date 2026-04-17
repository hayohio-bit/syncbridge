package com.syncbridge.domain.attachment.service;

import com.syncbridge.domain.attachment.entity.Attachment;
import com.syncbridge.domain.attachment.repository.AttachmentRepository;
import com.syncbridge.domain.task.entity.Task;
import com.syncbridge.domain.user.entity.User;
import com.syncbridge.global.exception.ErrorCode;
import com.syncbridge.global.exception.NotFoundException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @Transactional
    public Attachment uploadFile(MultipartFile file, User uploader, Task task) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String extension = getExtension(originalFileName);
        String storedFileName = UUID.randomUUID().toString() + extension;
        Path targetPath = Paths.get(uploadDir).resolve(storedFileName);

        Files.copy(file.getInputStream(), targetPath);

        Attachment attachment = Attachment.builder()
                .originalFileName(originalFileName)
                .storedFileName(storedFileName)
                .fileUrl("/api/attachments/" + storedFileName)
                .fileSize(file.getSize())
                .contentType(file.getContentType())
                .uploader(uploader)
                .task(task)
                .build();

        return attachmentRepository.save(attachment);
    }

    public Resource loadFileAsResource(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .filter(a -> !a.isDeleted())
                .orElseThrow(() -> new NotFoundException(ErrorCode.FILE_NOT_FOUND));

        try {
            Path filePath = Paths.get(uploadDir).resolve(attachment.getStoredFileName());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new NotFoundException(ErrorCode.FILE_NOT_FOUND);
            }
        } catch (Exception e) {
            throw new NotFoundException(ErrorCode.FILE_NOT_FOUND);
        }
    }

    public Attachment getAttachment(Long id) {
        return attachmentRepository.findById(id)
                .filter(a -> !a.isDeleted())
                .orElseThrow(() -> new NotFoundException(ErrorCode.FILE_NOT_FOUND));
    }

    private String getExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
}
