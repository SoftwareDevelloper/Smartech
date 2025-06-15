package org.example.backendpfe.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Lob
    @Column(length = 10000)
    private String content;
    private String image;

    @ManyToOne
    @JoinColumn(name = "internote_id")
    private Internote internote;

    public Post() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }



    public Internote getInternote() {
        return internote;
    }

    public void setInternote(Internote internote) {
        this.internote = internote;
    }
}
