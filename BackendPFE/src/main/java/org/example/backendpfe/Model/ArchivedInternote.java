package org.example.backendpfe.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class ArchivedInternote {
    @Id
    private Long id;
    private String fullname;
    private String password;
    private String email;
    private String phone;
    private String about;
    private String niveau;
    private String image;
    private Number cle;
    private String proficiencyLevel;
    private double rating;
    private boolean active;
    private boolean status;
    private String note;
    @Enumerated(EnumType.STRING)
    private Internote.Specialite specialitée;
    private String posts;
    private Number folowers;
    @Enumerated(EnumType.STRING)
    private Internote.Role role;
    private LocalDateTime deletedAt;

    public ArchivedInternote() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Number getCle() {
        return cle;
    }

    public void setCle(Number cle) {
        this.cle = cle;
    }

    public String getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(String proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Internote.Specialite getSpecialitée() {
        return specialitée;
    }

    public void setSpecialitée(Internote.Specialite specialitée) {
        this.specialitée = specialitée;
    }

    public String getPosts() {
        return posts;
    }

    public void setPosts(String posts) {
        this.posts = posts;
    }

    public Number getFolowers() {
        return folowers;
    }

    public void setFolowers(Number folowers) {
        this.folowers = folowers;
    }

    public Internote.Role getRole() {
        return role;
    }

    public void setRole(Internote.Role role) {
        this.role = role;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
}
