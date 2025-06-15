package org.example.backendpfe.Model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String message;
    private boolean isRead;
    private LocalDateTime timestamp;
    @Column(nullable = false)
    private String messageHash; // For duplicate detection

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Internote user;

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

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Internote getUser() {
        return user;
    }

    public void setUser(Internote user) {
        this.user = user;
    }

    public String getMessageHash() {
        return messageHash;
    }

    public void setMessageHash(String messageHash) {
        this.messageHash = messageHash;
    }
    @PrePersist
    public void generateMessageHash() {
        // Create a unique hash combining user ID, message, and day (not time)
        this.messageHash = String.format("%d-%s-%s",
                user != null ? user.getId() : 0,
                message != null ? message.hashCode() : 0,
                timestamp != null ? timestamp.toLocalDate().toString() : ""
        );
    }
}
