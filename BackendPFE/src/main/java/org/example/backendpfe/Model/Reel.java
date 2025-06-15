package org.example.backendpfe.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Reel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String url;
    @Lob
    @Column(length = 10000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "internote_id")
    private Internote internote;

    public Reel() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public Internote getInternote() {
        return internote;
    }

    public void setInternote(Internote internote) {
        this.internote = internote;
    }
}
