package org.example.backendpfe.ServiceImpl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class VideoUploadService
{
    private final Path fileStorageLocation;

    public String generateCaptions(String videoPath, String outputDir) {
        try {
            // Corrected path to the Python script
            ProcessBuilder pb = new ProcessBuilder("python", "whisper-caller.py", videoPath, outputDir);

            // Specify the directory where the Python script is located
            pb.directory(new File("C:\\Users\\Lenovo\\Desktop\\Projet de fin d'etude(PFE)\\backend\\BackendPFE\\"));
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // Wait for the script to finish and get the result
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return "Captions generated successfully!";
            } else {
                return "Error generating captions.";
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return "Error executing Python script.";
        }
    }

    public VideoUploadService(@Value("${video.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory for video uploads.", ex);
        }
    }

    public String uploadVideo(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file.");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.contains("..")) {
            throw new IOException("Invalid file name: " + fileName);
        }
        String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString()).replace("+", "%20");

        Path targetLocation = fileStorageLocation.resolve(encodedFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        return "/api/video/file/videos/" + encodedFileName;
    }
    public Resource loadVideo(String filename) throws MalformedURLException {
        Path filePath = fileStorageLocation.resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new MalformedURLException("Could not read file: " + filename);
        }
    }
}
