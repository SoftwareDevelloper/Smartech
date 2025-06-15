package org.example.backendpfe.Model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class ChatBotQuizzes
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String question;
    @ElementCollection
    private List<String> answers;
    private String correctAnswer;
    private String level; // Beginner, Intermediate, Advanced


    public ChatBotQuizzes() {}

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

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
