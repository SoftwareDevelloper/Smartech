package org.example.backendpfe.DTO;

public class CartItemDTO {
    private Long id;
    private Long formationId; // add this
    private String titleEn;
    private String titleAr;
    private String titleFr;
    private Double price;
    private String image;

    public CartItemDTO(Long id, Long formationId, String titleEn, String titleAr, String titleFr, Double price, String image) {
        this.id = id;
        this.formationId = formationId;
        this.titleEn = titleEn;
        this.titleAr = titleAr;
        this.titleFr = titleFr;
        this.price = price;
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFormationId() {
        return formationId;
    }

    public void setFormationId(Long formationId) {
        this.formationId = formationId;
    }

    public String getTitleEn() {
        return titleEn;
    }

    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }

    public String getTitleAr() {
        return titleAr;
    }

    public void setTitleAr(String titleAr) {
        this.titleAr = titleAr;
    }

    public String getTitleFr() {
        return titleFr;
    }

    public void setTitleFr(String titleFr) {
        this.titleFr = titleFr;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
