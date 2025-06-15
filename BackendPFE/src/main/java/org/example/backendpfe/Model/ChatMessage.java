package org.example.backendpfe.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String role;
    private String content;

    @ManyToOne
    @JoinColumn(name = "chat_request_id")
    @JsonIgnore
    private ChatRequest chatRequest;


    public ChatMessage() {
    }

    public ChatMessage(Long id, String role, String content, ChatRequest chatRequest) {
        this.id = id;
        this.role = role;
        this.content = content;
        this.chatRequest = chatRequest;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ChatRequest getChatRequest() {
        return chatRequest;
    }

    public void setChatRequest(ChatRequest chatRequest) {
        this.chatRequest = chatRequest;
    }
}
