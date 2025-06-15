package org.example.backendpfe.ServiceImpl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
public class filesUploadService
{
    private final Path fileStorageLocation;

    public filesUploadService(@Value("${pdf.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory for files uploads.", ex);
        }
    }

    public Map<String, String> uploadfiles(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file");
        }

        if (!"application/pdf".equals(file.getContentType())) {
            throw new IOException("Only PDF files are allowed");
        }

        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        Path targetLocation = fileStorageLocation.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = "/api/files/file/pdf/" + uniqueFileName;

        return Map.of(
                "fileUrl", fileUrl,
                "savedFileName", uniqueFileName
        );
    }


    public Resource loadfiles(String filename) throws MalformedURLException {
        try {
            // Remove URL prefix if present
            String cleanFilename = filename.replace("/api/files/file/pdf/", "");

            Path filePath = fileStorageLocation.resolve(cleanFilename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or not readable: " + cleanFilename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error loading file: " + filename, e);
        }
    }
}