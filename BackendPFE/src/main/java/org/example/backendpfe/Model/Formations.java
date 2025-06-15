package org.example.backendpfe.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Formations
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    // English translations
    private String titleEn;
    @Lob
    @Column(length = 10000)// You can adjust the length as needed
    private String descriptionEn;

    // French translations
    private String titleFr;
    @Lob
    @Column(length = 10000)// You can adjust the length as needed
    private String descriptionFr;

    // Arabic translations
    private String titleAr;
    @Lob
    @Column(length = 10000)// You can adjust the length as needed
    private String descriptionAr;

    private String image;
    private Double price;
    private String category;
    // French translations
    private String categoryFr ;
    // Arabic translations
    private String categoryAr;
    private Date publisheddate;
    private String level;
    private String classe;
    private boolean status=false;
    private boolean iscompleted=false;

    // Many-to-Many Relationship: Formations ↔ Enseignants
    @JsonIgnore
    @ManyToMany(mappedBy = "formationsEnseignees")
    private Set<Internote> enseignants = new HashSet<>();
    // Many-to-Many Relationship: Formations ↔ Apprenants
    @JsonIgnore
    @ManyToMany(mappedBy = "formationsSuivies")
    private Set<Internote> apprenants = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Commentaires> commentaires = new ArrayList<>();

    //one to many formation <=> question

    @JsonIgnore
    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Questions> Questions = new ArrayList<>();

    // Add chapters relationship
    @JsonIgnore
    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Chapter> chapters = new ArrayList<>();


    public Formations() {}
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getTitleEn() {
        return titleEn;
    }

    public List<Chapter> getChapters() {
        return chapters;
    }

    public void setChapters(List<Chapter> chapters) {
        this.chapters = chapters;
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

    public String getClasse() {
        return classe;
    }

    public void setClasse(String classe) {
        this.classe = classe;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Date getPublisheddate() {
        return publisheddate;
    }

    public void setPublisheddate(Date publisheddate) {
        this.publisheddate = publisheddate;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public Set<Internote> getEnseignants() {
        return enseignants;
    }

    public void setEnseignants(Set<Internote> enseignants) {
        this.enseignants = enseignants;
    }

    public Set<Internote> getApprenants() {
        return apprenants;
    }

    public void setApprenants(Set<Internote> apprenants) {
        this.apprenants = apprenants;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public boolean isIscompleted() {
        return iscompleted;
    }

    public void setIscompleted(boolean iscompleted) {
        this.iscompleted = iscompleted;
    }
    public List<Commentaires> getCommentaires() {
        return commentaires;
    }

    public void setCommentaires(List<Commentaires> commentaires) {
        this.commentaires = commentaires;
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

    public List<org.example.backendpfe.Model.Questions> getQuestions() {
        return Questions;
    }

    public void setQuestions(List<org.example.backendpfe.Model.Questions> questions) {
        Questions = questions;
    }

    public Double getAverageRating() {
        if (commentaires == null || commentaires.isEmpty()) {
            return 0.0;
        }
        return commentaires.stream()
                .filter(comment -> comment.getRating() != null)
                .mapToDouble(Commentaires::getRating)
                .average()
                .orElse(0.0);
    }

    // And add this method to help with level/class mapping
    public String getLevelGroup() {
        if (classe == null) return null;

        if (classe.matches("[1-6]Primary")) return "Primary";
        if (classe.matches("[7-9]HS")) return "HighSchool";
        if (classe.startsWith("2") || classe.startsWith("3") || classe.startsWith("B")) return "Secondary";

        return null;
    }


}
