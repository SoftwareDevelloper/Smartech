package org.example.backendpfe.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Questions {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String question;
    @ElementCollection
    @CollectionTable(name = "question_answers", joinColumns = @JoinColumn(name = "question_id"))
    private List<String> answers = new ArrayList<>();;

    private int correctAnswerIndex;

    //constructor

    public Questions() {}

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formation_id")
    private Formations formation;
    //Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }

    public int getCorrectAnswerIndex() {
        return correctAnswerIndex;
    }

    public void setCorrectAnswerIndex(int correctAnswerIndex) {
        this.correctAnswerIndex = correctAnswerIndex;
    }

    public Formations getFormation() {
        return formation;
    }

    public void setFormation(Formations formation) {
        this.formation = formation;
    }
}
