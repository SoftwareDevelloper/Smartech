package org.example.backendpfe.Model;

import java.util.List;

public class PredictRequest
{
    private List<Answer> answers;
    private List<String> levels;    // List of levels corresponding to each question (e.g., "beginner", "intermediate", "advanced")

    // Getters and Setters


    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    public List<String> getLevels() {
        return levels;
    }

    public void setLevels(List<String> levels) {
        this.levels = levels;
    }
}
