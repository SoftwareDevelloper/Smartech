package org.example.backendpfe.Controlleur;

import org.example.backendpfe.ServiceImpl.ImageUploadService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;


@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("api/v1/file")
public class ImageUploadController {
    private final ImageUploadService imageUploadService;

    public ImageUploadController(ImageUploadService imageUploadService) {
        this.imageUploadService = imageUploadService;
    }

    @PostMapping("/images")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String filePath = imageUploadService.uploadImage(file);
            return ResponseEntity.ok("Image uploaded successfully: " + filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        }
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Resource resource = imageUploadService.loadImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }





}
