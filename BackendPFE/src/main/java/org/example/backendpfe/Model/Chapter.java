package org.example.backendpfe.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Chapter {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String titleEn;
    private String titleFr;
    private String titleAr;

    @Lob
    @Column(length = 10000)// You can adjust the length as needed
    private String descriptionEn;
    @Lob
    @Column(length = 10000)// You can adjust the length as needed
    private String descriptionFr;
    @Lob
    @Column(length = 10000)// You can adjust the length as needed
    private String descriptionAr;

    private double price;
    private String videoUrl;
    private String pdfCours;
    private  String pdfTD;
    private int chapterOrder;
    private boolean locked = true;
    private boolean status=false;

    @ManyToOne
    @JoinColumn(name = "formation_id")
    @JsonIgnore
    private Formations formation;



    public Chapter() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getVideoUrl() {
        return videoUrl;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }


    public int getChapterOrder() {
        return chapterOrder;
    }

    public void setChapterOrder(int chapterOrder) {
        this.chapterOrder = chapterOrder;
    }

    public boolean isLocked() {
        return locked;
    }

    public void setLocked(boolean locked) {
        this.locked = locked;
    }

    public Formations getFormation() {
        return formation;
    }

    public void setFormation(Formations formation) {
        this.formation = formation;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }


}
