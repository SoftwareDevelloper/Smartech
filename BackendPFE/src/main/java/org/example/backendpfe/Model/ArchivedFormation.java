package org.example.backendpfe.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
public class ArchivedFormation {
    @Id
    private Long id;
    private String titleEn;
    private String descriptionEn;
    private String titleFr;
    private String descriptionFr;
    private String titleAr;
    private String descriptionAr;
    private String image;
    private Double price;
    private String category;
    private String categoryFr;
    private String categoryAr;
    private Date publisheddate;
    private String level;
    private String classe;
    private boolean status;
    private boolean iscompleted;
    private LocalDateTime deletedAt;

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

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }

    public String getTitleFr() {
        return titleFr;
    }

    public void setTitleFr(String titleFr) {
        this.titleFr = titleFr;
    }

    public String getDescriptionFr() {
        return descriptionFr;
    }

    public void setDescriptionFr(String descriptionFr) {
        this.descriptionFr = descriptionFr;
    }

    public String getTitleAr() {
        return titleAr;
    }

    public void setTitleAr(String titleAr) {
        this.titleAr = titleAr;
    }

    public String getDescriptionAr() {
        return descriptionAr;
    }

    public void setDescriptionAr(String descriptionAr) {
        this.descriptionAr = descriptionAr;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryFr() {
        return categoryFr;
    }

    public void setCategoryFr(String categoryFr) {
        this.categoryFr = categoryFr;
    }

    public String getCategoryAr() {
        return categoryAr;
    }

    public void setCategoryAr(String categoryAr) {
        this.categoryAr = categoryAr;
    }

    public Date getPublisheddate() {
        return publisheddate;
    }

    public void setPublisheddate(Date publisheddate) {
        this.publisheddate = publisheddate;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getClasse() {
        return classe;
    }

    public void setClasse(String classe) {
        this.classe = classe;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public boolean isIscompleted() {
        return iscompleted;
    }

    public void setIscompleted(boolean iscompleted) {
        this.iscompleted = iscompleted;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
}
