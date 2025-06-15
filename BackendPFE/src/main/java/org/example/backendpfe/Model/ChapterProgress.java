package org.example.backendpfe.Model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class ChapterProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @ManyToOne
    @JoinColumn(name = "user_id") // This maps to the Internote table
    private Internote internote;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;

    private boolean completed = false;
    // New fields for unlocking
    private boolean unlocked = false;
    private Date unlockDate;
    public ChapterProgress() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Internote getInternote() {
        return internote;
    }

    public void setInternote(Internote internote) {
        this.internote = internote;
    }

    public Chapter getChapter() {
        return chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public boolean isUnlocked() {
        return unlocked;
    }

    public void setUnlocked(boolean unlocked) {
        this.unlocked = unlocked;
    }

    public Date getUnlockDate() {
        return unlockDate;
    }

    public void setUnlockDate(Date unlockDate) {
        this.unlockDate = unlockDate;
    }
}
