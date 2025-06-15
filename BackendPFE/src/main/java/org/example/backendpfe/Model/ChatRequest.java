package org.example.backendpfe.Model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class ChatRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String model = "gpt-4o-mini";
    private double temperature = 0.7;
    private boolean store = false; // 🆕 added field for GPT-4o "store" option
    @OneToMany(mappedBy = "chatRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> messages;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }

    public boolean isStore() {
        return store;
    }

    public void setStore(boolean store) {
        this.store = store;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }
}
