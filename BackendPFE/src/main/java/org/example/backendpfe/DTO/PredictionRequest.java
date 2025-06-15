package org.example.backendpfe.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PredictionRequest {
    private int numCorrect;
    private int timeTaken;
    private String schoolLevel;
    private int consecutiveCorrect;
    private double accuracy;
    private String subject;

    // Constructors

    public PredictionRequest() {
    }

    public PredictionRequest(int numCorrect, int timeTaken, String schoolLevel, int consecutiveCorrect, double accuracy, String subject) {
        this.numCorrect = numCorrect;
        this.timeTaken = timeTaken;
        this.schoolLevel = schoolLevel;
        this.consecutiveCorrect = consecutiveCorrect;
        this.accuracy = accuracy;
        this.subject = subject;
    }

    public int getNumCorrect() {
        return numCorrect;
    }

    public void setNumCorrect(int numCorrect) {
        this.numCorrect = numCorrect;
    }

    public int getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(int timeTaken) {
        this.timeTaken = timeTaken;
    }

    public String getSchoolLevel() {
        return schoolLevel;
    }

    public void setSchoolLevel(String schoolLevel) {
        this.schoolLevel = schoolLevel;
    }

    public int getConsecutiveCorrect() {
        return consecutiveCorrect;
    }

    public void setConsecutiveCorrect(int consecutiveCorrect) {
        this.consecutiveCorrect = consecutiveCorrect;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }
}
