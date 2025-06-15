package org.example.backendpfe.ServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class ImageUploadService
{
    private final Path fileStorageLocation;

    // Constructor to initialize file storage location
    public ImageUploadService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file.");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.contains("..")) {
            throw new IOException("Invalid file name: " + fileName);
        }
        String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString()).replace("+", "%20");
        Path targetLocation = fileStorageLocation.resolve(encodedFileName);
        Files.createDirectories(targetLocation.getParent());
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return "/api/v1/file/images/" + encodedFileName;
    }

    // Load image from the file system
    public Resource loadImage(String filename) throws MalformedURLException {
        Path filePath = fileStorageLocation.resolve(filename).normalize();
        return new UrlResource(filePath.toUri());
    }
}
