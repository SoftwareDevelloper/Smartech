package org.example.backendpfe.DTO;

import jakarta.persistence.Entity;

import java.util.List;
import java.util.Map;

public class PredictionResponse {
    private String level;
    private double score;
    private double confidence; // Add this field
    private Map<String, Double> probabilityDistribution; // Add this field
    private boolean levelAdjusted = false;
    // Constructors, Getters and Setters
    public PredictionResponse() {}

    public PredictionResponse(String level, List<String> recommendations, double score) {
        this.level = level;
        this.score = score;
    }

    public boolean isLevelAdjusted() {
        return levelAdjusted;
    }

    public void setLevelAdjusted(boolean levelAdjusted) {
        this.levelAdjusted = levelAdjusted;
    }

    // Getters and Setters
    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }


    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public Map<String, Double> getProbabilityDistribution() {
        return probabilityDistribution;
    }

    public void setProbabilityDistribution(Map<String, Double> probabilityDistribution) {
        this.probabilityDistribution = probabilityDistribution;
    }
}
