package org.example.backendpfe.DTO;

import org.springframework.web.multipart.MultipartFile;

public class CaptionUploadDTO {
    private String language;
    private String label;
    private MultipartFile vttFile;

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public MultipartFile getVttFile() {
        return vttFile;
    }

    public void setVttFile(MultipartFile vttFile) {
        this.vttFile = vttFile;
    }
}
