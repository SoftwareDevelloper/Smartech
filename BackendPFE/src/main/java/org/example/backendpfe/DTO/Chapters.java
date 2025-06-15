package org.example.backendpfe.DTO;

public class Chapters {
    private String titleEn;
    private String titleFr;
    private String titleAr;

    private String descriptionEn;
    private String descriptionFr;
    private String descriptionAr;

    private double price;
    private String videoUrl;
    private String pdfCours;
    private  String pdfTD;
    private Long formation_id;

    public Chapters() {
    }

    public Chapters(String titleEn, String titleFr, String titleAr, String descriptionEn, String descriptionFr, String descriptionAr, double price, String videoUrl, String pdfCours, String pdfTD, Long formation_id) {
        this.titleEn = titleEn;
        this.titleFr = titleFr;
        this.titleAr = titleAr;
        this.descriptionEn = descriptionEn;
        this.descriptionFr = descriptionFr;
        this.descriptionAr = descriptionAr;
        this.price = price;
        this.videoUrl = videoUrl;
        this.pdfCours = pdfCours;
        this.pdfTD = pdfTD;
        this.formation_id = formation_id;
    }

    public String getTitleEn() {
        return titleEn;
    }

    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }

    public String getTitleFr() {
        return titleFr;
    }

    public void setTitleFr(String titleFr) {
        this.titleFr = titleFr;
    }

    public String getTitleAr() {
        return titleAr;
    }

    public void setTitleAr(String titleAr) {
        this.titleAr = titleAr;
    }

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }

    public String getDescriptionFr() {
        return descriptionFr;
    }

    public void setDescriptionFr(String descriptionFr) {
        this.descriptionFr = descriptionFr;
    }

    public String getDescriptionAr() {
        return descriptionAr;
    }

    public void setDescriptionAr(String descriptionAr) {
        this.descriptionAr = descriptionAr;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getPdfCours() {
        return pdfCours;
    }

    public void setPdfCours(String pdfCours) {
        this.pdfCours = pdfCours;
    }

    public String getPdfTD() {
        return pdfTD;
    }

    public void setPdfTD(String pdfTD) {
        this.pdfTD = pdfTD;
    }

    public Long getFormation_id() {
        return formation_id;
    }

    public void setFormation_id(Long formation_id) {
        this.formation_id = formation_id;
    }
}
