package org.example.backendpfe.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Internote
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String fullname; // apprenant , admin , enseignant
    @NotEmpty
    @NotBlank
    private String password;// apprenant , admin , enseignant
    @NotEmpty(message = "email is required")
    @Email(message = "Veuillez entrez un @ mail valide")
    @Column(unique = true)
    private String email;// apprenant , admin , enseignant
    private String phone;
    @Lob
    @Column(length = 10000)
    private String about;
    private String niveau; // juste pour l'apprenant
    private String image;
    private Number cle;//admin
    private String proficiencyLevel; // for learner : beginner , intermediate , advanced
    private double rating;
    private boolean active=false;
    private boolean status=false;
    private String note;
    @Enumerated(EnumType.STRING)
    private  Specialite specialitee;
    public enum Specialite{
        Mathématiques,
        Sciences,
        Languages,
        Informatiques,
        Programming,
        Histoire,
        Geographie,
    }

    private String Posts;
    private Number Folowers;
    @Enumerated(EnumType.STRING)
    private Role role;
    public  enum Role{
        ADMIN,
        APPRENANT,
        ENSEIGNMENT,
    }
    @JsonIgnore
    @JsonBackReference
    @ManyToMany
    @JoinTable(
            name = "enseignant_apprenant",
            joinColumns = @JoinColumn(name = "apprenant_id"),
            inverseJoinColumns = @JoinColumn(name = "enseignant_id")
    )
    private Set<Internote> enseignants = new HashSet<>();
    @ManyToMany(mappedBy = "enseignants")
    private Set<Internote> apprenants = new HashSet<>();
    @JsonBackReference
    @ManyToMany
    @JoinTable(
            name = "enseignant_formations",
            joinColumns = @JoinColumn(name = "enseignant_id"),
            inverseJoinColumns = @JoinColumn(name = "formation_id")
    )
    private Set<Formations> formationsEnseignees = new HashSet<>();
    @ManyToMany
    @JoinTable(
            name = "inscriptions",
            joinColumns = @JoinColumn(name = "apprenant_id"),
            inverseJoinColumns = @JoinColumn(name = "formation_id")
    )
    private Set<Formations> formationsSuivies = new HashSet<>();
    // One-to-Many Relationship: One Internote (student) can have many Commentaires
    @JsonIgnore
    @JsonBackReference
    @OneToMany(mappedBy = "internote", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Commentaires> commentaires = new ArrayList<>();




    @JsonIgnore
    @OneToMany(mappedBy = "internote")
    private List<Reel> reels;

    @JsonIgnore
    @OneToMany(mappedBy = "internote")
    private List<Post> posts;




    public Internote() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
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



    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public Number getCle() {
        return cle;
    }

    public void setCle(Number cle) {
        this.cle = cle;
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

    public Set<Formations> getFormationsEnseignees() {
        return formationsEnseignees;
    }

    public void setFormationsEnseignees(Set<Formations> formationsEnseignees) {
        this.formationsEnseignees = formationsEnseignees;
    }

    public Set<Formations> getFormationsSuivies() {
        return formationsSuivies;
    }

    public void setFormationsSuivies(Set<Formations> formationsSuivies) {
        this.formationsSuivies = formationsSuivies;
    }

    public String getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(String proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public List<Commentaires> getCommentaires() {
        return commentaires;
    }

    public void setCommentaires(List<Commentaires> commentaires) {
        this.commentaires = commentaires;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
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

    public Number getFolowers() {
        return Folowers;
    }

    public void setFolowers(Number folowers) {
        Folowers = folowers;
    }

    public String getPosts() {
        return Posts;
    }

    public void setPosts(String posts) {
        Posts = posts;
    }

    public Specialite getSpecialitee() {
        return specialitee;
    }

    public void setSpecialitee(Specialite specialitee) {
        this.specialitee = specialitee;
    }



    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public List<Reel> getReels() {
        return reels;
    }

    public void setReels(List<Reel> reels) {
        this.reels = reels;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }
}
