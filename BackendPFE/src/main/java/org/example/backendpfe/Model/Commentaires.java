package org.example.backendpfe.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.FetchMode;
import org.hibernate.annotations.Fetch;

import java.util.Date;
import java.util.List;

@Entity
public class Commentaires
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String message;
    private Date date;
    private Double rating;
    @Enumerated(EnumType.STRING)
    private ValidationStatus status = ValidationStatus.PENDING;


    public enum ValidationStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
    private boolean liked=false;

    public Commentaires() {}

    public Commentaires(Long id, String message) {
        this.id = id;
        this.message = message;
    }
    // Many-to-One Relationship: Many Commentaires can belong to one Internote (student)
    @JsonIgnore
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "internote_id")
    private Internote internote;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "formation_id")
    private Formations formation;

    // one-to-many Relationship: a Commentaire can have many replies
    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Reply> replies;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Internote getInternote() {
        return internote;
    }

    public void setInternote(Internote internote) {
        this.internote = internote;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
    public Formations getFormation() {
        return formation;
    }
    public void setFormation(Formations formation) {
        this.formation = formation;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public List<Reply> getReplies() {
        return replies;
    }

    public void setReplies(List<Reply> replies) {
        this.replies = replies;
    }

    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }

    public ValidationStatus getStatus() {
        return status;
    }

    public void setStatus(ValidationStatus status) {
        this.status = status;
    }
}
