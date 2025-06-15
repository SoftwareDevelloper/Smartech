package org.example.backendpfe.Controlleur;

import org.example.backendpfe.ServiceImpl.VideoUploadService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("api/video/file")
public class VideoImagesControlleur
{

    private final VideoUploadService videoUploadService;

    public VideoImagesControlleur( VideoUploadService videoUploadService) {
        this.videoUploadService = videoUploadService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadVideo(@RequestParam("video") MultipartFile file) {
        try {
            String filePath = videoUploadService.uploadVideo(file);
            return ResponseEntity.ok("Video uploaded successfully: " + filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading video: " + e.getMessage());
        }
    }

    @GetMapping("/videos/{filename}")
    public ResponseEntity<Resource> getVideo(@PathVariable String filename) {
        try {
            Resource resource = videoUploadService.loadVideo(filename);
            String contentType = determineContentType(filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    private String determineContentType(String filename) {
        try {
            Path path = Paths.get(filename);
            return Files.probeContentType(path) != null ? Files.probeContentType(path) : "application/octet-stream";
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }
}