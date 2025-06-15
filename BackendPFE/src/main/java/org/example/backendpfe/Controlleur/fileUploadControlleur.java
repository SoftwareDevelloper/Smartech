package org.example.backendpfe.Controlleur;
import org.example.backendpfe.ServiceImpl.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.example.backendpfe.ServiceImpl.filesUploadService;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/api/files/file")
public class fileUploadControlleur
{
    private final filesUploadService filesUploadService;

    public fileUploadControlleur(org.example.backendpfe.ServiceImpl.filesUploadService filesUploadService) {
        this.filesUploadService = filesUploadService;
    }
    @PostMapping("/pdf")
    public ResponseEntity<String> uploadImage(@RequestParam("pdf") MultipartFile file) {
        try {
            Map<String, String> filePath = filesUploadService.uploadfiles(file);
            return ResponseEntity.ok("files uploaded successfully: " + filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading files");
        }
    }

    @GetMapping("/pdf/{filename:.+}")
    public ResponseEntity<Resource> getpdf(@PathVariable String filename) {
        try {
            // Load the file using the saved UUID filename
            Resource resource = filesUploadService.loadfiles(filename);

            // Return the PDF file in the response
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
