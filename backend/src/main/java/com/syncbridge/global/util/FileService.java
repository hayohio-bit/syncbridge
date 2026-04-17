package com.syncbridge.global.util;

import com.syncbridge.global.exception.CustomException;
import com.syncbridge.global.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class FileService {

    @Value("${file.upload-dir:C:/syncbridge-uploads/}")
    private String uploadDir;

    private static final Set<String> ALLOWED_EXTENSIONS = 
            Set.of("jpg", "jpeg", "png", "gif", "pdf", "docx", "xlsx", "pptx", "zip", "txt");

    private static final Set<String> ALLOWED_MIME_TYPES = 
            Set.of("image/jpeg", "image/png", "image/gif", 
                   "application/pdf", 
                   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                   "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                   "application/zip",
                   "text/plain");

    public StoredFile storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file.");
        }

        String originalFileName = file.getOriginalFilename();
        String extension = getExtension(originalFileName).toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new CustomException(ErrorCode.INVALID_FILE_TYPE);
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new CustomException(ErrorCode.INVALID_FILE_TYPE);
        }

        try {
            // 디렉토리 생성
            Path root = Paths.get(uploadDir);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            String storedFileName = UUID.randomUUID().toString() + "." + extension;

            Path targetPath = root.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetPath);

            log.info("File stored: {} -> {}", originalFileName, targetPath);

            // URL 생성 (WebConfig 정적 매핑 제거 및 전용 다운로드 컨트롤러 사용)
            String fileUrl = "/api/attachments/" + storedFileName;

            return new StoredFile(originalFileName, storedFileName, fileUrl, file.getSize(), file.getContentType());

        } catch (IOException e) {
            log.error("Failed to store file", e);
            throw new RuntimeException("Could not store file", e);
        }
    }

    private String getExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    public void deleteFile(String storedFileName) {
        try {
            Path path = Paths.get(uploadDir).resolve(storedFileName);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.error("Failed to delete file: {}", storedFileName, e);
        }
    }

    public record StoredFile(
            String originalFileName,
            String storedFileName,
            String fileUrl,
            long fileSize,
            String contentType
    ) {}
}
