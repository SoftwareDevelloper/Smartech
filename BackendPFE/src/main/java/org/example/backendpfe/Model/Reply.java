package org.example.backendpfe.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String message;
    private Date date;
    @Enumerated(EnumType.STRING)
    private ValidationStatus status = ValidationStatus.PENDING;

    public enum ValidationStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
    public Reply() {}

    public Reply(Long id, String message, Date date, Internote internote) {
        this.id = id;
        this.message = message;
        this.date = new Date();
        this.internote = internote;
    }
    @ManyToOne
    @JoinColumn(name = "comment_id")
    @JsonBackReference
    private Commentaires comment;
    // Many-to-One Relationship: Many Commentaires can belong to one Internote (student)
    @ManyToOne
    @JoinColumn(name = "internote_id")
    @JsonIgnoreProperties({"password", "email", "commentaires"})
    private Internote internote;



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

    public Commentaires getComment() {
        return comment;
    }

    public void setComment(Commentaires comment) {
        this.comment = comment;
    }

    public ValidationStatus getStatus() {
        return status;
    }

    public void setStatus(ValidationStatus status) {
        this.status = status;
    }
}
